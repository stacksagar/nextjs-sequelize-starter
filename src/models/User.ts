import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import bcrypt from "bcryptjs";
import VerificationCode from "./VerificationCode";

export enum UserRole {
  USER = "user",
  MERCHANT = "merchant",
  ADMIN = "admin",
}

class User extends Model {
  // Relationship properties from UserModelRelations

  declare id: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;
  declare name: string;
  declare phoneNumber: string;
  declare picture: string;
  declare isVerified: boolean;
  declare merchantVerified: boolean;
  declare lastLogin: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare merchantRole?: string;
  declare country?: string;
  declare timezone?: string;
  declare bio?: string;
  declare pushNotification: boolean;
  declare emailNotification: boolean;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.USER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    merchantRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    merchantVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    pushNotification: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    emailNotification: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

User.hasMany(VerificationCode, {
  foreignKey: "userId",
  as: "verificationOTPs",
});

VerificationCode.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default User;
