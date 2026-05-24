import { searchCharacters } from "../server/characterSync.js"

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === "OPTIONS") {
    res.status(204).end()
    return
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed." })
    return
  }

  try {
    const characters = await searchCharacters({
      name: req.query.name || "",
      server: req.query.server || "",
      dataCenter: req.query.dataCenter || "",
    })

    res.status(200).json({ characters })
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.status === 404
        ? "That character could not be found in FFXIV Collect."
        : "Character sync is unavailable right now.",
    })
  }
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
}
