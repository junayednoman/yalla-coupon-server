import { AppError } from "../../classes/appError";
import Auth from "./auth.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import generateOTP from "../../utils/generateOTP";
import isUserExist from "../../utils/isUserExist";
import fs from "fs";
import path from "path";
import mongoose, { startSession } from "mongoose";
import generateRandomString from "../../utils/generateRandomString";
import axios from "axios";
import { userRoles } from "../../constants/global.constant";
import Editor from "../editor/editor.model";
import { TModeratorSignUp } from "./auth.validation";
import Viewer from "../viewer/viewer.model";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { firebaseAdmin } from "../../utils/notification";

const createModerator = async (payload: TModeratorSignUp) => {
  const auth = await Auth.findOne({
    email: payload.email,
    isAccountVerified: true,
  });
  if (auth) throw new AppError(400, "Editor already exists!");

  const session = await startSession();
  session.startTransaction();

  try {
    let moderator = null;
    if (payload.role === userRoles.editor) {
      moderator = await Editor.findOneAndUpdate(
        { email: payload.email },
        payload,
        { upsert: true, new: true, session }
      );
    } else if (payload.role === userRoles.viewer) {
      moderator = await Viewer.findOneAndUpdate(
        { email: payload.email },
        payload,
        { upsert: true, new: true, session }
      );
    }

    const password = generateRandomString();
    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.salt_rounds)
    );

    // Prepare auth data
    const authData = {
      email: payload.email,
      password: hashedPassword,
      user: moderator?._id,
      role: payload.role,
      isAccountVerified: true,
    };

    await Auth.findOneAndUpdate({ email: payload.email }, authData, {
      upsert: true,
      session,
    });

    if (moderator) {
      // Send OTP
      const emailTemplatePath = "./src/app/emailTemplates/sharePassword.html";
      const subject = `Your Password - Yalla Coupon`;
      const year = new Date().getFullYear().toString();
      fs.readFile(emailTemplatePath, "utf8", async (err, data) => {
        if (err) throw new AppError(500, err.message || "Something went wrong");
        const emailContent = data
          .replace("{{password}}", password)
          .replace("{{role}}", payload.role)
          .replace("{{year}}", year);

        const emailData = {
          to: payload.email,
          subject,
          html: emailContent,
        };

        await axios.post(config.send_email_url as string, emailData);
      });
    }

    await session.commitTransaction();
    return moderator;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error creating moderator!");
  } finally {
    session.endSession();
  }
};

const loginUser = async (payload: {
  email: string;
  password: string;
  isRemember: boolean;
  fcmToken?: string;
}) => {
  const user = await isUserExist(payload.email);

  if (!user.isAccountVerified)
    throw new AppError(400, "Please, verify your account before logging in!");

  if (user.needsPasswordChange)
    throw new AppError(400, "Please, reset your password before logging in!");

  if (user?.provider !== "credentials")
    throw new AppError(
      400,
      `Your account is set up with ${user.provider}! Use ${user.provider} to log in.`
    );

  // Compare the password
  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Incorrect password!",
      "password"
    );
  }

  // generate token
  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  };

  const accessToken = jsonwebtoken.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expiration,
    }
  );

  const refreshToken = jsonwebtoken.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: payload?.isRemember ? "60d" : "20d",
    }
  );

  // update fcm token if any
  if (payload.fcmToken) {
    await Auth.findByIdAndUpdate(user._id, { fcmToken: payload.fcmToken });
  }
  return { accessToken, refreshToken, role: user.role };
};

