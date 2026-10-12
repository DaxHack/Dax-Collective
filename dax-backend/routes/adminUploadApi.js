// dax-backend/routes/adminUploadApi.js
//
// Replaces the original routes/uploadApi.js, whose routes were mounted
// directly under /api and required only a signed-in user. Every route in
// this router requires a valid Firebase ID token AND admin authorization
// (custom claim `admin:true` or ADMIN_UIDS allowlist) — see server.js,
// which only mounts this router (under /api/admin) when
// ENABLE_ADMIN_UPLOADS === 'true', and applies requireAuth + requireAdmin
// before any route here is reached.
//
// Drive-specific routes additionally require ENABLE_DRIVE_AUTOMATION='true'
// plus the Drive OAuth env vars (validated at startup in config/env.js).
// Making an uploaded Drive file public is now OPT-IN via
// ALLOW_PUBLIC_DRIVE_FILES='true' — previously this happened automatically
// on every upload.

const express = require("express");
const multer = require("multer");
const {google} = require("googleapis");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
const config = require("../config/env");
const {getAdmin} = require("../services/firebaseAdmin");

const router = express.Router(); // eslint-disable-line new-cap

// --- Google Drive API Setup (lazy — only constructed if Drive automation is enabled) ---
let driveOauth2Client = null;

function ensureDriveEnabled(req, res, next) {
  if (!config.ENABLE_DRIVE_AUTOMATION) {
    return res.status(503).json({
      error: "Drive automation is disabled on this server (ENABLE_DRIVE_AUTOMATION is not 'true').",
    });
  }
  next();
}

function getDriveService() {
  if (!driveOauth2Client) {
    driveOauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
    );
    driveOauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }
  return google.drive({version: "v3", auth: driveOauth2Client});
}

// --- Multer Configuration ---
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// --- Folder Mapping for Smart Routing (from backend env only) ---
const FOLDER_MAPPING = {
  "dax-the-traveler": process.env.DRIVE_FOLDER_TRAVEL,
  "gods-vessel": process.env.DRIVE_FOLDER_FAITH,
  "ani-dax": process.env.DRIVE_FOLDER_COLLECTIVE,
  "timezone-travelers": process.env.DRIVE_FOLDER_TIMEZONE,
  "dax-homepage": process.env.DRIVE_FOLDER_COLLECTIVE,
  "dax-analytics": process.env.DRIVE_FOLDER_COLLECTIVE,
  "collective": process.env.DRIVE_FOLDER_COLLECTIVE,
};

// --- Helper Functions ---

const generateUniqueFilename = (originalName) => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString("hex");
  return `${name.substring(0, 50)}-${timestamp}-${random}${ext}`;
};

const optimizeImage = async (buffer, options = {}) => {
  const {width = 1920, quality = 85} = options;
  return await sharp(buffer)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({quality, progressive: true})
      .toBuffer();
};

const generateImageHash = (buffer) => {
  return crypto.createHash("md5").update(buffer).digest("hex");
};

const checkDuplicatesInFolder = async (driveInstance, folderId, fileHashes) => {
  try {
    const response = await driveInstance.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, md5Checksum, size, createdTime)",
      pageSize: 1000,
    });

    const existingFiles = response.data.files || [];
    const duplicates = [];

    fileHashes.forEach((hash, index) => {
      const duplicate = existingFiles.find((file) => file.md5Checksum === hash);
      if (duplicate) {
        duplicates.push({index, hash, existingFile: duplicate});
      }
    });

    return duplicates;
  } catch (error) {
    console.error("Error checking duplicates in Drive:", error);
    return [];
  }
};

// Only makes a Drive file public if ALLOW_PUBLIC_DRIVE_FILES='true'.
// Previously this ran unconditionally on every upload.
const maybeMakeFilePublic = async (driveInstance, fileId) => {
  if (!config.ALLOW_PUBLIC_DRIVE_FILES) {
    return false;
  }
  try {
    await driveInstance.permissions.create({
      fileId: fileId,
      resource: {role: "reader", type: "anyone"},
    });
    return true;
  } catch (error) {
    console.error(`Error making Drive file ${fileId} public:`, error);
    return false;
  }
};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// --- API Routes ---
// NOTE: requireAuth + requireAdmin are applied by server.js to this entire
// router before any handler below runs.

