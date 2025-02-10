const express = require("express");
const multer = require("multer");
const NodeClam = require("clamscan");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { PinataSDK } = require("pinata-web3");

const config = require("config");

const pinata = new PinataSDK({
  pinataJwt: config.PINATA_JWT,
  pinataGateway: config.PINATA_GATEWAY,
});

const {
  downloadImage,
  imageGeneration,
} = require("../../utils/imageGeneration");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage: storage });

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

const scanAllFiles = async (filePaths) => {
  try {
    const clamav = await clamscan;
    const results = await clamav.scanFiles(filePaths);

    if (results.badFiles.length > 0) {
      results.badFiles.forEach((badFile) => {
        if (badFile.isInfected) {
          console.log(`File is infected: ${badFile.file}`);
          fs.unlinkSync(badFile.file); // Remove infected file
        }
      });
      return false;
    }

    return results.goodFiles;
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
router.post("/", upload.array("images", 2), async (req, res) => {
  try {
    if (!req.files || req.files.length !== 2) {
      return res.status(400).json({ msg: "Please upload exactly 2 images" });
    }
    const file1 = req.files[0];
    const file2 = req.files[1];
    const filePaths = [file1.path, file2.path];
    const savedFiles = await scanAllFiles(filePaths);
    if (!savedFiles) {
      return res.status(400).json({ msg: "One or more files are infected" });
    }

    const url = await imageGeneration(savedFiles);
    const imagePath = await downloadImage(url, req.id);
    const base64Image = fs.readFileSync(imagePath, { encoding: "base64" });
    const upload = await pinata.upload.base64(base64Image);

    res.json({ msg: "Image generated successfully", upload });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
