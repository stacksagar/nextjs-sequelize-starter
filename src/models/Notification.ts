import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import User from "./User";
import type { NotificationModelRelations } from "../models.types";

class Notification extends Model {
  declare id: string;
  declare userId: string;

  // Relationship properties from NotificationModelRelations
  declare user?: NotificationModelRelations["user"];
  declare relatedUser?: NotificationModelRelations["relatedUser"];
  declare deal?: NotificationModelRelations["deal"];
  declare group?: NotificationModelRelations["group"];
  declare order?: NotificationModelRelations["order"];

  declare type: "system" | "deal" | "order" | "refund" | "complaint";
  declare title: string;
  declare message: string;
  declare read: boolean;
  declare url: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    type: {
      type: DataTypes.ENUM("system", "deal", "order", "refund", "complaint"),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    timestamps: true,
  }
);

User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Notification;
