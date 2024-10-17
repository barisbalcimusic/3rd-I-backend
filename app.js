import express from "express";
import cors from "cors";
import { imageToText } from "./middlewares/imageToText.js";
import { textToSpeech } from "./middlewares/textToSpeech.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.post("/imageToSpeech", imageToText, textToSpeech);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
