import { PDFDocument } from "pdf-lib";

const DatatoSend = {
  pdf: [],
  image: [],
  video: [],
  prompt: null,
};
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

const GeneratePdf = async ({ pdf }) => {
  if (!pdf.pdf) {
    throw new Error("No PDF file uploaded!");
  }
  if (pdf.selectedPages.length === 0) {
    throw new Error("No pages selected!");
  }
  const pdfBytes = pdf.pdfBytes;
  const selectedPages = pdf.selectedPages;

  // Clone pdfBytes for safe processing—in case the original is detached during PDF processing.
  const pdfBytesClone = new Uint8Array(pdfBytes.length);
  pdfBytesClone.set(pdfBytes);

  try {
    const newPdfBytes = await createNewPDF(pdfBytesClone, selectedPages);
    const blob = new Blob([newPdfBytes], { type: "application/pdf" });
    const renamedFile = new File([blob], pdf.name, { type: "application/pdf" });
    return renamedFile;
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Check the console for details.");
  }
};
// const callGeneratePdf = async ({ pdf }) => {
//   if(!pdf) return null;
//   pdf.map(async (pdf) => {
//       try {
//         const Updatedpdf = await GeneratePdf({ pdf });
//         DatatoSend.pdf = [...DatatoSend.pdf, Updatedpdf];
//       } catch (error) {
//         console.error("Error processing PDF:", error);
//       }
//     });
// }
const callGeneratePdf = async (pdfArray) => {
  if (!pdfArray || pdfArray.length === 0) return [];

  const editedPdfs = await Promise.all(
    pdfArray.map(async (pdf) => {
      try {
        const Updatedpdf = await GeneratePdf({ pdf });
        DatatoSend.pdf = [...DatatoSend.pdf, Updatedpdf];
      } catch (error) {
        console.error("Error processing PDF:", error);
        return null; // Or handle how you want to skip failed ones
      }
    })
  );

  // Filter out any nulls
  return editedPdfs.filter((f) => f !== null);
};

export const handleGenerate = async ({
  uploadedFiles,
  setQuizData,
  setAnskey,
  setQuizId,
}) => {
  if (
    uploadedFiles.pdf.length > 0 ||
    uploadedFiles.image.length > 0 ||
    uploadedFiles.video.length > 0
  ) {
    for (const pdf of uploadedFiles.pdf) {
      if (pdf.selectedPages.length === 0) {
        console.error(`No pages selected for PDF: ${pdf.name}`);
        return null; // Or handle this case as an error
      }
    }
    await callGeneratePdf(uploadedFiles.pdf);
    DatatoSend.image = uploadedFiles.image;
    DatatoSend.video = uploadedFiles.video;
    fecthResponse(DatatoSend, setQuizData, setAnskey, setQuizId);
  } else {
    console.error("No files uploaded!");
  }
};

const fecthResponse = async (DatatoSend, setQuizData, setAnskey, setQuizId) => {
  const formData = new FormData();
  // The server's multer middleware expects an array of files under the 'files' field name.
  DatatoSend.pdf.forEach((file) => formData.append("files", file));
  DatatoSend.image.forEach((file) => formData.append("files", file.file));
  DatatoSend.video.forEach((file) => formData.append("files", file.file));

  if (DatatoSend.prompt) {
    formData.append("prompt", DatatoSend.prompt);
  }

  // Assuming the auth token is stored in localStorage.
  // The 'authenticateUser' middleware on the server requires this.
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Authentication error. Please log in.");
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    // 'Content-Type' is not set for FormData; the browser sets it with the correct boundary.
  };

  try {
    // Step 1: Call the quizCreation endpoint. It returns the ID of the created quiz.
    const createQuizResponse = await fetch(
      "http://localhost:5000/api/v1/quiz/quizCreation",
      {
        method: "POST",
        headers,
        body: formData,
      }
    );

    if (!createQuizResponse.ok) {
      const errorData = await createQuizResponse.json();
      throw new Error(
        errorData.message || "Network response was not ok during quiz creation"
      );
    }

    const creationData = await createQuizResponse.json();
    const newQuizId = creationData.data.response.quizId;

    if (!newQuizId) {
      throw new Error("Server did not return a quiz ID after creation.");
    }

    setQuizId(newQuizId);

    // Step 2: Use the new quiz ID to fetch the full quiz data.
    const getQuizResponse = await fetch(
      `http://localhost:5000/api/v1/quiz/getQuiz?id=${newQuizId}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!getQuizResponse.ok) {
      const errorData = await getQuizResponse.json();
      throw new Error(
        errorData.message || "Failed to fetch the created quiz data."
      );
    }

    const quizDataResponse = await getQuizResponse.json();
    const quiz = quizDataResponse.data.quiz;

    if (!quiz) {
      throw new Error("Server did not return quiz data.");
    }

    // The server returns the full quiz object, including answers.
    // We can now set the state for the quiz and the answer key.
    setQuizData(quiz);

    const answerKey = quiz.questions.map((q) => ({
      correct_answer: q.answer,
      explanation: q.explanation,
    }));
    setAnskey(answerKey);
  } catch (err) {
    console.error("Fetch error:", err);
    alert(`Error generating quiz: ${err.message}`);
  }
};
