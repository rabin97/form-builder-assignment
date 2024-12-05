"use client";
import React, { useState, useRef } from "react";

const FillInTheBlanksEditor = () => {
    const editorRef = useRef(null);
    const [content, setContent] = useState(""); // Stores editor content
    const [answers, setAnswers] = useState([]); // Stores underlined words as answers
    console.log("🚀 ~ FillInTheBlanksEditor ~ answers:", answers)

    const applyUnderline = () => {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (range && selection?.toString().trim()) {
            const selectedText = selection.toString();

            // Store the underlined word in the answers array
            setAnswers((prev) => [...prev, selectedText.trim()] as any);

            // Replace the selected text with a blank (____)
            const span = document.createElement("span");
            span.textContent = "____";
            span.style.textDecoration = "underline"; // Visually underline blank for clarity
            range.deleteContents();
            range.insertNode(span);

            // Update the editor content
            updateContent();
        }

        (editorRef?.current as any)?.focus();

    };

    const updateContent = () => {
        setContent((editorRef.current as any).innerHTML);
    };

    return (
        <div>
            {/* Toolbar */}
            <div style={{ marginBottom: "10px" }}>
                <button onClick={applyUnderline}>Underline</button>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={updateContent}
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    minHeight: "200px",
                    fontSize: "16px",
                    outline: "none",
                    borderRadius: "16px"
                }}
            ></div>

            {/* Output */}
            <div className="m-5">
                <div className="bg-gray-200">
                    <h3> Preview</h3>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: content,
                        }}
                    ></p>
                </div>

                <h3>Answers:</h3>
                <ul>
                    {answers.map((answer, index) => (
                        <li key={index}>{answer}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FillInTheBlanksEditor;
