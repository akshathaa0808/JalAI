import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-green-200 to-blue-200">

      <h1 className="text-5xl font-bold text-green-800">
        JalAI
      </h1>

      <p className="mt-4 text-gray-700">
        Smart Irrigation for Farmers
      </p>

      <Link
        to="/"
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl"
      >
        Go to Setup
      </Link>

    </div>
  )
}

export default Home