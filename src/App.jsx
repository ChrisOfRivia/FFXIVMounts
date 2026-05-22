import { useEffect, useState } from "react"

function App() {
  const [mounts, setMounts] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedExpansions, setSelectedExpansions] = useState([])

  useEffect(() => {
    fetch("https://ffxivcollect.com/api/mounts")
      .then((response) => response.json())
      .then((data) => {
        setMounts(data.results)
      })
  }, [])

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

  const filteredMounts = mounts.filter((mount) => {
    const mountType =
      mount.sources?.[0]?.type || "Unknown"

    const expansion =
      getExpansion(mount.patch)

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(mountType)

    const matchesExpansion =
      selectedExpansions.length === 0 || selectedExpansions.includes(expansion)

    return matchesType && matchesExpansion
  })

  function toggleSelection(value, selectedValues, setSelectedValues) {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value))
      return
    }

    setSelectedValues([...selectedValues, value])
  }


  return (
    <div className="app-shell">
      <aside className="filters-sidebar">
        <div className="filters-panel">
          <h2>Filters</h2>

          <div className="filter-group">
            <h3>Type</h3>
            <div className="type-filters">
              <button
                className={selectedTypes.length === 0 ? "filter-button type-button active" : "filter-button type-button"}
                onClick={() => setSelectedTypes([])}>
                All
              </button>

              {Object.entries(sourceIcons).map(([type, icon]) => (
                <button
                  key={type}
                  className={selectedTypes.includes(type) ? "filter-button type-button active" : "filter-button type-button"}
                  onClick={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                >
                  <img src={icon} alt={type} />
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Expansion</h3>
            <div className="expansion-filters">
              <button
                className={
                  selectedExpansions.length === 0
                    ? "filter-button expansion-button active"
                    : "filter-button expansion-button"
                }
                onClick={() => setSelectedExpansions([])}
              >
                All
              </button>

              {["ARR", "HW", "SB", "SHB", "EW", "DT"].map((expansion) => (
                <button
                  key={expansion}
                  className={
                    selectedExpansions.includes(expansion)
                      ? "filter-button expansion-button active"
                      : "filter-button expansion-button"
                  }
                  onClick={() =>
                    toggleSelection(expansion, selectedExpansions, setSelectedExpansions)
                  }
                >
                  <img
                    src={getExpansionIcon(expansion)}
                    alt={expansion}
                  />
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
