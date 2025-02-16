import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import VenueSidebar from "./VenueSidebar";

export default function AgreementPage() {
  const [isAgreed, setIsAgreed] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [recipientEmails, setRecipientEmails] = useState("");

  // Refs for the signature canvas and the agreement content container
  const sigPad = useRef(null);
  const pdfRef = useRef(null);

  const clearSignature = () => {
    sigPad.current.clear();
    setSignatureData(null);
  };

  const handleSubmit = async () => {
    if (!isAgreed || !signatureData) {
      alert(
        "Please agree to the terms and provide your signature before submitting."
      );
      return;
    }
    if (!recipientEmails.trim()) {
      alert("Please enter at least one email address to send the agreement.");
      return;
    }

    try {
      // Capture the agreement content as an image
      const canvas = await html2canvas(pdfRef.current);
      const imgData = canvas.toDataURL("image/png");

      // Create a PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);

      // Convert the PDF to a Blob
      const pdfBlob = pdf.output("blob");

      // Prepare FormData to send to the backend API
      const formData = new FormData();
      formData.append("pdf", pdfBlob, "agreement.pdf");
      formData.append("emails", JSON.stringify(recipientEmails.split(","))); // Split emails by comma

      // Send the FormData to your backend endpoint
      const response = await fetch(
        "http://localhost:8000/api/sendAgreementEmail",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send the agreement email.");
      }
      alert("Agreement submitted and emailed successfully!");
    } catch (error) {
      console.error("Error submitting agreement:", error);
      alert("Error submitting agreement. Please try again.");
    }
  };

  return (
    <div>
      <VenueSidebar />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-center mb-6">
          Venue Booking Agreement
        </h1>

        {/* Agreement content container (captured as PDF) */}
        <div
          ref={pdfRef}
          className="border border-gray-300 p-6 rounded-md bg-gray-50"
        >
          <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              The venue owner shall not increase the price under any condition.
            </li>
            <li>
              The user must pay at least 50% of the total amount to place an
              order.
            </li>
            <li>
              If the user cancels the order more than 15 days before the event,
              15% of the paid amount will be deducted.
            </li>
            <li>
              If cancellation occurs within 15 days of the event, no refund will
              be provided.
            </li>
            <li>
              Both parties agree to adhere to the agreed-upon schedule and
              responsibilities.
            </li>
            <li>
              The user is responsible for any damages incurred during the event.
            </li>
            <li>
              Any disputes will be resolved through arbitration as per the terms
              of this agreement.
            </li>
          </ul>

          {/* Agreement confirmation checkbox */}
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              className="mr-2 h-5 w-5"
              onChange={(e) => setIsAgreed(e.target.checked)}
            />
            <span className="text-lg">
              I agree to the above terms and conditions.
            </span>
          </div>

          {/* Signature Section */}
          <div className="mt-8">
            <p className="font-semibold mb-2">Your Digital Signature</p>
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                className: "border border-gray-400 w-full h-32 rounded-md",
              }}
              ref={sigPad}
              onEnd={() => setSignatureData(sigPad.current.toDataURL())}
            />
          </div>
        </div>

        {/* Input for recipient emails */}
        <div className="mt-4">
          <label className="block mb-1 font-medium">
            Enter Recipient Email(s)
          </label>
          <input
            type="text"
            placeholder="Enter email addresses (comma separated)"
            value={recipientEmails}
            onChange={(e) => setRecipientEmails(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Clear Signature Button */}
        <div className="flex justify-end mt-2">
          <button onClick={clearSignature} className="text-red-500 underline">
            Clear Signature
          </button>
        </div>

        {/* Submit Agreement Button */}
        <button
          onClick={handleSubmit}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md w-full transition duration-300"
        >
          Submit Agreement
        </button>
      </div>
    </div>
  );
}
