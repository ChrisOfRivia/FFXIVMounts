import { useEffect, useState } from "react"

const SOURCE_ICONS = {
  Unknown: "/icons/unknown.png",
  Trial: "/icons/trial.png",
  Achievement: "/icons/achievement.png",
  Event: "/icons/seasonal.png",
  Quest: "/icons/msq.png",
  "Wondrous Tails": "/icons/trails.png",
  Premium: "/icons/store.png",
  "V&C Dungeon": "/icons/trissant.png",
  "Cosmic Exploration": "/icons/cosmocredit.png",
  Raid: "/icons/raid.png",
  PvP: "/icons/pvp.png",
  "Deep Dungeon": "/icons/deepdungeon.png",
  Tribal: "/icons/tribal.png",
  "Treasure Hunt": "/icons/treasure.png",
  "Occult Crescent": "/icons/crescent.png",
  "Chaotic Raid": "/icons/chaotic.png",
  Hunts: "/icons/hunt.png",
  Gathering: "/icons/gather.png",
  FATE: "/icons/fate.png",
  Purchase: "/icons/purchase.png",
  "Island Sanctuary": "/icons/sanctuary.png",
  "Gold Saucer": "/icons/saucer.png",
  Skybuilders: "/icons/deliveries.png",
  Bozja: "/icons/bozja.png",
  Crafting: "/icons/crafting.png",
  Eureka: "/icons/lockbox.png",
  Dungeon: "/icons/dungeon.png",
  Voyages: "/icons/voyages.png",
  Other: "/icons/special.png",
}

const TYPE_GROUPS = [
  {
    label: "Instances",
    types: ["Dungeon", "Trial", "Raid", "Chaotic Raid", "Deep Dungeon", "V&C Dungeon"],
  },
  {
    label: "Exploration",
    types: ["Eureka", "Bozja", "Occult Crescent", "Treasure Hunt", "Voyages"],
  },
  {
    label: "Progression",
    types: ["Quest", "Achievement", "Hunts", "FATE", "Wondrous Tails"],
  },
  {
    label: "Side Content",
    types: ["Tribal", "Island Sanctuary", "Gold Saucer", "Skybuilders", "Gathering", "Crafting"],
  },
  {
    label: "Special",
    types: ["Event", "Premium", "Purchase", "Cosmic Exploration", "PvP", "Other"],
  },
]

const EXPANSION_NAMES = {
  ARR: "A Realm Reborn",
  HW: "Heavensward",
  SB: "Stormblood",
  SHB: "Shadowbringers",
  EW: "Endwalker",
  DT: "Dawntrail",
}

const EXPANSION_OPTIONS = Object.entries(EXPANSION_NAMES).map(([code, fullName]) => ({
  code,
  label: code,
  fullName,
  icon: getExpansionIcon(code),
}))

const GARLAND_TYPE_MAP = {
  Achievement: "achievement",
  Fate: "fate",
  FATE: "fate",
  Item: "item",
  Leve: "leve",
  Mob: "mob",
  NPC: "npc",
  Quest: "quest",
}

const INSTANCE_TYPES = new Set([
  "Trial",
  "Raid",
  "Dungeon",
  "Deep Dungeon",
  "Chaotic Raid",
  "V&C Dungeon",
])

const MOGSTATION_SOURCE_TEXT = "Online Store"

const WIKI_TITLE_OVERRIDES = {
  "Sinus Ardonum": "Sinus Ardorum",
  "The Palace of the Dead": "Palace of the Dead",
}

