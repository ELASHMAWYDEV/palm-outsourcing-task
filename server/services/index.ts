import { CheckIn, ICheckIn } from "../models/checkIn";
import { getSuggestions } from "../utils/openrouter";

export interface CreateCheckInInput {
  energyLevel?: number;
  mood?: "amazing" | "happy" | "neutral" | "down" | "stressed";
  dailyNote?: string;
}

export interface DateRangeInput {
  startDate: Date;
  endDate: Date;
}

export const createOrUpdateCheckIn = async (
  input: CreateCheckInInput
): Promise<ICheckIn> => {
  const { ...updateData } = input;
  let suggestions: string[] = [];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  if (input.mood && input.energyLevel) {
    suggestions = await getSuggestions({
      energyLevel: input.energyLevel,
      mood: input.mood,
    }).catch((error) => {
      console.error("Error getting suggestions:", error);
      return [];
    });
  }

  const checkIn = await CheckIn.findOneAndUpdate(
    {
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    },
    {
      $set: {
        ...Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== undefined)
        ),
        suggestions,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return checkIn;
};

export const getCheckInToday = async (): Promise<ICheckIn | null> => {
  const date = new Date();
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const checkIn = await CheckIn.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  return checkIn;
};

export const listCheckInsByDateRange = async (
  input: DateRangeInput
): Promise<ICheckIn[]> => {
  const { startDate, endDate } = input;

  console.log("startDate", startDate);
  console.log("endDate", endDate);

  const startOfDay = new Date(startDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  const checkIns = await CheckIn.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).sort({ date: -1 });

  return checkIns;
};
