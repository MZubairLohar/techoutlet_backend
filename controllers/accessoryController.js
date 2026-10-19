import Accessory from '../models/Accessory.js';

// @desc    Get all accessories
// @route   GET /api/v1/getAccessories
// @access  Public
export const getAccessories = async (req, res, next) => {
  try {
    const accessories = await Accessory.find();
    res.status(200).json({
      success: true,
      count: accessories.length,
      data: accessories,
      message: accessories,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a new accessory
// @route   POST /api/v1/accessories
// @access  Public
export const createAccessory = async (req, res, next) => {
  try {
    const {
      name, category, brand, compatibleModels, condition,
      price, discountPrice, stock, description, warrantyDays,
      isAvailable, isFeatured
    } = req.body;

    const uploadedFiles = [
      ...(req.files?.image || []),
      ...(req.files?.images || []),
    ];
    const images = uploadedFiles.map((file) => file.path);

    if (!name || !category || price === undefined || price === '') {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }

    let parsedModels = [];
    if (compatibleModels) {
      try {
        parsedModels = typeof compatibleModels === 'string'
          ? JSON.parse(compatibleModels)
          : compatibleModels;
      } catch {
        return res.status(400).json({ success: false, message: 'Compatible models must be a valid JSON array' });
      }
      if (!Array.isArray(parsedModels)) {
        return res.status(400).json({ success: false, message: 'Compatible models must be a valid JSON array' });
      }
    }

    const accessory = await Accessory.create({
      name,
      category,
      brand,
      compatibleModels: parsedModels,
      condition,
      price,
      discountPrice,
      stock,
      description,
      images,
      warrantyDays,
      isAvailable,
      isFeatured,
    });

    res.status(201).json({
      success: true,
      data: accessory,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update accessory
// @route   PUT /api/v1/accessories/:id
// @access  Public
export const updateAccessory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {};
    for (const field of [
      'name', 'category', 'brand', 'compatibleModels', 'condition', 'price',
      'discountPrice', 'stock', 'description', 'warrantyDays', 'isAvailable', 'isFeatured',
    ]) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }

    const uploadedFiles = [
      ...(req.files?.image || []),
      ...(req.files?.images || []),
    ];
    if (uploadedFiles.length > 0) {
      updateData.images = uploadedFiles.map((file) => file.path);
    }

    if (updateData.compatibleModels && typeof updateData.compatibleModels === 'string') {
      try {
        updateData.compatibleModels = JSON.parse(updateData.compatibleModels);
      } catch {
        return res.status(400).json({ success: false, message: 'Compatible models must be a valid JSON array' });
      }
      if (!Array.isArray(updateData.compatibleModels)) {
        return res.status(400).json({ success: false, message: 'Compatible models must be a valid JSON array' });
      }
    }

    const accessory = await Accessory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!accessory) {
      return res.status(404).json({ success: false, message: 'Accessory not found' });
    }

    res.status(200).json({
      success: true,
      data: accessory,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete accessory
// @route   DELETE /api/v1/deleteAccessory/:id
// @access  Public
export const deleteAccessory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const accessory = await Accessory.findById(id);

    if (!accessory) {
      return res.status(404).json({ success: false, message: 'Accessory not found' });
    }

    await Accessory.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Accessory deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};
