import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Await the JSON body correctly
        const { title, userId, categories, fillInTheBlanks, Mcq, paragraph } = await req.json();
        console.log("🚀 ~ POST ~ req.json():", { title, userId, categories, fillInTheBlanks });

        // Check if the required fields are provided
        if (!categories || !fillInTheBlanks || !Mcq || !paragraph) {
            return NextResponse.json(
                { status: "error", message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create a new form in the database
        const form = await prisma.form.create({
            data: {
                title: `test-${Math.random()}`,
                categories: {
                    create: categories.map((category: { name: string; answers: { text: string }[] }) => ({
                        name: category.name,
                        answers: {
                            create: category.answers.map((answer) => ({
                                text: answer.text,
                            })),
                        },
                    })),
                },
                fillInBlanks: {
                    create: fillInTheBlanks.map((blank: { content: string; answers: string[] }) => ({
                        content: blank.content,
                        answers: {
                            create: blank.answers.map((answer) => ({
                                answer,
                            })),
                        },
                    })),
                },
                // mcqQuestions: {
                //     create: Mcq.map((mcqQuestion: { question: string; answers: string[]; correctAnswer: string }) => ({
                //         question: mcqQuestion.question,
                //         answers: {
                //             create: mcqQuestion.answers.map((answer) => ({
                //                 answer,
                //             })),
                //         },
                //         correctAnswer: mcqQuestion.correctAnswer,
                //     })),
                // }
                paragraph: {
                    create: {
                        content: paragraph,
                        questions: {
                            create: Mcq.map((mcqQuestion: { question: string; answers: string[]; correctAnswer: string }) => ({
                                question: mcqQuestion.question,
                                answers: {
                                    create: mcqQuestion.answers.map((answer) => ({
                                        answer,
                                    })),
                                },
                                correctAnswer: mcqQuestion.correctAnswer,
                            }))
                        }
                    }
                }
            },
        });

        // Return the created form as a response
        return NextResponse.json({
            status: "success",
            data: form,
        });
    } catch (e) {
        console.error("Error creating form:", e);
        return NextResponse.json({
            status: "error",
            message: "Something went wrong",
        }, { status: 500 });
    }
}
