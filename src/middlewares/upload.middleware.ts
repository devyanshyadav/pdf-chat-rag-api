import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}
const configurePdfUpload = () => {
    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const filePath = path.join(uploadDir, file.originalname);
            if (fs.existsSync(filePath)) {
                return cb(new Error('PDF with the same name already exists'), uploadDir);
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });

    return multer({
        storage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new Error('Only PDF files are allowed'));
            }
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
    });
};
const uploadPdfMiddleware = (req: MulterRequest, res: Response, next: NextFunction) => {
    const upload = configurePdfUpload().single('pdf');
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            if (err.message === 'PDF with the same name already exists') {
                return res.status(409).json({ success: false, error: err.message });
            }
            if (err.message === 'Only PDF files are allowed') {
                return res.status(400).json({ success: false, error: err.message });
            }
            return res.status(500).json({ success: false, error: 'Error uploading file' });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        next();
    });
};


export default uploadPdfMiddleware;