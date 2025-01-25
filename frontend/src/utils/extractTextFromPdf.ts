import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";


// SPECIFIED THE PATH OF PDF.WORKER.MJS (ITS IN PUBLIC FOLDER)
//THIS IS NEEDED SINCE ITS DOWNLOADED IN LOCAL FILE
GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"

// TYPE OF THE PDF.JS CONTENT ITEMS
interface TextItem {
  str: string;
}

export const extractTextFromPdf = async (file: string): Promise<string | undefined> => {
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

      return text;
      
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return
    }

}