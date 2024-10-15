import express from "express";
import axios from "axios";
import cors from "cors";
import { configDotenv } from "dotenv";

const app = express();
configDotenv();

app.use(express.json({ limit: "50mb" }));
app.use(cors());

const PORT = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;

app.post("/send-image", async (req, res, next) => {
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
    ],
    max_tokens: 300,
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      payload,
      { headers }
    );
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
