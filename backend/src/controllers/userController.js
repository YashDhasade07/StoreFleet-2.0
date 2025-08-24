import userService from '../services/userService.js';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateAddress 
} from '../utils/validation.js';

// Get current user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile'
    });
  }
};

// Update current user password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'New password must be 8-16 characters with at least one uppercase letter and one special character'
      });
    }

    // Call service
    await userService.updatePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Update password error:', error);
    
    if (error.message.includes('not found') || 
        error.message.includes('incorrect') || 
        error.message.includes('different')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during password update'
    });
  }
};

// Get all users with filtering and sorting (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
      email: req.query.email,
      address: req.query.address,
      role: req.query.role,
      sortBy: req.query.sortBy || 'name',
      sortOrder: req.query.sortOrder || 'ASC',
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    
    const result = await userService.getAllUsers(filters);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving users'
    });
  }
};

// Get user by ID (Admin only)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    const user = await userService.getUserById(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error retrieving user'
    });
  }
};

// Create new user (Admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Input validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    if (!validateName(name)) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 20 and 60 characters'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be 8-16 characters with at least one uppercase letter and one special character'
      });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({
        success: false,
        message: 'Address must not exceed 400 characters'
      });
    }

    const validRoles = ['system_admin', 'normal_user', 'store_owner'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be system_admin, normal_user, or store_owner'
      });
    }

    // Call service
    const newUser = await userService.createUser({ name, email, password, address, role });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: newUser }
    });

  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during user creation'
    });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    // Input validation (only validate fields that are being updated)
    if (name && !validateName(name)) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 20 and 60 characters'
      });
    }

    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (address !== undefined && !validateAddress(address)) {
      return res.status(400).json({
        success: false,
        message: 'Address must not exceed 400 characters'
      });
    }

    if (role) {
      const validRoles = ['system_admin', 'normal_user', 'store_owner'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be system_admin, normal_user, or store_owner'
        });
      }
    }

    // Call service
    const updatedUser = await userService.updateUser(parseInt(id), { name, email, address, role });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during user update'
    });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Call service
    await userService.deleteUser(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'Cannot delete the last system administrator') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during user deletion'
    });
  }
};


export const getUserStats = async (req, res) => {
  try {
      const userId = req.user.id; // From JWT token
      console.log('Getting user stats for user:', userId);
      
      const result = await userService.getUserStats(userId);
      
      res.status(200).json({
          success: true,
          message: 'User stats retrieved successfully',
          data: result
      });

  } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
          success: false,
          message: 'Server error retrieving user stats'
      });
  }
};