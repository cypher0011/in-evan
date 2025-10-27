"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";

export default function TestInsertPage() {
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("guests")
        .insert([{
          first_name: "Test",
          last_name: "Connection",
          room_number: "999",
          email: "test@example.com",
          phone: "00000000",
          status: "Checked In",
        }])
        .select()
        .single();

      setResult(data);
      setErr(error);
      console.log("Insert data:", data);
      console.log("Insert error:", error);
    })();
  }, []);

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-xl font-semibold">🧪 Supabase Insert Test</h1>
      <p>Open Supabase &gt; Table Editor &gt; <b>guests</b> to see the new row.</p>
      {err && <pre className="text-red-600">{JSON.stringify(err, null, 2)}</pre>}
      {result && <pre className="text-green-700">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
