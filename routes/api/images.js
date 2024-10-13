const express = require("express");
const multer = require("multer");
const NodeClam = require("clamscan");
const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

const clamscan = new NodeClam().init({
  removeInfected: true, // Automatically remove infected files
  quarantineInfected: false, // Don't quarantine, just delete infected files
  debugMode: false, // Show detailed debug info in console
  scanLog: "./logs/clamscan.txt", // Log file to append scan results
  scanRecursively: false, // Scan folders recursively
  clamdscan: {
    host: "localhost",
    port: 3310,
    timeout: 60000,
  },
});

// Function to scan uploaded files
const scanFile = async (filePath) => {
  try {
    const clamav = await clamscan;
    const { isInfected, viruses } = await clamav.scanFile(filePath);

    if (isInfected) {
      console.log(`File is infected with: ${viruses}`);
      fs.unlinkSync(filePath); // Remove infected file
      return { infected: true, viruses };
    }

    return { infected: false };
  } catch (error) {
    console.error("Error during ClamAV scan:", error);
    throw error;
  }
};

// @route    GET api/v1/images
// @desc     Test route
// @access   Public
router.get("/", (req, res) => res.send("Images route"));

// @route    POST api/v1/images
// @desc     Upload 2 images
// @access   Public
router.post("/", upload.array("images", 2), (req, res) => {
  try {
    if (!req.files || req.files.length !== 2) {
      return res.status(400).json({ msg: "Please upload exactly 2 images" });
    }
    const file1 = req.files[0];
    const file2 = req.files[1];
    const { infectedFile1, virusesFile1 } = scanFile(file1.path);
    const { infectedFile2, virusesFile2 } = scanFile(file2.path);
    console.log("Infected file 1: ", infectedFile1);
    console.log("Viruses file 1: ", virusesFile1);
    console.log("Infected file 2: ", infectedFile2);
    console.log("Viruses file 2: ", virusesFile2);

    // Log file details to verify they are received
    req.files.forEach((file) => {
      console.log(
        `Received file: ${file.originalname}, size: ${file.size} bytes`
      );
    });

    res.json({ msg: "Images uploaded successfully", files: req.files });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
