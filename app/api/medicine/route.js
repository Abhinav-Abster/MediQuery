import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { medicine } = await request.json();

    if (!medicine || typeof medicine !== "string" || medicine.trim() === "") {
      return NextResponse.json(
        { error: "Medicine name is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please add your GEMINI_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `You are a pharmaceutical expert. Provide detailed information about the medicine "${medicine.trim()}".

Return ONLY valid JSON (no markdown, no code blocks, no extra text) in this exact structure:
{
  "name": "Brand/common name of the medicine",
  "genericName": "Generic/chemical name",
  "drugClass": "Pharmacological class",
  "overview": "A comprehensive 2-3 sentence overview of what this medicine is and what it's used for",
  "mechanism": "Clear explanation of how the drug works in the body (mechanism of action), 2-3 sentences",
  "dosage": {
    "adult": "Standard adult dosage",
    "child": "Standard pediatric dosage or 'Not recommended for children' if applicable",
    "frequency": "How often the medicine should be taken"
  },
  "sideEffects": {
    "common": [
      { "name": "Side effect name", "severity": 3, "frequency": 25 }
    ],
    "rare": [
      { "name": "Rare side effect name", "severity": 7, "frequency": 2 }
    ]
  },
  "howItsMade": "A step-by-step description of how this drug is manufactured/synthesized, with each step numbered (e.g., '1. Raw material preparation: ... 2. Chemical synthesis: ... 3. Purification: ...'). Include at least 5 steps.",
  "interactions": ["Drug or substance that interacts with this medicine - brief explanation of the interaction"],
  "contraindications": ["Condition or situation where this drug should NOT be used - brief explanation"],
  "warnings": "Important safety warnings, precautions, and special considerations for this medicine. 2-3 sentences."
}

Important rules:
- severity is an integer from 1 (mild) to 10 (life-threatening)
- frequency is a percentage (0-100) representing how common the side effect is
- Include at least 5 common side effects and 3 rare side effects
- Include at least 4 drug interactions
- Include at least 4 contraindications
- All text should be informative and medically accurate
- Return ONLY the JSON object, nothing else`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean the response - remove any markdown code block markers
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const data = JSON.parse(cleanedText);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Medicine API Error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse medicine data from AI. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch medicine information" },
      { status: 500 }
    );
  }
}
