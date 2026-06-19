"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { applyToJob } from "@/lib/applications";

export default function ApplyButton({ jobId }: { jobId: string }) {
  // status is "loading" | "authenticated" | "unauthenticated".
  const { status } = useSession();
  const router = useRouter();

  // Track what's happening so we can show the right text/message.
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    // Still checking who's logged in? Do nothing yet.
    if (status === "loading") return;

    // Not logged in? Send them to the sign-in page instead of applying.
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);
    setMessage("");

    // Ask the server to record the application.
    const result = await applyToJob(jobId);

    if (result.error) {
      // Safety net: if the server says we're not signed in, go sign in.
      if (result.error.includes("signed in")) {
        router.push("/auth/signin");
        return;
      }
      setMessage(result.error);
    } else {
      setApplied(true);
      setMessage("Application sent!");
    }
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={handleApply}
        disabled={loading || applied}
        className="rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {applied ? "Applied" : loading ? "Applying..." : "Apply"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
