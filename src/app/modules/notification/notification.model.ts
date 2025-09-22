import mongoose from 'mongoose';
import { TNotificationPayload } from './notification.interface';

const notificationSchema = new mongoose.Schema<TNotificationPayload>({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true },
  countries: { type: [String], required: true },
  hasRead: { type: Boolean, default: false },
  type: { type: String, enum: ['alert', 'others'], required: true },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
