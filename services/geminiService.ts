/*
 * App Weaver
 * Copyright (C) 2025 Google LLC
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { ImplementationFormat } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function enhancePrompt(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert prompt engineer for text-to-image models. Elaborate on the user's app idea to create a rich, detailed, and descriptive prompt for generating a high-fidelity UI/UX mockup. The prompt should be a single, continuous block of text. Focus on visual details, style (e.g., 'minimalist', 'neumorphic', 'glassmorphism'), color palettes, and layout. End with "Clean, modern design. Centered on a single screen view." Respond ONLY with the enhanced prompt.`,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    // Fallback to original prompt if enhancement fails
    return prompt;
  }
}

export async function generateMockup(prompt: string): Promise<string> {
  try {
    const fullPrompt = `A high-fidelity, professional UI/UX mockup for a web or mobile application. ${prompt}`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '9:16',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("No mockup image was generated.");
    }
  } catch (error) {
    console.error("Error generating mockup:", error);
    throw new Error("Failed to generate mockup. Please check the console for details.");
  }
}

export async function refineMockup(prompt: string, imageBase64: string): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("The model did not return an edited image.");
  } catch(error) {
    console.error("Error refining mockup:", error);
    throw new Error("Failed to refine mockup. The model may have returned an unexpected response.");
  }
}


export async function* generateCodeStream(
  prompt: string,
  mockupImageBase64: string,
  format: ImplementationFormat
): AsyncGenerator<string> {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: mockupImageBase64,
    },
  };
  
  const getSystemInstruction = () => {
    const sharedInstructions = `
- Use a clear file marker format: Start each file with "[START_FILE: path/to/file.ext]" on its own line, and end it with "[END_FILE: path/to/file.ext]" on its own line.
- The code within these markers should be the raw file content.
- Do not add any other commentary or text outside of the file markers.
    `;

    switch(format) {
      case 'html':
        return `You are a world-class frontend engineer. Based on the user's request and the provided UI mockup, create a complete, single HTML file.
- The HTML file MUST be self-contained.
- Use Tailwind CSS via the CDN for styling: <script src="https://cdn.tailwindcss.com"></script>.
- All JavaScript logic MUST be included within a <script> tag.
- The app should be fully functional and visually match the mockup.
- The only file should be 'index.html'.
${sharedInstructions}`;
      case 'react':
        return `You are a world-class senior React engineer specializing in TypeScript and Tailwind CSS. Based on the user's request and the provided UI mockup, create a complete, functional React web application.
- Structure the application into multiple files (e.g., App.tsx, components/...).
- Use modern React best practices: functional components and hooks.
- Use TypeScript for type safety.
- Style with Tailwind CSS.
- Assume the project is set up with React 18+ and an 'index.tsx' that renders 'App.tsx'. Provide all key files.
${sharedInstructions}`;
    }
  };

  const textPart = {
    text: `Original user prompt: "${prompt}". Please generate the code based on this and the provided image.`,
  };
  
  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        systemInstruction: getSystemInstruction(),
      },
    });

    for await (const chunk of responseStream) {
      yield chunk.text;
    }

  } catch (error) {
    console.error("Error generating code stream:", error);
    throw new Error("Failed to generate code. An unexpected error occurred during streaming.");
  }
}