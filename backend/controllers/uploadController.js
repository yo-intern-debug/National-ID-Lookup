const { createWorker } = require("tesseract.js");
const fs = require("fs");

exports.handleUpload = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "No image file uploaded or invalid file type",
    });
  }

  try {
    const worker = await createWorker("eng");
    const result = await worker.recognize(req.file.path);
    await worker.terminate();

    const text = result.data.text;

    // Extract ID using regex
    const match = text.match(/FCN\s+(\d{12}|\d{4}-\d{4}-\d{4})/i);
    const extracted = {
      id: match ? match[1] : "Not found",
    };
    console.log("FCN Extraction Result:", extracted);
    console.log(extracted.id);
    res.json({
      status: "success",
      id: extracted.id,
      extracted,
      raw: text,
    });
  } catch (err) {
    next(err);
  } finally {
    // Clean up uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    }
  }
};