const googleLogin = async (idToken: string, fcmToken?: string) => {
  const decodedToken: DecodedIdToken | null = await firebaseAdmin
    .auth()
    .verifyIdToken(idToken);
  console.log("fcmToken", fcmToken);
  if (!decodedToken) throw new AppError(400, "login failed!");

  // const image = "";
  // const name = "";
  // const email = "";
  // const country = "AF";

  // const auth = await Auth.findOne({ email });

  // // generate token
  // const jwtPayload = {
  //   email: email,
  //   role: userRoles.user,
  // } as any;
  // if (auth) {
  //   if (auth?.provider !== "google")
  //     throw new AppError(
  //       400,
  //       `Your account is set up with ${auth.provider}! Use ${auth.provider} to log in.`
  //     );
  //   jwtPayload.id = auth._id;
  //   if (fcmToken) await Auth.findByIdAndUpdate(auth._id, { fcmToken });
  // } else {
  //   const session = await startSession();
  //   try {
  //     session.startTransaction();

  //     const userData = {
  //       name,
  //       image,
  //       email,
  //     };

  //     const authData = {
  //       email,
  //       role: userRoles.user,
  //       country,
  //       isAccountVerified: true,
  //       fcmToken,
  //       provider: "google",
  //     } as any;

  //     const user = await User.create(userData);
  //     authData.user = user._id;

  //     const newAuth = await Auth.create(authData);
  //     jwtPayload.id = newAuth._id;
  //     await session.commitTransaction();
  //   } catch (error: any) {
  //     await session.abortTransaction();
  //     throw new AppError(500, error.message || "Error creating moderator!");
  //   } finally {
  //     await session.endSession();
  //   }

  //   const accessToken = jsonwebtoken.sign(
  //     jwtPayload,
  //     config.jwt_access_secret as string,
  //     {
  //       expiresIn: config.jwt_access_expiration,
  //     }
  //   );

  //   const refreshToken = jsonwebtoken.sign(
  //     jwtPayload,
  //     config.jwt_refresh_secret as string,
  //     {
  //       expiresIn: config.jwt_refresh_expiration,
  //     }
  //   );

  //   return { accessToken, refreshToken };
  // }

  return decodedToken;
};

const sendOtp = async (payload: { email: string }) => {
  const user = await isUserExist(payload.email);

  // generate OTP and send email
  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(
    otp.toString(),
    Number(config.salt_rounds)
  );
  const otpExpires = new Date(Date.now() + 3 * 60 * 1000);

  // send email
  const subject = `Your OTP Code is Here - Yalla Coupon`;
  const year = new Date().getFullYear().toString();
  const emailTemplatePath = "./src/app/emailTemplates/otp.html";
  fs.readFile(emailTemplatePath, "utf8", async (err, data) => {
    if (err) throw new AppError(500, err.message || "Something went wrong");
    const emailContent = data
      .replace("{{otp}}", otp.toString())
      .replace("{{year}}", year);

    const emailData = {
      to: payload.email,
      subject,
      html: emailContent,
    };

    await axios.post(config.send_email_url as string, emailData);
  });

  await Auth.findByIdAndUpdate(
    user._id,
    { otp: hashedOtp, otpExpires, otpAttempts: 0 },
    { new: true }
  );
  return { otp };
};

const verifyOtp = async (payload: {
  email: string;
  otp: string;
  verifyAccount?: boolean;
}) => {
  const user = await isUserExist(payload.email);

  // check OTP attempts
  if (user.otpAttempts! > 3) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP attempts exceeded", "otp");
  }

  user.otpAttempts = user.otpAttempts ? user.otpAttempts! + 1 : 1;
  user.save();

  if (!user.otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP not found", "otp");
  }

  // verify OTP
  const isOtpMatch = await bcrypt.compare(payload.otp, user.otp as string);
  if (!isOtpMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP", "otp");
  }

  if (user.otpExpires! < new Date()) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP has expired", "otp");
  }

  if (payload.verifyAccount) {
    const subject = `Your Email Has Been Successfully Verified - Yalla Coupon`;
    const year = new Date().getFullYear().toString();
    const emailTemplatePath = "./src/app/emailTemplates/otpSuccess.html";
    fs.readFile(emailTemplatePath, "utf8", async (err, data) => {
      if (err) throw new AppError(500, err.message || "Something went wrong");
      const emailContent = data.replace("{{year}}", year);

      const emailData = {
        to: payload.email,
        subject,
        html: emailContent,
      };

      await axios.post(config.send_email_url as string, emailData);
    });

    return await Auth.findByIdAndUpdate(user._id, {
      isAccountVerified: true,
      $unset: { otp: "", otpExpires: "", otpAttempts: "" },
    });
  }
  await Auth.findByIdAndUpdate(user._id, {
    isOtpVerified: true,
    $unset: { otp: "", otpExpires: "", otpAttempts: "" },
  });
};

