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

    res.set("Content-Type", "audio/mpeg");
    res.send(response.data);
  } catch (error) {
    if (error.response && error.response.data) {
      try {
        const errorData = JSON.parse(error.response.data.toString("utf-8"));
        console.error("Error generating voice-over:", errorData);
      } catch (parseError) {
        console.error(
          "Error parsing response data:",
          error.response.data.toString("utf-8")
        );
      }
    } else {
      console.error("Error generating voice-over:", error.message);
    }
    return res.status(500).json({ error: "Failed to generate voice-over." });
  }
};
