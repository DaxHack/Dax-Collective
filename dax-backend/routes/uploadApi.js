// dax-backend/routes/uploadApi.js
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const admin = require('firebase-admin');
const fs = require('fs'); // Still needed for some operations like stream.Readable.from
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp'); // For image optimization
const router = express.Router();

// --- Firebase Admin SDK Initialization ---
// Ensure this is initialized once in your main server.js or here if this is the only place it's used.
// It's safer to initialize it in your main server.js file and pass `admin` to this router.
// For demonstration, I'll include it here, assuming it's the first place it's initialized.
if (!admin.apps.length) {
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './credentials/firebase-adminsdk.json';
    const serviceAccount = require(path.resolve(serviceAccountPath)); // Ensure this path is correct
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET // Required for Firebase Storage
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    // Exit process or handle error appropriately if Firebase is critical
  }
}

// --- Firebase Authentication Middleware ---
const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token', details: error.message });
  }
};

// --- Google Drive API Setup (using OAuth2 with Refresh Token) ---
// This is generally more robust for a backend service
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // Ensure this is set in your .env
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN // Ensure this is set in your .env
});

// Function to get authenticated Drive instance
const getDriveService = () => {
  return google.drive({ version: 'v3', auth: oauth2Client });
};

// --- Multer Configuration ---
const storage = multer.memoryStorage(); // Store files in memory for processing with sharp
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// --- Folder Mapping for Smart Routing (from your .env) ---
const FOLDER_MAPPING = {
  'dax-the-traveler': process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS,
  'gods-vessel': process.env.REACT_APP_DRIVE_GODS_VESSEL_PHOTOS,
  'ani-dax': process.env.REACT_APP_DRIVE_ANI_DAX_PHOTOS,
  'timezone-travelers': process.env.REACT_APP_DRIVE_TIMEZONE_TRAVELERS_PHOTOS,
  'dax-homepage': process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS,
  'dax-analytics': process.env.REACT_APP_DRIVE_DAX_ANALYTICS_IMAGES,
  // Add any other categories you need, matching your frontend's logic
  'collective': process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS // Default/fallback
};

// --- Helper Functions ---

// Helper function to generate unique filename
const generateUniqueFilename = (originalName) => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex'); // Shorter random string
  return `${name.substring(0, 50)}-${timestamp}-${random}${ext}`; // Limit name length
};

// Helper function to optimize image using sharp
const optimizeImage = async (buffer, options = {}) => {
  const { width = 1920, quality = 85, format = 'jpeg' } = options;

  return await sharp(buffer)
    .resize(width, null, {
      withoutEnlargement: true, // Don't enlarge if smaller than width
      fit: 'inside' // Maintain aspect ratio, fit within dimensions
    })
    .jpeg({ quality, progressive: true }) // Use JPEG for web, progressive for faster loading
    .toBuffer();
};

// Helper function to generate image hash for duplicate detection
const generateImageHash = (buffer) => {
  return crypto.createHash('md5').update(buffer).digest('hex');
};

// Helper function to check for duplicates in Drive folder
const checkDuplicatesInFolder = async (driveInstance, folderId, fileHashes) => {
  try {
    const response = await driveInstance.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, md5Checksum, size, createdTime)',
      pageSize: 1000 // Fetch up to 1000 files to check for duplicates
    });

    const existingFiles = response.data.files || [];
    const duplicates = [];

    fileHashes.forEach((hash, index) => {
      const duplicate = existingFiles.find(file => file.md5Checksum === hash);
      if (duplicate) {
        duplicates.push({
          index, // Index of the uploaded file that is a duplicate
          hash,
          existingFile: duplicate
        });
      }
    });

    return duplicates;
  } catch (error) {
    console.error('Error checking duplicates in Drive:', error);
    return [];
  }
};

// Helper to make file publicly viewable in Google Drive
const makeFilePublic = async (driveInstance, fileId) => {
  try {
    await driveInstance.permissions.create({
      fileId: fileId,
      resource: {
        role: 'reader',
        type: 'anyone'
      }
    });
  } catch (error) {
    console.error(`Error making Drive file ${fileId} public:`, error);
    // Log error but don't fail the upload, as the file is still uploaded
  }
};

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// --- API Routes ---

// Route: Upload to Firebase Storage (Profile Pictures)
router.post('/firebase-profile', verifyAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const bucket = admin.storage().bucket();
    const fileName = `profile-pictures/${req.user.uid}/${generateUniqueFilename(req.file.originalname)}`; // Store by user ID
    const file = bucket.file(fileName);

    // Optimize image for profile picture (smaller size)
    const optimizedBuffer = await optimizeImage(req.file.buffer, {
      width: 400,
      quality: 90
    });

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          originalName: req.file.originalname,
          uploadedBy: req.user.uid,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    stream.on('error', (error) => {
      console.error('Firebase upload stream error:', error);
      res.status(500).json({ error: 'Upload failed during stream' });
    });

    stream.on('finish', async () => {
      try {
        // Make file publicly accessible
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        res.json({
          success: true,
          url: publicUrl,
          fileName: fileName,
          originalName: req.file.originalname,
          size: optimizedBuffer.length,
          message: 'Profile picture uploaded to Firebase Storage successfully'
        });
      } catch (error) {
        console.error('Error making Firebase file public or getting URL:', error);
        res.status(500).json({ error: 'Failed to finalize Firebase upload' });
      }
    });

    stream.end(optimizedBuffer);
  } catch (error) {
    console.error('Firebase profile upload error:', error);
    res.status(500).json({ error: 'Profile picture upload failed', details: error.message });
  }
});

