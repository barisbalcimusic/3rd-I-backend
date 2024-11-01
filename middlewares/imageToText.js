import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();

const apiKey = process.env.OPENAI_API_KEY;

export const imageToText = async (req, res, next) => {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: "No image provided" });
  }

  const base64ImageWithoutHeader = base64Image.split(",")[1];

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What’s in this image?",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64ImageWithoutHeader}`,
            },
          },
        ],
      },
      {
        role: "system",
        content:
          "You are a helpful assistant providing blind users concise, 20-word max descriptions of surroundings, navigation routes, obstacles, entrances, and exits. No questions.",
      },
    ],
    max_tokens: 300,
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      payload,
      { headers }
    );

    req.imageAnalysis = response.data.choices[0].message.content;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
