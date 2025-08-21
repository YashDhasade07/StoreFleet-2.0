import { DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: [20, 60]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('system_admin', 'normal_user', 'store_owner'),
      allowNull: false,
      defaultValue: 'normal_user'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['email'] },
      { fields: ['role'] },
      { fields: ['name'] }
    ]
  });

  return User;
};

export default UserModel;
