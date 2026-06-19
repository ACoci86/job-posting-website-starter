"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Server action: apply the logged-in user to a job.
export async function applyToJob(jobId: string) {
  // Must be signed in to apply.
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to apply." };
  }

  try {
    // Save the application. The database stops a user from applying twice
    // (the jobId + userId pair is unique), which throws here if it happens.
    await prisma.application.create({
      data: {
        jobId,
        userId: session.user.id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error applying to job:", error);
    return { error: "You have already applied to this job." };
  }
}
