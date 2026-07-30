const aiService = require('../services/aiService');

exports.chat = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    
    // In a real app, context could be built from req.user data
    const userContext = context || `Role: ${req.user.role}, Name: ${req.user.name}`;
    
    const response = await aiService.chat(message, userContext);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: 'AI processing failed' });
  }
};

exports.generateStudyPlan = async (req, res) => {
  try {
    const { goals } = req.body;
    const userContext = `Branch: ${req.user.branch}, Semester: ${req.user.semester}`;
    
    const plan = await aiService.generateStudyPlan(userContext, goals || 'General preparation');
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate study plan' });
  }
};

exports.predictPerformance = async (req, res) => {
  try {
    // In a real scenario, fetch real data from Attendance/Result schemas
    const studentData = {
      name: req.user.name,
      attendance: 78,
      lastSgpa: 8.2,
      activeTasks: 4
    };
    
    const analysis = await aiService.analyzePerformance(studentData);
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to analyze performance' });
  }
};
