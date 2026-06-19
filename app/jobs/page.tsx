import { prisma } from "@/lib/prisma";

export default async function JobsPage({searchParams} : {searchParams: Promise<{[key: string]: string | string[] | undefined}>}) {
const {q, type, location} = await searchParams;
const jobs = await prisma.job.findMany({
where: {
  AND: [
    q ? {
      OR: [
        { title: { contains: q as string, mode: "insensitive" } },
        { company: { contains: q as string, mode: "insensitive" } },
        { description: { contains: q as string, mode: "insensitive" } },
      ],
    } : {},
    type ? { type: type as string } : {},
    location ? { location: location as string } : {},
  ],
},

  orderBy: { postedAt: "desc" },
  include: { postedBy: true }, // also load the user who posted each job
});

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Jobs</h1>
        <form className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            name="q"
            placeholder="Search jobs..."
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
          <select
            name="type"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 md:col-span-3"
          >
            Search
          </button>
        </form>
      </div>

      {/* Show each job as a card. If there are none, show a message. */}
      {jobs.length === 0 ? (
        <div className="text-gray-600">No jobs to show yet.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                {job.salary && (
                  <p className="text-lg font-bold text-gray-900">{job.salary}</p>
                )}
              </div>
              <p className="text-gray-700">
                {job.company} · {job.location} · {job.type}
              </p>
              <p className="mt-2 text-gray-600">{job.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                Posted by {job.postedBy.name ?? "Unknown"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
