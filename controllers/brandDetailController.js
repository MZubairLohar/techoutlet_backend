import BrandDetail from '../models/BrandDetail.js';

// @desc    Get all brand details
// @route   GET /api/v1/getBrandDetails
// @access  Public
export const getBrandDetails = async (req, res, next) => {
  try {
    const brandDetails = await BrandDetail.find();
    res.status(200).json({
      success: true,
      count: brandDetails.length,
      data: brandDetails,
      message: brandDetails,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Create brand detail
// @route   POST /api/v1/brandDetail
// @access  Public
export const createBrandDetail = async (req, res, next) => {
  try {
    const { brand, description } = req.body;
    const image = req.file ? req.file.path : null;

    if (!brand || !description || !image) {
      return res.status(400).json({ success: false, message: 'Brand, description, and image are required' });
    }

    const brandDetail = await BrandDetail.create({
      brand,
      image,
      description,
    });

    res.status(201).json({
      success: true,
      data: brandDetail,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update brand detail
// @route   PUT /api/v1/editBrandDetail/:id
// @access  Public
export const updateBrandDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { brand, description } = req.body;
    const image = req.file ? req.file.path : null;

    const brandDetail = await BrandDetail.findById(id);

    if (!brandDetail) {
      return res.status(404).json({ success: false, message: 'Brand detail not found' });
    }

    brandDetail.brand = brand || brandDetail.brand;
    brandDetail.description = description || brandDetail.description;
    if (image) brandDetail.image = image;

    await brandDetail.save();

    res.status(200).json({
      success: true,
      data: brandDetail,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete brand detail
// @route   DELETE /api/v1/deleteBrandDetail/:id
// @access  Public
export const deleteBrandDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const brandDetail = await BrandDetail.findById(id);

    if (!brandDetail) {
      return res.status(404).json({ success: false, message: 'Brand detail not found' });
    }

    await BrandDetail.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Brand detail deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};
