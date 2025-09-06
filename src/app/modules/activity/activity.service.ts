import Activity from "./activity.model";
import { IActivity } from "./activity.interface";
import AggregationBuilder from "../../classes/AggregationBuilder";

const addActivity = async (payload: IActivity) => {
  const existingActivity = await Activity.findOne({ user: payload.user, coupon: payload.coupon, type: payload.type });
  if (existingActivity) {
    await existingActivity.deleteOne();
  }
  const result = await Activity.create(payload);
  return result;
};

const getAllActivities = async (query: Record<string, any>) => {
  const searchableFields = [""];
const pipeline = [
  {
    $lookup: {
      from: "coupons",
      localField: "coupon",
      foreignField: "_id",
      as: "coupon"
    }
  },
  { $unwind: "$coupon" },
  {
    $lookup: {
      from: "stores",
      localField: "coupon.store",
      foreignField: "_id",
      as: "store"
    }
  },
  { $unwind: "$store" },
  {
    $addFields: {
      dateLabel: {
        $switch: {
          branches: [
            {
              case: {
                $eq: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  { $dateToString: { format: "%Y-%m-%d", date: new Date() } }
                ]
              },
              then: "Today"
            },
            {
              case: {
                $eq: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: {
                        $dateSubtract: { startDate: new Date(), unit: "day", amount: 1 }
                      }
                    }
                  }
                ]
              },
              then: "Yesterday"
            }
          ],
          default: "Others"
        }
      }
    }
  },
  {
    $addFields: {
      sortKey: {
        $switch: {
          branches: [
            { case: { $eq: ["$dateLabel", "Today"] }, then: 1 },
            { case: { $eq: ["$dateLabel", "Yesterday"] }, then: 2 }
          ],
          default: 3
        }
      }
    }
  },
  {
    $project: {
      couponTitle: "$coupon.title",
      storeName: "$store.name",
      storeImage: "$store.image",
      createdAt: 1,
      type: 1,
      dateLabel: 1,
      sortKey: 1
    }
  },
  {
    $group: {
      _id: { label: "$dateLabel", sortKey: "$sortKey" },
      items: { $push: "$$ROOT" }
    }
  },
  { $sort: { "_id.sortKey": 1 } }, // ✅ ensures Today → Yesterday → Others
  {
    $project: {
      _id: 0,
      label: "$_id.label",
      items: 1
    }
  }
];


  const couponQuery = new AggregationBuilder(Activity, pipeline, query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await couponQuery.countTotal();
  const result = await couponQuery.execute();
  return { data: result, meta };
};

const activityService = {
  addActivity,
  getAllActivities,
};

export default activityService;