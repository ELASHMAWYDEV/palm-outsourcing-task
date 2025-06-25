import { Request, Response } from "express";
import {
  createOrUpdateCheckIn,
  getCheckInToday,
  listCheckInsByDateRange,
  CreateCheckInInput,
  DateRangeInput,
} from "../services";

export const createOrUpdateCheckInController = async (
  req: Request,
  res: Response
) => {
  try {
    const { energyLevel, mood, dailyNote }: CreateCheckInInput = req.body;

    const input: CreateCheckInInput = {};

    if (energyLevel !== undefined) input.energyLevel = energyLevel;
    if (mood) input.mood = mood;
    if (dailyNote !== undefined) input.dailyNote = dailyNote;

    const checkIn = await createOrUpdateCheckIn(input);

    res.status(200).json({
      success: true,
      message: "Check-in saved successfully",
      data: checkIn,
    });
  } catch (error) {
    console.error("Error creating/updating check-in:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save check-in",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCheckInTodayController = async (
  req: Request,
  res: Response
) => {
  try {
    const checkIn = await getCheckInToday();

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: "No check-in found for today",
      });
    }

    res.status(200).json({
      success: true,
      data: checkIn,
    });
  } catch (error) {
    console.error("Error getting check-in today:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get check-in",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const listCheckInsByDateRangeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Both startDate and endDate query parameters are required",
      });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be later than end date",
      });
    }

    const input: DateRangeInput = {
      startDate: start,
      endDate: end,
    };

    const checkIns = await listCheckInsByDateRange(input);

    res.status(200).json({
      success: true,
      checkIns: checkIns,
      total: checkIns.length,
    });
  } catch (error) {
    console.error("Error listing check-ins by date range:", error);
    res.status(500).json({
      success: false,
      message: "Failed to list check-ins",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
