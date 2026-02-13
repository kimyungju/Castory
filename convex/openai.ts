"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const TTS_MAX_CHARS = 4096;

function splitText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    const window = remaining.slice(0, maxLen);
    const sentenceEnd = Math.max(
      window.lastIndexOf(". "),
      window.lastIndexOf("! "),
      window.lastIndexOf("? "),
      window.lastIndexOf(".\n"),
      window.lastIndexOf("!\n"),
      window.lastIndexOf("?\n"),
    );

    let splitAt: number;
    if (sentenceEnd > maxLen * 0.3) {
      splitAt = sentenceEnd + 1;
    } else {
      const lastSpace = window.lastIndexOf(" ");
      splitAt = lastSpace > 0 ? lastSpace : maxLen;
    }

    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  return chunks;
}

export const generateAudioAction = action({
  args: {
    input: v.string(),
    voice: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const openai = new OpenAI({ apiKey });

    try {
      const chunks = splitText(args.input, TTS_MAX_CHARS);

      const audioBuffers: ArrayBuffer[] = [];
      for (const chunk of chunks) {
        const mp3Response = await openai.audio.speech.create({
          model: "tts-1",
          voice: args.voice as "alloy" | "shimmer" | "nova" | "echo" | "fable" | "onyx",
          input: chunk,
        });
        audioBuffers.push(await mp3Response.arrayBuffer());
      }

      const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of audioBuffers) {
        combined.set(new Uint8Array(buf), offset);
        offset += buf.byteLength;
      }

      return combined.buffer;
    } catch (error) {
      throw new Error(`Failed to generate audio: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

    const openai = new OpenAI({ apiKey });
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: args.prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const url = response.data?.[0]?.url;
    if (!url) throw new Error("No image URL returned");

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  },
});
