import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import ShadCN RadioGroup components
import { ParagraphType } from "@/types/form.types";

interface ParagraphQuestionsProps {
    paragraph: ParagraphType;
    onChange: (answers: any) => void; // New prop to pass back answers to the parent
}

export function ParagraphQuestions({ paragraph, onChange }: ParagraphQuestionsProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});

    const handleAnswerChange = (questionId: string, answerId: string) => {
        const updatedAnswers = { ...selectedAnswers, [questionId]: answerId };
        setSelectedAnswers(updatedAnswers);

        // Call onChange to update the parent component with the new answers
        onChange(updatedAnswers);
    };

    return (
        <div className="space-y-6">
            {/* Paragraph Content */}
            <div className="p-4 bg-gray-100 rounded-md">
                <p className="text-lg font-medium">{paragraph.content}</p>
            </div>

            {/* MCQ Questions */}
            {paragraph.questions.map((question) => (
                <div key={question.id} className="space-y-4">
                    <h3 className="text-md font-semibold">{question.question}</h3>

                    {/* Radio Group for Answers */}
                    <RadioGroup
                        className="space-y-2"
                        value={selectedAnswers[question.id] || ""}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                        {question.answers.map((answer: any) => (
                            <div key={answer.id} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={answer.id}
                                    id={`answer-${answer.id}`}
                                    className="radio-item"
                                />
                                <label htmlFor={`answer-${answer.id}`} className="text-sm">
                                    {answer.answer}
                                </label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            ))}
        </div>
    );
}

