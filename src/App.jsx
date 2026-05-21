function App() {
  const mounts = [
    {
      id: 1,
      name: "Alte Roite",
      owned: false,
    },
    {
      id: 2,
      name: "Argos",
      owned: true,
    },
    {
      id: 3,
      name: "Megashiba",
      owned: false,
    },
  ]
    

  return (
    <div>
      <h1> FFXIV Mount Tracker</h1>

      {mounts.map((mount) => (
      <div key={mount.id}>
        <h2> {mount.name} </h2>
        <p> {mount.owned ? "Owned" : "Not Owned"}</p>
      </div>
    ))}
    </div>
    
  )
}

export default App
