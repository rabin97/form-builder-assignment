"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import FillInTheBlanksEditor from "./ritch-text-editor";

type FormValues = {
    categories: {
        name: string;
        answers: { text: string }[];
    }[];
};

export function CategoryFormBuilder() {
    const { control, register, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            categories: [{ name: "", answers: [{ text: "" }] }],
        },
    });

    const { fields: categoryFields, append: addCategory, remove: removeCategory } =
        useFieldArray({
            control,
            name: "categories",
        });

    const onSubmit = (data: FormValues) => {
        console.log("Form Data:", data);
        alert(JSON.stringify(data, null, 2));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gray-200 border rounded-md  p-3">
            <h1 className="text-xl font-bold">Buid Category Form </h1>
            <div className="grid grid-cols-3 gap-4">

                {categoryFields.map((category, categoryIndex) => (
                    <Card key={category.id} className="p-4 relative">
                        <CardContent>
                            <div className="space-y-4 ">
                                <Input
                                    {...register(`categories.${categoryIndex}.name`)}
                                    placeholder="Category Name"
                                    className="mb-2"
                                />
                                <h2 className="text-lg font-semibold">Answers:</h2>
                                <AnswerFields
                                    control={control}
                                    categoryIndex={categoryIndex}
                                    register={register}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeCategory(categoryIndex)}
                                    className=" rounded-full absolute -top-5 -right-1 p-0 w-6 h-6"
                                >
                                    <X size={16} className=" " />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Button
                type="button"
                onClick={() => addCategory({ name: "", answers: [{ text: "" }] })}
                className="mt-4 absolute right-6 top-12"
            >
                Add Category
            </Button>
            <Button type="submit" className="bg-blue-500 text-white mt-6">
                Submit
            </Button>


            <FillInTheBlanksEditor />
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
