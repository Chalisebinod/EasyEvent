import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import html2canvas from "html2canvas";
import VenueSidebar from "./VenueSidebar";

export default function AgreementPage() {
  const [isAgreed, setIsAgreed] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [agreementPreview, setAgreementPreview] = useState(null);

  // Refs for the signature canvas and the agreement content container
  const sigPad = useRef(null);
  const pdfRef = useRef(null);

  const clearSignature = () => {
    sigPad.current.clear();
    setSignatureData(null);
    setAgreementPreview(null);
  };

  const generateAgreementPreview = async () => {
    try {
      // Capture the agreement content as an image
      const canvas = await html2canvas(pdfRef.current);
      const imgData = canvas.toDataURL("image/png");
      setAgreementPreview(imgData);
    } catch (error) {
      console.error("Error generating agreement preview:", error);
    }
  };

  // Automatically generate the agreement preview when user agrees and has signed
  useEffect(() => {
    if (isAgreed && signatureData) {
      generateAgreementPreview();
    }
  }, [isAgreed, signatureData]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sticky Sidebar */}
      <div className="sticky top-0 h-screen">
        <VenueSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-10">
          <h1 className="text-3xl font-bold text-center mb-6">
            Venue Booking Agreement
          </h1>

          {/* Agreement Content Container (this will be captured as an image) */}
          <div
            ref={pdfRef}
            className="border border-gray-300 p-6 rounded-md bg-gray-50"
          >
            <h2 className="text-xl font-semibold mb-4">
              Terms and Conditions
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                The venue owner shall not increase the price under any condition.
              </li>
              <li>
                The user must pay at least 50% of the total amount to place an order.
              </li>
              <li>
                If the user cancels the order more than 15 days before the event, 15% of the paid amount will be deducted.
              </li>
              <li>
                If cancellation occurs within 15 days of the event, no refund will be provided.
              </li>
              <li>
                Both parties agree to adhere to the agreed-upon schedule and responsibilities.
              </li>
              <li>
                The user is responsible for any damages incurred during the event.
              </li>
              <li>
                Any disputes will be resolved through arbitration as per the terms of this agreement.
              </li>
            </ul>

            {/* Agreement Confirmation Checkbox */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                className="mr-2 h-5 w-5"
                checked={isAgreed}
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
                  className:
                    "border border-gray-400 w-full h-32 rounded-md",
                }}
                ref={sigPad}
                onEnd={() =>
                  setSignatureData(sigPad.current.toDataURL())
                }
              />
            </div>
          </div>

          {/* Clear Signature Button */}
          <div className="flex justify-end mt-2">
            <button onClick={clearSignature} className="text-red-500 underline">
              Clear Signature
            </button>
          </div>

          {/* Generate/Print Agreement Button */}
          <button
            onClick={generateAgreementPreview}
            disabled={!isAgreed || !signatureData}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md w-full transition duration-300"
          >
            {agreementPreview ? "Agreement Generated" : "Generate Agreement"}
          </button>
        </div>

        {/* Sticky Agreement Preview Panel */}
        {agreementPreview && (
          <div className="absolute top-10 right-10 bg-white shadow-lg rounded-md p-4 border border-gray-200">
            <h3 className="text-lg font-bold mb-2">Your Agreement</h3>
            <img
              src={agreementPreview}
              alt="Agreement Preview"
              className="w-64"
            />
          </div>
        )}
      </div>
    </div>
  );
}
