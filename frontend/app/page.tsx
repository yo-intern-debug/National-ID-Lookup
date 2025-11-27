"use client";
import { useState } from "react";

// use your uploaded logo path
const LOGO_URL = "/nbe-logo.png";

export default function Home() {
  const [nationalId, setNationalId] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchId = async () => {
    if (!nationalId.trim()) {
      setError("Please enter a valid National ID.");
      return;
    }

    setError("");
    setLoading(true);
    setUserData(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/national-id/${encodeURIComponent(nationalId)}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("National ID not found.");
        }
        throw new Error("Server error occurred.");
      }

      const json = await res.json();
      if (json.success) {
        setUserData(json.data);
      } else {
        setError("No data found.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to lookup ID.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setNationalId("");
    setUserData(null);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#001B3A] to-black p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
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

        {/* Main Card */}
        <main className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT SIDE — Input Section */}
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-4 w-full max-w-md">
                <label className="font-medium">Enter National ID</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="Enter ID here"
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#D4AF37]"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={fetchId}
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
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <p className="text-xs text-gray-500">
                <strong>Note:</strong> This demo uses a test dataset. Once connected to the real NID API, results will reflect actual data.
              </p>
            </div>

            {/* RIGHT SIDE — Results */}
            <div className="bg-[#F2D77C]/10 rounded-xl border border-[#D4AF37]/30 p-5 flex flex-col items-center">
              <h3 className="text-[#001B3A] text-lg font-semibold mb-3">Result</h3>

              {!userData ? (
                <p className="text-gray-600">No result yet. Enter an ID and click Lookup.</p>
              ) : (
                <div className="space-y-2 text-sm animate-fade-in w-full flex flex-col items-center">
                  {/* Photo */}
                  {userData.photo && (
                    <img
                      src={userData.photo}
                      alt="ID Owner"
                      className="w-32 h-32 rounded-full object-cover border shadow-md mb-4"
                    />
                  )}

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

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400 mt-6">
          © National Bank of Ethiopia — Secure Service
        </footer>
      </div>

      {/* Animation Style */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}


