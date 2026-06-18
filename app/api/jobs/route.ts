import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    // Only logged-in users can post a job. If nobody is signed in, send them
    // to the sign-in page.
    const session = await auth();
    if (!session?.user || !session?.user.id) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    try {
        // Read the job details sent from the form.
        const data = await request.json();

        // Save the new job to the database, tagged with who posted it.
        const job = await prisma.job.create({
            data: {
                ...data,
                postedById: session.user.id,
            },
        });

        // Send the saved job back as the response.
        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        // If anything goes wrong, log it and return an error response.
        console.error("Error creating job:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
        
    }
}
