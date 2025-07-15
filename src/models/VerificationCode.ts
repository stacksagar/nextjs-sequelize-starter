import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import type { VerificationCodeModelRelations } from "../models.types";

class VerificationCode extends Model {
  declare id: string;
  declare userId: string;

  // Relationship properties from VerificationCodeModelRelations
  declare user?: VerificationCodeModelRelations["user"];

  declare code: string;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

VerificationCode.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "VerificationCode",
    indexes: [
      {
        fields: ["userId"],
      },
    ],
  }
);

export default VerificationCode;
