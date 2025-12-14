import { GoogleGenAI, Type } from "@google/genai";
import { WasteAnalysis, WasteCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash'; // High speed, good vision capabilities

const wasteSchema = {
  type: Type.OBJECT,
  properties: {
    itemName: {
      type: Type.STRING,
      description: "Tên ngắn gọn của vật thể trong ảnh bằng tiếng Việt (ví dụ: Chai nhựa, Vỏ chuối).",
    },
    category: {
      type: Type.STRING,
      enum: [
        WasteCategory.RECYCLABLE,
        WasteCategory.ORGANIC,
        WasteCategory.HAZARDOUS,
        WasteCategory.RESIDUAL,
        WasteCategory.UNKNOWN
      ],
      description: "Phân loại rác.",
    },
    explanation: {
      type: Type.STRING,
      description: "Giải thích ngắn gọn tại sao nó thuộc loại này (Tiếng Việt).",
    },
    disposalInstruction: {
      type: Type.STRING,
      description: "Hướng dẫn cụ thể cách xử lý hoặc vứt bỏ (Tiếng Việt).",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Độ tin cậy của dự đoán (0-100).",
    },
  },
  required: ["itemName", "category", "explanation", "disposalInstruction", "confidence"],
};

export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysis> => {
  try {
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "Hãy nhìn vào hình ảnh này và xác định đây là loại rác gì. Trả về kết quả JSON theo cấu trúc đã định nghĩa. Hãy dùng Tiếng Việt.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: wasteSchema,
        temperature: 0.2, // Low temperature for consistent classification
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as WasteAnalysis;
      return data;
    } else {
      throw new Error("Không nhận được phản hồi từ AI.");
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
