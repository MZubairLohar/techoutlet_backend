import Service from '../models/Service.js';

// @desc    Get all services
// @route   GET /api/v1/getAllServices
// @access  Public
export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
      message: services,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a new service
// @route   POST /api/v1/services
// @access  Public
export const createService = async (req, res, next) => {
  try {
    const { ServiceName, Description, price, icon } = req.body;

    if (!ServiceName) {
      return res.status(400).json({ success: false, message: 'Service name is required' });
    }

    const service = await Service.create({
      ServiceName,
      Description,
      price,
      icon: icon || '🔧',
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update a service
// @route   PUT /api/v1/services/:id
// @access  Public
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ServiceName, Description, price, icon } = req.body;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (ServiceName !== undefined) service.ServiceName = ServiceName;
    if (Description !== undefined) service.Description = Description;
    if (price !== undefined) service.price = price;
    if (icon !== undefined) service.icon = icon;

    await service.save();

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete a service
// @route   DELETE /api/v1/deleteService/:id
// @access  Public
export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await Service.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};
