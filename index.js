import express from 'express';
import cors from 'cors';

import { generateChatResponse, generateChatResponseStream } from './src/services/chat-service.js';

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Routes
app.post('/api/v1/chat', async (req, res) => {
    try {
        const message = req.body.message;
        const history = req.body.history || [];

        if (!message) {
            return res.status(400).json({
                error: "Message is required",
            });
        }

        const response = await generateChatResponse( message, history );

        res.json({ response });
    } catch(err) {
        console.error(err);
        console.log(err.errorDetails)
        res.status(500).json({
            error: "Failed to generate response",
        });
    }
});

// Streaming endpoint
app.post('/api/v1/chat/stream', async (req, res) => {
    try {
        const message = req.body.message;
        const history = req.body.history || [];

        if (!message) {
            return res.status(400).json({
                error: "Message is required",
            });
        }

        // Set headers for Server-Sent Events
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await generateChatResponseStream(message, history);

        for await (const chunk of stream) {
            const content = chunk.content;
            res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
        }

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
    } catch(err) {
        console.error(err);
        res.write(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`);
        res.end();
    }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});