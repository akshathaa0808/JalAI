import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

import { Line, Pie } from "react-chartjs-2"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"

// 🟢 ADD THESE (NEW - SAFE)
import { MapContainer, TileLayer, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function Dashboard() {

  // 🌾 FARMER DATA
  const [farmer, setFarmer] = useState(null)

  const [weather, setWeather] = useState(null)
  const [recommendation, setRecommendation] = useState("")
  const [decision, setDecision] = useState(null)
  const [satellite, setSatellite] = useState(null)
  const [alerts, setAlerts] = useState([])

  // ✅ LOAD FARMER FIRST
  useEffect(() => {

    const storedFarmer = JSON.parse(localStorage.getItem("farmer"))

    if (storedFarmer) {
      setFarmer(storedFarmer)
      fetchWeather(storedFarmer)
    }

  }, [])

  // ✅ WEATHER FETCH
  const fetchWeather = async (farmerData) => {

    try {

      const response = await API.get(
        `/weather?city=${farmerData.location || "Bangalore"}`
      )

      setWeather(response.data)

      fetchRecommendation(response.data, farmerData)

    } catch (error) {
      console.log(error)
    }
  }

  // ✅ AI RECOMMENDATION
  const fetchRecommendation = async (weatherData, farmerData) => {

    try {

      const response = await API.post("/recommend", {

        name: farmerData?.name || "Farmer",
        location: farmerData?.location || "Bangalore",
        crop: farmerData?.crop || "Tomato",
        soil: farmerData?.soil || "Sandy",

        language: farmerData?.language || "English",

        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        rain_probability: weatherData.rain_probability

      })

      setRecommendation(response.data.recommendation)
      setDecision(response.data.decision)
      setSatellite(response.data.satellite)
      setAlerts(response.data.alerts)

    } catch (error) {
      console.log(error)
    }
  }

  // 🌾 SAMPLE DATA
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const waterUsageData = {
    labels: days,
    datasets: [
      {
        label: "Traditional Irrigation",
        data: [520, 510, 530, 500, 490, 480, 500],
        borderColor: "#ef4444",
        tension: 0.4
      },
      {
        label: "AI Optimized",
        data: [320, 300, 310, 280, 260, 250, 270],
        borderColor: "#22c55e",
        tension: 0.4
      }
    ]
  }

  const rainData = {
    labels: days,
    datasets: [
      {
        label: "Rain Probability %",
        data: [20, 35, 40, 70, 75, 60, 30],
        borderColor: "#3b82f6",
        tension: 0.4
      }
    ]
  }

  const irrigationCycleData = {
    labels: ["Irrigated Days", "Skipped Days"],
    datasets: [
      {
        data: [4, 3],
        backgroundColor: ["#22c55e", "#ef4444"]
      }
    ]
  }

  const dryWetData = {
    labels: ["Dry Days", "Rainy Days"],
    datasets: [
      {
        data: [5, 2],
        backgroundColor: ["#f59e0b", "#3b82f6"]
      }
    ]
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-green-700">
          🌾 JalAI Control Center
        </h1>

        <Link
          to="/chat"
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg"
        >
          Open AI Assistant
        </Link>

      </div>

      {/* 🟢 FARM MAP (NEW - SAFE ADDITION) */}
      {farmer?.polygon && farmer.polygon.length > 0 && (

        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-xl font-bold text-green-700 mb-4">
            🗺 Farm Boundary
          </h2>

          <div className="h-[400px] w-full rounded-xl overflow-hidden">

            <MapContainer
              center={farmer.polygon[0]}
              zoom={16}
              style={{ height: "100%", width: "100%" }}
            >

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polygon
                positions={farmer.polygon}
                pathOptions={{
                  color: "green",
                  fillColor: "green",
                  fillOpacity: 0.3
                }}
              />

            </MapContainer>

          </div>

        </div>
      )}

      {weather && (

        <>

          {/* WEATHER CARDS */}
          <div className="grid md:grid-cols-4 gap-6">

            <Card title="🌡 Temp" value={`${weather.temperature}°C`} />
            <Card title="💧 Humidity" value={`${weather.humidity}%`} />
            <Card title="🌧 Rain Probability" value={`${weather.rain_probability}%`} />
            <Card title="🌱 Moisture" value="34%" />

          </div>

          {/* ALERTS */}
          {alerts?.length > 0 && (

            <div className="bg-red-100 p-4 mt-6 rounded-2xl">

              <h2 className="font-bold text-red-700">
                🚨 Alerts
              </h2>

              {alerts.map((a, i) => (
                <p key={i}>{a}</p>
              ))}

            </div>
          )}

          {/* SATELLITE */}
          {satellite && (

            <div className="bg-white p-6 rounded-2xl mt-8 shadow">

              <h2 className="text-xl font-bold text-purple-700 mb-4">
                🛰 Satellite Intelligence
              </h2>

              <p>NDVI: {satellite.ndvi || "N/A"}</p>
              <p>Health: {satellite.crop_health || "Healthy"}</p>
              <p>Soil Moisture: {satellite.soil_moisture_index || "Normal"}</p>

            </div>
          )}

          {/* AI RECOMMENDATION */}
          <div className="bg-white p-6 rounded-2xl mt-8 shadow">

            <h2 className="text-2xl font-bold text-blue-700">
              🤖 AI Recommendation
            </h2>

            <p className="mt-2">
              {recommendation || "No recommendation yet"}
            </p>

          </div>

          {/* DECISION */}
          {decision && (

            <div className="bg-green-50 p-6 rounded-2xl mt-8 shadow">

              <h2 className="font-bold text-green-700">
                💧 Irrigation Decision
              </h2>

              <p>Status: {decision.irrigate ? " IRRIGATE" : " SKIP"}</p>
              <p>Water Required: {decision.water_liters ?? 0} L</p>
              <p>Delay: {decision.delay_hours ?? 0} hrs</p>
              <p>Risk: {decision.risk || "Low"}</p>

            </div>
          )}

          {/* CHARTS */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <ChartCard title="💧 Water Usage">
              <Line data={waterUsageData} />
            </ChartCard>

            <ChartCard title="🌧 Rain Forecast">
              <Line data={rainData} />
            </ChartCard>

          </div>

          {/* PIE CHARTS */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <ChartCard title="🚿 Irrigation Cycles">
              <Pie data={irrigationCycleData} />
            </ChartCard>

            <ChartCard title="🌤 Dry vs Wet Days">
              <Pie data={dryWetData} />
            </ChartCard>

          </div>

        </>
      )}

    </div>
  )
}

// CARD
function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-bold">{title}</h2>
      <p className="text-2xl">{value}</p>
    </div>
  )
}

// CHART CARD
function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-bold mb-4">{title}</h2>
      {children}
    </div>
  )
}

export default Dashboard