const GARLAND_CURRENCY_NAME_OVERRIDES = {
  "Achievement Certificates": "Achievement Certificate",
  "Ananta Dreamstaves": "Ananta Dreamstave",
  "Bicolor Gemstone Vouchers": "Bicolor Gemstone Voucher",
  "Bozjan Clusters": "Bozjan Cluster",
  "Bottles Of Exciting Tonic": "Bottle Of Exciting Tonic",
  "Burning Horns": "Burning Horn",
  "Chi Bolts": "Chi Bolt",
  "Chunks of Sanguinite": "Sanguinite",
  "Clan Mark Logs": "Clan Mark Log",
  "Corvosi Manuscripts": "Corvosi Manuscript",
  Cosmocredits: "Cosmocredit",
  "Enlightenment Silver Pieces": "Enlightenment Silver Piece",
  "Fae Fancies": "Fae Fancy",
  "First Light Relics": "First Light Relic",
  "Formidable Cog": "Formidable Cog",
  "Faux Leaves": "Faux Leaf",
  "Fete Tokens": "Fete Token",
  "Gelmorran Potsherds": "Gelmorran Potsherd",
  "Gil": "Gil",
  "Gold Chocobo Feathers": "Gold Chocobo Feather",
  "Guardian Arkveld Certificates": "Guardian Arkveld Certificate",
  "Hammered Frogments": "Hammered Frogment",
  "Ixion Horns": "Ixion Horn",
  "Mount Tokens": "Mount Token",
  "Oizys Token Booklets": "Oizys Token Booklet",
  "Orange Gatherer's Scrips": "Orange Gatherer's Scrip",
  "Omicron Omnitokens": "Omicron Omnitoken",
  "Phaenna Token Booklets": "Phaenna Token Booklet",
  "Pieces of Corvosi Brass": "Corvosi Brass",
  "Resplendent Feathers": "Resplendent Feather",
  "Sacks of Nuts": "Sack of Nuts",
  "Sacks Of Nuts": "Sack Of Nuts",
  "Seafarer's Cowries": "Seafarer's Cowrie",
  "Shishu Coins": "Shishu Coin",
  "Sil'dihn Silvers": "Sil'dihn Silver",
  "Skybuilders' Scrips": "Skybuilders' Scrip",
  "Trophy Crystals": "Trophy Crystal",
  "Turali Bicolor Gemstone Vouchers": "Turali Bicolor Gemstone Voucher",
  "Ttokrrone Scales": "Ttokrrone Scale",
  "Twilight Gemstones": "Twilight Gemstone",
  "Vegetal Vouchers": "Vegetal Voucher",
  "Wolf Marks": "Wolf Mark",
}

