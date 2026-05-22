import { useEffect, useState } from "react"

function App() {
  const [mounts, setMounts] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedExpansions, setSelectedExpansions] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showProjectNotice, setShowProjectNotice] = useState(true)

  useEffect(() => {
    fetch("https://ffxivcollect.com/api/mounts")
      .then((response) => response.json())
      .then((data) => {
        setMounts(data.results)
      })
  }, [])

  useEffect(() => {
    document.body.style.overflow = showProjectNotice ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [showProjectNotice])

  const sourceIcons = {
    "Unknown": "/icons/unknown.png",
    "Trial": "/icons/trial.png",
    "Achievement": "/icons/achievement.png",
    "Event": "/icons/seasonal.png",
    "Quest": "/icons/msq.png",
    "Wondrous Tails": "/icons/trails.png",
    "Premium": "/icons/store.png",
    "V\u0026C Dungeon": "/icons/trissant.png",
    "Cosmic Exploration": "/icons/cosmocredit.png",
    "Raid": "/icons/raid.png",
    "PvP": "/icons/pvp.png",
    "Deep Dungeon": "/icons/deepdungeon.png",
    "Tribal": "/icons/tribal.png",
    "Treasure Hunt": "/icons/treasure.png",
    "Occult Crescent": "/icons/crescent.png",
    "Chaotic Raid": "/icons/chaotic.png",
    "Hunts": "/icons/hunt.png",
    "Gathering": "/icons/gather.png",
    "FATE": "/icons/fate.png",
    "Purchase": "/icons/purchase.png",
    "Island Sanctuary": "/icons/sanctuary.png",
    "Gold Saucer": "/icons/saucer.png",
    "Skybuilders": "/icons/deliveries.png",
    "Bozja": "/icons/bozja.png",
    "Crafting": "/icons/crafting.png",
    "Eureka": "/icons/lockbox.png",
    "Dungeon": "/icons/dungeon.png",
    "Voyages": "/icons/voyages.png",
    "Other": "/icons/special.png",
  }

  const typeGroups = [
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
      types: ["Event", "Premium", "Purchase", "Cosmic Exploration", "Other", "Unknown"],
    },
  ]

  const expansionOptions = [
    {
      code: "ARR",
      label: "ARR",
      fullName: "A Realm Reborn",
      icon: getExpansionIcon("ARR"),
    },
    {
      code: "HW",
      label: "HW",
      fullName: "Heavensward",
      icon: getExpansionIcon("HW"),
    },
    {
      code: "SB",
      label: "SB",
      fullName: "Stormblood",
      icon: getExpansionIcon("SB"),
    },
    {
      code: "SHB",
      label: "SHB",
      fullName: "Shadowbringers",
      icon: getExpansionIcon("SHB"),
    },
    {
      code: "EW",
      label: "EW",
      fullName: "Endwalker",
      icon: getExpansionIcon("EW"),
    },
    {
      code: "DT",
      label: "DT",
      fullName: "Dawntrail",
      icon: getExpansionIcon("DT"),
    },
  ]

  const filteredMounts = mounts.filter((mount) => {
    const mountType = mount.sources?.[0]?.type || "Unknown"
    const expansion = getExpansion(mount.patch)
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const matchesSearch =
      normalizedQuery === "" ||
      mount.name.toLowerCase().includes(normalizedQuery) ||
      (mount.sources?.[0]?.text || "").toLowerCase().includes(normalizedQuery)

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


  return (
    <>
      {showProjectNotice ? (
        <div className="project-notice-overlay" role="dialog" aria-modal="true" aria-labelledby="project-notice-title">
          <div className="project-notice-card">
            <p className="project-notice-eyebrow">Heads Up</p>
            <h2 id="project-notice-title">This project is still unfinished.</h2>
            <p className="project-notice-text">
              Some features, styling, and data handling are still in progress, so things may change or break while the tracker is being built out.
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
                {typeGroups.map((group) => (
                  <div key={group.label} className="type-category">
                    <p className="type-category-title">{group.label}</p>

                    <div className="type-category-buttons">
                      {group.types.map((type) => (
                        <button
                          key={type}
                          className={selectedTypes.includes(type) ? "filter-button type-button active" : "filter-button type-button"}
                          onClick={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                        >
                          <img src={sourceIcons[type]} alt={type} />
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
                {expansionOptions.map((expansion) => (
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
          <h1>FFXIV Mount Tracker</h1>
          <div className="mount-grid">
            {filteredMounts.map((mount) => (
              <div key={mount.id} className="mount-card">
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
                <div>
                  <h4>Owned by: {mount.owned}</h4>
                </div>

                <div className="source-mount">
                  <img
                    src={
                      sourceIcons[mount.sources?.[0]?.type] ||
                      "/icons/unknown.png"
                    }
                  />
                  <p className="source-text"> {mount.sources?.[0]?.text || "Unknown source"}  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

function getExpansionIcon(expansion) {
  if (expansion === "ARR") {
    return "/expansions/ARR.png";
  }

  if (expansion === "HW") {
    return "/expansions/HW.webp";
  }

  if (expansion === "SB") {
    return "/expansions/SB.webp";
  }

  if (expansion === "SHB") {
    return "/expansions/SHB.webp";
  }

  if (expansion === "EW") {
    return "/expansions/EW.png";
  }

  if (expansion === "DT") {
    return "/expansions/DT.webp";
  }

  return "/icons/unknown.png";
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
