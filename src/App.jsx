import { useEffect, useState } from "react"

function App() {
  const [mounts, setMounts] = useState([])

  useEffect(() => {
    fetch("https://ffxivcollect.com/api/mounts")
      .then((response) => response.json())
      .then((data) => {
        setMounts(data.results)
      })
  }, [])

  const sourceIcons = {
    "Uknown": "/icons/unknown.png",
    "Trial": "/icons/trial.png",
    "Achievement": "/icons/achievement.png",
    "Event": "/icons/seasonal.png",
    "Quest": "/icons/msq.png",
    "Wondrous Tails": "/icons/trails.png",
    "Premium": "/icons/store.png",
    "V\u0026C Dungeon": "/icons/trissant.png",
    "Cosmic Exploration": "/icons/cosmocredit.png",
    "Achievement": "/icons/achivement.png",
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

  const expansionIcons = {
    "ARR": "/expansions.ARR.png"
  }


  return (
    <div>
      <h1>FFXIV Mount Tracker</h1>
      <div className="mount-grid">
        {mounts.map((mount) => (
          <div key={mount.id} className="mount-card">
            <div className="mount-patch">
              <img src={getExpansionIcon(mount.patch)} />
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
                src={sourceIcons[mount.sources?.[0]?.type]} />
              <p className="source-text"> {mount.sources?.[0]?.text || "???"}  </p>
            </div>


          </div>

        ))}
      </div>
    </div>
  )
}

function getExpansionIcon(patch) {
  const patchNumber = parseFloat(patch)

  if (patchNumber >= 2.0 && patchNumber < 3.0) {
    return "/expansions/ARR.png";
  }
  else if (patchNumber >= 3.0 && patchNumber < 4.0) {
    return "/expansions/HW.webp";
  }
  else if (patchNumber >= 4.0 && patchNumber < 5.0) {
    return "/expansions/SB.webp";
  }
  else if (patchNumber >= 5.0 && patchNumber < 6.0) {
    return "/expansions/SHB.webp";
  }
  else if (patchNumber >= 6.0 && patchNumber < 7.0) {
    return "/expansions/EW.png";
  }
  else if (patchNumber >= 7.0 && patchNumber < 8.0) {
    return "/expansions/DT.webp";
  }

  return "/icons/unknown.png";
}

export default App
