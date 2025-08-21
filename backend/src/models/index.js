import { Sequelize } from 'sequelize';
import UserModel from './User.js';
import StoreModel from './Store.js';
import RatingModel from './Rating.js';

// Database connection
const sequelize = new Sequelize(
    process.env.DB_NAME || 'storefleet',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'root',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false
    }
  );

// Initialize models
const User = UserModel(sequelize);
const Store = StoreModel(sequelize);
const Rating = RatingModel(sequelize);

// Define associations
User.hasMany(Store, { 
  foreignKey: 'owner_id', 
  as: 'ownedStores' 
});
User.hasMany(Rating, { 
  foreignKey: 'user_id', 
  as: 'submittedRatings' 
});

Store.belongsTo(User, { 
  foreignKey: 'owner_id', 
  as: 'owner' 
});
Store.hasMany(Rating, { 
  foreignKey: 'store_id', 
  as: 'ratings' 
});

Rating.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});
Rating.belongsTo(Store, { 
  foreignKey: 'store_id', 
  as: 'store' 
});

export { sequelize, User, Store, Rating };
