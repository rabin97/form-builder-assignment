"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";

type FormValues = {
    categories: {
        name: string;
        answers: { text: string }[];
    }[];
    fillInTheBlanks: {
        content: string;
        answers: string[];
    }[];
    paragraph: string;
    Mcq: {
        question: string;
        answers: string[];
        correctAnswer: string;
    }[]
};

export function QuestionFormBuilder() {
    const { control, register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
        defaultValues: {
            categories: [{ name: "", answers: [{ text: "" }] }],
            fillInTheBlanks: [{ content: "", answers: [] }],
        },
    });

    const { fields: categoryFields, append: addCategory, remove: removeCategory } =
        useFieldArray({
            control,
            name: "categories",
        });

    const { fields: fillInTheBlankFields, append: addFillInTheBlank, remove: removeFillInTheBlank } =
        useFieldArray({
            control,
            name: "fillInTheBlanks",
        });

    const { fields: McqFields, append: addMcq, remove: removeMcq } = useFieldArray({
        control,
        name: "Mcq",
    })


    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data: FormValues) => {
        console.log("🚀 ~ onSubmit ~ data ---->>:", data)

        const formSubmissionPromise = new Promise(async (resolve, reject) => {
            try {
                setIsLoading(true)
                // Send the form data to your API endpoint
                const response = await fetch('/api/save-form-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data), // Convert form data to JSON
                });

                // Handle the response
                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }

                const result = await response.json();
                console.log('Form submitted successfully:', result);
                // You can also display a success message to the user
                // toast.success('Form submitted successfully!');
                reset();
                resolve(result);
            } catch (error) {
                console.error('Error submitting form:', error);
                // Handle error (show message to user, etc.)
                // toast.error('There was an error submitting the form');
                reject(error);
            } finally {
                setIsLoading(false)
            }
        })

        toast.promise(formSubmissionPromise, {
            loading: 'Submitting form...',
            success: 'Form submitted successfully!',
            error: 'Failed to submit form',
        });


    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
            <h1 className="text-xl font-bold">Question Form Builder</h1>

            {/* Categorize Questions */}
            <div className="relative bg-gray-200 border rounded-md p-3">
                <h2 className="text-lg font-bold mb-4">Categorize Questions</h2>
                <div className="grid grid-cols-3 gap-4">
                    {categoryFields.map((category, categoryIndex) => (
                        <Card key={category.id} className="p-4 relative">
                            <CardContent>
                                <div className="space-y-4">
                                    <Input
                                        {...register(`categories.${categoryIndex}.name`)}
                                        placeholder="Category Name"
                                    />
                                    <h3 className="text-sm font-medium">Answers:</h3>
                                    <AnswerFields control={control} categoryIndex={categoryIndex} register={register} />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeCategory(categoryIndex)}
                                        className="rounded-full absolute -top-5 -right-1 p-0 w-6 h-6"
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Button
                    type="button"
                    onClick={() => addCategory({ name: "", answers: [{ text: "" }] })}
                    className=" absolute top-4 right-4"
                >
                    Add Category
                </Button>
            </div>

            {/* Fill-in-the-Blanks Questions */}
            <div className="relative bg-gray-200 border rounded-md p-3">
                <h2 className="text-lg font-bold mb-4">Fill-in-the-Blanks Questions</h2>
                {fillInTheBlankFields.map((question, questionIndex) => (
                    <div key={question.id} className="mb-6 relative">
                        <FillInTheBlanksEditor
                            setContent={(content) => setValue(`fillInTheBlanks.${questionIndex}.content`, content)}
                            setAnswers={(answers) => setValue(`fillInTheBlanks.${questionIndex}.answers`, answers)}
                            content={watch(`fillInTheBlanks.${questionIndex}.content`)}
                            answers={watch(`fillInTheBlanks.${questionIndex}.answers`)}
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeFillInTheBlank(questionIndex)}
                            className="mt-2 absolute top-2 right-4"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={() => addFillInTheBlank({ content: "", answers: [] })}
                    className="absolute top-2 right-4"
                >
                    Add Fill-in-the-Blank Question
                </Button>
            </div>

            {/* Multiple Choice Questions */}
            <div className="relative bg-gray-200 border rounded-md p-3">
                <h2 className="text-lg font-bold mb-4">Multiple Choice Questions</h2>
                <div>
                    <Textarea
                        rows={4}
                        {...register(`paragraph`)}
                        placeholder="Type your paragraph here."
                        className="w-full border-[0.3px] border-black"
                    />
                </div>
                {McqFields.map((question, questionIndex) => (
                    <div key={question.id} className="mb-6 relative">
                        <McqQuestionFields control={control} questionIndex={questionIndex} register={register} setValue={setValue} watch={watch} />
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeMcq(questionIndex)}
                            className="mt-2 absolute top-2 right-4"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={() => addMcq({ question: "", answers: [], correctAnswer: "" })}
                    className="absolute top-2 right-4"
                >
                    Add Multiple Choice Question
                </Button>
            </div>

            <Button type="submit" disabled={isLoading} className=" mt-6">
                Submit
            </Button>
        </form>
    );
}

type AnswerFieldsProps = {
    control: any;
    categoryIndex: number;
    register: any;
};

function AnswerFields({ control, categoryIndex, register }: AnswerFieldsProps) {
    const { fields: answerFields, append: addAnswer, remove: removeAnswer } =
        useFieldArray({
            control,
            name: `categories.${categoryIndex}.answers`,
        });

    return (
        <div>
            {answerFields.map((answer, answerIndex) => (
                <div key={answer.id} className="flex items-center space-x-2 mb-2">
                    <Input
                        {...register(`categories.${categoryIndex}.answers.${answerIndex}.text`)}
                        placeholder="Answer Text"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeAnswer(answerIndex)}
                    >
                        Remove
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                onClick={() => addAnswer({ text: "" })}
                className="mt-2"
            >
                Add Answer
            </Button>
        </div>
    );
}

type FillInTheBlanksEditorProps = {
    setContent: (content: string) => void;
    setAnswers: (answers: string[]) => void;
    content: string;
    answers: string[];
};

const FillInTheBlanksEditor = ({
    setContent,
    setAnswers,
    content,
    answers,
}: FillInTheBlanksEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const applyUnderline = () => {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (range && selection?.toString().trim()) {
            const selectedText = selection.toString();

            // Store the underlined word in the answers array
            setAnswers([...answers, selectedText.trim()]);

            // Replace the selected text with a blank (____)
            const span = document.createElement("span");
            span.textContent = "____";
            span.style.textDecoration = "underline";
            range.deleteContents();
            range.insertNode(span);

            // Update the editor content
            setContent(editorRef.current?.innerHTML || "");
        }

        editorRef.current?.focus();
    };

    return (
        <div className="rounded-md bg-white p-4 relative">
            <div style={{ marginBottom: "10px" }}>
                <Button type="button" onClick={applyUnderline}>
                    Underline
                </Button>
            </div>

            <div
                ref={editorRef}
                contentEditable
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    minHeight: "200px",
                    fontSize: "16px",
                    outline: "none",
                }}
            ></div>

            <div className="space-y-3 mt-4">
                <div className="bg-gray-200 p-3 rounded-md flex gap-4">
                    <h3>Preview : </h3>
                    <p dangerouslySetInnerHTML={{ __html: content }}></p>
                </div>

                <div className="bg-gray-200 p-3 rounded-md flex gap-4">
                    <h3>Answers:</h3>
                    <div className="flex gap-4 flex-wrap">
                        {answers.map((answer, index) => (
                            <div key={index} className="bg-gray-300 rounded-md px-2">{answer}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// const McqQuestionFields = ({ control, questionIndex, register }: any) => {
//     const { fields: answerFields, append: addAnswer, remove: removeAnswer } =
//         useFieldArray({
//             control,
//             name: `Mcq.${questionIndex}.answers`,
//         });

//     return (
//         <div>
//             <Input
//                 {...register(`Mcq.${questionIndex}.question`)}
//                 placeholder="Question Text"
//             />
//             <h3>Answers:</h3>
//             {answerFields.map((answer, answerIndex) => (
//                 <div key={answer.id} className="flex items-center space-x-2 mb-2">
//                     <Input
//                         {...register(`Mcq.${questionIndex}.answers.${answerIndex}`)}
//                         placeholder="Answer Text"
//                     />
//                     <input
//                         {...register(`Mcq.${questionIndex}.correctAnswer`)}
//                         type="radio"
//                         value={answerIndex}
//                     />
//                     <Button
//                         type="button"
//                         variant="destructive"
//                         onClick={() => removeAnswer(answerIndex)}
//                     >
//                         Remove
//                     </Button>
//                 </div>
//             ))}
//             <Button
//                 type="button"
//                 onClick={() => addAnswer("")}
//                 className="mt-2"
//             >
//                 Add Answer
//             </Button>
//         </div>
//     );
// }


import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";
import { resolve } from "path";
import { Textarea } from "./ui/textarea";

const McqQuestionFields = ({ control, questionIndex, register, setValue, watch }: any) => {
    const { fields: answerFields, append: addAnswer, remove: removeAnswer } =
        useFieldArray({
            control,
            name: `Mcq.${questionIndex}.answers`,
        });

    // Watch the selected correctAnswer for this question
    const correctAnswer = watch(`Mcq.${questionIndex}.correctAnswer`);

    return (

        <div className="space-y-4 mt-4 bg-white p-4 rounded-md relative">

            {/* Question Input */}
            <Input
                {...register(`Mcq.${questionIndex}.question`)}
                placeholder="Question Text"
                className="mb-2"
            />

            {/* Answers with RadioGroup */}
            <h3 className="text-sm font-medium mb-2">Answers:</h3>
            <RadioGroup
                value={correctAnswer}
                onValueChange={(value) => setValue(`Mcq.${questionIndex}.correctAnswer`, value)} // Set value to answer text
            >
                {answerFields.map((answer, answerIndex) => (
                    <div
                        key={answer.id}
                        className="flex items-center space-x-4 mb-2"
                    >
                        {/* Answer Input */}
                        <Input
                            {...register(`Mcq.${questionIndex}.answers.${answerIndex}`)}
                            placeholder={`Answer ${answerIndex + 1}`}
                            className="w-full"
                        />
                        {/* Radio Button */}
                        <RadioGroupItem
                            value={watch(`Mcq.${questionIndex}.answers.${answerIndex}`)} // Use answer text as the value
                            id={`mcq-${questionIndex}-answer-${answerIndex}`}
                        />
                        <Label htmlFor={`mcq-${questionIndex}-answer-${answerIndex}`}>
                            Correct
                        </Label>
                        {/* Remove Answer Button */}
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeAnswer(answerIndex)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </RadioGroup>

            {/* Add Answer Button */}
            <Button
                type="button"
                onClick={() => addAnswer("")}
                className="mt-2"
            >
                Add Answer
            </Button>
        </div>
    );
};


