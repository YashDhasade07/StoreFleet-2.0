import bcrypt from 'bcryptjs';
import { User, Store, Rating } from '../models/index.js';
import { Op } from 'sequelize';

class UserService {
  // Get user profile by ID
  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Store,
          as: 'ownedStores',
          attributes: ['id', 'name', 'email', 'address'],
          required: false
        }
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Get all users with filtering and sorting (Admin only)
  async getAllUsers(filters = {}) {
    const {
      name,
      email,
      address,
      role,
      sortBy = 'name',
      sortOrder = 'ASC',
      page = 1,
      limit = 10
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
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    // Calculate pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
        where: whereConditions,
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Store,
            as: 'ownedStores',
            attributes: ['id', 'name', 'email', 'address'], 
            required: false
          }
        ],
        order: [[validSortBy, validSortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    return {
      users: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  }

  // Create new user (Admin only)
  async createUser(userData) {
    const { name, email, password, address, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    return userWithoutPassword;
  }

  // Update user (Admin only)
  async updateUser(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { name, email, address, role } = updateData;

    // If email is being updated, check for duplicates
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: userId } 
        } 
      });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    // Update user
    await user.update({
      ...(name && { name }),
      ...(email && { email }),
      ...(address !== undefined && { address }),
      ...(role && { role })
    });

    // Return updated user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  // Delete user (Admin only)
  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Prevent admin from deleting themselves
    if (user.role === 'system_admin') {
      const adminCount = await User.count({ where: { role: 'system_admin' } });
      if (adminCount <= 1) {
        throw new Error('Cannot delete the last system administrator');
      }
    }

    await user.destroy();
    return true;
  }

  // Update password
  async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Check if new password is different
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error('New password must be different from current password');
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await user.update({ password: hashedNewPassword });
    return true;
  }


  async getUserStats(userId) {
    try {
        // Get user's rating statistics
        const userRatings = await Rating.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'name']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Calculate user statistics
        const totalRatings = userRatings.length;
        const totalStoresRated = new Set(userRatings.map(r => r.store_id)).size;
        const ratingsWithMessage = userRatings.filter(r => r.message && r.message.trim()).length;

        // Calculate average rating given by user
        const averageRatingGiven = totalRatings > 0 
            ? (userRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
            : '0.0';

        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRatings = await Rating.count({
            where: {
                user_id: userId,
                created_at: {
                    [Op.gte]: thirtyDaysAgo
                }
            }
        });

        // Get favorite stores (5-star ratings)
        const favoriteStores = await Rating.findAll({
            where: {
                user_id: userId,
                rating: 5
            },
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'name', 'address']
                }
            ],
            limit: 5,
            order: [['created_at', 'DESC']]
        });

        // Get latest ratings
        const latestRatings = userRatings.slice(0, 5);

        return {
            totalRatings,
            totalStoresRated,
            ratingsWithMessage,
            averageRatingGiven,
            recentActivity: {
                ratingsThisMonth: recentRatings
            },
            favoriteStores: favoriteStores.map(r => r.store),
            latestRatings
        };
    } catch (error) {
        console.error('UserService getUserStats error:', error);
        throw error;
    }
}
}

export default new UserService();
