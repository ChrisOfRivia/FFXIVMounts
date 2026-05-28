import { useEffect, useState } from "react"
import CollectionPage from "./CollectionPage.jsx"

const COLLECTION_PAGES = {
  mounts: {
    key: "mounts",
    title: "FFXIV Mount Tracker",
    singularLabel: "mount",
    pluralLabel: "mounts",
    dataEndpoint: "https://ffxivcollect.com/api/mounts",
    syncEndpoint: "/api/character-mounts",
    characterStorageKey: "ffxiv-mount-tracker-character-sync",
    favoritesStorageKey: "ffxiv-mount-tracker-favorites",
    pageClassName: "page-shell-mounts",
    cardClassName: "mount-card",
    emptyStateTutorial: {
      imageSrc: "/tutorials/favoriteMount.png",
      imageAlt: "Tutorial showing how to favorite a mount",
    },
    typeGroupVariant: "mounts",
  },
  minions: {
    key: "minions",
    title: "FFXIV Minion Tracker",
    singularLabel: "minion",
    pluralLabel: "minions",
    dataEndpoint: "https://ffxivcollect.com/api/minions",
    syncEndpoint: "/api/character-minions",
    characterStorageKey: "ffxiv-minion-tracker-character-sync",
    favoritesStorageKey: "ffxiv-minion-tracker-favorites",
    pageClassName: "page-shell-minions",
    cardClassName: "mount-card minion-card",
    emptyStateTutorial: {
      imageSrc: "/tutorials/favoriteMinion.png",
      imageAlt: "Tutorial showing how to favorite a minion",
    },
    typeGroupVariant: "minions",
  },
}

function App() {
  const [activePage, setActivePage] = useState(() => getPageFromHash(window.location.hash))

  useEffect(() => {
    function handleHashChange() {
      setActivePage(getPageFromHash(window.location.hash))
    }

    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const activeConfig = COLLECTION_PAGES[activePage]

  return (
    <div className="app-route-shell">
      <nav className="collection-nav" aria-label="Collection pages">
        {Object.values(COLLECTION_PAGES).map((page) => (
          <a
            key={page.key}
            className={page.key === activePage ? "collection-nav-link active" : "collection-nav-link"}
            href={page.key === "mounts" ? "#/" : `#/${page.key}`}
          >
            {page.key === "mounts" ? "Mounts" : "Minions"}
          </a>
        ))}
      </nav>

      <CollectionPage key={activeConfig.key} config={activeConfig} />
    </div>
  )
}

function getPageFromHash(hashValue) {
  const normalizedHash = hashValue.replace(/^#\/?/, "").trim().toLowerCase()

  if (normalizedHash === "minions") {
    return "minions"
  }

  return "mounts"
}

export default App
