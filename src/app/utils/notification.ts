import admin from "firebase-admin";
import { StatusCodes } from "http-status-codes";
import firebaseJsonFile from "../private/firebase.json";
import { AppError } from "../classes/appError";
import { TNotificationPayload } from "../modules/notification/notification.interface";
import NotificationModel from "../modules/notification/notification.model";

admin.initializeApp({
  credential: admin.credential.cert(firebaseJsonFile as any),
});

export const sendNotification = async (
  fcmToken: string[],
  payload: TNotificationPayload,
): Promise<any> => {
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
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

    console.log(response?.responses, "from send notification");

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

    console.log("Response:", response.responses);

    return response;
  } catch (error: any) {
    console.error("Error sending message:", error);
    if (error?.code === "messaging/third-party-auth-error") {
      return null;
    } else {
      console.error("Error sending message:", error);
      throw new AppError(
        StatusCodes.NOT_IMPLEMENTED,
        error.message || "Failed to send notification",
      );
    }
  }
};