"use client";

import { FormEvent } from "react";

export default function PostJobPage() {

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      company: formData.get("company"),
      location: formData.get("location"),
      type: formData.get("type"),
      salary: formData.get("salary"),
      description: formData.get("description"),
    };

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to post job");
      }

      window.location.href = "/jobs"; // Redirect to the jobs page after a successful post
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a Job</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Job Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Job Type
          </label>
          <select
            name="type"
            id="type"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700"
          >
            Salary <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            name="salary"
            id="salary"
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={6}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2.5 font-medium text-white hover:bg-gray-800"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
