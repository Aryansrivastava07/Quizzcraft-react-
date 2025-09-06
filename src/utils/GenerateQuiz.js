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
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // URL.revokeObjectURL(url);
    // window.generatedPdfBlob = blob;
    // window.generatedPdfUrl = url;

    // const formData = new FormData();
    // formData.append("pdf", blob, "selected_pages.pdf");
    // Make API call to your backend to handle the PDF blob
    //   setLoading(true);
    // fetch("http://localhost:5000/upload-pdf", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((res) => {
    //     if (!res.ok) {
    //       return res.json().then((errorData) => {
    //         throw new Error(
    //           errorData.message || "Network response was not ok"
    //         );
    //       });
    //     }
    //     return res.json();
    //   })
    //   .then((data) => {
    //     // setQuizData(data.data.quiz);
    //     console.log("Quiz Data:", data.data.quiz);
    //     // Navigate to QuizPlatform with the quiz data
    //     const question = data.data.quiz.map((q) => q.question);
    //     const options = data.data.quiz.map((q) => q.options);
    //     console.log("Navigating to QuizPlatform with data:", {
    //       quizId: data.data.quizId,
    //       Questions: question,
    //       Options: options,
    //     });
    //     navigate("/QuizPlatform", {
    //       state: {
    //         quizId: data.data.quizId,
    //         Questions: question,
    //         Options: options,
    //       },
    //     });
    //   })
    //   .catch((err) => {
    //     console.error("Fetch error:", err);
    //     alert("Error generating PDF: " + err.message);
    //   });
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

export const handleGenerate = async ({ uploadedFiles, setQuizData , setAnskey , setQuizId }) => {
  if (uploadedFiles.pdf.length > 0 || uploadedFiles.image.length > 0 || uploadedFiles.video.length > 0) {
    for (const pdf of uploadedFiles.pdf) {
      if (pdf.selectedPages.length === 0) {
        console.error(`No pages selected for PDF: ${pdf.name}`);
        return null; // Or handle this case as an error
      }
    }
    await callGeneratePdf(uploadedFiles.pdf);
    DatatoSend.image = uploadedFiles.image;
    DatatoSend.video = uploadedFiles.video;
    fecthResponse(DatatoSend, setQuizData,setAnskey, setQuizId);
  }
  else {
    console.error("No files uploaded!");
  }
};

const fecthResponse = async (DatatoSend, setQuizData,setAnskey , setQuizId) => {
  const formData = new FormData();
  DatatoSend.pdf.forEach((file, idx) => formData.append(`pdf${idx}`, file));
  DatatoSend.image.forEach((file, idx) => formData.append(`image${idx}`, file.file));
  DatatoSend.video.forEach((file, idx) => formData.append(`video${idx}`, file.file));

  if (DatatoSend.prompt) {
    formData.append("prompt", DatatoSend.prompt);
  }

  fetch("http://localhost:5000/generate-quiz", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setQuizData(data.data.quiz);
      setQuizId(data.data.quizId);
      setAnskey(data.answerKey);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
    });
};
