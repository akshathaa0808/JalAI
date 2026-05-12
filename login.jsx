import { useState } from "react"
import { useNavigate } from "react-router-dom"

// leaflet imports
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function DrawPolygon({ setPolygon }) {

  useMapEvents({
    click(e) {
      setPolygon((prev) => [
        ...prev,
        [e.latlng.lat, e.latlng.lng]
      ])
    }
  })

  return null
}

function Login() {

  const navigate = useNavigate()

  const [polygon, setPolygon] = useState([])

  const [form, setForm] = useState({
    name: "",
    location: "",
    soil: "Sandy",
    crop: "Tomato"
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {

    const farmerData = {
      ...form,
      polygon: polygon
    }

    localStorage.setItem("farmer", JSON.stringify(farmerData))

    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100 p-4">

      <div className="bg-white p-6 rounded-2xl shadow-lg w-[420px] mb-4">

        <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">
          🌾 JalAI Farmer Setup
        </h1>

        <input
          name="name"
          placeholder="Farmer Name"
          className="w-full p-3 border rounded-xl mb-3"
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Village / City"
          className="w-full p-3 border rounded-xl mb-3"
          onChange={handleChange}
        />

        <select
          name="soil"
          className="w-full p-3 border rounded-xl mb-3"
          onChange={handleChange}
        >
          <option value="Sandy">Sandy Soil</option>
          <option value="Clay">Clay Soil</option>
          <option value="Loamy">Loamy Soil</option>
          <option value="Black">Black Soil</option>
        </select>

        <select
          name="crop"
          className="w-full p-3 border rounded-xl mb-3"
          onChange={handleChange}
        >
          <option value="Tomato">Tomato</option>
          <option value="Rice">Rice</option>
          <option value="Wheat">Wheat</option>
          <option value="Sugarcane">Sugarcane</option>
        </select>

        <p className="text-sm text-gray-500 mb-2">
          ✏️ Click on map to draw your farm boundary
        </p>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 mt-2"
        >
          Start Farming AI 🌱
        </button>
      </div>

      {/* 🗺 MAP SECTION */}
      <div className="w-full max-w-4xl h-[400px] rounded-xl overflow-hidden shadow-lg">

        <MapContainer
          center={[13.3, 77.8]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* CLICK TO DRAW */}
          <DrawPolygon setPolygon={setPolygon} />

          {/* SHOW POLYGON */}
          {polygon.length > 2 && (
            <Polygon positions={polygon} />
          )}

        </MapContainer>

      </div>

      {polygon.length > 0 && (
        <p className="mt-3 text-green-700 font-medium">
          ✅ Farm boundary captured ({polygon.length} points)
        </p>
      )}

    </div>
  )
}

export default Login