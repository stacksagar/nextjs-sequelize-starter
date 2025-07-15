import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

class Image extends Model {
  declare id: string;
  declare url: string;
  declare properties?: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Image.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    properties: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "Image",
    timestamps: true,
  }
);

export default Image;
