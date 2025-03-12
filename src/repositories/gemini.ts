import BusinessAnalytics from "@/models/BusinessAnalytics.js";
import { analyticsInterface, BusinessInterface } from "@/types/types.js";
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

const getBusinessAdviceByAI = async (business: Partial<BusinessInterface>) => {
  try {
    const analytics = (await BusinessAnalytics.findOne({
      where: { businessId: business.id },
    })) as analyticsInterface | null;
    if (!analytics) {
      return { success: false, message: "analytics not found" };
    }
    const regex = new RegExp(`[/\\"]`, "gi");
    const analyticsData = {
      totalAppointments: analytics.totalAppointments,
      totalRevenue: analytics.totalRevenue,
      missedAppointments: `[${analytics.missedAppointments} , info: appointments which users have cancelled or failed to pay before booking]`,
      completedAppointments: analytics.completedAppointments,
      peakHours: `[${JSON.stringify(analytics.peakHours).replace(
        regex,
        ""
      )} , info: ignore peakHours.time]`,
    };
    const { name, description, location, category } = business;

    const query = [
      "give business advice for growth",
      `business:${JSON.stringify({
        name,
        description,
        location,
        category,
      }).replace(regex, "")}`,
      `analytics:${JSON.stringify(analyticsData).replace(regex, "")}`,
      "give a short clear response in a paragraph",
    ];
    const result = await model.generateContent(query);
    let response = result.response;
    return {
      success: true,
      result: response.text(),
    };
  } catch (error:any) {
    return { success: false, error: error.message || "An error occurred" };
  }
};
export { createQueryByAI, getBusinessAdviceByAI };
