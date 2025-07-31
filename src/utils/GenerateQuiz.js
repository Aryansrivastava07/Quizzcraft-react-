import { PDFDocument } from 'pdf-lib';
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


export const handleGenerate = async ({pdf}) => {
    if (!pdf.pdf) {
      alert("No PDF file uploaded!");
      return;
    }
    if (pdf.selectedPages.length === 0) {
      alert("No pages selected!");
      return;
    }
    const pdfBytes = pdf.pdfBytes;
    const selectedPages = pdf.selectedPages;

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
    //   setLoading(true);
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
          // setQuizData(data.data.quiz);
          console.log("Quiz Data:", data.data.quiz);
        //   setLoading(false);
          // Navigate to QuizPlatform with the quiz data
          const question = data.data.quiz.map((q) => q.question);
          const options = data.data.quiz.map((q) => q.options);
          console.log("Navigating to QuizPlatform with data:", {
            quizId: data.data.quizId,
            Questions: question,
            Options: options,
          });
        //   navigate("/QuizPlatform", {
        //     state: {
        //       quizId: data.data.quizId,
        //       Questions: question,
        //       Options: options,
        //     },
        //   });
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