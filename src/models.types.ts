import User from "./models/User";

import Notification from "./models/Notification";
import VerificationCode from "./models/VerificationCode";
import PasswordReset from "./models/PasswordReset";

import Image from "./models/Image";

export type UserModelRelations = {
  notifications?: Notification[];
  verificationOTPs?: VerificationCode[];
  passwordResets?: PasswordReset[];
  images?: Image[];
};

export type NotificationModelRelations = {
  user?: User;
};

export type VerificationCodeModelRelations = {
  user?: User;
};

export type PasswordResetModelRelations = {
  user?: User;
};
