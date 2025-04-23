import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import uploadPdfMiddleware from './middlewares/upload.middleware';
import pdfExistsMiddleware from './middlewares/pdf-exists.middleware';
import uploadPdf from './controllers/upload-pdf';
import chatWithPdf from './controllers/chat-with-pdf';
const app = express();

app.use(express.json());
app.post('/upload-pdf', uploadPdfMiddleware, uploadPdf);
app.post('/chat', pdfExistsMiddleware, chatWithPdf);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
   console.log(`Server is running on port http://localhost:${PORT}`);
});
