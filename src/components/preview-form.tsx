"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CategoryType, FormType } from "@/types/form.types";

// Define your types
interface Answer {
    id: string;
    text: string;
}

interface Category {
    id: string;
    name: string;
    answers: Answer[];
}

interface Column {
    id: string;
    title: string;
    answerIds: string[]; // List of answer IDs
}

interface State {
    columns: Record<string, Column>;
    columnOrder: string[];
    categories: Category[];
}

const Preview = ({ data, onChange }: { data: FormType; onChange: (data: any) => void }) => {
    const [state, setState] = useState<State | null>(null);

    const initializeState = useCallback(() => {
        const initState: State = {
            columns: {
                "answer-column": {
                    id: "answer-column",
                    title: "Answers",
                    answerIds: data.categories.reduce(
                        (acc: string[], category: Category) => [
                            ...acc,
                            ...category.answers.map((answer) => answer.id),
                        ],
                        []
                    ),
                },
                ...data.categories.reduce((acc: Record<string, Column>, category: Category, index: number) => {
                    acc[`category-${index + 1}`] = {
                        id: `category-${index + 1}`,
                        title: category.name,
                        answerIds: [],
                    };
                    return acc;
                }, {}),
            },
            columnOrder: ["answer-column", ...data.categories.map((_, index) => `category-${index + 1}`)],
            categories: data.categories,
        };
        setState(initState);
    }, [data]);

    useEffect(() => {
        initializeState();
    }, [initializeState]);

    const handleStateChange = useCallback(() => {
        if (state) {
            const updatedCategories = state.columnOrder
                .filter((columnId) => columnId !== "answer-column") // Exclude the answer pool column
                .map((columnId) => {
                    const column = state.columns[columnId];
                    return {
                        id: columnId,
                        name: column.title,
                        answers: column.answerIds.map((answerId) => {
                            const category = state.categories.find((c) => c.answers.some((a) => a.id === answerId));
                            return category?.answers.find((a) => a.id === answerId) || null;
                        }).filter(Boolean) as Answer[],
                    };
                });

            onChange(updatedCategories);
        }
    }, [state]);

    useEffect(() => {
        handleStateChange();
    }, [state, handleStateChange]);

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const sourceColumn = state!.columns[source.droppableId];
        const destinationColumn = state!.columns[destination.droppableId];

        if (sourceColumn.id === destinationColumn.id) {
            const newAnswerIds = Array.from(sourceColumn.answerIds);
            newAnswerIds.splice(source.index, 1);
            newAnswerIds.splice(destination.index, 0, draggableId);

            setState((prevState) => ({
                ...prevState!,
                columns: {
                    ...prevState!.columns,
                    [sourceColumn.id]: {
                        ...sourceColumn,
                        answerIds: newAnswerIds,
                    },
                },
            }));
        } else {
            const sourceAnswerIds = Array.from(sourceColumn.answerIds);
            const [removed] = sourceAnswerIds.splice(source.index, 1);

            const destinationAnswerIds = Array.from(destinationColumn.answerIds);
            destinationAnswerIds.splice(destination.index, 0, draggableId);

            setState((prevState) => ({
                ...prevState!,
                columns: {
                    ...prevState!.columns,
                    [sourceColumn.id]: {
                        ...sourceColumn,
                        answerIds: sourceAnswerIds,
                    },
                    [destinationColumn.id]: {
                        ...destinationColumn,
                        answerIds: destinationAnswerIds,
                    },
                },
            }));
        }
    };

    if (!state) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-gray-100 p-4 rounded-md">
            <DragDropContext onDragEnd={onDragEnd}>
                {state.columnOrder.map((columnId) => {
                    const column = state.columns[columnId];
                    const items = column.answerIds.map((answerId) => {
                        const category = state.categories.find((c) => c.answers.some((a) => a.id === answerId));
                        const answer = category?.answers.find((a) => a.id === answerId);
                        return answer ? { id: answer.id, text: answer.text } : null;
                    }).filter(Boolean);

                    return (
                        <div key={column.id} className="space-y-2">
                            <h3 className={`${column.id === "answer-column" && "hidden"} mt-5`}>{column.title}</h3>
                            <div key={column.id} className={`${column.id === "answer-column" ? "bg-gray-400 rounded-md p-4 mb-5" : "bg-gray-300"}`}>
                                <Droppable droppableId={column.id}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`${column.id === "answer-column" ? "bg-gray-400 rounded-md p-4 flex w-fit flex-wrap gap-4" : "min-h-24 rounded-md p-4"}`}
                                        >
                                            {items?.map((item, index) => (
                                                <Draggable key={item?.id} draggableId={item?.id ?? ""} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                backgroundColor: "white",
                                                                marginBottom: "8px",
                                                                padding: "10px",
                                                                borderRadius: "5px",
                                                                border: "1px solid lightblue",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {item?.text}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    );
                })}
            </DragDropContext>
        </div>
    );
};

export default Preview;