// Route: Admin-access check, used by the frontend to decide whether to show
// admin/upload UI. Intentionally returns NOTHING beyond a boolean — no UIDs,
// account IDs, secrets, or integration details. By the time a request
// reaches this handler it has already passed requireAuth (401 if missing/
// invalid token) and requireAdmin (403 if authenticated but not an allowed
// admin), so a 200 here always means "real admin, verified server-side."
// Does not depend on ENABLE_DRIVE_AUTOMATION — available whenever
// ENABLE_ADMIN_UPLOADS=true, independent of whether Drive is also enabled.
router.get("/access", (req, res) => {
  res.json({authorized: true});
});

// Route: Upload to Firebase Storage (Profile Pictures)
router.post("/firebase-profile", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: "No file provided"});
    }

    const admin = getAdmin();
    const bucket = admin.storage().bucket();
    const fileName = `profile-pictures/${req.user.uid}/${generateUniqueFilename(req.file.originalname)}`;
    const file = bucket.file(fileName);

    const optimizedBuffer = await optimizeImage(req.file.buffer, {width: 400, quality: 90});

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          originalName: req.file.originalname,
          uploadedBy: req.user.uid,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    stream.on("error", (error) => {
      console.error("Firebase upload stream error:", error);
      res.status(500).json({error: "Upload failed during stream"});
    });

    stream.on("finish", async () => {
      try {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        res.json({
          success: true,
          url: publicUrl,
          fileName: fileName,
          originalName: req.file.originalname,
          size: optimizedBuffer.length,
          message: "Profile picture uploaded to Firebase Storage successfully",
        });
      } catch (error) {
        console.error("Error making Firebase file public or getting URL:", error);
        res.status(500).json({error: "Failed to finalize Firebase upload"});
      }
    });

    stream.end(optimizedBuffer);
  } catch (error) {
    console.error("Firebase profile upload error:", error);
    res.status(500).json({error: "Profile picture upload failed", details: error.message});
  }
});

// Route: Upload to Google Drive with smart routing (single or batch)
router.post("/drive-upload", ensureDriveEnabled, upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({error: "No files provided"});
    }

    const {category, tags, description, folderId: clientFolderId} = req.body;
    const targetFolderId = clientFolderId || FOLDER_MAPPING[category] || FOLDER_MAPPING["collective"];

    if (!targetFolderId) {
      return res.status(400).json({error: "Invalid category or target folder not configured"});
    }

    const driveInstance = getDriveService();
    const fileData = [];
    const fileHashes = [];

    for (const file of req.files) {
      const optimizedBuffer = await optimizeImage(file.buffer);
      const hash = generateImageHash(optimizedBuffer);

      fileData.push({
        buffer: optimizedBuffer,
        originalName: file.originalname,
        mimetype: file.mimetype,
        hash,
      });
      fileHashes.push(hash);
    }

    const duplicates = await checkDuplicatesInFolder(driveInstance, targetFolderId, fileHashes);

    if (duplicates.length > 0) {
      return res.status(409).json({
        success: false,
        duplicates: duplicates.map((dup) => ({
          fileName: req.files[dup.index].originalname,
          hash: dup.hash,
          existingFile: dup.existingFile,
        })),
        message: "Duplicate files detected in target folder. No files were uploaded.",
      });
    }

    const uploadResults = [];

    for (const file of fileData) {
      const fileName = generateUniqueFilename(file.originalName);

      const fileMetadata = {
        name: fileName,
        parents: [targetFolderId],
        description: description || `Uploaded by ${req.user.email} via automation system. Tags: ${tags || "none"}`,
      };

      const media = {
        mimeType: file.mimetype,
        body: require("stream").Readable.from(file.buffer),
      };

      const response = await driveInstance.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id, name, size, createdTime, webViewLink, thumbnailLink",
      });

      const madePublic = await maybeMakeFilePublic(driveInstance, response.data.id);

      uploadResults.push({
        id: response.data.id,
        fileName: response.data.name,
        originalName: file.originalName,
        size: response.data.size,
        category: category,
        webViewLink: response.data.webViewLink,
        thumbnailLink: response.data.thumbnailLink,
        directLink: `https://drive.google.com/uc?id=${response.data.id}`,
        createdTime: response.data.createdTime,
        tags: tags ? JSON.parse(tags) : [],
        hash: file.hash,
        public: madePublic,
      });
    }

    res.json({
      success: true,
      uploads: uploadResults,
      category: category,
      folderId: targetFolderId,
      totalFiles: uploadResults.length,
      message: `Successfully uploaded ${uploadResults.length} files.`,
    });
  } catch (error) {
    console.error("Drive upload error:", error);
    res.status(500).json({error: "Drive upload failed", details: error.message});
  }
});

