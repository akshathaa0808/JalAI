import { useState } from "react"
import API from "../services/api"

function Chat() {

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [listening, setListening] = useState(false)

  // 🔊 TEXT TO SPEECH
  const speakText = (text) => {

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(text)

    const isKannada = /[\u0C80-\u0CFF]/.test(text)

    speech.lang = isKannada ? "kn-IN" : "en-IN"
    speech.rate = 1

    window.speechSynthesis.speak(speech)
  }

  // 🎤 VOICE INPUT
  const startVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser")
      return
    }

    const recognition = new SpeechRecognition()

    recognition.lang = "en-IN"
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    recognition.start()
    setListening(true)

    recognition.onresult = (event) => {

      let transcript = ""

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " "
      }

      setMessage(transcript.trim())
    }

    recognition.onerror = (e) => {
      console.log("Voice error:", e)
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }
  }

  const sendMessage = async () => {

    if (!message.trim()) return

    const userMessage = {
      sender: "user",
      text: message
    }

    setMessages(prev => [...prev, userMessage])

    try {

      const response = await API.post("/chat", {
        message: message
      })

      const aiResponse = response.data.response

      const aiMessage = {
        sender: "ai",
        text: aiResponse
      }

      setMessages(prev => [...prev, aiMessage])

      // 🔊 Speak AI response
      speakText(aiResponse)

    } catch (error) {

      console.log(error)

      alert("Backend error. Check FastAPI server.")
    }

    setMessage("")
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 p-6">

      <h1 className="text-4xl font-bold text-green-700 mb-6">
        🌾 JalAI Farmer Assistant
      </h1>

      {/* CHAT BOX */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 h-[500px] overflow-y-auto border border-green-100">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`mb-4 flex ${
              msg.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`px-4 py-3 rounded-2xl max-w-[70%] shadow-md ${
                msg.sender === "user"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >

              {msg.text}

            </div>

          </div>

        ))}

      </div>

      {/* INPUT SECTION */}
      <div className="flex mt-4 gap-3 items-center">

        <input
          type="text"
          placeholder="Ask in English or Kannada..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-4 rounded-2xl border shadow-sm"
        />

        {/* 🎤 VOICE BUTTON */}
        <button
          onClick={startVoiceInput}
          className={`px-4 py-3 rounded-2xl text-white shadow-md ${
            listening ? "bg-red-500" : "bg-purple-600"
          }`}
        >
          🎤 {listening ? "Listening..." : "Speak"}
        </button>

        {/* SEND BUTTON */}
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl shadow-md"
        >
          Send
        </button>

      </div>

    </div>
  )
}

export default Chat