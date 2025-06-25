export interface EnergyOption {
  id: string;
  label: string;
  emoji: string;
  subtitle: string;
  value: number;
}

export type MoodOptionId =
  | "amazing"
  | "happy"
  | "neutral"
  | "down"
  | "stressed";

export interface MoodOption {
  id: MoodOptionId;
  label: string;
  emoji: string;
  subtitle: string;
}

export interface CheckInData {
  _id?: string;
  date: string;
  mood: MoodOptionId;
  dailyNote: string;
  energyLevel: number;
  suggestions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCheckInRequest {
  mood: MoodOptionId;
  dailyNote: string;
  energyLevel: number;
}

export interface ListCheckInsRequest {
  startDate?: string;
  endDate?: string;
}

export interface ListCheckInsResponse {
  checkIns: CheckInData[];
  total: number;
}
