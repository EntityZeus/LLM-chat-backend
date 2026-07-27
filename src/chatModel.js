import { ChatGroq } from '@langchain/groq';

import dotenv from 'dotenv';

dotenv.config();

export const chatModel = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 1,
    maxRetries: 2
})