// Route: Check for duplicates before upload
router.post("/check-duplicates", ensureDriveEnabled, upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({error: "No files provided for duplicate check"});
    }

    const {folderId, category} = req.body;
    const targetFolderId = folderId || FOLDER_MAPPING[category] || FOLDER_MAPPING.collective;

    if (!targetFolderId) {
      return res.status(400).json({error: "Target folder not specified or configured"});
    }

    const driveInstance = getDriveService();
    const fileHashes = [];
    const fileInfo = [];

    for (const file of req.files) {
      const hash = generateImageHash(file.buffer);
      fileHashes.push(hash);
      fileInfo.push({name: file.originalname, size: file.size, hash});
    }

    const duplicates = await checkDuplicatesInFolder(driveInstance, targetFolderId, fileHashes);

    res.json({
      duplicates: duplicates.map((dup) => ({
        fileName: fileInfo[dup.index].name,
        hash: dup.hash,
        existingFile: dup.existingFile,
      })),
      totalFiles: req.files.length,
      duplicateCount: duplicates.length,
      message: duplicates.length > 0 ? "Duplicates found." : "No duplicates found.",
    });
  } catch (error) {
    console.error("Duplicate check API error:", error);
    res.status(500).json({error: "Duplicate check failed", details: error.message});
  }
});

// Route: Get images from Drive folder
router.get("/drive/images/:folderId", ensureDriveEnabled, async (req, res) => {
  try {
    const {folderId} = req.params;
    const {pageSize = 50, pageToken} = req.query;

    const driveInstance = getDriveService();
    const response = await driveInstance.files.list({
      q: `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`,
      fields: "nextPageToken, files(id, name, size, createdTime, modifiedTime, webViewLink, thumbnailLink)",
      pageSize: parseInt(pageSize),
      pageToken,
      orderBy: "createdTime desc",
    });

    const images = response.data.files.map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      webViewLink: file.webViewLink,
      thumbnailLink: file.thumbnailLink,
      directLink: `https://drive.google.com/uc?id=${file.id}`,
      downloadLink: `https://drive.google.com/uc?export=download&id=${file.id}`,
    }));

    res.json({
      images,
      nextPageToken: response.data.nextPageToken,
      totalCount: images.length,
      message: `Fetched ${images.length} images from folder ${folderId}`,
    });
  } catch (error) {
    console.error("Error fetching Drive images:", error);
    res.status(500).json({error: "Failed to fetch images", details: error.message});
  }
});

// Route: Get folder information and statistics
router.get("/drive/folder/:folderId", ensureDriveEnabled, async (req, res) => {
  try {
    const {folderId} = req.params;
    const driveInstance = getDriveService();

    const folderInfo = await driveInstance.files.get({
      fileId: folderId,
      fields: "id, name, createdTime, modifiedTime",
    });

    const filesResponse = await driveInstance.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(size, mimeType)",
      pageSize: 1000,
    });

    const files = filesResponse.data.files || [];
    const imageFiles = files.filter((file) => file.mimeType && file.mimeType.startsWith("image/"));
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
      message: `Fetched info for folder ${folderId}`,
    });
  } catch (error) {
    console.error("Error getting folder info:", error);
    res.status(500).json({error: "Failed to get folder information", details: error.message});
  }
});