// Route: Upload to Google Drive with smart routing (single or batch)
router.post('/drive-upload', verifyAuth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const { category, tags, description, folderId: clientFolderId } = req.body; // clientFolderId can be passed from frontend
    
    // Determine target folder ID
    const targetFolderId = clientFolderId || FOLDER_MAPPING[category] || FOLDER_MAPPING['collective'];

    if (!targetFolderId) {
      return res.status(400).json({ error: 'Invalid category or target folder not configured' });
    }

    const driveInstance = getDriveService();
    const fileData = [];
    const fileHashes = [];

    // Process files, optimize, and generate hashes
    for (const file of req.files) {
      const optimizedBuffer = await optimizeImage(file.buffer);
      const hash = generateImageHash(optimizedBuffer);

      fileData.push({
        buffer: optimizedBuffer,
        originalName: file.originalname,
        mimetype: file.mimetype,
        hash
      });
      fileHashes.push(hash);
    }

    // Check for duplicates
    const duplicates = await checkDuplicatesInFolder(driveInstance, targetFolderId, fileHashes);

    if (duplicates.length > 0) {
      return res.status(409).json({ // 409 Conflict
        success: false,
        duplicates: duplicates.map(dup => ({
          fileName: req.files[dup.index].originalname,
          hash: dup.hash,
          existingFile: dup.existingFile
        })),
        message: 'Duplicate files detected in target folder. No files were uploaded.'
      });
    }

    // Upload files to Drive
    const uploadResults = [];

    for (const file of fileData) {
      const fileName = generateUniqueFilename(file.originalName);

      const fileMetadata = {
        name: fileName,
        parents: [targetFolderId],
        description: description || `Uploaded by ${req.user.email} via automation system. Tags: ${tags || 'none'}`
      };

      const media = {
        mimeType: file.mimetype,
        body: require('stream').Readable.from(file.buffer) // Use stream.Readable.from for buffer
      };

      const response = await driveInstance.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, size, createdTime, webViewLink, thumbnailLink' // Request thumbnailLink
      });

      await makeFilePublic(driveInstance, response.data.id);

      uploadResults.push({
        id: response.data.id,
        fileName: response.data.name,
        originalName: file.originalName,
        size: response.data.size,
        category: category,
        webViewLink: response.data.webViewLink,
        thumbnailLink: response.data.thumbnailLink, // Include thumbnailLink
        directLink: `https://drive.google.com/uc?id=${response.data.id}`,
        createdTime: response.data.createdTime,
        tags: tags ? JSON.parse(tags) : [], // Assuming tags come as JSON string
        hash: file.hash
      });
    }

    res.json({
      success: true,
      uploads: uploadResults,
      category: category,
      folderId: targetFolderId,
      totalFiles: uploadResults.length,
      message: `Successfully uploaded ${uploadResults.length} files.`
    });

  } catch (error) {
    console.error('Drive upload error:', error);
    res.status(500).json({ error: 'Drive upload failed', details: error.message });
  }
});

// Route: Check for duplicates before upload (can be called separately by frontend)
router.post('/check-duplicates', verifyAuth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided for duplicate check' });
    }

    const { folderId, category } = req.body;
    const targetFolderId = folderId || FOLDER_MAPPING[category] || FOLDER_MAPPING.collective;

    if (!targetFolderId) {
      return res.status(400).json({ error: 'Target folder not specified or configured' });
    }

    const driveInstance = getDriveService();
    const fileHashes = [];
    const fileInfo = [];

    for (const file of req.files) {
      const hash = generateImageHash(file.buffer);
      fileHashes.push(hash);
      fileInfo.push({
        name: file.originalname,
        size: file.size,
        hash
      });
    }

    const duplicates = await checkDuplicatesInFolder(driveInstance, targetFolderId, fileHashes);

    res.json({
      duplicates: duplicates.map(dup => ({
        fileName: fileInfo[dup.index].name,
        hash: dup.hash,
        existingFile: dup.existingFile
      })),
      totalFiles: req.files.length,
      duplicateCount: duplicates.length,
      message: duplicates.length > 0 ? 'Duplicates found.' : 'No duplicates found.'
    });

  } catch (error) {
    console.error('Duplicate check API error:', error);
    res.status(500).json({ error: 'Duplicate check failed', details: error.message });
  }
});

