from ai import get_ai_recommendation
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from weather import get_weather

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🌱 HOME
@app.get("/")
def home():
    return {"message": "JalAI Backend Running 🚀"}


# 🌦 WEATHER
@app.get("/weather")
def weather(city: str):
    return get_weather(city)


# 🧠 IRRIGATION ENGINE
def irrigation_engine(data):

    rain = data["rain_probability"]
    temp = data["temperature"]
    humidity = data["humidity"]

    decision = {
        "irrigate": True,
        "delay_hours": 0,
        "water_liters": 300,
        "risk": "low"
    }

    if rain > 70:
        decision["irrigate"] = False
        decision["delay_hours"] = 6
        decision["water_liters"] = 0
        decision["risk"] = "high_rain_risk"

    elif temp > 35 and humidity < 40:
        decision["irrigate"] = True
        decision["water_liters"] = 450
        decision["risk"] = "high_heat_stress"

    else:
        decision["irrigate"] = True
        decision["water_liters"] = 250
        decision["risk"] = "normal"

    return decision


# 🚨 ALERTS
def generate_alerts(data, decision):

    alerts = []

    if data["rain_probability"] > 70:
        alerts.append("🌧 Heavy rain expected → Irrigation stopped")

    if decision["water_liters"] > 400:
        alerts.append("💧 High water usage → Risk of over-irrigation")

    if data["temperature"] > 35:
        alerts.append("🔥 High temperature → Increase monitoring")

    return alerts


# 🌾 UPDATED RECOMMENDATION (PERSONALIZED)
@app.post("/recommend")
def recommend(data: dict):

    farmer_name = data.get("name", "Farmer")
    location = data.get("location", "Unknown")
    crop = data["crop"]
    soil = data["soil"]

    # 🛰 satellite simulation
    satellite_data = {
        "ndvi": 0.55,
        "crop_health": "moderate",
        "soil_moisture_index": 0.48
    }

    # 🧠 irrigation logic
    decision = irrigation_engine(data)

    # 🚨 alerts
    alerts = generate_alerts(data, decision)

    # 🚫 FORCE DASHBOARD LANGUAGE = ENGLISH ONLY
    prompt = f"""
You are JalAI Dashboard Assistant.

CRITICAL RULES:
- Respond ONLY in English.
- Do NOT use Kannada or any regional language.
- Ignore farmer language preferences.
- This is a DASHBOARD system, not chat assistant.

Farmer Details:
Name: {farmer_name}
Location: {location}

Crop Information:
Crop: {crop}
Soil Type: {soil}

Weather Data:
Temperature: {data['temperature']}
Humidity: {data['humidity']}
Rain Probability: {data['rain_probability']}

Satellite Data:
NDVI: {satellite_data['ndvi']}
Crop Health: {satellite_data['crop_health']}
Soil Moisture Index: {satellite_data['soil_moisture_index']}

Decision:
{decision}

Alerts:
{alerts}

INSTRUCTIONS:
- Give clear irrigation advice
- Use simple farmer-friendly English
- Always explain WHY irrigation is or isn't needed
- Keep response short and structured
"""

    recommendation = get_ai_recommendation(prompt)

    return {
        "decision": decision,
        "alerts": alerts,
        "satellite": satellite_data,
        "recommendation": recommendation
    }


# 💬 CHAT
@app.post("/chat")
def chat(data: dict):

    response = get_ai_recommendation(data["message"])

    return {"response": response}