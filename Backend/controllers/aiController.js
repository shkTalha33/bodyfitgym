const axios = require("axios");

const AI_AGENT_URL = process.env.AI_AGENT_URL || "http://localhost:8000";

// --- Diet Plan Controller ---
exports.generateDietPlan = async (req, res, next) => {
  try {
    const { weight, height, goal, activity } = req.body;

    const prompt = `Generate a detailed diet plan for a user with the following details:
    - Weight: ${weight}kg
    - Height: ${height}cm
    - Goal: ${goal}
    - Activity Level: ${activity}
    
    Please provide the response in a clear layout with:
    1. Daily Calorie Target
    2. Macro Split (Protein, Carbs, Fats)
    3. Sample Meals for a day.
    Keep the response concise and accurate.`;

    const response = await axios.post(`${AI_AGENT_URL}/api/agent/gemini`, {
      prompt,
      model: "gemini-1.5-flash"
    });

    res.status(200).json({
      success: true,
      data: response.data.response
    });
  } catch (error) {
    console.error("AI Diet Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate diet plan. Make sure the AI Agent is running on port 8000."
    });
  }
};

// --- Workout Plan Controller ---
exports.generateWorkoutPlan = async (req, res, next) => {
  try {
    const { fitnessType, goalType, equipment, sessionMinutes, days } = req.body;

    const prompt = `Generate a professional workout plan for a user with these details:
    - Experience Level: ${fitnessType}
    - Goal: ${goalType}
    - Available Equipment: ${equipment}
    - Session Time: ${sessionMinutes} minutes
    - Targeted Muscle Groups: ${days.join(", ")}
    
    Provide the response in Markdown format with exercises, sets, and reps.`;

    const response = await axios.post(`${AI_AGENT_URL}/api/agent/gemini`, {
      prompt,
      model: "gemini-1.5-flash"
    });

    res.status(200).json({
      success: true,
      data: response.data.response
    });
  } catch (error) {
    console.error("AI Workout Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate workout plan."
    });
  }
};

// --- AI Coach Controller (Chat) ---
exports.aiCoach = async (req, res, next) => {
  try {
    const { messages } = req.body;

    // Use Groq for faster chat response
    const response = await axios.post(`${AI_AGENT_URL}/api/agent/groq`, {
      messages,
      model: "llama-3.1-8b-instant"
    });

    res.status(200).json({
      success: true,
      data: response.data.response
    });
  } catch (error) {
    console.error("AI Coach Error:", error.message);
    res.status(500).json({
      success: false,
      message: "AI Coach is currently unavailable."
    });
  }
};
