
Deno.serve(() => {
  return new Response(
    JSON.stringify({
      app: "Miraz TV",
      service: "miraz-pin-auth",
      status: "setup-only"
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
});
