import { Rating, Store, User, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

class RatingService {
  // Submit new rating (Normal users only)
  async submitRating(userId, ratingData) {
    const { store_id, rating } = ratingData;

    // Check if store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      throw new Error('Store not found');
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: {
        user_id: userId,
        store_id: store_id
      }
    });

    if (existingRating) {
      throw new Error('You have already rated this store. Use update to modify your rating.');
    }

    // Create new rating
    const newRating = await Rating.create({
      user_id: userId,
      store_id: store_id,
      rating: rating
    });

    // Return rating with store and user info
    const createdRating = await Rating.findByPk(newRating.id, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return createdRating;
  }

  // Update existing rating (Normal users only)
  async updateRating(userId, ratingId, newRatingValue) {
    // Find the rating
    const rating = await Rating.findByPk(ratingId, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address']
        }
      ]
    });

    if (!rating) {
      throw new Error('Rating not found');
    }

    // Check if the rating belongs to the current user
    if (rating.user_id !== userId) {
      throw new Error('You can only update your own ratings');
    }

    // Update the rating
    await rating.update({ rating: newRatingValue });

    return rating;
  }

  // Delete rating (Normal users only)
  async deleteRating(userId, ratingId) {
    // Find the rating
    const rating = await Rating.findByPk(ratingId);

    if (!rating) {
      throw new Error('Rating not found');
    }

    // Check if the rating belongs to the current user
    if (rating.user_id !== userId) {
      throw new Error('You can only delete your own ratings');
    }

    await rating.destroy();
    return true;
  }

  // Get current user's ratings (Normal users only)
  async getMyRatings(userId, filters = {}) {
    const {
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 10
    } = filters;

    // Validate sort fields
    const allowedSortFields = ['rating', 'created_at', 'updated_at'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Calculate pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await Rating.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: [
            'id', 
            'name', 
            'address',
            // Calculate average rating for the store
            [
              sequelize.literal(`(
                SELECT COALESCE(AVG(rating::numeric), 0)::numeric(3,2)
                FROM ratings 
                WHERE ratings.store_id = store.id
              )`),
              'averageRating'
            ]
          ]
        }
      ],
      order: [[validSortBy, validSortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      ratings: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  }

  // Get ratings for a specific store (Store owners and admins)
  async getStoreRatings(storeId, userId, userRole, filters = {}) {
    // Check if store exists
    const store = await Store.findByPk(storeId, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!store) {
      throw new Error('Store not found');
    }

    // Check permissions - store owner can only see their own store ratings
    if (userRole === 'store_owner' && store.owner_id !== userId) {
      throw new Error('You can only view ratings for your own store');
    }

    const {
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 10
    } = filters;

    // Validate sort fields
    const allowedSortFields = ['rating', 'created_at', 'updated_at'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Calculate pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await Rating.findAndCountAll({
      where: { store_id: storeId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address']
        }
      ],
      order: [[validSortBy, validSortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate store statistics
    const stats = await Rating.findOne({
      where: { store_id: storeId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('rating')), 'totalRatings'],
        [sequelize.fn('MIN', sequelize.col('rating')), 'minRating'],
        [sequelize.fn('MAX', sequelize.col('rating')), 'maxRating']
      ]
    });

    return {
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
        owner: store.owner
      },
      statistics: {
        averageRating: parseFloat(stats?.dataValues?.averageRating || 0).toFixed(2),
        totalRatings: parseInt(stats?.dataValues?.totalRatings || 0),
        minRating: parseInt(stats?.dataValues?.minRating || 0),
        maxRating: parseInt(stats?.dataValues?.maxRating || 0)
      },
      ratings: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  }

  // Get all ratings (Admin only)
  async getAllRatings(filters = {}) {
    const {
      rating,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 10
    } = filters;

    // Build where conditions
    const whereConditions = {};

    if (rating) {
      whereConditions.rating = parseInt(rating);
    }

    // Validate sort fields
    const allowedSortFields = ['rating', 'created_at', 'updated_at'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Calculate pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await Rating.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address'],
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [[validSortBy, validSortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate overall statistics
    const overallStats = await Rating.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('rating')), 'totalRatings'],
        [sequelize.fn('MIN', sequelize.col('rating')), 'minRating'],
        [sequelize.fn('MAX', sequelize.col('rating')), 'maxRating']
      ]
    });

    return {
      statistics: {
        averageRating: parseFloat(overallStats?.dataValues?.averageRating || 0).toFixed(2),
        totalRatings: parseInt(overallStats?.dataValues?.totalRatings || 0),
        minRating: parseInt(overallStats?.dataValues?.minRating || 0),
        maxRating: parseInt(overallStats?.dataValues?.maxRating || 0)
      },
      ratings: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  }
}

export default new RatingService();
