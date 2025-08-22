import storeService from '../services/storeService.js';
import { 
  validateEmail, 
  validateAddress 
} from '../utils/validation.js';

// Get all stores
export const getAllStores = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = {
      sortBy: req.query.sortBy || 'name',
      sortOrder: req.query.sortOrder || 'ASC',
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    const result = await storeService.getAllStores(userId, filters);

    res.status(200).json({
      success: true,
      message: 'Stores retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving stores'
    });
  }
};

// Search stores by name and address
export const searchStores = async (req, res) => {
  try {
    const userId = req.user.id;
    const searchFilters = {
      name: req.query.name,
      address: req.query.address,
      sortBy: req.query.sortBy || 'name',
      sortOrder: req.query.sortOrder || 'ASC',
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    const result = await storeService.searchStores(userId, searchFilters);

    res.status(200).json({
      success: true,
      message: 'Store search completed successfully',
      data: result
    });

  } catch (error) {
    console.error('Search stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during store search'
    });
  }
};

// Get store by ID
export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid store ID is required'
      });
    }

    const store = await storeService.getStoreById(parseInt(id), userId);

    res.status(200).json({
      success: true,
      message: 'Store retrieved successfully',
      data: { store }
    });

  } catch (error) {
    console.error('Get store by ID error:', error);
    
    if (error.message === 'Store not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error retrieving store'
    });
  }
};

// Get store owned by current user (store owner only)
export const getMyStore = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    const store = await storeService.getMyStore(ownerId);

    res.status(200).json({
      success: true,
      message: 'Your store retrieved successfully',
      data: { store }
    });

  } catch (error) {
    console.error('Get my store error:', error);
    
    if (error.message === 'No store found for this owner') {
      return res.status(404).json({
        success: false,
        message: 'You do not have a store assigned to you'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error retrieving your store'
    });
  }
};

// Create new store (Admin only)
export const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    // Input validation
    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, address, and owner ID are required'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({
        success: false,
        message: 'Address must not exceed 400 characters'
      });
    }

    if (isNaN(owner_id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid owner ID is required'
      });
    }

    // Call service
    const newStore = await storeService.createStore({ 
      name, 
      email, 
      address, 
      owner_id: parseInt(owner_id) 
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: { store: newStore }
    });

  } catch (error) {
    console.error('Create store error:', error);
    
    if (error.message.includes('not found') || 
        error.message.includes('already') || 
        error.message.includes('role')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during store creation'
    });
  }
};

// Update store (Admin only)
export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, owner_id } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid store ID is required'
      });
    }

    // Input validation (only validate fields that are being updated)
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

    if (owner_id && isNaN(owner_id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid owner ID is required'
      });
    }

    // Call service
    const updatedStore = await storeService.updateStore(parseInt(id), { 
      name, 
      email, 
      address, 
      owner_id: owner_id ? parseInt(owner_id) : undefined 
    });

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      data: { store: updatedStore }
    });

  } catch (error) {
    console.error('Update store error:', error);
    
    if (error.message === 'Store not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('already') || 
        error.message.includes('role') || 
        error.message.includes('not found')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during store update'
    });
  }
};

// Delete store (Admin only)
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid store ID is required'
      });
    }

    // Call service
    await storeService.deleteStore(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Store deleted successfully'
    });

  } catch (error) {
    console.error('Delete store error:', error);
    
    if (error.message === 'Store not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during store deletion'
    });
  }
};