// Route: Get images from Drive folder
router.get('/drive/images/:folderId', verifyAuth, async (req, res) => {
  try {
    const { folderId } = req.params;
    const { pageSize = 50, pageToken } = req.query;

    const driveInstance = getDriveService();
    const response = await driveInstance.files.list({
      q: `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`,
      fields: 'nextPageToken, files(id, name, size, createdTime, modifiedTime, webViewLink, thumbnailLink)',
      pageSize: parseInt(pageSize),
      pageToken,
      orderBy: 'createdTime desc'
    });

    const images = response.data.files.map(file => ({
      id: file.id,
      name: file.name,
      size: file.size,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      webViewLink: file.webViewLink,
      thumbnailLink: file.thumbnailLink,
      directLink: `https://drive.google.com/uc?id=${file.id}`,
      downloadLink: `https://drive.google.com/uc?export=download&id=${file.id}`
    }));

    res.json({
      images,
      nextPageToken: response.data.nextPageToken,
      totalCount: images.length,
      message: `Fetched ${images.length} images from folder ${folderId}`
    });

  } catch (error) {
    console.error('Error fetching Drive images:', error);
    res.status(500).json({ error: 'Failed to fetch images', details: error.message });
  }
});

// Route: Get folder information and statistics
router.get('/drive/folder/:folderId', verifyAuth, async (req, res) => {
  try {
    const { folderId } = req.params;

    const driveInstance = getDriveService();

    // Get folder info
    const folderInfo = await driveInstance.files.get({
      fileId: folderId,
      fields: 'id, name, createdTime, modifiedTime'
    });

    // Get file count and total size
    const filesResponse = await driveInstance.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(size, mimeType)',
      pageSize: 1000 // Max page size for stats
    });

    const files = filesResponse.data.files || [];
    const imageFiles = files.filter(file => file.mimeType && file.mimeType.startsWith('image/'));
    const totalSize = files.reduce((sum, file) => sum + (parseInt(file.size) || 0), 0);

    res.json({
      id: folderInfo.data.id,
      name: folderInfo.data.name,
      createdTime: folderInfo.data.createdTime,
      modifiedTime: folderInfo.data.modifiedTime,
      totalFiles: files.length,
      imageCount: imageFiles.length,
      totalSize,
      formattedSize: formatBytes(totalSize),
      message: `Fetched info for folder ${folderId}`
    });

  } catch (error) {
    console.error('Error getting folder info:', error);
    res.status(500).json({ error: 'Failed to get folder information', details: error.message });
  }
});

// Route: Batch upload from URLs (for photo search integration)
router.post('/drive/batch-from-urls', verifyAuth, async (req, res) => {
  try {
    const { urls, category = 'collective', tags = [], descriptions = [] } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'No URLs provided' });
    }

    const targetFolderId = FOLDER_MAPPING[category] || FOLDER_MAPPING['collective'];
    if (!targetFolderId) {
      return res.status(400).json({ error: 'Invalid category or target folder not configured' });
    }

    const driveInstance = getDriveService();
    const uploadResults = [];
    const errors = [];

    for (let i = 0; i < urls.length; i++) {
      try {
        const url = urls[i];
        const response = await fetch(url); // Node.js fetch API
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
        }

        const buffer = await response.buffer();
        const optimizedBuffer = await optimizeImage(buffer); // Optimize fetched image

        const urlPath = new URL(url).pathname;
        const originalName = path.basename(urlPath) || `image-${i + 1}.jpg`;
        const fileName = generateUniqueFilename(originalName);

        const fileMetadata = {
          name: fileName,
          parents: [targetFolderId],
          description: descriptions[i] || `Downloaded from ${url} by ${req.user.email}`
        };

        const media = {
          mimeType: 'image/jpeg', // Assume JPEG after optimization
          body: require('stream').Readable.from(optimizedBuffer)
        };

        const driveResponse = await driveInstance.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id, name, size, createdTime, webViewLink, thumbnailLink'
        });

        await makeFilePublic(driveInstance, driveResponse.data.id);

        uploadResults.push({
          id: driveResponse.data.id,
          fileName: driveResponse.data.name,
          originalUrl: url,
          size: driveResponse.data.size,
          category,
          webViewLink: driveResponse.data.webViewLink,
          thumbnailLink: driveResponse.data.thumbnailLink,
          directLink: `https://drive.google.com/uc?id=${driveResponse.data.id}`,
          createdTime: driveResponse.data.createdTime,
          tags: tags[i] || []
        });

      } catch (error) {
        console.error(`Error uploading from URL ${urls[i]}:`, error);
        errors.push({
          url: urls[i],
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      uploads: uploadResults,
      errors,
      totalRequested: urls.length,
      totalUploaded: uploadResults.length,
      totalErrors: errors.length,
      message: `Batch upload completed. Uploaded ${uploadResults.length} of ${urls.length} files.`
    });

  } catch (error) {
    console.error('Batch upload from URLs API error:', error);
    res.status(500).json({ error: 'Batch upload from URLs failed', details: error.message });
  }
});

// --- Error Handling Middleware ---
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  console.error('Upload API general error:', error);
  res.status(500).json({ error: 'Internal server error', details: error.message });
});

module.exports = router;
