import { User, Store, Rating, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

class AdminService {
    // Get dashboard statistics
    async getDashboardStats() {
        try {
            // Get total counts
            const [totalUsers, totalStores, totalRatings] = await Promise.all([
                User.count(),
                Store.count(),
                Rating.count()
            ]);

            // Get user role distribution
            const userRoleStats = await User.findAll({
                attributes: [
                    'role',
                    [sequelize.fn('COUNT', sequelize.col('role')), 'count']
                ],
                group: ['role']
            });

            // Get recent activity (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const [recentUsers, recentStores, recentRatings] = await Promise.all([
                User.count({
                    where: {
                        created_at: {
                            [Op.gte]: sevenDaysAgo
                        }
                    }
                }),
                Store.count({
                    where: {
                        created_at: {
                            [Op.gte]: sevenDaysAgo
                        }
                    }
                }),
                Rating.count({
                    where: {
                        created_at: {
                            [Op.gte]: sevenDaysAgo
                        }
                    }
                })
            ]);

            // Get rating distribution
            const ratingDistribution = await Rating.findAll({
                attributes: [
                    'rating',
                    [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
                ],
                group: ['rating'],
                order: [['rating', 'ASC']]
            });

            // Get top rated stores using RAW SQL (FIXED VERSION)
            const topRatedStores = await sequelize.query(`
        SELECT s.id, s.name, s.address, 
               COALESCE(AVG(r.rating::numeric), 0)::numeric(3,2) AS "averageRating", 
               COUNT(r.id) AS "totalRatings"
        FROM stores s
        INNER JOIN ratings r ON s.id = r.store_id
        GROUP BY s.id, s.name, s.address
        ORDER BY "averageRating" DESC
        LIMIT 5
      `, {
                type: sequelize.QueryTypes.SELECT
            });

            // Get average rating across all stores
            const overallRatingStats = await Rating.findOne({
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                    [sequelize.fn('MIN', sequelize.col('rating')), 'minRating'],
                    [sequelize.fn('MAX', sequelize.col('rating')), 'maxRating']
                ]
            });

            return {
                overview: {
                    totalUsers,
                    totalStores,
                    totalRatings,
                    averageRating: parseFloat(overallRatingStats?.dataValues?.averageRating || 0).toFixed(2)
                },
                userStats: {
                    byRole: userRoleStats.map(role => ({
                        role: role.role,
                        count: parseInt(role.dataValues.count)
                    })),
                    recentSignups: recentUsers
                },
                storeStats: {
                    total: totalStores,
                    recentlyAdded: recentStores,
                    topRated: topRatedStores.map(store => ({
                        id: store.id,
                        name: store.name,
                        address: store.address,
                        averageRating: parseFloat(store.averageRating),
                        totalRatings: parseInt(store.totalRatings)
                    }))
                },
                ratingStats: {
                    total: totalRatings,
                    recentlySubmitted: recentRatings,
                    distribution: ratingDistribution.map(rating => ({
                        rating: rating.rating,
                        count: parseInt(rating.dataValues.count)
                    })),
                    overall: {
                        average: parseFloat(overallRatingStats?.dataValues?.averageRating || 0).toFixed(2),
                        min: parseInt(overallRatingStats?.dataValues?.minRating || 0),
                        max: parseInt(overallRatingStats?.dataValues?.maxRating || 0)
                    }
                }
            };
        } catch (error) {
            throw new Error(`Error fetching dashboard stats: ${error.message}`);
        }
    }

    // Get all users with comprehensive information (Admin view)
    // Get all users with comprehensive information (Admin view)