const resetForgottenPassword = async (payload: {
  email: string;
  password: string;
}) => {
  const user = await isUserExist(payload.email);

  if (!user.isOtpVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP not verified", "otp");
  }

  // hash the password and save the document
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.salt_rounds)
  );
  const newAuth = await Auth.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    needsPasswordChange: false,
    $unset: { isOtpVerified: "" },
  });

  if (newAuth) {
    const subject = `Your Password Has Been Successfully Reset - Yalla Coupon`;
    const year = new Date().getFullYear().toString();
    const emailTemplatePath =
      "./src/app/emailTemplates/passwordResetSuccess.html";
    fs.readFile(emailTemplatePath, "utf8", async (err, data) => {
      if (err) throw new AppError(500, err.message || "Something went wrong");
      const emailContent = data.replace("{{year}}", year);

      const emailData = {
        to: payload.email,
        subject,
        html: emailContent,
      };

      await axios.post(config.send_email_url as string, emailData);
    });
  }
};

const changePassword = async (
  email: string,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const user = await isUserExist(email);

  // Compare the password
  const isPasswordMatch = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );
  if (!isPasswordMatch) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Incorrect old password!",
      "password"
    );
  }

  // hash the new password and save the document
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.salt_rounds)
  );
  await Auth.findByIdAndUpdate(user._id, { password: hashedPassword });

  // generate token
  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  };

  const accessToken = jsonwebtoken.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expiration,
    }
  );

  const refreshToken = jsonwebtoken.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: "3d",
    }
  );
  return { accessToken, refreshToken, role: user.role };
};

const getNewAccessToken = async (token: string) => {
  // verify token
  const decoded = jsonwebtoken.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;
  const user = await Auth.findOne({
    email: decoded.email,
    isDeleted: false,
    isBlocked: false,
  });

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  // generate token
  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  };
  const accessToken = jsonwebtoken.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expiration }
  );
  return { accessToken };
};

const deleteUser = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await Auth.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    await session.commitTransaction();
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Something went wrong");
  } finally {
    await session.endSession();
  }
};

const changeModeratorRole = async (
  email: string,
  role: "Editor" | "Viewer"
) => {
  const auth = await Auth.findOne({
    email,
  });

  if (!auth) throw new AppError(404, "User not found!");

  if ((auth.role as string) === role)
    throw new AppError(400, "User already has this role!");

  const session = await startSession();

  let userId = null;
  try {
    session.startTransaction();
    if (auth.role === userRoles.viewer) {
      const viewer = await Viewer.findById(auth.user).session(session);
      if (!viewer) throw new AppError(404, "User not found1!");

      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const { _id, createdAt, __v, updatedAt, ...editorData } =
        viewer.toObject();

      const result = await Editor.create([editorData], { session });
      userId = result[0]._id;
      await Viewer.findByIdAndDelete(auth.user, { session });
    } else if (auth.role === userRoles.editor) {
      const editor = await Editor.findById(auth.user).session(session);
      if (!editor) throw new AppError(404, "User not found!");

      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const { _id, createdAt, __v, updatedAt, ...viewerData } =
        editor.toObject();

      const result = await Viewer.create([viewerData], { session });
      userId = result[0]._id;
      await Editor.findByIdAndDelete(auth.user, { session });
    }

    const result = await Auth.findByIdAndUpdate(
      auth._id,
      { role, user: userId },
      { new: true, session }
    ).select("-password");

    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Something went wrong");
  } finally {
    await session.endSession();
  }
};

const AuthServices = {
  createModerator,
  loginUser,
  sendOtp,
  verifyOtp,
  resetForgottenPassword,
  changePassword,
  getNewAccessToken,
  deleteUser,
  googleLogin,
  changeModeratorRole,
};

export default AuthServices;
