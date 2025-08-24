import ratingService from '../services/ratingService.js';

// Submit new rating (Normal users only)
export const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!store_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Store ID and rating are required'
      });
    }

    if (isNaN(store_id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid store ID is required'
      });
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5'
      });
    }

    // Call service
    const newRating = await ratingService.submitRating(userId, {
      store_id: parseInt(store_id),
      rating: parseInt(rating)
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: { rating: newRating }
    });

  } catch (error) {
    console.error('Submit rating error:', error);
    
    if (error.message === 'Store not found' || 
        error.message.includes('already rated')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during rating submission'
    });
  }
};

// Update existing rating (Normal users only)
export const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid rating ID is required'
      });
    }

    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5'
      });
    }

    // Call service
    const updatedRating = await ratingService.updateRating(
      userId, 
      parseInt(id), 
      parseInt(rating)
    );

    res.status(200).json({
      success: true,
      message: 'Rating updated successfully',
      data: { rating: updatedRating }
    });

  } catch (error) {
    console.error('Update rating error:', error);
    
    if (error.message === 'Rating not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('only update your own')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during rating update'
    });
  }
};

// Delete rating (Normal users only)
export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Input validation
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid rating ID is required'
      });
    }

    // Call service
    await ratingService.deleteRating(userId, parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Rating deleted successfully'
    });

  } catch (error) {
    console.error('Delete rating error:', error);
    
    if (error.message === 'Rating not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('only delete your own')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during rating deletion'
    });
  }
};

// Get current user's ratings (Normal users only)
export const getMyRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = {
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    const result = await ratingService.getMyRatings(userId, filters);

    res.status(200).json({
      success: true,
      message: 'Your ratings retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Get my ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving your ratings'
    });
  }
};

// Get ratings for a specific store 
export const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Input validation
    if (!storeId || isNaN(storeId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid store ID is required'
      });
    }

    const filters = {
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    const result = await ratingService.getStoreRatings(
      parseInt(storeId), 
      userId, 
      userRole, 
      filters
    );

    res.status(200).json({
      success: true,
      message: 'Store ratings retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Get store ratings error:', error);
    
    if (error.message === 'Store not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('only view ratings for your own')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error retrieving store ratings'
    });
  }
};

// Get all ratings (Admin only)
export const getAllRatings = async (req, res) => {
  try {
    const filters = {
      rating: req.query.rating,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    const result = await ratingService.getAllRatings(filters);

    res.status(200).json({
      success: true,
      message: 'All ratings retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Get all ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving all ratings'
    });
  }
};
