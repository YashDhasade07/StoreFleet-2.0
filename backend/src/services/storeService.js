import { Store, User, Rating, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

class StoreService {
  // Get all stores with ratings
 
  async getAllStores(userId, filters = {}) {
    try {
        console.log('Getting all stores for user:', userId);
        
        const whereCondition = {};
        
        // Add name filter if provided
        if (filters.name) {
            whereCondition.name = {
                [Op.iLike]: `%${filters.name}%`
            };
        }

        const stores = await Store.findAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: filters.limit || 50,
            offset: ((filters.page || 1) - 1) * (filters.limit || 50)
        });

        console.log('Found stores:', stores.length);

        // If userId is provided, fetch user's ratings separately
        let processedStores = stores.map(store => store.toJSON());
        
        if (userId) {
            // Get all user's ratings for these stores
            const storeIds = processedStores.map(store => store.id);
            const userRatings = await Rating.findAll({
                where: {
                    user_id: userId,
                    store_id: storeIds
                },
                attributes: ['id', 'rating', 'store_id', 'created_at', 'updated_at']
            });

            // Create a map of store_id -> rating for quick lookup
            const ratingsMap = {};
            userRatings.forEach(rating => {
                ratingsMap[rating.store_id] = rating;
            });

            // Add user rating info to stores
            processedStores = processedStores.map(store => {
                const userRating = ratingsMap[store.id];
                if (userRating) {
                    store.userRating = userRating.rating;
                    store.userRatingId = userRating.id;
                    store.userRatingDate = userRating.created_at;
                }
                return store;
            });
        }

        // Get total count for pagination
        const totalCount = await Store.count({ where: whereCondition });

        return {
            stores: processedStores,
            pagination: {
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / (filters.limit || 50)),
                currentPage: filters.page || 1,
                itemsPerPage: filters.limit || 50
            }
        };
    } catch (error) {
        console.error('StoreService getAllStores error:', error);
        throw error;
    }
}




  // Search stores by name and address
  async searchStores(userId, searchFilters = {}) {
    const {
      name,
      address,
      sortBy = 'name',
      sortOrder = 'ASC',
      page = 1,
      limit = 10
    } = searchFilters;

    // Build where conditions
    const whereConditions = {};

    if (name) {
      whereConditions.name = { [Op.iLike]: `%${name}%` };
    }

    if (address) {
      whereConditions.address = { [Op.iLike]: `%${address}%` };
    }

    // Validate sort fields
    const allowedSortFields = ['name', 'address', 'created_at'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    // Calculate pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await Store.findAndCountAll({
      where: whereConditions,
      attributes: [
        'id',
        'name', 
        'email',
        'address',
        'created_at',
        // Calculate average rating
        [
          sequelize.literal(`(
            SELECT COALESCE(AVG(rating::numeric), 0)::numeric(3,2)
            FROM ratings 
            WHERE ratings.store_id = "Store".id
          )`),
          'averageRating'
        ],
        // Get current user's rating for this store
        [
          sequelize.literal(`(
            SELECT rating
            FROM ratings 
            WHERE ratings.store_id = "Store".id 
            AND ratings.user_id = ${userId}
          )`),
          'userRating'
        ]
      ],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [[validSortBy, validSortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      stores: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  }

  // Get store by ID with ratings
  async getStoreById(storeId, userId) {
    const store = await Store.findByPk(storeId, {
      attributes: [
        'id',
        'name', 
        'email',
        'address',
        'created_at',
        // Calculate average rating
        [
          sequelize.literal(`(
            SELECT COALESCE(AVG(rating::numeric), 0)::numeric(3,2)
            FROM ratings 
            WHERE ratings.store_id = "Store".id
          )`),
          'averageRating'
        ],
        // Get current user's rating for this store
        [
          sequelize.literal(`(
            SELECT rating
            FROM ratings 
            WHERE ratings.store_id = "Store".id 
            AND ratings.user_id = ${userId}
          )`),
          'userRating'
        ]
      ],
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

    return store;
  }

  // Get store owned by current user (store owner)
  async getMyStore(ownerId) {
    const store = await Store.findAll({
      where: { owner_id: ownerId },
      attributes: [
        'id',
        'name', 
        'email',
        'address',
        'created_at',
        // Calculate average rating
        [
          sequelize.literal(`(
            SELECT COALESCE(AVG(rating::numeric), 0)::numeric(3,2)
            FROM ratings 
            WHERE ratings.store_id = "Store".id
          )`),
          'averageRating'
        ],
        // Get total rating count
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM ratings 
            WHERE ratings.store_id = "Store".id
          )`),
          'totalRatings'
        ]
      ],
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['id', 'rating', 'created_at'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!store) {
      throw new Error('No store found for this owner');
    }

    return store;
  }

  // Create new store (Admin only)
  async createStore(storeData) {
    const { name, email, address, owner_id } = storeData;

    // Check if owner exists and is a store_owner
    const owner = await User.findByPk(owner_id);
    if (!owner) {
      throw new Error('Owner not found');
    }

    if (owner.role !== 'store_owner') {
      throw new Error('Owner must have store_owner role');
    }

    // Check if owner already has a store
    // const existingStore = await Store.findOne({ where: { owner_id } });
    // if (existingStore) {
    //   throw new Error('This owner already has a store');
    // }

    // Check if email is already used
    const existingEmailStore = await Store.findOne({ where: { email } });
    if (existingEmailStore) {
      throw new Error('Store with this email already exists');
    }

    // Create store
    const newStore = await Store.create({
      name,
      email,
      address,
      owner_id
    });

    return newStore;
  }

  // Update store (Admin only)
  async updateStore(storeId, updateData) {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new Error('Store not found');
    }

    const { name, email, address, owner_id } = updateData;

    // If email is being updated, check for duplicates
    if (email && email !== store.email) {
      const existingStore = await Store.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: storeId } 
        } 
      });
      if (existingStore) {
        throw new Error('Store with this email already exists');
      }
    }

    // If owner is being changed, validate new owner
    if (owner_id && owner_id !== store.owner_id) {
      const newOwner = await User.findByPk(owner_id);
      if (!newOwner) {
        throw new Error('New owner not found');
      }

      if (newOwner.role !== 'store_owner') {
        throw new Error('New owner must have store_owner role');
      }

      // Check if new owner already has a store
      const existingOwnerStore = await Store.findOne({ 
        where: { 
          owner_id,
          id: { [Op.ne]: storeId } 
        } 
      });
      if (existingOwnerStore) {
        throw new Error('This owner already has a store');
      }
    }

    // Update store
    await store.update({
      ...(name && { name }),
      ...(email && { email }),
      ...(address !== undefined && { address }),
      ...(owner_id && { owner_id })
    });

    return store;
  }

  // Delete store (Admin only)
  async deleteStore(storeId) {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new Error('Store not found');
    }

    await store.destroy();
    return true;
  }
}

export default new StoreService();