function App() {
  const [mounts, setMounts] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedExpansions, setSelectedExpansions] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showProjectNotice, setShowProjectNotice] = useState(true)
  const [selectedMount, setSelectedMount] = useState(null)

  useEffect(() => {
    fetch("https://ffxivcollect.com/api/mounts")
      .then((response) => response.json())
      .then((data) => {
        setMounts(data.results)
      })
  }, [])

  useEffect(() => {
    document.body.style.overflow = showProjectNotice || selectedMount ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [showProjectNotice, selectedMount])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedMount(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const filteredMounts = mounts.filter((mount) => {
    const mountType = getPrimarySource(mount).type
    const expansion = getExpansion(mount.patch)
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const matchesSearch =
      normalizedQuery === "" ||
      mount.name.toLowerCase().includes(normalizedQuery) ||
      getPrimarySource(mount).text.toLowerCase().includes(normalizedQuery)

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(mountType)
    const matchesExpansion = selectedExpansions.length === 0 || selectedExpansions.includes(expansion)

    return matchesType && matchesExpansion && matchesSearch
  })

  function toggleSelection(value, selectedValues, setSelectedValues) {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value))
      return
    }

    setSelectedValues([...selectedValues, value])
  }

  function openMountDetails(mount) {
    setSelectedMount(mount)
  }

  const selectedMountExpansion = selectedMount ? getExpansion(selectedMount.patch) : null
  const selectedMountSourceType = selectedMount ? getPrimarySource(selectedMount).type : "Unknown"

  return (
    <>
      {showProjectNotice ? (
        <div className="project-notice-overlay" role="dialog" aria-modal="true" aria-labelledby="project-notice-title">
          <div className="project-notice-card">
            <p className="project-notice-eyebrow">Heads Up</p>
            <h2 id="project-notice-title">This project is still unfinished.</h2>
            <p className="project-notice-text">
              Some features, styling and data handling are still in progress, so things may change or break while the tracker is being built out.
            </p>
            <button
              className="project-notice-button"
              onClick={() => setShowProjectNotice(false)}
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {selectedMount ? (
        <div
          className="mount-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mount-detail-title"
          onClick={() => setSelectedMount(null)}
        >
          <div className="mount-detail-card" onClick={(event) => event.stopPropagation()}>
            <button
              className="mount-detail-close"
              onClick={() => setSelectedMount(null)}
              aria-label="Close mount details"
            >
              X
            </button>

            <div className="mount-detail-header">
              <div className="mount-detail-badges">
                <span className="mount-detail-badge mount-detail-expansion-badge">
                  <img
                    src={getExpansionIcon(selectedMountExpansion)}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>{getExpansionName(selectedMountExpansion)}</span>
                </span>
                <span className="mount-detail-badge mount-detail-type-badge">
                  <img
                    src={SOURCE_ICONS[selectedMountSourceType] || "/icons/unknown.png"}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>{selectedMountSourceType}</span>
                </span>
              </div>

              <div className="mount-detail-title-row">
                <div className="mount-detail-icon">
                  <img src={selectedMount.icon || selectedMount.image} alt="" aria-hidden="true" />
                </div>

                <div className="mount-detail-title-group">
                  <h2 id="mount-detail-title">{selectedMount.name}</h2>
                  <p className="mount-detail-subtitle">
                    Patch {selectedMount.patch || "Unknown"}
                  </p>
                  {selectedMount.description ? (
                    <p className="mount-detail-description">{selectedMount.description}</p>
                  ) : null}
                </div>
              </div>

            </div>

            <div className="mount-detail-body">
              <div className="mount-detail-image">
                <img src={selectedMount.image} alt={selectedMount.name} />
              </div>

              <div className="mount-detail-info">
                <div className="mount-detail-owned">
                  Owned by: <strong>{selectedMount.owned}</strong>
                </div>

                <div className="mount-detail-section">
                  <h3>How to Get It</h3>

                  <div className="mount-detail-sources">
                    {getSourceList(selectedMount).map((source, index) => {
                      const sourceLinks = getSourceLinks(source, selectedMount)
                      const primarySourceLink = getPrimarySourceLink(sourceLinks)

                      return (
                        <div key={`${selectedMount.id}-${source.type}-${index}`} className="mount-detail-source">
                          <div className="mount-detail-source-header">
                            <img
                              src={SOURCE_ICONS[source.type] || "/icons/unknown.png"}
                              alt={source.type}
                            />
                            <span>{source.type}</span>
                          </div>

                          {primarySourceLink ? (
                            <a
                              className="mount-detail-source-copy mount-detail-source-copy-link"
                              href={primarySourceLink.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {source.text}
                            </a>
                          ) : (
                            <p className="mount-detail-source-copy">{source.text}</p>
                          )}

                          {sourceLinks.length > 0 ? (
                            <div className="mount-detail-source-links">
                              {sourceLinks.map((link) => (
                                <a
                                  key={`${selectedMount.id}-${source.type}-${link.label}-${link.href}`}
                                  className="mount-detail-source-pill"
                                  href={link.href}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="page-shell">
        <header className="page-header">
          <h1>FFXIV Mount Tracker</h1>
        </header>

        <div className="app-shell">
          <aside className="filters-sidebar">
            <div className="filters-panel">
              <h2>Filters</h2>

              <div className="search-filter">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search mounts..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  aria-label="Search mounts"
                />
              </div>

              <div className="filter-group">
                <div className="filter-heading">
                  <h3>Type</h3>
                  <button
                    className={selectedTypes.length === 0 ? "reset-filter-button active" : "reset-filter-button"}
                    onClick={() => setSelectedTypes([])}
                  >
                    <img src="/icons/all.png" alt="" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                </div>
                <div className="type-filters">
                  {TYPE_GROUPS.map((group) => (
                    <div key={group.label} className="type-category">
                      <p className="type-category-title">{group.label}</p>

                      <div className="type-category-buttons">
                        {group.types.map((type) => (
                          <button
                            key={type}
                            className={selectedTypes.includes(type) ? "filter-button type-button active" : "filter-button type-button"}
                            onClick={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                          >
                            <img src={SOURCE_ICONS[type]} alt={type} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-heading">
                  <h3>Expansion</h3>
                  <button
                    className={selectedExpansions.length === 0 ? "reset-filter-button active" : "reset-filter-button"}
                    onClick={() => setSelectedExpansions([])}
                  >
                    <img src="/icons/all.png" alt="" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                </div>
                <div className="expansion-filters">
                  {EXPANSION_OPTIONS.map((expansion) => (
                    <button
                      key={expansion.code}
                      className={
                        selectedExpansions.includes(expansion.code)
                          ? "filter-button expansion-button expansion-card active"
                          : "filter-button expansion-button expansion-card"
                      }
                      title={expansion.fullName}
                      onClick={() =>
                        toggleSelection(expansion.code, selectedExpansions, setSelectedExpansions)
                      }
                    >
                      <img
                        src={expansion.icon}
                        alt={expansion.fullName}
                      />
                      <span className="expansion-label">{expansion.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="content-area">
            <div className="mount-grid">
              {filteredMounts.map((mount) => (
                <div
                  key={mount.id}
                  className="mount-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => openMountDetails(mount)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      openMountDetails(mount)
                    }
                  }}
                >
                  <div className="mount-patch">
                    <img
                      src={
                        getExpansionIcon(
                          getExpansion(mount.patch)
                        )
                      }
                    />
                  </div>
                  <h2>{mount.name}</h2>
                  <div className="mount-image">
                    <img src={mount.image} />
                  </div>
                  <div className="mount-owned">
                    <h4>Owned by: {mount.owned}</h4>
                  </div>

                  <div className="source-mount">
                    <img
                      src={
                        SOURCE_ICONS[getPrimarySource(mount).type] ||
                        "/icons/unknown.png"
                      }
                    />
                    <p className="source-text">{getPrimarySource(mount).text}</p>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

function getPrimarySource(mount) {
  return getSourceList(mount)[0]
}

function getSourceList(mount) {
  if (mount?.sources?.length) {
    return mount.sources.map((source) => ({
      ...source,
      type: source.type || "Unknown",
      text: source.text || "Unknown source",
    }))
  }

  return [{ type: "Unknown", text: "Unknown source" }]
}

function getExpansionIcon(expansion) {
  if (expansion === "ARR") {
    return "/expansions/ARR.png"
  }

  if (expansion === "HW") {
    return "/expansions/HW.webp"
  }

  if (expansion === "SB") {
    return "/expansions/SB.webp"
  }

  if (expansion === "SHB") {
    return "/expansions/SHB.webp"
  }

  if (expansion === "EW") {
    return "/expansions/EW.png"
  }

  if (expansion === "DT") {
    return "/expansions/DT.webp"
  }

  return "/icons/unknown.png"
}

function getExpansionName(expansion) {
  return EXPANSION_NAMES[expansion] || "Unknown Expansion"
}

function getSourceLinks(source, mount) {
  const linkBuilders = getSourceLinkPriority(source)
  const links = linkBuilders.map((builder) => builder(source, mount)).filter(Boolean)

  return links.filter((link, index) => links.findIndex((entry) => entry.href === link.href) === index)
}

function getPrimarySourceLink(sourceLinks) {
  return sourceLinks[0] || null
}

function getVendorSourceLink(source) {
  const vendorWikiTitle = getVendorWikiTitle(source)

  if (!vendorWikiTitle) {
    return null
  }

  return {
    label: "Vendor",
    href: `https://ffxiv.consolegameswiki.com/wiki/${encodeWikiPageTitle(vendorWikiTitle)}`,
  }
}

function getCurrencySourceLink(source) {
  const garlandCurrencyName = getGarlandCurrencyName(source)

  if (!garlandCurrencyName) {
    return null
  }

  return {
    label: "Garland DB",
    href: `https://www.garlandtools.org/db/#search/${encodeURIComponent(garlandCurrencyName)}`,
  }
}

function getCollectSourceLink(source) {
  if (source.related_type === "Achievement" && source.related_id) {
    return {
      label: "FFXIV Collect",
      href: `https://ffxivcollect.com/achievements/${source.related_id}`,
    }
  }

  return null
}

function getMogstationSourceLink(source) {
  if (!isMogstationSource(source)) {
    return null
  }

  return {
    label: "Mog Station",
    href: "https://store.finalfantasyxiv.com/ffxivstore/en-us/category/11",
  }
}

function getGarlandSourceLink(source) {
  const garlandType = GARLAND_TYPE_MAP[source.related_type]

  if (!garlandType || !source.related_id) {
    return null
  }

  return {
    label: "Garland DB",
    href: `https://www.garlandtools.org/db/#${garlandType}/${source.related_id}`,
  }
}

function getWikiSourceLink(source) {
  const wikiTitle = getWikiTitle(source)

  if (!wikiTitle) {
    return null
  }

  return {
    label: "FFXIV Wiki",
    href: `https://ffxiv.consolegameswiki.com/wiki/${encodeWikiPageTitle(wikiTitle)}`,
  }
}

function getSourceLinkPriority(source) {
  if (isMogstationSource(source)) {
    return [getMogstationSourceLink]
  }

  if (isCosmicFortuneSource(source) || isMechPilotRewardSource(source)) {
    return [getWikiSourceLink, getVendorSourceLink]
  }

  if (isMgpSource(source) || isGilSource(source)) {
    return [getVendorSourceLink]
  }

  if (getGarlandCurrencyName(source)) {
    return [getCurrencySourceLink, getVendorSourceLink]
  }

  if (INSTANCE_TYPES.has(source.type)) {
    return [getWikiSourceLink]
  }

  return [getCollectSourceLink, getGarlandSourceLink, getWikiSourceLink]
}

function getWikiTitle(source) {
  const sourceText = source.text?.trim()

  if (!sourceText || sourceText === "Unknown source") {
    return null
  }

  const normalizedWikiTitle = getNormalizedWikiTitle(sourceText)

  if (normalizedWikiTitle) {
    return normalizedWikiTitle
  }

  return sourceText
}

function encodeWikiPageTitle(title) {
  return encodeURIComponent(title.replace(/\s+/g, "_"))
}

function getNormalizedWikiTitle(sourceText) {
  const directTitle = getDirectWikiTitle(sourceText)

  if (directTitle) {
    return directTitle
  }

  const pvpSeriesTitle = getPvpSeriesWikiTitle(sourceText)

  if (pvpSeriesTitle) {
    return pvpSeriesTitle
  }

  const feastTitle = getFeastWikiTitle(sourceText)

  if (feastTitle) {
    return feastTitle
  }

  const cosmicExplorationTitle = getCosmicExplorationWikiTitle(sourceText)

  if (cosmicExplorationTitle) {
    return cosmicExplorationTitle
  }

  const instanceContainerTitle = getInstanceContainerWikiTitle(sourceText)

  if (instanceContainerTitle) {
    return instanceContainerTitle
  }

  const lockboxZoneTitle = getLockboxZoneWikiTitle(sourceText)

  if (lockboxZoneTitle) {
    return lockboxZoneTitle
  }

  return null
}

function getVendorWikiTitle(source) {
  const sourceText = source.text?.trim()

  if (!sourceText) {
    return null
  }

  if (isMgpSource(source)) {
    return "Gold Saucer Attendant"
  }

  if (isPvpTrophyCrystalSource(source)) {
    return "Crystal Quartermaster"
  }

  if (isPvpWolfMarkSource(source)) {
    return "Mark Quartermaster"
  }

  if (isCosmicFortuneSource(source)) {
    return "Orbitingway"
  }

  if (isMechPilotRewardSource(source)) {
    return "Alerot"
  }

  const vendorSourceMatch = sourceText.match(/^(.*?) - \d[\d,]*\s+.+$/)

  if (vendorSourceMatch) {
    return getVendorNameFromSourcePrefix(vendorSourceMatch[1])
  }

  return null
}

function getVendorNameFromSourcePrefix(sourcePrefix) {
  const normalizedSourcePrefix = sourcePrefix.trim()

  if (!normalizedSourcePrefix) {
    return null
  }

  const vendorSegment = normalizedSourcePrefix.includes(" / ")
    ? normalizedSourcePrefix.split(" / ")[0]
    : normalizedSourcePrefix.split(" - ")[0]

  return vendorSegment.replace(/\s*\([^)]*\)\s*$/, "").trim() || null
}

function getDirectWikiTitle(sourceText) {
  return WIKI_TITLE_OVERRIDES[sourceText] || null
}

function getPvpSeriesWikiTitle(sourceText) {
  if (!/^PvP Series \d+ - Level \d+$/.test(sourceText)) {
    return null
  }

  return "Series Malmstones"
}

function getFeastWikiTitle(sourceText) {
  if (!/^The Feast: Season \d+$/.test(sourceText)) {
    return null
  }

  return "The Feast"
}

function getCosmicExplorationWikiTitle(sourceText) {
  const cosmicFortuneMatch = sourceText.match(/^Cosmic Fortune - (.+)$/)

  if (cosmicFortuneMatch) {
    return "Cosmic Fortune"
  }

  const mechPilotRewardMatch = sourceText.match(/^Mech Pilot Reward - (.+)$/)

  if (mechPilotRewardMatch) {
    return normalizeCosmicExplorationZoneTitle(mechPilotRewardMatch[1])
  }

  return null
}

function normalizeCosmicExplorationZoneTitle(zoneTitle) {
  return WIKI_TITLE_OVERRIDES[zoneTitle] || zoneTitle
}

function getInstanceContainerWikiTitle(sourceText) {
  const containerSourceMatch = sourceText.match(/^(.+?) - (Final Boss Chest(?:es)?|Bronze(?:\/Silver)? Coffer|Silver Coffer|Gold Sack|Silver Sack|Platinum Sack|Sack of First Light)$/)

  if (!containerSourceMatch) {
    return null
  }

  return WIKI_TITLE_OVERRIDES[containerSourceMatch[1]] || containerSourceMatch[1]
}

function getLockboxZoneWikiTitle(sourceText) {
  const happyBunnyLockboxMatch = sourceText.match(/^Happy Bunny Lockbox - (.+)$/)

  if (!happyBunnyLockboxMatch) {
    return null
  }

  return happyBunnyLockboxMatch[1]
}

function isMogstationSource(source) {
  return source.type === "Premium" && source.text?.trim() === MOGSTATION_SOURCE_TEXT
}

function isMgpSource(source) {
  return source.type === "Gold Saucer" && source.text?.includes("MGP")
}

function isGilSource(source) {
  return source.text?.includes("Gil")
}

function isCosmicFortuneSource(source) {
  return source.type === "Cosmic Exploration" && source.text?.startsWith("Cosmic Fortune - ")
}

function isMechPilotRewardSource(source) {
  return source.type === "Cosmic Exploration" && source.text?.startsWith("Mech Pilot Reward - ")
}

function isPvpTrophyCrystalSource(source) {
  return source.type === "PvP" && source.text?.includes("Trophy Crystals")
}

function isPvpWolfMarkSource(source) {
  return source.type === "PvP" && source.text?.includes("Wolf Marks")
}

function getGarlandCurrencyName(source) {
  const sourceText = source.text?.trim()

  if (!sourceText || sourceText === "Unknown source") {
    return null
  }

  const directAmountMatch = sourceText.match(/^\d[\d,]*\s+(.+?)(?:\s*\(|$)/)

  if (directAmountMatch) {
    return normalizeGarlandCurrencyName(directAmountMatch[1])
  }

  const vendorAmountMatch = sourceText.match(/ - \d[\d,]*\s+(.+?)(?:\s*\(|$)/)

  if (vendorAmountMatch) {
    return normalizeGarlandCurrencyName(vendorAmountMatch[1])
  }

  return null
}

function normalizeGarlandCurrencyName(currencyName) {
  const trimmedCurrencyName = currencyName.trim()
  const normalizedCurrencyName = normalizeGarlandCurrencyLookupKey(trimmedCurrencyName)

  if (!trimmedCurrencyName) {
    return null
  }

  if (GARLAND_CURRENCY_NAME_OVERRIDES[normalizedCurrencyName]) {
    return GARLAND_CURRENCY_NAME_OVERRIDES[normalizedCurrencyName]
  }

  return singularizeGarlandCurrencyName(trimmedCurrencyName)
}

function normalizeGarlandCurrencyLookupKey(currencyName) {
  return currencyName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function singularizeGarlandCurrencyName(currencyName) {
  const words = currencyName.split(" ")

  for (let index = words.length - 1; index >= 0; index -= 1) {
    const word = words[index]
    const singularWord = singularizeGarlandWord(word)

    if (singularWord !== word) {
      words[index] = singularWord
      return words.join(" ")
    }
  }

  return currencyName
}

function singularizeGarlandWord(word) {
  if (word === "Leaves") {
    return "Leaf"
  }

  if (word.endsWith("ies")) {
    return `${word.slice(0, -3)}y`
  }

  if (word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1)
  }

  return word
}

function getExpansion(patch) {
  const patchNumber = parseFloat(patch)

  if (patchNumber >= 2.0 && patchNumber < 3.0) {
    return "ARR";
  }
  else if (patchNumber >= 3.0 && patchNumber < 4.0) {
    return "HW";
  }
  else if (patchNumber >= 4.0 && patchNumber < 5.0) {
    return "SB";
  }
  else if (patchNumber >= 5.0 && patchNumber < 6.0) {
    return "SHB";
  }
  else if (patchNumber >= 6.0 && patchNumber < 7.0) {
    return "EW";
  }
  else if (patchNumber >= 7.0 && patchNumber < 8.0) {
    return "DT";
  }

  return "Unknown";
}

export default App
