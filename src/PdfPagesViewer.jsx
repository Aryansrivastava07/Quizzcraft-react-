// PdfPagesViewer.js
import React from "react";

const PdfPagesViewer = ({ pages, selectedPages, onPageToggle }) => {
  return (
    <div className="flex flex-row gap-4 flex-nowrap mt-10 overflow-x-auto">
      {pages.map((page) => {
        const isSelected = selectedPages.includes(page.pageNumber);
        const imageClasses = `w-full h-auto border-2 ${isSelected ? "opacity-100" : "opacity-35"}`;

        return (
          <div
            key={page.pageNumber}
            className="flex-shrink-0 flex-grow-0 min-w-[100px] max-w-[150px] cursor-pointer"
            onClick={() => onPageToggle(page.pageNumber)}
          >
            <img
              src={page.imageData}
              alt={`Page ${page.pageNumber}`}
              className={imageClasses}
            />
            <p className="text-center">{page.pageNumber}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PdfPagesViewer;