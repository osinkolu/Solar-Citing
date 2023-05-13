export default async function handler(req, res) {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Pinned to a specific version of Stable Diffusion
        // See https://replicate.com/stability-ai/stable-diffussion/versions
        version: "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c",
  
        // This is the text prompt that will be submitted by a form on the frontend
        input: { prompt: req.body.prompt },
      }),
    });
  
    if (response.status !== 201) {
      let error = await response.json();
      res.statusCode = 500;
      res.end(JSON.stringify({ detail: error.detail }));
      return;
    }
  
    const prediction = await response.json();
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  }


//   import { promises as fs } from "fs";

// // Read the file into a buffer
// const data = await fs.readFile("path/to/image.png", "utf-8");
// // Convert the buffer into a base64-encoded string
// const base64 = data.toString("base64");
// // Set MIME type for PNG image
// const mimeType = "image/png";
// // Create the data URI
// const dataURI = `data:${mimeType};base64,${base64}`;

// const model = "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b";
// const input = {
//   image: dataURI,
// };
// const output = await replicate.run(model, { input });
// // ['https://replicate.delivery/mgxm/e7b0e122-9daa-410e-8cde-006c7308ff4d/output.png']