import express from 'express';
import cors from 'cors';

import { generateChatResponse } from './src/services/chat-service.js';

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

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});