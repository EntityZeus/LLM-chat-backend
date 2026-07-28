import { HumanMessage, AIMessage } from "@langchain/core/messages";

import { chatModel } from "../chatModel.js";

export const generateChatResponse = async (message, history = []) => {
    const messages = [
        ...history.map((item) => {
        if (item.role === "user") {
            return new HumanMessage(item.content);
        }

        return new AIMessage(item.content);
        }),

        new HumanMessage(message),
    ];
    
    const response = await chatModel.invoke(messages);

    return response.content;
}

export const generateChatResponseStream = async (message, history = []) => {
    const messages = [
        ...history.map((item) => {
        if (item.role === "user") {
            return new HumanMessage(item.content);
        }

        return new AIMessage(item.content);
        }),

        new HumanMessage(message),
    ];
    
    return await chatModel.stream(messages);
}