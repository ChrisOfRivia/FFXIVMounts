import { DATA_CENTER_REGION, WORLD_DATA_CENTER } from "../shared/ffxivWorlds.js"

const FFXIV_COLLECT_BASE_URL = "https://ffxivcollect.com"
const SEARCH_PATH = "/characters/search"
const LODESTONE_SEARCH_PATH = "/characters/search/lodestone"
const USER_AGENT = "FFXIVMountTracker/1.0"

export async function searchCharacters({ name, server = "", dataCenter = "" }) {
  const trimmedName = name.trim()

  if (!trimmedName) {
    return []
  }

  const searchParams = {
    name: trimmedName,
    server: server.trim(),
    data_center: dataCenter.trim(),
  }

  const localHtml = await fetchHtml(buildCollectUrl(SEARCH_PATH, searchParams))
  const localResults = parseCharacterSearchResults(localHtml, "ffxivcollect")

  if (localResults.length > 0) {
    return localResults
  }

  const lodestoneHtml = await fetchHtml(buildCollectUrl(LODESTONE_SEARCH_PATH, searchParams))
  return parseCharacterSearchResults(lodestoneHtml, "lodestone")
}

export async function getOwnedMounts(characterId) {
  await refreshCharacter(characterId).catch(() => null)

  const response = await fetch(`${FFXIV_COLLECT_BASE_URL}/api/characters/${characterId}/mounts/owned`, {
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
  })

  if (!response.ok) {
    const error = new Error(`FFXIV Collect responded with ${response.status}`)
    error.status = response.status
    throw error
  }

  const payload = await response.json()
  const results = Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : []
  return results
    .map((mount) => ({
      id: mount.id,
      name: mount.name,
    }))
    .filter((mount) => mount.id || mount.name)
}

export async function getOwnedMountIds(characterId) {
  const mounts = await getOwnedMounts(characterId)
  return mounts.map((mount) => mount.id).filter(Boolean)
}

function buildCollectUrl(pathname, queryParams) {
  const url = new URL(pathname, FFXIV_COLLECT_BASE_URL)

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": USER_AGENT,
    },
  })

  if (!response.ok) {
    const error = new Error(`FFXIV Collect responded with ${response.status}`)
    error.status = response.status
    throw error
  }

  return response.text()
}

async function refreshCharacter(characterId) {
  const characterUrl = `${FFXIV_COLLECT_BASE_URL}/characters/${characterId}`
  const pageResponse = await fetch(characterUrl, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": USER_AGENT,
    },
  })

  if (!pageResponse.ok) {
    return
  }

  const html = await pageResponse.text()
  const csrfToken = getCsrfToken(html)

  if (!csrfToken) {
    return
  }

  const cookie = pageResponse.headers.get("set-cookie")
  const body = new URLSearchParams({ authenticity_token: csrfToken })

  await fetch(`${FFXIV_COLLECT_BASE_URL}/character/refresh/${characterId}`, {
    method: "POST",
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
      Referer: characterUrl,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body.toString(),
  })
}

function parseCharacterSearchResults(html, source) {
  const characterMatches = html.matchAll(
    /<div class="d-flex flex-wrap align-items-center">\s*<img class="avatar[^"]*" src="([^"]+)" \/>[\s\S]*?<b>([^<]+)<\/b>[\s\S]*?<span><i class="fas fa-globe"><\/i><span class="fa5-text">([^<]+)<\/span><\/span>[\s\S]*?<a class="btn btn-sm btn-secondary" href="\/characters\/(\d+)"/g,
  )

  const results = []

  for (const match of characterMatches) {
    const [, avatar, rawName, rawWorld, id] = match
    const world = decodeHtml(rawWorld.trim())
    const dataCenter = WORLD_DATA_CENTER[world] || ""

    results.push({
      id: Number(id),
      avatar,
      name: decodeHtml(rawName.trim()),
      world,
      dataCenter,
      region: DATA_CENTER_REGION[dataCenter] || "",
      source,
    })
  }

  return dedupeCharacters(results)
}

function dedupeCharacters(characters) {
  const seenIds = new Set()

  return characters.filter((character) => {
    if (seenIds.has(character.id)) {
      return false
    }

    seenIds.add(character.id)
    return true
  })
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", "\"")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
}

function getCsrfToken(html) {
  return html.match(/<meta name="csrf-token" content="([^"]+)"/)?.[1] || null
}
