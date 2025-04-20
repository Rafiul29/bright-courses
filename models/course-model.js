import mongoose, { Schema } from "mongoose";
const courseSchema = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    subtitle: {
      type: String,
    },
    slug: {
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    thumbnail: {
      type: String,
    },
    price: {
      required: true,
      default: 0,
      type: Number,
    },
    active: {
      required: true,
      default: false,
      type: Boolean,
    },
    subscription_type: {
      required: true,
      type: String,
      default: "Paid",
    },

    learning: {
      required: true,
      type: [String]
    },
  
    createdOn: {
      required: true,
      type: Date,
      default: new Date()
    },
  
    modifiedOn: {
      required: true,
      type: Date,
      default: new Date()
    },

    // relationship
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    modules: [{ type: Schema.ObjectId, ref: "Module" }],

    quizSet: { type: Schema.ObjectId, ref: "Quizset" },

    testimonials: [{ type: Schema.ObjectId, ref: "Testimonial" }],
  },
  { timestamps: true }
);

export const Course =
  mongoose.models.Course ?? mongoose.model("Course", courseSchema);
