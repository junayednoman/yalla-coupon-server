import User from "./user.model";
import { AppError } from "../../classes/appError";
import { IUser } from "./user.interface";
import Auth from "../auth/auth.model";
import { startSession } from "mongoose";
import { userRoles } from "../../constants/global.constant";
import bcrypt from "bcrypt";
import fs from "fs";
import config from "../../config";
import generateOTP from "../../utils/generateOTP";
import axios from "axios";
import { TFile } from "../../../interface/file.interface";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";
import QueryBuilder from "../../classes/queryBuilder";

const userSignUp = async ({ password, ...payload }: IUser & { password: string }) => {
  const auth = await Auth.findOne({ email: payload.email, isAccountVerified: true });
  if (auth) throw new AppError(400, "User already exists!");

  payload.country = payload.country.toLowerCase();

  const session = await startSession();
  session.startTransaction();

  try {
    const user = await User.findOneAndUpdate({ email: payload.email }, payload, { upsert: true, new: true, session });

    // hash password
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.salt_rounds)
    );

    // prepare auth data
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(
      otp.toString(),
      Number(config.salt_rounds)
    );

    const otpExpires = new Date(Date.now() + 3 * 60 * 1000);

    const authData = {
      email: payload.email,
      password: hashedPassword,
      user: user?._id,
      role: userRoles.user,
      otp: hashedOtp,
      otpExpires,
      otpAttempts: 0,
    }

    await Auth.findOneAndUpdate({ email: payload.email }, authData, { upsert: true, session });

    if (user) {
      // send otp
      const emailTemplatePath = "./src/app/emailTemplates/otp.html";
      const subject = `Your OTP Code is Here - Yalla Coupon`;
      const year = new Date().getFullYear().toString();
      fs.readFile(emailTemplatePath, "utf8", async (err, data) => {
        if (err) throw new AppError(500, err.message || "Something went wrong");
        const emailContent = data
          .replace('{{otp}}', otp.toString())
          .replace('{{year}}', year);

        const emailData = {
          to: payload.email,
          subject,
          html: emailContent,
        }

        await axios.post(
          config.send_email_url as string,
          emailData,
        )
      })
    }

    await session.commitTransaction();
    return user;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error signing up teacher!");
  } finally {
    session.endSession();
  }
};

const updateProfile = async (userId: string, payload: Partial<IUser>, file?: TFile) => {
  const auth = await Auth.findById(userId).populate("user");

  if (file) payload.image = await uploadToS3(file);
  const result = await User.findOneAndUpdate({ _id: (auth?.user as any)?._id }, payload, { new: true });
  if ((auth?.user as any).image && payload.image && result) await deleteFileFromS3((auth?.user as any).image)
  return result;
};

const getProfile = async (userId: string) => {
  const user = await Auth.findById(userId).select("user role").populate("user");
  return user;
};

const getAllUsers = async (query: Record<string, any>) => {
  const searchableFields = ["name", "image", "email", "phone", "country"];

  const categoryQuery = new QueryBuilder(User.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await categoryQuery.countTotal();
  const result = await categoryQuery.queryModel;
  return { data: result, meta };
};

const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId);
  return user;
};

const changeUserStatus = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(400, "Invalid user id!");

  const session = await startSession();
  session.startTransaction();
  try {
    await Auth.findOneAndUpdate({ user: user._id }, { isBlocked: user.isBlocked ? false : true }, { new: true, session })
    const result = await User.findByIdAndUpdate(user._id, { isBlocked: user.isBlocked ? false : true }, { new: true, session });
    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error changing user status!");
  } finally {
    session.endSession();
  }
}

const userService = {
  userSignUp,
  updateProfile,
  getProfile,
  getAllUsers,
  getSingleUser,
  changeUserStatus
};

export default userService;