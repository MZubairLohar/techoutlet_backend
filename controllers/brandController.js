import Mobile from '../models/Mobile.js';

// @desc    Create a new brand
// @route   POST /api/v1/create
// @access  Public
export const createBrand = async (req, res, next) => {
  try {
    const { brand } = req.body;

    if (!brand) {
      return res.status(400).json({ success: false, message: 'Brand name is required' });
    }

    const brandExists = await Mobile.findOne({ brand: brand.toLowerCase() });

    if (brandExists) {
      return res.status(409).json({ success: false, message: 'Brand already exists' });
    }

    let models = [];
    if (req.body.models) {
      if (typeof req.body.models === 'string') {
        try {
          models = JSON.parse(req.body.models);
        } catch {
          return res.status(400).json({ success: false, message: 'Models must be a valid JSON array' });
        }
      } else {
        models = req.body.models;
      }
      if (!Array.isArray(models)) {
        return res.status(400).json({ success: false, message: 'Models must be a valid JSON array' });
      }
    }

    const images = req.files?.images || [];
    if (models.length !== images.length) {
      return res.status(400).json({ success: false, message: 'Each model must have an image' });
    }

    const newBrand = await Mobile.create({
      brand: brand.toLowerCase(),
      models: models.map((model, index) => ({
        name: model.name,
        image: images[index].path,
        isAvailable: true,
      })),
    });

    res.status(201).json({
      success: true,
      data: newBrand,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Mobile.find();
    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
      message: brands,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get models by brand
// @route   GET /api/v1/models/:brand
// @access  Public
export const getModelsByBrand = async (req, res, next) => {
  try {
    const { brand } = req.params;
    const brandData = await Mobile.findOne({ brand: brand.toLowerCase() });

    if (!brandData) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    res.status(200).json({
      success: true,
      data: brandData,
      message: brandData.models,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Add model to brand
// @route   POST /api/v1/add-model/:brand
// @access  Public
export const addModelToBrand = async (req, res, next) => {
  try {
    const { brand } = req.params;
    const { modelName } = req.body;
    const image = req.file ? req.file.path : null;

    if (!modelName) {
      return res.status(400).json({ success: false, message: 'Model name is required' });
    }

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const brandData = await Mobile.findOne({ brand: brand.toLowerCase() });

    if (!brandData) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    // Check if model already exists
    const modelExists = brandData.models.some(
      (model) => model.name.toLowerCase() === modelName.toLowerCase()
    );

    if (modelExists) {
      return res.status(409).json({ success: false, message: 'Model already exists for this brand' });
    }

    brandData.models.push({
      name: modelName.toLowerCase(),
      image: image,
      isAvailable: true,
    });

    await brandData.save();

    res.status(201).json({
      success: true,
      data: brandData,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete brand or model
// @route   DELETE /api/v1/delete/:brand/:modelName
// @access  Public
export const deleteBrandOrModel = async (req, res, next) => {
  try {
    const { brand, modelName } = req.params;

    const brandData = await Mobile.findOne({ brand: brand.toLowerCase() });

    if (!brandData) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    if (modelName && modelName !== 'undefined') {
      // Delete specific model
      brandData.models = brandData.models.filter(
        (model) => model.name.toLowerCase() !== modelName.toLowerCase()
      );
      await brandData.save();
      
      res.status(200).json({
        success: true,
        message: 'Model deleted successfully',
        data: brandData,
      });
    } else {
      // Delete entire brand
      await Mobile.findByIdAndDelete(brandData._id);
      
      res.status(200).json({
        success: true,
        message: 'Brand deleted successfully',
      });
    }
  } catch (error) {
    return next(error);
  }
};

// @desc    Update model availability
// @route   PATCH /api/v1/models/:brand/:modelName
// @access  Public
export const updateModelAvailability = async (req, res, next) => {
  try {
    const { brand, modelName } = req.params;
    const { isAvailable } = req.body;

    const brandData = await Mobile.findOne({ brand: brand.toLowerCase() });

    if (!brandData) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    const model = brandData.models.find(
      (m) => m.name.toLowerCase() === modelName.toLowerCase()
    );

    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }

    model.isAvailable = isAvailable !== undefined ? isAvailable : !model.isAvailable;
    await brandData.save();

    res.status(200).json({
      success: true,
      data: brandData,
    });
  } catch (error) {
    return next(error);
  }
};

export const editModel = async (req, res, next) => {
  try {
    const { brand, modelName } = req.params;
    const { newModelName } = req.body;
    const brandData = await Mobile.findOne({ brand: brand.toLowerCase() });

    if (!brandData) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    const model = brandData.models.find(
      (item) => item.name.toLowerCase() === modelName.toLowerCase()
    );
    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }

    if (newModelName && newModelName.trim().toLowerCase() !== model.name.toLowerCase()) {
      const duplicate = brandData.models.some(
        (item) => item._id.toString() !== model._id.toString()
          && item.name.toLowerCase() === newModelName.trim().toLowerCase()
      );
      if (duplicate) {
        return res.status(409).json({ success: false, message: 'Model already exists for this brand' });
      }
      model.name = newModelName.trim();
    }
    if (req.file) model.image = req.file.path;

    await brandData.save();
    return res.status(200).json({
      success: true,
      data: brandData,
      message: brandData.models,
    });
  } catch (error) {
    return next(error);
  }
};
