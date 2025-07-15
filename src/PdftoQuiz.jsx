// PdftoQuiz.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { extractPdfPages } from "./pdfUtils";
import PdfPagesViewer from "./PdfPagesViewer";
import QuizData, { Questions } from "./dump/TestQuiz";

const createNewPDF = async (originalPdfBytes, selectedPages) => {
  const originalPdf = await PDFDocument.load(originalPdfBytes);
  const newPdf = await PDFDocument.create();

  // pdf-lib uses zero-based indexing; convert 1-indexed numbers accordingly
  for (const pageNumber of selectedPages) {
    const [copiedPage] = await newPdf.copyPages(originalPdf, [pageNumber - 1]);
    newPdf.addPage(copiedPage);
  }

  const newPdfBytes = await newPdf.save();
  return newPdfBytes;
};

export function PdftoQuiz() {
  const [file, setFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [pages, setPages] = useState([]);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleFileUpload = async (e) => {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded || fileUploaded.type !== "application/pdf") {
      alert("Please upload a valid PDF file!");
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(fileUploaded);

    reader.onload = async () => {
      // Read the raw data from the file
      const originalPdfData = new Uint8Array(reader.result);

      // Clone the data for storage—this copy will be used when generating the new PDF
      const pdfDataCopy = new Uint8Array(originalPdfData.length);
      pdfDataCopy.set(originalPdfData);
      setPdfBytes(pdfDataCopy);

      try {
        const extractedPages = await extractPdfPages(originalPdfData);
        setPages(extractedPages);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        alert("Failed to process the PDF. Please try another file.");
      }
    };

    reader.onerror = () => {
      alert("Error reading the file. Please try again.");
    };
  };

  const handlePageToggle = (pageNumber) => {
    setSelectedPages((prevSelected) =>
      prevSelected.includes(pageNumber)
        ? prevSelected.filter((num) => num !== pageNumber)
        : [...prevSelected, pageNumber]
    );
  };

  const handleGenerate = async () => {
    if (!pdfBytes) {
      alert("No PDF file uploaded!");
      return;
    }
    if (selectedPages.length === 0) {
      alert("No pages selected!");
      return;
    }

    // Clone pdfBytes for safe processing—in case the original is detached during PDF processing.
    const pdfBytesClone = new Uint8Array(pdfBytes.length);
    pdfBytesClone.set(pdfBytes);

    try {
      const newPdfBytes = await createNewPDF(pdfBytesClone, selectedPages);
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      URL.revokeObjectURL(url);
      window.generatedPdfBlob = blob;
      window.generatedPdfUrl = url;
      const formData = new FormData();
      formData.append("pdf", blob, "selected_pages.pdf");
      // Make API call to your backend to handle the PDF blob
      setLoading(true);
      fetch("http://localhost:5000/upload-pdf", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((errorData) => {
              throw new Error(
                errorData.message || "Network response was not ok"
              );
            });
          }
          return res.json();
        })
        .then((data) => {
          setQuizData(data.data.quiz);
          // console.log("Quiz Data:", quizData);
          setLoading(false);
          // Navigate to QuizPlatform with the quiz data
          const question = QuizData.map((q) => q.question);
          const options = QuizData.map((q) => q.options);
            navigate("/QuizPlatform", {
            state: {
              quizId: data.data.quizId,
              Questions: question,
              Options: options,
            },
            });
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          alert("Error generating PDF: " + err.message);
        });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Check the console for details.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <form
        action="/"
        method="get"
        className="pt-10 flex flex-col items-center"
      >
        <input
          type="file"
          name="pdf"
          id="pdf"
          accept=".pdf"
          onChange={(e) => {
            handleFileUpload(e);
            if (e.target.files[0]) {
              setFile(e.target.files[0].name);
            }
          }}
          className="hidden"
        />
        <label htmlFor="pdf">
          {!file && (
            <button
              type="button"
              className="bg-[#da4133] font-bold pt-2 pl-5 pb-2 pr-5 text-white cursor-pointer rounded-xl"
              onClick={() => document.getElementById("pdf").click()}
            >
              Select files
            </button>
          )}
          {file && (
            <button
              type="button"
              className="bg-[#919fca] font-bold pt-2 pl-5 pb-2 pr-5 text-white cursor-pointer rounded-xl"
              onClick={() => setFile(null)}
            >
              File Selected
            </button>
          )}
        </label>
        <p id="file-name" className="mt-2 text-gray-700">
          {file || ""}
        </p>
      </form>

      {pages.length > 0 && (
        <PdfPagesViewer
          pages={pages}
          selectedPages={selectedPages}
          onPageToggle={handlePageToggle}
        />
      )}

      <button
        type="button"
        className="bg-[#da4133] font-bold pt-2 pl-5 pb-2 pr-5 text-white cursor-pointer rounded-xl mt-5"
        onClick={handleGenerate}
      >
        Generate
      </button>
      {loading && (
        <div className="mt-5">
          <p className="text-gray-700">Generating quiz, please wait...</p>
        </div>
      )}
    </div>
  );
}
