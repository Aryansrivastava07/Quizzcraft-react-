import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleFileUpload } from "./utils/HandleFile";
import { handleGenerate } from "./utils/GenerateQuiz";
import {
  faFilePdf,
  faTerminal,
  faVideo,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export const MakeQuiz = () => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { text: "Welcome to the quiz creator!", content: null },
    {
      text: "Need help? Visit our docs",
      content: (
        <a href="/docs" className="text-blue-600 underline">
          View Docs
        </a>
      ),
    },
  ]);
  useEffect(() => {
    if (selectedFiles.length > 0) {
      handleFileUpload({fileUploaded:selectedFiles[selectedFiles.length - 1], setPdfs, setChatMessages});
    }
  }, [selectedFiles]);



  return (
    <div className="h-[90vh] grid grid-cols-[1fr_4fr] transition-all duration-150 bg-gradient-to-b from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-950">
      <div className="shadow-2xl"></div>
      <div className="h-[90vh] shadow-2xl grid grid-rows-[1fr_auto] overflow-hidden">
        <div className="overflow-y-auto">
          {chatMessages.map((msg, index) => (
            <Chat key={index} mes={msg.text}>
              {msg.content}
            </Chat>
          ))}
        </div>
        <div className="self-end">
          <Input setChatMessages={setChatMessages} setSelectedFiles={setSelectedFiles} pdfs={pdfs} />
        </div>
      </div>
    </div>
  );
};

const Chat = ({ mes, children }) => {
  return (
    <div className="text-gray-900 px-10 py-4 w-[70%] m-5 rounded-2xl bg-gradient-to-bl from-gray-400 to-gray-200 dark:from-gray-700 dark:to-gray-800 dark:text-white shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)]">
      <p>{mes}</p>
      {children}
    </div>
  );
};

const Input = ({ setChatMessages, setSelectedFiles ,pdfs }) => {
   const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => {
      const uniqueFiles = newFiles.filter(
        (file) =>
          !prevFiles.some(
            (f) => f.name === file.name && f.lastModified === file.lastModified
          )
      );
      return [...prevFiles, ...uniqueFiles];
    });
  };
  const [files, setFiles] = useState([]);
  return (
    <form className="mx-10 my-2">
      <div className="px-5 flex items-center gap-10">
        <button
          type="button"
          className="border border-gray-900 dark:border-white p-3 rounded-4xl dark:text-white text-black"
        >
          Add Category
        </button>
        <button
          type="button"
          className="border border-gray-900 dark:border-white p-3 rounded-4xl dark:text-white text-black"
          onClick={() => {
            setChatMessages((prev) => [
              ...prev,
              {
                text: "Upload your files below",
                content: (
                  <input type="file" multiple onChange={handleFileChange} />
                ),
              },
            ]);
          }}
        >
          Add Files
        </button>
        <button
          type="button"
          className="border border-gray-900 dark:border-white p-3 rounded-4xl dark:text-white text-black"
        >
          Add Category
        </button>
      </div>
      <div className="p-5 flex items-center gap-5">
        <input
          type="text"
          className="rounded-4xl w-full p-5 border-2 border-gray-600 dark:border-gray-200 text-gray-900 dark:text-white"
        />
        <button type="button">
          <FontAwesomeIcon
            icon={faArrowRight}
            className="p-5 bg-gray-800 rounded-4xl text-white dark:text-gray-900 dark:bg-slate-300"
            onClick={()=>{
              console.log(pdfs[pdfs.length-1]);
              handleGenerate({pdf : pdfs[pdfs.length-1]});
            }}
          />
        </button>
      </div>
    </form>
  );
};
