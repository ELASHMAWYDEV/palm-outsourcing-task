import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.39:3001/api";

export const queryKeys = {
  checkIn: {
    all: ["checkIn"] as const,
    today: () => [...queryKeys.checkIn.all, "today"] as const,
    byDateRange: (startDate: string, endDate: string) =>
      [...queryKeys.checkIn.all, "byDateRange", startDate, endDate] as const,
  },
};
