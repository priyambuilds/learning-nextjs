"use client";

import QuestionForm from "@/components/forms/QuestionForm";
import React from "react";

const AskAQuestion = () => {
  return (
    <>
      <h1 className="text-dark100_light900 h1-bold">Ask a Question</h1>

      <div className="mt-9">
        <QuestionForm />
      </div>
    </>
  );
};

export default AskAQuestion;
