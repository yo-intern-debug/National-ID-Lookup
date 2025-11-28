"use client";

import { useState } from "react";

const LOGO_URL = "/nbe-logo.png";

export default function Home() {
  const [nationalId, setNationalId] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const [ocrLoading, setOcrLoading] = useState(false);

  // -------------------------------
  // 📌 Upload & Scan ID Image (OCR)
  // -------------------------------
  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadPreview(URL.createObjectURL(file));
    setOcrLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("idImage", file);

    try {
      const res = await fetch("http://localhost:5000/api/scan-id", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.detectedId) {
        setNationalId(json.detectedId);
        fetchId(json.detectedId); // Auto lookup
      } else {
        setError("Could not detect a 16-digit ID number from the image.");
      }
    } catch (err) {
      setError("Image scanning failed.");
    } finally {
      setOcrLoading(false);
    }
  };

  // -------------------------
  // 📌 Manual ID Lookup
  // -------------------------
  const fetchId = async (forcedId?: string) => {
    const idToUse = forcedId || nationalId;

    if (!/^\d{16}$/.test(idToUse)) {
      setError("National ID must be exactly 16 digits.");
      return;
    }

    setError("");
    setLoading(true);
    setUserData(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/national-id/${idToUse}`
      );

      const json = await res.json();

      if (!json.success) {
        setError("User not found.");
      } else {
        setUserData(json.data);
      }
    } catch (err) {
      setError("Lookup failed.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setNationalId("");
    setUserData(null);
    setError("");
    setUploadPreview(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#001B3A] to-black p-6">
      <div className="w-full max-w-4xl">

        {/* HEADER */}
        <header className="flex items-center gap-4 mb-8">
          <img
            src={LOGO_URL}
            alt="NBE Logo"
            className="w-20 h-20 rounded-full ring-2 ring-[#D4AF37]/50 shadow-lg"
          />
          <div>
            <h1 className="text-3xl text-white font-semibold">
              National Bank of Ethiopia — ID Lookup
            </h1>
            <p className="text-[#F2D77C]">Secure citizen verification</p>
          </div>
        </header>

        {/* MAIN CARD */}
        <main className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT SIDE */}
            <div className="flex flex-col space-y-6">

           
              {/* Image Upload */}
                <div>
                  <label className="font-medium">Upload ID Image</label>

                  <div
                    className="
                      mt-2 border-2 border-dashed border-gray-300 rounded-xl 
                      bg-gray-50 p-5 text-center cursor-pointer transition 
                      hover:bg-gray-100
                    "
                onClick={() => {
                  const input = document.getElementById("idUploadInput");
                  if (input) input.click();
                }}

                  >
                    {uploadPreview ? (
                      <img
                        src={uploadPreview}
                        className="w-44 mx-auto rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6H16a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>

                        <p className="text-gray-600 font-medium">
                          Drag & drop your ID image,<br />
                          or <span className="text-blue-600 underline">browse</span>
                        </p>

                        <p className="text-xs text-gray-500 mt-1">JPG, PNG supported</p>
                      </div>
                    )}
                  </div>

                  <input
                    id="idUploadInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  {ocrLoading && (
                    <p className="text-sm text-blue-600 mt-2 animate-pulse">
                      Scanning image for ID number...
                    </p>
                  )}
                </div>


              {/* Manual ID Input */}
              <div>
                <label className="font-medium">Enter National ID (16 digits)</label>
                <input
                  type="text"
                  maxLength={16}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="1234567890123456"
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => fetchId()}
                  disabled={loading}
                  className="bg-[#D4AF37] text-black font-semibold px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Searching..." : "Lookup"}
                </button>

                <button
                  onClick={clearAll}
                  className="border px-6 py-2 rounded-lg hover:bg-gray-100"
                >
                  Clear
                </button>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>

            {/* RIGHT SIDE — RESULT */}
            <div className="bg-[#F2D77C]/10 rounded-xl border border-[#D4AF37]/30 p-5">
              <h3 className="text-[#001B3A] text-lg font-semibold mb-3">Result</h3>

              {!userData ? (
                <p className="text-gray-600">No result yet.</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <img
                    src={userData.photo}
                    alt="User Photo"
                    className="w-32 rounded-lg shadow-md mb-3"
                  />

                  <p><strong>ID:</strong> {userData.id}</p>
                  <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
                  <p><strong>DOB:</strong> {userData.dob}</p>
                  <p><strong>Age:</strong> {userData.age}</p>
                  <p><strong>Address:</strong> {userData.address}</p>
                </div>
              )}

            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="text-center text-sm text-gray-400 mt-6">
          © National Bank of Ethiopia — Secure Service
        </footer>
      </div>
    </div>
  );
}
