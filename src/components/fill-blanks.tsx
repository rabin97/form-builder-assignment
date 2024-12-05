"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const FillInTheBlanks = ({ formId, onChange }: { formId: string, onChange: (data: any) => void }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [sentence, setSentence] = useState("");

    const setSentenceWithAnswers = (newBlanks: string[]) => {
        let updatedSentence = splitSentence.map((text, index) => {
            if (index < newBlanks.length) {
                const blankContent = newBlanks[index] ? newBlanks[index] : "<span>____</span>";
                return `${text}<span>${blankContent}</span>`;
            }
            return text;
        }).join("");

        onChange(updatedSentence);

    };

    useEffect(() => {

        const fetchFormData = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(`/api/get-form-data?formId=${formId}`);

                const result = await response.json();
                console.log("🚀 ~ fetchFormData ~ result:", result)
                if (response.ok) {
                    console.log(result.data);
                    setSentence(result.data.fillInBlanks[0].content);
                    setRemainingAnswers(result.data.fillInBlanks[0].answers.map((a: any) => a.answer as string));
                } else {
                    console.error(result.message || "Failed to fetch form data.");
                }

            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }

        }
        fetchFormData();
    }, [])


    const [splitSentence, setSplitSentence] = useState<string[]>([]);
    const [blanks, setBlanks] = useState<string[]>([]);
    const [remainingAnswers, setRemainingAnswers] = useState<string[]>([]);
    console.log("🚀 ~ FillInTheBlanks ~ remainingAnswers:", splitSentence)

    useEffect(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(sentence, "text/html");
        const spanElements = doc.querySelectorAll("span[style='text-decoration: underline;']");

        // Split sentence into static text parts and blanks
        const split = sentence.split(/<span[^>]*>.*?<\/span>/);
        const blanksArray = Array.from(spanElements).map(() => ""); // Initialize blanks

        setSplitSentence(split);
        setBlanks(blanksArray);
    }, [sentence]);

    const onDragEnd = (result: any) => {
        const { source, destination } = result;

        if (!destination) return; // Dropped outside
        if (!destination.droppableId.startsWith("blank")) return; // Not on a blank

        const blankIndex = parseInt(destination.droppableId.split("-")[1]);
        const answer = remainingAnswers[source.index];

        if (blanks[blankIndex] === "") {
            const newBlanks = [...blanks];
            newBlanks[blankIndex] = answer;

            const updatedAnswers = [...remainingAnswers];
            updatedAnswers.splice(source.index, 1);

            setBlanks(newBlanks);
            setRemainingAnswers(updatedAnswers);
            setSentenceWithAnswers(newBlanks);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>
    }


    return (
        <div className="bg-green-200 rounded-md p-4">
            <h3>Fill in the blanks</h3>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="space-y-5">

                    <Droppable droppableId="answers" direction="horizontal">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "20px",
                                    border: "1px solid gray",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    backgroundColor: "white",
                                }}
                            >
                                {remainingAnswers.map((answer, index) => (
                                    <Draggable key={answer} draggableId={answer} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    padding: "10px",
                                                    border: "1px solid blue",
                                                    borderRadius: "5px",
                                                    backgroundColor: "white",
                                                    textAlign: "center",
                                                    minWidth: "60px",
                                                    cursor: "grab",
                                                }}
                                            >
                                                {answer}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <p className="bg-white p-4 rounded-md">
                        {splitSentence.map((text, index) => (
                            <React.Fragment key={index}>
                                <span>{text}</span>
                                {index < blanks.length && (
                                    <Droppable droppableId={`blank-${index}`} direction="vertical">
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                style={{
                                                    display: "inline-block",
                                                    width: "100px",
                                                    height: "30px",
                                                    border: "1px dashed gray",
                                                    margin: "0 5px",
                                                    textAlign: "center",
                                                    backgroundColor: blanks[index] ? "lightgreen" : "white",
                                                }}
                                            >
                                                {blanks[index] ? (
                                                    <span>{blanks[index]}</span>
                                                ) : (
                                                    <span style={{ color: "gray" }}>Drop here</span>
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                )}
                            </React.Fragment>
                        ))}
                    </p>
                </div>

            </DragDropContext>
        </div>
    );
};

export default FillInTheBlanks;
