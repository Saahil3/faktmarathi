import { useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [translatedText, setTranslatedText] = useState("");
  const [activeTab, setActiveTab] = useState("text"); // To manage the active tab

  // Handle Text Translation
  const handleTextTranslate = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/translate-text",
        { text }
      );
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  // Handle Image Translation
  const handleImageTranslate = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/translate-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error("Error translating image:", error);
    }
  };

  // Handle Document Translation
  const handleDocumentTranslate = async () => {
    const formData = new FormData();
    formData.append("file", documentFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/translate-document",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error("Error translating document:", error);
    }
  };

  // Handle PPT Translation
  const handlePptTranslate = async () => {
    const formData = new FormData();
    formData.append("file", pptFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/translate-ppt",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, responseType: 'blob' }
      );

      // Create a URL for the translated PPT file and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'translated_ppt.pptx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error translating PPT:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-6">Marathi Translator</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-6 py-2 text-lg font-medium rounded-md ${
            activeTab === "text" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("text")}
        >
          Text
        </button>
        <button
          className={`px-6 py-2 text-lg font-medium rounded-md ${
            activeTab === "image" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("image")}
        >
          Image
        </button>
        <button
          className={`px-6 py-2 text-lg font-medium rounded-md ${
            activeTab === "document" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("document")}
        >
          Document
        </button>
        <button
          className={`px-6 py-2 text-lg font-medium rounded-md ${
            activeTab === "ppt" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("ppt")}
        >
          PPT
        </button>
      </div>

      {/* Text Translation */}
      {activeTab === "text" && (
        <div className="w-full max-w-2xl p-6 bg-white rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Translate Text</h2>
          <div className="flex flex-col space-y-4">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-md"
              rows="5"
              placeholder="Enter text to translate..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-md"
              onClick={handleTextTranslate}
            >
              Translate Text
            </button>
          </div>
        </div>
      )}

      {/* Image Translation */}
      {activeTab === "image" && (
        <div className="w-full max-w-2xl p-6 bg-white rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Translate Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full p-4 border border-gray-300 rounded-md mb-4"
          />
          <button
            className="w-full py-2 bg-blue-600 text-white rounded-md"
            onClick={handleImageTranslate}
          >
            Translate Image
          </button>
        </div>
      )}

      {/* Document Translation */}
      {activeTab === "document" && (
        <div className="w-full max-w-2xl p-6 bg-white rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Translate Document</h2>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setDocumentFile(e.target.files[0])}
            className="w-full p-4 border border-gray-300 rounded-md mb-4"
          />
          <button
            className="w-full py-2 bg-blue-600 text-white rounded-md"
            onClick={handleDocumentTranslate}
          >
            Translate Document
          </button>
        </div>
      )}

      {/* PPT Translation */}
      {activeTab === "ppt" && (
        <div className="w-full max-w-2xl p-6 bg-white rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Translate PPT</h2>
          <input
            type="file"
            accept=".pptx"
            onChange={(e) => setPptFile(e.target.files[0])}
            className="w-full p-4 border border-gray-300 rounded-md mb-4"
          />
          <button
            className="w-full py-2 bg-blue-600 text-white rounded-md"
            onClick={handlePptTranslate}
          >
            Translate PPT
          </button>
        </div>
      )}

      {/* Translated Text Display */}
      {translatedText && (
        <div className="mt-6 p-6 max-w-2xl w-full bg-white rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Translated Text</h2>
          <p className="whitespace-pre-wrap text-gray-700">{translatedText}</p>
        </div>
      )}
    </div>
  );
}
