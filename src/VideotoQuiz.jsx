import { useState } from "react";
export function VideotoQuiz() {
    return (
        <div>
            <h1>Video to Quiz</h1>
            <p>Upload a PDF file to convert it into a quiz.</p>
            <input type="file" accept=".pdf" />
        </div>
    )}