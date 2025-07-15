import ChatGroup from "@/models/ChatGroup";
import sequelize from "./sequelize";
import Order from "@/models/Order";
import MerchantWithdraw from "@/models/MerchantWithdraw";
import RedemptionRequest from "@/models/RedemptionRequest";
import DeliveryPersonnel from "@/models/DeliveryPersonnel";

// import Setting from "@/models/Settings";
// import User from "@/models/User";
// import Deal from "@/models/Deal";
// import MerchantProfile from "@/models/MerchantProfile";
// import DealCategory from "@/models/DealCategory";
// import Cart from "@/models/Cart";
// import Order from "@/models/Order";
// import Transaction from "@/models/Transaction";
// import Card from "@/models/Card";
// import Bank from "@/models/Bank";
// import Group from "@/models/Group";
// import GroupMember from "@/models/GroupMember";
// import Notification from "@/models/Notification";
// import GroupInvitation from "@/models/GroupInvitation";
// import ChatMessage from "@/models/ChatMessage";
// import ChatGroup from "@/models/ChatGroup";
// import ChatGroupMember from "@/models/ChatGroupMember";
// import Review from "@/models/Review";
// import TestPayment from "@/models/TestPayment";

// User;
// Deal;
// MerchantProfile;
// DealCategory;
// Cart;
// Order;
// Transaction;
// Card;
// Bank;
// Group;
// GroupMember;
// GroupInvitation;
// Notification;
// ChatMessage;
// ChatGroup;
// ChatGroupMember;
// Review;
// TestPayment;
// Setting;
// Review;

// ChatGroup;
// Order;
// MerchantWithdraw;
// RedemptionRequest;
// DeliveryPersonnel

export default async function connectDB() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Only sync in development environment
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync();
      console.log("Database synchronized successfully.");
    }
  } catch (error: any) {
    console.error("Unable to connect to the database:", error?.message);
    throw error;
  }
}
