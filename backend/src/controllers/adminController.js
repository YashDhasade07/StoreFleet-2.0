import adminService from '../services/adminService.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: stats
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving dashboard statistics'
    });
  }
};

// Get all users (Admin comprehensive view)
export const getAllUsersAdmin = async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
      email: req.query.email,
      address: req.query.address,
      role: req.query.role,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
      page: req.query.page || 1,
      limit: req.query.limit || 20
    };

    // Validate role filter
    if (filters.role) {
      const validRoles = ['system_admin', 'normal_user', 'store_owner'];
      if (!validRoles.includes(filters.role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role filter. Must be system_admin, normal_user, or store_owner'
        });
      }
    }

    const result = await adminService.getAllUsersAdmin(filters);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Get all users admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving users'
    });
  }
};

// Get all stores (Admin comprehensive view)
export const getAllStoresAdmin = async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
      address: req.query.address,
      ownerName: req.query.ownerName,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
      page: req.query.page || 1,
      limit: req.query.limit || 20
    };

    const result = await adminService.getAllStoresAdmin(filters);

    res.status(200).json({
      success: true,
      message: 'Stores retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Get all stores admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving stores'
    });
  }
};

// Get all ratings (Admin comprehensive view)
export const getAllRatingsAdmin = async (req, res) => {
  try {
    const filters = {
      rating: req.query.rating,
      userName: req.query.userName,
      storeName: req.query.storeName,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
      page: req.query.page || 1,
      limit: req.query.limit || 20
    };

    // Validate rating filter
    if (filters.rating) {
      const ratingValue = parseInt(filters.rating);
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        return res.status(400).json({
          success: false,
          message: 'Invalid rating filter. Must be between 1 and 5'
        });
      }
    }

    const result = await adminService.getAllRatingsAdmin(filters);

    res.status(200).json({
      success: true,
      message: 'Ratings retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Get all ratings admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving ratings'
    });
  }
};
