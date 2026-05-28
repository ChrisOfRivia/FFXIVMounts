import { useEffect, useState } from "react"
import CollectionPage from "./CollectionPage.jsx"

const HOME_ROUTE = "home"

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
  const [activeRoute, setActiveRoute] = useState(() => getRouteFromHash(window.location.hash))
  const [showHomeDisclaimer, setShowHomeDisclaimer] = useState(() => getRouteFromHash(window.location.hash) === HOME_ROUTE)

  useEffect(() => {
    function handleHashChange() {
      const nextRoute = getRouteFromHash(window.location.hash)
      setActiveRoute(nextRoute)

      if (nextRoute !== HOME_ROUTE) {
        setShowHomeDisclaimer(false)
      }
    }

    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  useEffect(() => {
    document.title =
      activeRoute === HOME_ROUTE
        ? "FFXIV Mount & Minion Tracker"
        : COLLECTION_PAGES[activeRoute]?.title || "FFXIV Mount & Minion Tracker"
  }, [activeRoute])

  useEffect(() => {
    if (activeRoute === HOME_ROUTE && showHomeDisclaimer) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [activeRoute, showHomeDisclaimer])

  const activeConfig = COLLECTION_PAGES[activeRoute] || null

  return (
    <div className={`app-route-shell app-route-shell-${activeRoute}`}>
      <nav className="collection-nav" aria-label="Primary navigation">
        <a
          className={activeRoute === HOME_ROUTE ? "collection-nav-link active" : "collection-nav-link"}
          href="#/"
          aria-current={activeRoute === HOME_ROUTE ? "page" : undefined}
        >
          Home
        </a>
        {Object.values(COLLECTION_PAGES).map((page) => (
          <a
            key={page.key}
            className={page.key === activeRoute ? "collection-nav-link active" : "collection-nav-link"}
            href={`#/${page.key}`}
            aria-current={page.key === activeRoute ? "page" : undefined}
          >
            {page.key === "mounts" ? "Mounts" : "Minions"}
          </a>
        ))}
      </nav>

      {activeRoute === HOME_ROUTE ? (
        <HomePage
          showDisclaimer={showHomeDisclaimer}
          onDismissDisclaimer={() => setShowHomeDisclaimer(false)}
        />
      ) : (
        <CollectionPage key={activeConfig.key} config={activeConfig} />
      )}
    </div>
  )
}

function HomePage({ showDisclaimer, onDismissDisclaimer }) {
  return (
    <main className="page-shell page-shell-home home-page">
      {showDisclaimer ? (
        <div className="project-notice-overlay" role="dialog" aria-modal="true" aria-labelledby="project-notice-title">
          <div className="project-notice-card">
            <p className="project-notice-eyebrow">Heads Up</p>
            <h2 id="project-notice-title">This app is still in development.</h2>
            <p className="project-notice-text">
              Some features may be unfinished or buggy while the tracker is still being built out.
            </p>
            <button
              className="project-notice-button"
              onClick={onDismissDisclaimer}
              type="button"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}
      <section className="home-hero">
        <p className="home-eyebrow">Final Fantasy XIV collection tracker</p>
        <h1>Start Tracking!</h1>
        <p className="home-copy">
          Track mounts and minions with filters, favorites, and ownership sync.
        </p>

        <div className="home-route-grid">
          <a className="home-route-card home-route-card-mounts" href="#/mounts">
            <span className="home-route-card-label">Mounts</span>
            <div className="home-route-card-icon" aria-hidden="true">
              <img src="/icons/chocobo.png" alt="" />
            </div>
            <h2>Mount Tracker</h2>
            <p>Browse mounts by source, expansion and collection status.</p>
            <span className="home-route-card-cta">Open mounts</span>
          </a>

          <a className="home-route-card home-route-card-minions" href="#/minions">
            <span className="home-route-card-label">Minions</span>
            <div className="home-route-card-icon" aria-hidden="true">
              <img src="/icons/minion.png" alt="" />
            </div>
            <h2>Minion Tracker</h2>
            <p>Browse minions by source, expansion and check Verminion details in a dedicated view.</p>
            <span className="home-route-card-cta">Open minions</span>
          </a>
        </div>
      </section>
    </main>
  )
}

function getRouteFromHash(hashValue) {
  const normalizedHash = hashValue.replace(/^#\/?/, "").trim().toLowerCase()

  if (normalizedHash === "mounts") {
    return "mounts"
  }

  if (normalizedHash === "minions") {
    return "minions"
  }

  return HOME_ROUTE
}

export default App
