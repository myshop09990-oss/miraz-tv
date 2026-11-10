
import { createClient } from "npm:@supabase/supabase-js@2";
import bcrypt from "npm:bcryptjs@2.4.3";

const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin":
    "https://myshop09990-oss.github.io",
  "Access-Control-Allow-Headers":
    "content-type, authorization, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function reply(message: string, status = 200) {
  return new Response(
    JSON.stringify({ message, success: status === 200 }),
    { status, headers }
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  if (req.method !== "POST") {
    return reply("Method not allowed", 405);
  }

  try {
    const body = await req.json();
    const phone = String(body.phone ?? "").trim();
    const pin = String(body.pin ?? "");

    if (
      !/^01[0-9]{9}$/.test(phone) ||
      !/^[0-9]{4}$/.test(pin)
    ) {
      return reply("Invalid phone or PIN", 400);
    }

    const { data: member, error: memberError } =
      await db.from("miraz_premium_members")
        .select("user_id, status, expires_at")
        .eq("phone", phone)
        .maybeSingle();

    if (memberError) throw memberError;

    if (
      !member ||
      !member.user_id ||
      member.status !== "active" ||
      (member.expires_at &&
        new Date(member.expires_at).getTime() <= Date.now())
    ) {
      return reply("Invalid credentials or membership", 401);
    }

    const { data: credential, error: credError } =
      await db.from("miraz_member_credentials")
        .select("pin_hash, failed_attempts, locked_until")
        .eq("user_id", member.user_id)
        .maybeSingle();

    if (credError) throw credError;

    if (!credential) {
      return reply("Invalid credentials or membership", 401);
    }

    if (
      credential.locked_until &&
      new Date(credential.locked_until).getTime() > Date.now()
    ) {
      return reply("Account temporarily locked", 429);
    }

    const valid = await bcrypt.compare(
      pin,
      credential.pin_hash
    );

    if (!valid) {
      const attempts = Math.min(
        5,
        (credential.failed_attempts ?? 0) + 1
      );

      const lockedUntil = attempts >= 5
        ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
        : null;

      const { error } = await db
        .from("miraz_member_credentials")
        .update({
          failed_attempts: attempts,
          locked_until: lockedUntil
        })
        .eq("user_id", member.user_id);

      if (error) throw error;

      return reply("Invalid credentials or membership", 401);
    }

    const { error } = await db
      .from("miraz_member_credentials")
      .update({
        failed_attempts: 0,
        locked_until: null
      })
      .eq("user_id", member.user_id);

    if (error) throw error;

    return reply("PIN verified");
  } catch (error) {
    console.error("PIN verification error", error);
    return reply("Server error", 500);
  }
});
