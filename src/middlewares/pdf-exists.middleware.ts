import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const pdfExistsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { pdfName } = req.body;
    try {
        if (!pdfName) {
            throw new Error('Missing required field: pdfName');
        }
        const uploadDir = path.join(__dirname, '../uploads');
        const filePath = path.join(uploadDir, pdfName);
        const fileExists = fs.existsSync(filePath);

        if (!fileExists) {
            throw new Error(`PDF file '${pdfName}' not found`);
        }
        if (path.extname(filePath).toLowerCase() !== '.pdf') {
            throw new Error(`File '${pdfName}' is not a PDF`);
        }

        req.body.filePath = filePath;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while checking the PDF',
        });
    }
};

export default pdfExistsMiddleware;