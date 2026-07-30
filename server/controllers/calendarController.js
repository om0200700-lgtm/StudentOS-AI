const AcademicCalendar = require('../models/AcademicCalendar');

exports.getEvents = async (req, res) => {
  try {
    const events = await AcademicCalendar.find().sort({ startDate: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await AcademicCalendar.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await AcademicCalendar.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
