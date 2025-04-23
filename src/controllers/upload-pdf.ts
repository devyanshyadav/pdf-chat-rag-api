import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { QdrantClient } from "@qdrant/js-client-rest";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Request, Response } from 'express';

interface MulterRequest extends Request {
    file?: Express.Multer.File
}

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
});

const embedder = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: "AIzaSyCxf-7bzmnyLgJIqwWQL6lqlCyLa-tBMhY",
});


const uploadPdf = async (req: MulterRequest, res: Response) => {
    try {
        const filePath = req.file!.path; 
        console.log(`File saved at: ${filePath}`);
        const response = `PDF saved locally at: ${filePath}`;
        const pdfLoader = new PDFLoader(filePath);
        const docs = await pdfLoader.load();
        const splitDocs = await textSplitter.splitDocuments(docs);
        const client = new QdrantClient({ url: 'http://localhost:6333' });
        const collectionExists = await client.collectionExists(req.file!.originalname);
        if (collectionExists) {
            await client.deleteCollection(req.file!.originalname);
        }
        await QdrantVectorStore.fromDocuments(splitDocs, embedder, {
            url: 'http://localhost:6333',
            collectionName: req.file!.originalname
        });
        res.status(200).json({
            success: true,
            message: 'PDF uploaded and saved successfully',
            data: response,
        });
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while processing the PDF',
        });
    }
};

export default uploadPdf;