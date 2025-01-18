const fs = require("fs");
const mime = require("mime-types");
const OpenAI = require("openai");
const axios = require("axios");
const path = require("path");

const config = require("config");

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

async function imageClassification(imagePath) {
  // Read the image file and encode it to base64
  const imageData = fs.readFileSync(imagePath, { encoding: "base64" });
  const imageType = mime.lookup(imagePath);

  // Create the prompt
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "What’s in this image? Keep response concise and informative.",
        },
        {
          type: "image_url",
          image_url: { url: `data:${imageType};base64,${imageData}` },
        },
      ],
    },
  ];

  // Call the OpenAI API
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 300,
    });

    // Return the response content
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error classifying image:", error);
    throw error;
  }
}

function imageGenerationPrompt(description1, description2) {
  const prompt = `Given two images with the following descriptions, generate a new image that combines elements from both descriptions. 1. ${description1} 2. ${description2}`;
  return prompt;
}

async function downloadImage(url, name) {
  try {
    const response = await axios({
      url: url,
      method: "GET",
      responseType: "stream",
    });

    // Extract filename from URL
    const fileName = `${name}.png`;
    const filePath = path.join(__dirname, "../downloads", fileName);

    // Ensure the "downloads" directory exists
    fs.mkdirSync(path.join(__dirname, "../downloads"), { recursive: true });

    // Pipe the image data to a file
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(filePath));
      writer.on("error", (error) => {
        console.error("Error writing file:", error);
        reject({ error: "Error writing file", details: error });
      });
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    return { error: "Error downloading image", details: error };
  }
}

async function imageGeneration(imagePaths) {
  const imagePath1 = imagePaths[0];
  const imagePath2 = imagePaths[1];
  try {
    const description1 = await imageClassification(imagePath1);
    const description2 = await imageClassification(imagePath2);
    const prompt = imageGenerationPrompt(description1, description2);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const url = response.data[0].url;
    return url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

module.exports = {
  downloadImage,
  imageClassification,
  imageGeneration,
  imageGenerationPrompt,
};
