export const REGIONS = [
  { code: "NA", label: "North America" },
  { code: "EU", label: "Europe" },
  { code: "JP", label: "Japan" },
  { code: "OC", label: "Oceania" },
]

export const REGION_DATA_CENTERS = {
  NA: ["Aether", "Crystal", "Dynamis", "Primal"],
  EU: ["Chaos", "Light"],
  JP: ["Elemental", "Gaia", "Mana", "Meteor"],
  OC: ["Materia"],
}

export const DATA_CENTER_WORLDS = {
  Aether: ["Adamantoise", "Cactuar", "Faerie", "Gilgamesh", "Jenova", "Midgardsormr", "Sargatanas", "Siren"],
  Chaos: ["Cerberus", "Louisoix", "Moogle", "Omega", "Phantom", "Ragnarok", "Sagittarius", "Spriggan"],
  Crystal: ["Balmung", "Brynhildr", "Coeurl", "Diabolos", "Goblin", "Malboro", "Mateus", "Zalera"],
  Dynamis: ["Cuchulainn", "Golem", "Halicarnassus", "Kraken", "Maduin", "Marilith", "Rafflesia", "Seraph"],
  Elemental: ["Aegis", "Atomos", "Carbuncle", "Garuda", "Gungnir", "Kujata", "Tonberry", "Typhon"],
  Gaia: ["Alexander", "Bahamut", "Durandal", "Fenrir", "Ifrit", "Ridill", "Tiamat", "Ultima"],
  Light: ["Alpha", "Lich", "Odin", "Phoenix", "Raiden", "Shiva", "Twintania", "Zodiark"],
  Mana: ["Anima", "Asura", "Chocobo", "Hades", "Ixion", "Masamune", "Pandaemonium", "Titan"],
  Materia: ["Bismarck", "Ravana", "Sephirot", "Sophia", "Zurvan"],
  Meteor: ["Belias", "Mandragora", "Ramuh", "Shinryu", "Unicorn", "Valefor", "Yojimbo", "Zeromus"],
  Primal: ["Behemoth", "Excalibur", "Exodus", "Famfrit", "Hyperion", "Lamia", "Leviathan", "Ultros"],
}

export const ALL_DATA_CENTERS = Object.values(REGION_DATA_CENTERS).flat()

export const WORLD_DATA_CENTER = Object.fromEntries(
  Object.entries(DATA_CENTER_WORLDS).flatMap(([dataCenter, worlds]) =>
    worlds.map((world) => [world, dataCenter]),
  ),
)

export const DATA_CENTER_REGION = Object.fromEntries(
  Object.entries(REGION_DATA_CENTERS).flatMap(([region, dataCenters]) =>
    dataCenters.map((dataCenter) => [dataCenter, region]),
  ),
)

export function getDataCentersByRegion(regionCode) {
  if (!regionCode) {
    return ALL_DATA_CENTERS
  }

  return REGION_DATA_CENTERS[regionCode] || []
}

export function getWorldsByDataCenter(dataCenter) {
  if (!dataCenter) {
    return Object.values(DATA_CENTER_WORLDS).flat()
  }

  return DATA_CENTER_WORLDS[dataCenter] || []
}
