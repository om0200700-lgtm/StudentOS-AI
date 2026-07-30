const { GoogleGenerativeAI } = require('@google/generative-ai');

// Use the API key from environment, or a dummy for local testing if not available
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
// Use gemini-1.5-flash for general fast text responses
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

exports.chat = async (message, context = '') => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return "Hello! I am the StudentOS AI Assistant. (API Key not configured, running in demo mode). How can I help you today?";
    }
    const prompt = `You are the StudentOS AI Academic Assistant. Your goal is to help students, faculty, and admins navigate the college system, understand attendance, marks, and GPA. Keep your answers concise, helpful, and professional.\n\nContext:\n${context}\n\nUser: ${message}\nAssistant:`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('AI Chat Error:', error);
    throw new Error('Failed to communicate with AI service');
  }
};

exports.generateStudyPlan = async (userContext, goals) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        plan: "Monday: Revise OS\nTuesday: Practice DSA\nWednesday: Database Lab",
        tips: ["Take regular breaks", "Stay hydrated"]
      };
    }
    const prompt = `Generate a personalized weekly study schedule and preparation tips based on the following context and goals.\nContext: ${userContext}\nGoals: ${goals}\nFormat the output in JSON with { "plan": "detailed string", "tips": ["array of tips"] }.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Simple JSON extraction assuming the model returns JSON block
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { plan: text, tips: [] };
  } catch (error) {
    console.error('AI Study Plan Error:', error);
    throw new Error('Failed to generate study plan');
  }
};

exports.analyzePerformance = async (studentData) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return "Based on your current trajectory, you are on track. Maintain above 85% attendance to ensure eligibility.";
    }
    const prompt = `Analyze the following student performance data and provide a concise, encouraging prediction and improvement plan. Data: ${JSON.stringify(studentData)}\nAnalysis:`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('AI Performance Analysis Error:', error);
    throw new Error('Failed to analyze performance');
  }
};
