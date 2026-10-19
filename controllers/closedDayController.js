import ClosedDay from '../models/ClosedDay.js';

// @desc    Get all closed days
// @route   GET /api/v1/getClosedDays
// @access  Public
export const getClosedDays = async (req, res, next) => {
  try {
    const closedDays = await ClosedDay.find().sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: closedDays.length,
      data: closedDays,
      message: closedDays,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Add closed day
// @route   POST /api/v1/closeDay
// @access  Public
export const addClosedDay = async (req, res, next) => {
  try {
    const { date, reason } = req.body;

    if (!date || !reason) {
      return res.status(400).json({ success: false, message: 'Date and reason are required' });
    }

    const closedDay = await ClosedDay.create({
      date,
      reason,
    });

    res.status(201).json({
      success: true,
      data: closedDay,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete closed day
// @route   DELETE /api/v1/closeDay/:id
// @access  Public
export const deleteClosedDay = async (req, res, next) => {
  try {
    const { id } = req.params;

    const closedDay = await ClosedDay.findById(id);

    if (!closedDay) {
      return res.status(404).json({ success: false, message: 'Closed day not found' });
    }

    await ClosedDay.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Closed day deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};
