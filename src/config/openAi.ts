// File: src/services/studyPlan.ts

import OpenAI from "openai";
import { z } from "zod";
import config from "../config/settings";
import { response } from "express";

const client = new OpenAI({
  apiKey: config.SIMBI_AI_KEY,
  baseURL: "https://api.openai.com/v1",

});

const StudyPlan = z.object({
  topic: z.string(),
  objectives: z.array(z.string()),
  schedule: z.array(
    z.object({
      date: z.string(),
      time: z.string(),
      activity: z.string(),
    })
  ),
});

export default async function studyPlan(prompt: string) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
            role: "system",
            content: `You are an assistant that outputs valid JSON only.
          
          Return a study plan JSON object matching the schema:
          
          {
            topic: string,
            objectives: string[],
            schedule: {
              date: string,    // e.g. "2025-05-06"
              time: string,    // e.g. "10:00 AM - 12:00 PM"
              activity: string // e.g. "Review Algebra"
            }[]
          }
          
          Never leave any field undefined or null. Do not include Markdown. Do not add extra text. Only output raw JSON.`,
          }
          ,
        {
          role: "user",
          content: prompt,
        },
      ],
      // Removed invalid response_format property
    // Removed invalid response_format property

    tools: [
        {
          type: "function",
          function: {
            name: "generate_study_plan",
            description: "Generate a structured study plan",
            parameters: {
              type: "object",
              properties: {
                topic: { type: "string" },
                objectives: {
                  type: "array",
                  items: { type: "string" }
                },
                schedule: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: { type: "string" },
                      time: { type: "string" },
                      activity: { type: "string" }
                    },
                    required: ["date", "time", "activity"]
                  }
                }
              },
              required: ["topic", "objectives", "schedule"]
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "generate_study_plan" } }
    });

    const rawText = response.choices[0].message.tool_calls?.[0].function.arguments;
    console.log("RAW GPT OUTPUT:", rawText);

    // Attempt to parse and validate with Zod
    if (!rawText) {
      throw new Error("Failed to extract study plan: rawText is undefined.");
    }
    const parsed = StudyPlan.parse(JSON.parse(rawText));

    return parsed;
  } catch (error) {
    console.error("Error extracting study plan:", error);
    throw new Error("Failed to extract study plan.");
  }
}
