"use client";

export default function EnvTestPage() {
  console.log("✅ Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL);
  console.log("✅ Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + "..."); // only show part for safety

  return (
    <div className="p-6">
      <h1>🔍 Environment Test</h1>
      <p>Open your browser console (F12 → Console tab) to check the logs.</p>
    </div>
  );
}
