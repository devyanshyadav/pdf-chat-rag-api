import { Request, Response } from "express";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const embedder = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.GEMINI_API_KEY,
});

const chatWithPdf = async (req: Request, res: Response) => {

    const { filePath, query, pdfName } = req.body;
    try {
        if (!filePath || !query) throw new Error('Missing pdfName or query');
        const vectorStore = new QdrantVectorStore(embedder, {
            url: process.env.QDRANT_URL,
            collectionName: pdfName,
        });
        const searchResults = await vectorStore.similaritySearch(query)
        const context = searchResults.map((doc) => doc.pageContent).join('\n\n');
        const systemPrompt = `You are a helpful assistant that can answer questions from the provided context.
        context: ${context}
        `
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: query,
            config: {
                systemInstruction: systemPrompt
            }
        });
        res.status(200).json({
            success: true,
            data: response.text
        })
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred while processing the file',
        });
    }

};


export default chatWithPdf;