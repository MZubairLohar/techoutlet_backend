import Accessory from '../models/Accessory.js';
import Service from '../models/Service.js';
import Mobile from '../models/Mobile.js';
import Blog from '../models/Blog.js';
import Contact from '../models/Contact.js';
import Appointment from '../models/Appointment.js';
import Order from '../models/Order.js';

// @desc    Get dashboard data
// @route   GET /api/v1/getDashboardData
// @access  Public
export const getDashboardData = async (req, res, next) => {
  try {
    const [
      accessoriesCount,
      servicesCount,
      brandsCount,
      blogsCount,
      contactsCount,
      appointmentsCount,
      ordersCount,
      pendingAppointments,
      recentOrders,
    ] = await Promise.all([
      Accessory.countDocuments(),
      Service.countDocuments(),
      Mobile.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Appointment.countDocuments(),
      Order.countDocuments(),
      Appointment.find({ status: 'pending' }).limit(5).sort({ createdAt: -1 }),
      Order.find().limit(5).sort({ createdAt: -1 }),
    ]);

    // Calculate total models
    const brands = await Mobile.find();
    const totalModels = brands.reduce((sum, brand) => sum + brand.models.length, 0);

    res.status(200).json({
      success: true,
      data: {
        totalAccessoriesOrders: ordersCount,
        totalAccessories: accessoriesCount,
        totalAppointments: appointmentsCount,
        totalNotifications: contactsCount,
        counts: {
          accessories: accessoriesCount,
          services: servicesCount,
          brands: brandsCount,
          models: totalModels,
          blogs: blogsCount,
          contacts: contactsCount,
          appointments: appointmentsCount,
          orders: ordersCount,
        },
        recentActivity: {
          pendingAppointments,
          recentOrders,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};
