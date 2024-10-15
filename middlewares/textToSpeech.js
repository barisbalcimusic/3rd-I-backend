import axios from "axios";
import { configDotenv } from "dotenv";
import fs from "fs";

configDotenv();

const apiKey = process.env.ELEVENLABS_API_KEY;

export const textToSpeech = async (req, res) => {
  const VOICE_ID = "XB0fDUnXU5powFXDhCwa";
  try {
    const { imageAnalysis } = req;

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: imageAnalysis,
        output_format: "mp3_22050",
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.75,
          style: 0.2,
        },
      },
      {
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const filePath = "./public/generated_audio.mp3";
    fs.writeFileSync(filePath, response.data);

    console.log("Audio file saved as generated_audio.mp3");
    res.json({ audioUrl: "/generated_audio.mp3" });
  } catch (error) {
    console.error(
      "Error generating voice-over:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({ error: "Failed to generate voice-over." });
  }
};
