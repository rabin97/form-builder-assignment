// import { CategoryFormBuilder } from "@/components/category-form-builder";
// import PreviewFillInBlank from "@/components/fill-blanks";
// import { QuestionFormBuilder } from "@/components/form";
// import Preview from "@/components/preview-form";
// import FormPage from "@/components/rendered-form";
// import RichTextEditor from "@/components/ritch-text-editor";

// export default function App() {

//   return (
//     <div className="space-y-6">
//       {/* <QuestionFormBuilder /> */}
//       <Preview formId="6750670998120d0f0c9a5fac" />
//       <PreviewFillInBlank formId="6750670998120d0f0c9a5fac" />
//     </div>
//   );
// }

"use client";
import FillInTheBlanks from "@/components/fill-blanks";
import { QuestionFormBuilder } from "@/components/form";
import Preview from "@/components/preview-form";
import React, { useState } from "react";

const App = () => {
  const [previewData, setPreviewData] = useState(null); // State for Preview form data
  const [fillInBlanksData, setFillInBlanksData] = useState(null); // State for FillInTheBlanks form data

  const handlePreviewDataChange = (data: any) => {
    setPreviewData(data);
  };

  const handleFillInBlanksDataChange = (data: any) => {
    setFillInBlanksData(data);
  };

  const handleSubmit = async () => {
    if (!previewData || !fillInBlanksData) {
      alert("Please complete all sections before submitting.");
      return;
    }

    const submissionData = {
      preview: previewData,
      fillInBlanks: fillInBlanksData,
    };
    console.log("🚀 ~ handleSubmit ~ submissionData:", submissionData)

    try {
      // const response = await fetch("/api/submit-form-data", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(submissionData),
      // });

      // const result = await response.json();

      // if (response.ok) {
      //   alert("Form submitted successfully!");
      //   console.log("Submission Result:", result);
      // } else {
      //   alert("Failed to submit the form.");
      //   console.error("Error:", result);
      // }
    } catch (err) {
      console.error("Submission Error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <QuestionFormBuilder />
      {/* <Preview
        formId="675125991e1884a07138e71a"
        onChange={handlePreviewDataChange}
      />
      <FillInTheBlanks
        formId="675125991e1884a07138e71a"
        onChange={handleFillInBlanksDataChange}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Submit
      </button> */}
    </div>
  );
};

export default App;
