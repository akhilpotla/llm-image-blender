const express = require('express');
const multer = require('multer');
const NodeClam = require('clamscan');
const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

const clamscan = new NodeClam().init({
  removeInfected: true, // Automatically remove infected files
  quarantineInfected: false, // Don't quarantine, just delete infected files
  debugMode: false, // Show detailed debug info in console
  scanLog: './logs/clamscan.txt', // Log file to append scan results
  scanRecursively: false, // Scan folders recursively
  clamdscan: {
    host: 'localhost',
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
    console.error('Error during ClamAV scan:', error);
    throw error;
  }
};

// @route    GET api/v1/images
// @desc     Test route
// @access   Public
router.get('/', (req, res) => res.send('Images route'));

// @route    POST api/v1/images
// @desc     Upload 2 images
// @access   Public
router.post('/', upload.single("image1"), (req, res) => {
  try {
    const filePath = req.file.path;
    const { infected, viruses } = scanFile(filePath);
    if (!req.files || req.files.length !== 2) {
      return res.status(400).json({ msg: 'Please upload exactly 2 images' });
    }

    // Log file details to verify they are received
    req.files.forEach(file => {
      console.log(`Received file: ${file.originalname}, size: ${file.size} bytes`);
    });

    res.json({ msg: 'Images uploaded successfully', files: req.files })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;