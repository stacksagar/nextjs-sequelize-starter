import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

class Setting extends Model {
  declare id: string;
  declare siteName: string;
  declare siteDescription: string;
  declare contactEmail: string;
  declare contactPhone: string;
  declare address: string;
  declare logoUrl: string;
  declare faviconUrl: string;
  declare serviceCharge: number;
  declare commissionRate: number;
  declare totalCharge: number;
  declare socialLinks: object; // JSON object for social links

  declare options: {
    enableMerchant?: boolean;
    autoApprove?: boolean;
  };

  declare createdAt: Date;
  declare updatedAt: Date;
}

Setting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    siteName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    siteDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    faviconUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    socialLinks: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    options: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    serviceCharge: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0,
    },
    commissionRate: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0,
    },
    totalCharge: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0.0,
    },
  },
  {
    sequelize,
    modelName: "Settings",
  }
);

export default Setting;