async getAllUsersAdmin(filters = {}) {
    const {
      name,
      email,
      address,
      role,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 20
    } = filters;
  
    // Build where conditions
    const whereConditions = {};
  
    if (name) {
      whereConditions.name = { [Op.iLike]: `%${name}%` };
    }
  
    if (email) {
      whereConditions.email = { [Op.iLike]: `%${email}%` };
    }
  
    if (address) {
      whereConditions.address = { [Op.iLike]: `%${address}%` };
    }
  
    if (role) {
      whereConditions.role = role;
    }
  
    // Validate sort fields
    const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
  
    // Calculate pagination
    const offset = (page - 1) * limit;
  
    const { count, rows } = await User.findAndCountAll({
      where: whereConditions,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Store,
          as: 'ownedStores',
          attributes: ['id', 'name', 'address', 'email'],
          required: false
        },
        {
          model: Rating,
          as: 'submittedRatings',
          attributes: ['id', 'rating', 'created_at', 'store_id'], // Include store_id here
          include: [
            {
              model: Store,
              as: 'store',
              attributes: ['id', 'name']
            }
          ],
          required: false,
          limit: 5
        }
      ],
      order: [[validSortBy, validSortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  
    // Calculate store ratings separately for users who own stores
    const usersWithStoreRatings = await Promise.all(
      rows.map(async (user) => {
        const userObj = user.toJSON();
        
        if (userObj.ownedStores && userObj.ownedStores.length > 0) {
          // Calculate average rating for each owned store
          for (let store of userObj.ownedStores) {
            const storeRatings = await Rating.findOne({
              where: { store_id: store.id },
              attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('rating')), 'totalRatings']
              ]
            });
            
            store.averageRating = parseFloat(storeRatings?.dataValues?.averageRating || 0).toFixed(2);
            store.totalRatings = parseInt(storeRatings?.dataValues?.totalRatings || 0);
          }
        }
        
        return userObj;
      })
    );
  
    return {
      users: usersWithStoreRatings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  }
  
  



  async getAllStoresAdmin(filters = {}) {
    const {
      name,
      address,
      ownerName,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 20
    } = filters;
  
    // Build where conditions
    const whereConditions = {};
    const ownerWhereConditions = {};
  
    if (name) {
      whereConditions.name = { [Op.iLike]: `%${name}%` };
    }
  
    if (address) {
      whereConditions.address = { [Op.iLike]: `%${address}%` };
    }
  
    if (ownerName) {
      ownerWhereConditions.name = { [Op.iLike]: `%${ownerName}%` };
    }
  
    // Validate sort fields
    const allowedSortFields = ['name', 'address', 'created_at'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
  
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
        'updated_at',
        [
          sequelize.literal(`(
            SELECT COALESCE(AVG(rating::numeric), 0)::numeric(3,2)
            FROM ratings 
            WHERE ratings.store_id = "Store".id
          )`),
          'averageRating'
        ],
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
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'address'],
          where: Object.keys(ownerWhereConditions).length > 0 ? ownerWhereConditions : undefined
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['id', 'rating', 'created_at', 'user_id'], // Added user_id here
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ],
          required: false,
          limit: 10
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
  


    // Get all ratings with comprehensive information (Admin view)
    async getAllRatingsAdmin(filters = {}) {
        const {
            rating,
            userName,
            storeName,
            sortBy = 'created_at',
            sortOrder = 'DESC',
            page = 1,
            limit = 20
        } = filters;

        // Build where conditions
        const whereConditions = {};
        const userWhereConditions = {};
        const storeWhereConditions = {};

        if (rating) {
            whereConditions.rating = parseInt(rating);
        }

        if (userName) {
            userWhereConditions.name = { [Op.iLike]: `%${userName}%` };
        }

        if (storeName) {
            storeWhereConditions.name = { [Op.iLike]: `%${storeName}%` };
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
                    attributes: ['id', 'name', 'email', 'role'],
                    where: Object.keys(userWhereConditions).length > 0 ? userWhereConditions : undefined
                },
                {
                    model: Store,
                    as: 'store',
                    attributes: [
                        'id',
                        'name',
                        'address',
                        [
                            sequelize.literal(`(
                SELECT COALESCE(AVG(rating::numeric), 0)::numeric(3,2)
                FROM ratings 
                WHERE ratings.store_id = store.id
              )`),
                            'averageRating'
                        ]
                    ],
                    include: [
                        {
                            model: User,
                            as: 'owner',
                            attributes: ['id', 'name', 'email']
                        }
                    ],
                    where: Object.keys(storeWhereConditions).length > 0 ? storeWhereConditions : undefined
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
}

export default new AdminService();
