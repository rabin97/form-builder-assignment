"use client";
import FillInTheBlanks from "@/components/fill-blanks";
import { ParagraphQuestions } from "@/components/paragrapg-mcq-question";
import Preview from "@/components/preview-form";
import { Button } from "@/components/ui/button";
import { FormType } from "@/types/form.types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RenderedForm({
    data,
    formId
}: {
    data: FormType;
    formId: string;
}) {
    console.log("🚀 ~ data:=======>>>", data);

    const [previewData, setPreviewData] = useState(null); // State for Preview form data
    const [fillInBlanksData, setFillInBlanksData] = useState(null); // State for FillInTheBlanks form data
    const [paragraphAnswers, setParagraphAnswers] = useState<any>({}); // State for Paragraph data

    const handlePreviewDataChange = (data: any) => {
        setPreviewData(data);
    };

    const handleFillInBlanksDataChange = (data: any) => {
        setFillInBlanksData(data);
    };

    // Update paragraph answers when user interacts with ParagraphQuestions component
    const handleParagraphAnswersChange = (paragraphId: string, answers: any) => {
        setParagraphAnswers((prev: any) => ({
            ...prev,
            [paragraphId]: answers,
        }));
    };

    const router = useRouter();
    const [isLoading, setiIsLoading] = useState(false)


    const handleSubmit = async () => {
        // Check if the required data is present before submitting
        if (!previewData || !fillInBlanksData || Object.keys(paragraphAnswers).length === 0) {
            toast.error("Please complete all sections before submitting.");
            return;
        }

        setiIsLoading(true)
        const submissionData = {
            preview: previewData,            // Includes category answers
            fillInBlanks: fillInBlanksData,  // Includes fill-in-the-blanks answers
            paragraphs: paragraphAnswers,    // Includes paragraph answers
            formId,                          // Include the formId if required
        };

        console.log("🚀 ~ handleSubmit ~ submissionData:", submissionData);

        // Create a new Promise to handle the submission process
        const promise = new Promise<string>(async (resolve, reject) => {

            try {
                const response = await fetch("/api/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submissionData), // Send the data as JSON
                })

                // Handle the response
                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }

                const result = await response.json();
                router.push("/")
                resolve("Form submitted successfully!");
            } catch (err) {
                reject("Failed to submit the form.");
            } finally {
                setiIsLoading(false)
            }
        });



        toast.promise(promise, {
            loading: "Submitting your form...",
            success: "Form submitted successfully!",
            error: "Failed to submit the form.",
        });
    };



    return (
        <>
            <Preview
                data={data}
                onChange={handlePreviewDataChange}
            />
            {formId && (
                <FillInTheBlanks
                    formId={formId}
                    onChange={handleFillInBlanksDataChange}
                />
            )}
            {data?.paragraph &&
                data.paragraph.map((p) => {
                    return (
                        <ParagraphQuestions
                            key={p.id} // Added key prop
                            paragraph={p}
                            onChange={(answers) => handleParagraphAnswersChange(p.id, answers)} // Pass change handler for paragraph answers
                        />
                    );
                })}
            <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 mt-5"
            >
                Submit
            </Button>
        </>
    );
}
