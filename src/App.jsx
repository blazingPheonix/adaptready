import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function OcrDemo() {
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [data, setData] = useState(null);

  const handleImageChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleConvert = async () => {
    if (!imageUrl) return alert('Please provide an image URL');

    try {
      const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng');
      console.log('text ', text);
      setText(text);

      const idCardPattern = /Name:\s*(?<name>.+?)\n.*?DOR:\s*(?<dob>\d{2}\/\d{2}\/\d{4})/s;
      const match = text.match(idCardPattern);

      if (match && match.groups) {
        setData(match.groups);
      } else {
        alert('No structured data found.');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      alert('Error processing image');
    }
  };

  const handleCopyLink = () => {
    const demoImageUrl = 'https://res.cloudinary.com/dagdqfdvi/image/upload/v1741891624/WhatsApp_Image_2025-03-14_at_00.16.40_7fd88c6b_xcvkm7.jpg';
    navigator.clipboard.writeText(demoImageUrl)
      .then(() => alert('Demo link copied to clipboard!'))
      .catch(err => console.error('Error copying link:', err));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      {/* Left Section */}
      <div className="flex-1 p-8 bg-white border-r border-gray-300 w-full">
        <h1 className="text-4xl font-serif text-indigo-800 mb-8">OCR Demo: Extract Name and DOB</h1>

        <button 
          onClick={handleCopyLink} 
          className="px-6 py-3 mb-6 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
        >
          click here to copy Demo Link
        </button>

        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-xl">
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={handleImageChange}
            className="mb-4 p-4 border-2 border-gray-300 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleConvert} 
            className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Convert
          </button>
        </div>

        {imageUrl && (
          <div className="mt-6">
            <h2 className="text-xl text-gray-700 mb-2">Image Preview:</h2>
            <img 
              src={imageUrl} 
              alt="Uploaded" 
              className="mt-2 max-w-full rounded-lg shadow-lg border-4 border-gray-100"
            />
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex-1 p-8">
        {data && (
          <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl text-gray-700 mb-4">Structured Data:</h2>
            <table className="table-auto w-full border-separate border-spacing-0.5 rounded-lg">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="p-2 text-left text-sm text-indigo-700 font-semibold">Field</th>
                  <th className="p-2 text-left text-sm text-indigo-700 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-200 hover:bg-gray-50 transition duration-200">
                    <td className="p-2 text-sm text-gray-600 font-medium">{key}</td>
                    <td className="p-2 text-sm text-gray-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {text && !data && (
          <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-xl mt-8">
            <h2 className="text-xl text-gray-700 mb-4">Extracted Text:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg">{text}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
