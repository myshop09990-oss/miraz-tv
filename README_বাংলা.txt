MIRAZ TV — ফ্রি মোবাইল ওয়েব অ্যাপ (PWA) | প্রথম ডেমো
===================================================

এই ফাইলগুলো ZIP থেকে Extract করুন:
- index.html
- banner.svg
- icon-192.png
- icon-512.png
- manifest.webmanifest
- sw.js

মোবাইল দিয়ে ফ্রিতে প্রকাশ:
1) Chrome-এ https://github.com খুলে ফ্রি অ্যাকাউন্ট খুলুন।
2) '+' > New repository থেকে নতুন Public repository বানান। নাম দিন miraz-tv । Add a README নির্বাচন করলে সহজ হবে।
3) রিপোজিটরির Code ট্যাব থেকে Add file > Upload files-এ যান।
   মোবাইলে Add file অপশন না দেখা গেলে Chrome-এর Desktop site চালু করুন।
4) ZIP নয়: Extract করা উপরের ৬টি ফাইল সিলেক্ট করে আপলোড করুন, তারপর Commit changes দিন।
5) Settings > Pages > Build and deployment:
   Source = Deploy from a branch, Branch = main, Folder = /(root), Save।
6) GitHub Pages-এ প্রকাশ হওয়ার পর আপনার URL হবে প্রায় এইরকম:
   https://YOUR-USERNAME.github.io/miraz-tv/
7) Chrome দিয়ে ওয়েবসাইট খুলে মেনু (⋮) > Add to Home screen/Install app ব্যবহার করুন।

এই ডেমোতে কাজ করে: Home, Series, TV ডেমো, Search, Channel Filter, Favorite, Profile name,
ভিডিও প্লেয়ার (MDN-এর CC0 flower.mp4 ডেমো), PWA install এবং অ্যাপের শেল অফলাইনে দেখা।

সীমাবদ্ধতা:
- বাস্তব লাইভ টিভি নেই; কোনো চ্যানেলের লাইসেন্সধারী স্ট্রিম যুক্ত করা হয়নি।
- ভিডিও ক্লিপ চালাতে ইন্টারনেট লাগবে।
- Favorites এবং নাম শুধু আপনার ব্রাউজারে সেভ হয়।
- অ্যাডমিন প্যানেল, Firebase, সার্ভার লগইন এখনো নেই।
- PWA ইনস্টলযোগ্য অ্যাপ; এটি আলাদা native APK নয়। APK প্যাকেজ তৈরির ধাপ পরে।
- GitHub Pages-এর এই Public repository-এর কোড সবার কাছে দৃশ্যমান; কোনো পাসওয়ার্ড বা সিক্রেট API key রাখবেন না।
- চ্যানেল ও সিরিয়াল নাম ডেমো UI-র জন্য; সংশ্লিষ্ট স্বত্বাধিকারীর অনুমতি ছাড়া প্রচার করবেন না।

কিছু ব্রাউজারে file:// থেকে index.html সরাসরি খুললে এক বা একাধিক PWA ফিচার কাজ করবে না।
GitHub Pages-এ প্রকাশের পর পূর্ণভাবে পরীক্ষা করুন।

আগে Bangla TV ডেমো ব্যবহার করে থাকলে নতুন সংস্করণে Favorites ও প্রোফাইল নামের তথ্য স্বয়ংক্রিয়ভাবে পড়ার চেষ্টা করবে।
