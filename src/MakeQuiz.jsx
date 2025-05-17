import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PdftoQuiz } from "./PdftoQuiz";
import { PrompttoQuiz } from "./PrompttoQuiz";
import { VideotoQuiz } from "./VideotoQuiz";
import {
  faFilePdf,
  faTerminal,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

export const MakeQuiz = () => {
  const [canvas, setCanvas] = useState(null);
  return (
    <>
      <h1 className="mt-20 text-6xl quicksand-normal">Create Your Quiz</h1>
      <div className="w-[80vw] h-[60vh] m-auto mt-10 bg-amber-10 rounded-2xl shadow-2xl">
        {canvas || <Canvas setCanvas={setCanvas} />}
      </div>
    </>
  );
};
function Canvas({ setCanvas }) {
  return (
    <>
    <div className="w-[100%] h-[100%] flex flex-row gap-30 justify-center items-center">
      {[
        ["PDF to Quiz", faFilePdf , <PdftoQuiz />],
        ["Prompt to Quiz", faTerminal,<PrompttoQuiz />],
        ["Video to Quiz", faVideo , <VideotoQuiz />],
      ].map((text,index) => (
        <button
          type="button"
          className="h-[20vh] w-[20vh] bg-amber-200 hover:bg-amber-300 cursor-pointer rounded-xl flex flex-col justify-center items-center relative"
          onClick={() => setCanvas(text[2])}
          key={index}
        >
          <FontAwesomeIcon icon={text[1]} className="text-5xl" />
          <p className="absolute bottom-8">{text[0]}</p>
        </button>
      ))}
      </div>
    </>
  );
}

