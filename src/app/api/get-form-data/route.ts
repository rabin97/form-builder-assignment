import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch form data by form ID (or any other identifier)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const formId = searchParams.get("formId");

        // Check if the form ID is provided
        if (!formId) {
            return NextResponse.json(
                { status: "error", message: "Form ID is required" },
                { status: 400 }
            );
        }

        // Query the form from the database
        const form = await prisma.form.findUnique({
            where: {
                id: formId,
            },
            include: {
                categories: {
                    include: {
                        answers: true,
                    },
                },
                fillInBlanks: {
                    include: {
                        answers: true,
                    },
                },
                paragraph: {
                    include: {
                        questions: {
                            include: {
                                answers: true,
                            }
                        }
                    },
                },
            },
        });

        // Check if the form exists
        if (!form) {
            return NextResponse.json(
                { status: "error", message: "Form not found" },
                { status: 404 }
            );
        }

        // Return the form data
        return NextResponse.json({
            status: "success",
            data: form,
        });
    } catch (e) {
        console.error("Error fetching form:", e);
        return NextResponse.json(
            { status: "error", message: "Something went wrong" },
            { status: 500 }
        );
    }
}
