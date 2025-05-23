const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine subdirectory based on file type
    let uploadPath = uploadsDir;
    
    if (file.mimetype.startsWith('image/')) {
      uploadPath = path.join(uploadsDir, 'images');
    } else if (file.originalname.endsWith('.ipynb')) {
      uploadPath = path.join(uploadsDir, 'notebooks');
    } else if (
      file.originalname.endsWith('.csv') ||
      file.originalname.endsWith('.xlsx') ||
      file.originalname.endsWith('.parquet')
    ) {
      uploadPath = path.join(uploadsDir, 'datasets');
    } else {
      uploadPath = path.join(uploadsDir, 'files');
    }
    
    // Create subdirectory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow specific file types
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
    // Jupyter notebooks
    'application/json',
    // Code files will be handled as text
    'text/x-python',
    'application/javascript',
    'text/markdown'
  ];
  
  // Accept Jupyter notebook files based on extension
  if (file.originalname.endsWith('.ipynb')) {
    return cb(null, true);
  }
  
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  
  cb(new Error('File type not supported'), false);
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

module.exports = upload; 