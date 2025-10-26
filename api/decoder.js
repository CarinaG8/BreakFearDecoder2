// api/decoder.js  Vercel serverless function

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Use POST" })
    }

    const { question } = req.body || {}

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Missing question" })
    }

    // set this in Vercel Project Settings  Environment Variables
    const apiKey = process.env.DECODER_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: "API key not set" })
    }

    // replace with your real upstream endpoint when ready
    const r = await fetch("https://api.yourdecoder.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({ question })
    })

    const text = await r.text()

    // pass through upstream status and body
    return res.status(r.status).setHeader("Content-Type", "application/json").send(text)
  } catch (e) {
    return res.status(500).json({ error: String(e) })
  }
}
