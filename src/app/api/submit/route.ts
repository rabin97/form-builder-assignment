import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Await the JSON body correctly
        const { preview, fillInBlanks, paragraphs, formId } = await req.json();
        console.log("🚀 ~ POST ~ req.json():", { preview, fillInBlanks, paragraphs });

        // Check if the required fields are provided
        if (!preview || !fillInBlanks || !paragraphs || !formId) {
            return NextResponse.json(
                { status: "error", message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create a new submission record in the database
        const submission = await prisma.submittedFormAnswer.create({
            data: {
                formId,
                fillInBlanks, // Assuming this is a string (e.g., HTML content)
                preview, // Assuming this is the preview data
                paragraphs, // Storing paragraphs data (with answers mapped to question IDs)
            },
        });

        // Return the created submission as a response
        return NextResponse.json({
            status: "success",
            message: "Form submitted successfully",
            data: submission,
        });
    } catch (e) {
        console.error("Error creating submission:", e);
        return NextResponse.json({
            status: "error",
            message: "Something went wrong",
        }, { status: 500 });
    }
}
