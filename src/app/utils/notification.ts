import admin from "firebase-admin";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../classes/appError";
import { TNotificationPayload } from "../modules/notification/notification.interface";
import NotificationModel from "../modules/notification/notification.model";
import firebaseJsonFile from "../private/firebase.json";

admin.initializeApp({
  credential: admin.credential.cert(firebaseJsonFile as any),
});

export const sendNotification = async (
  fcmToken: string[],
  payload: TNotificationPayload,
  extraData?: Record<string, any>,
): Promise<any> => {
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: extraData,
      apns: {
        headers: {
          "apns-push-type": "alert",
        },
        payload: {
          aps: {
            badge: 1,
            sound: "default",
          },
        },
      },
    });
    if (response.successCount) {
      fcmToken?.map(async (token) => {
        try {
          if (token) {
            await NotificationModel.create(payload);
          } else {
            console.log("Token not found");
          }
        } catch (error) {
          console.log(error);
        }
      });
    }

    return response;
  } catch (error: any) {
    if (error?.code === "messaging/third-party-auth-error") {
      return null;
    } else {
      throw new AppError(
        StatusCodes.NOT_IMPLEMENTED,
        error.message || "Failed to send notification",
      );
    }
  }
};

export const firebaseAdmin = admin;
