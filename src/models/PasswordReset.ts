import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import User from "./User";
import type { PasswordResetModelRelations } from "../models.types";

class PasswordReset extends Model {
  declare id: string;
  declare userId: string;

  // Relationship properties from PasswordResetModelRelations
  declare user?: PasswordResetModelRelations["user"];

  declare token: string;
  declare expiresAt: Date;
  declare isUsed: boolean;
}

PasswordReset.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "PasswordReset",
    timestamps: true,
  }
);

PasswordReset.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(PasswordReset, {
  foreignKey: "userId",
  as: "passwordResets",
});

export default PasswordReset;
