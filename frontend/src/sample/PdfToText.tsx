import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

// Set the worker source for PDF.js (local or from CDN, depending on your choice)
GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"
// Define the type for PDF.js content items
interface TextItem {
  str: string;
}

// Define the type for the file input event
interface FileInputEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & { files: FileList };
}

const PdfToText: React.FC = () => {
  const [pdfText, setPdfText] = useState<string>("");

  const extractTextFromPdf = async (file: string): Promise<void> => {
    try {
      // Load the PDF file
      const pdf = await pdfjsLib.getDocument(file).promise;

      let text = "";

      // Loop through each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        // Extract text content, ensuring the item has the 'str' property
        const pageText = content.items
          .map((item) => {
            // Type guard to check if the item is a TextItem
            if ("str" in item) {
              return (item as TextItem).str;
            }
            return ""; // Return an empty string for non-TextItem objects
          })
          .join(" ");
        text += pageText + "\n";
      }

      console.log("Extracted Text: ", text);

      setPdfText(text);
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
    }
  };

  const handleFileChange = (event: FileInputEvent): void => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      extractTextFromPdf(fileURL);
    }
  };

  return (
    <div>
      <h1>PDF to Text Converter</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <textarea
        value={pdfText}
        readOnly
        rows={20}
        cols={80}
        style={{ marginTop: "20px", width: "100%", color: "white" }}
      ></textarea>
    </div>
  );
};

export default PdfToText;
