import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import ApplyButton from "@/components/ApplyButton";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { postedBy: true },
  });

  // If no job has this id, show the standard "not found" page.
  if (!job) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link href="/jobs" className="text-sm text-indigo-600 hover:underline">
        ← Back to jobs
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
        {job.salary && (
          <p className="text-lg font-bold text-gray-900">{job.salary}</p>
        )}
      </div>
      <p className="mt-1 text-gray-700">
        {job.company} · {job.location} · {job.type}
      </p>
      <p className="mt-4 whitespace-pre-line text-gray-600">{job.description}</p>
      <p className="mt-4 text-sm text-gray-500">
        Posted by {job.postedBy.name ?? "Unknown"}{" "}
        <span>· {formatDistanceToNow(job.postedAt, { addSuffix: true })}</span>
      </p>

      <div className="mt-6">
        <ApplyButton jobId={job.id} />
      </div>
      </div>
    </div>
  );
}