// Route: Batch upload from URLs (for photo search integration)
router.post("/drive/batch-from-urls", ensureDriveEnabled, async (req, res) => {
  try {
    const {urls, category = "collective", tags = [], descriptions = []} = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({error: "No URLs provided"});
    }

    const targetFolderId = FOLDER_MAPPING[category] || FOLDER_MAPPING["collective"];
    if (!targetFolderId) {
      return res.status(400).json({error: "Invalid category or target folder not configured"});
    }

    const driveInstance = getDriveService();
    const uploadResults = [];
    const errors = [];

    for (let i = 0; i < urls.length; i++) {
      try {
        const url = urls[i];
        if (!/^https?:$/.test(new URL(url).protocol)) {
          throw new Error("Only http(s) URLs are allowed");
        }
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        const optimizedBuffer = await optimizeImage(buffer);

        const urlPath = new URL(url).pathname;
        const originalName = path.basename(urlPath) || `image-${i + 1}.jpg`;
        const fileName = generateUniqueFilename(originalName);

        const fileMetadata = {
          name: fileName,
          parents: [targetFolderId],
          description: descriptions[i] || `Downloaded from ${url} by ${req.user.email}`,
        };

        const media = {
          mimeType: "image/jpeg",
          body: require("stream").Readable.from(optimizedBuffer),
        };

        const driveResponse = await driveInstance.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: "id, name, size, createdTime, webViewLink, thumbnailLink",
        });

        const madePublic = await maybeMakeFilePublic(driveInstance, driveResponse.data.id);

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
          tags: tags[i] || [],
          public: madePublic,
        });
      } catch (error) {
        console.error(`Error uploading from URL ${urls[i]}:`, error);
        errors.push({url: urls[i], error: error.message});
      }
    }

    res.json({
      success: true,
      uploads: uploadResults,
      errors,
      totalRequested: urls.length,
      totalUploaded: uploadResults.length,
      totalErrors: errors.length,
      message: `Batch upload completed. Uploaded ${uploadResults.length} of ${urls.length} files.`,
    });
  } catch (error) {
    console.error("Batch upload from URLs API error:", error);
    res.status(500).json({error: "Batch upload from URLs failed", details: error.message});
  }
});

// Route: Brand-aware social posting stub.
// Moved here (from the old public server.js mount) because it returns
// configured social-account IDs and is a precursor to actual publishing —
// neither belongs on a public route. Still a TODO stub: it does not post.
function getAccountIds(brand) {
  const B = brand.toUpperCase();
  return {
    tiktok: process.env[`TIKTOK_ACCOUNT_ID_${B}`],
    facebook: process.env[`FACEBOOK_PAGE_ID_${B}`],
    instagram: process.env[`INSTAGRAM_ACCOUNT_ID_${B}`],
    youtube: process.env[`YOUTUBE_CHANNEL_ID_${B}`],
  };
}

router.post("/post/:brand", async (req, res) => {
  const ids = getAccountIds(req.params.brand);
  if (Object.values(ids).some((v) => !v)) {
    return res.status(400).json({
      error: `Missing one of [tiktok,facebook,instagram,youtube] ID for "${req.params.brand}"`,
    });
  }
  try {
    // TODO: call your actual social-post functions here
    return res.json({success: true, used: ids});
  } catch (err) {
    console.error(err);
    return res.status(500).json({error: err.message});
  }
});

// --- Error Handling Middleware ---
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({error: "File too large. Maximum size is 10MB."});
    }
  }
  console.error("Admin upload API general error:", error);
  res.status(500).json({error: "Internal server error", details: error.message});
});

module.exports = router;
