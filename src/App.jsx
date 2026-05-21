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


  return (
    <div>
      <h1>FFXIV Mount Tracker</h1>
      <div className="mount-grid">
        {mounts.map((mount) => (
          <div key={mount.id} className="mount-card">
            <h2>{mount.name}</h2>

            <img src={mount.image} />
            <h4>Owned by: {mount.owned}</h4>

          </div>

        ))}
      </div>
    </div>
  )
}

export default App
