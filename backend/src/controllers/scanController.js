const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

exports.scanIdImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    const imgPath = req.file.path;

    const result = await Tesseract.recognize(imgPath, "eng");
    const text = result.data.text;

    // Extract ONLY 16-digit ID
    const match = text.match(/\b\d{16}\b/);

    fs.unlinkSync(imgPath); // delete temp uploaded file

    res.json({
      rawText: text,
      detectedId: match ? match[0] : null,
    });
  } catch (err) {
    res.status(500).json({
      error: "OCR failed",
      details: err.message,
    });
  }
};
