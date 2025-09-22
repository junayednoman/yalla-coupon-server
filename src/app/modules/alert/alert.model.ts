import { model, Schema } from "mongoose";

const alertSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  countries: { type: [String], required: true },
  coupon: { type: Schema.Types.ObjectId, ref: "Coupon", required: true },
})

const Alert = model('Alert', alertSchema)
export default Alert;