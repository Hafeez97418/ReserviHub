import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.AI_API_KEY;

if (!API_KEY) {
  throw new Error("AI_API_KEY is missing in your env file");
}
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const createQueryByAI = async (prompt: string) => {
  try {
    const query = await model.generateContent([
      "Respond strictly in JSON format. Use this format: { name: string, description: string, category: string, location: string }",
      `Extract structured information from this prompt: "${prompt}"`,
    ]);
    const message = query.response
      .text()
      .trim()
      .replace(/`|json/g, "");


    const response = JSON.parse(message);

    return { success: true, response };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.message || "Oops! Something went wrong. Please try again later.",
    };
  }
};

export { createQueryByAI };
