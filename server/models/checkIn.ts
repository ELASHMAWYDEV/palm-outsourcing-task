import { Schema, model, Document } from "mongoose";

export interface ICheckIn extends Document {
  date: Date;
  mood: "amazing" | "happy" | "neutral" | "down" | "stressed";
  dailyNote: string;
  energyLevel: number;
  suggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const checkInSchema = new Schema<ICheckIn>(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    mood: {
      type: String,
      required: true,
      enum: ["amazing", "happy", "neutral", "down", "stressed"],
      lowercase: true,
    },
    dailyNote: {
      type: String,
      maxlength: 500,
      trim: true,
      default: "",
    },
    energyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

checkInSchema.index({ date: 1 });
checkInSchema.index({ createdAt: -1 });

export const CheckIn = model<ICheckIn>("CheckIn", checkInSchema);
