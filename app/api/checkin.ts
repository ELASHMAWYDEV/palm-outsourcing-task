import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  CheckInData,
  CreateCheckInRequest,
  ListCheckInsRequest,
  ListCheckInsResponse,
} from "@/types";
import { API_BASE_URL, queryKeys } from "./index";
import dayjs from "dayjs";

export const checkInService = {
  async createOrUpdate(data: CreateCheckInRequest): Promise<CheckInData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/check-in`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },

  async getToday(): Promise<CheckInData | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/check-in/today`);
      return response.data.data;
    } catch (error) {
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },

  async listByDateRange(
    params: ListCheckInsRequest
  ): Promise<ListCheckInsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/check-in`, {
        params: {
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
        },
      });
      return response.data;
    } catch (error) {
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },
};

export const useCreateOrUpdateCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkInService.createOrUpdate,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.checkIn.today(), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.checkIn.all });
    },
    onError: (error) => {
      console.error("Failed to create/update check-in:", error);
    },
  });
};

export const useGetCheckInToday = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.checkIn.today(),
    queryFn: checkInService.getToday,
    enabled: enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes for individual check-ins
  });
};

export const useListCheckInsByDateRange = (
  params: ListCheckInsRequest,
  enabled = true
) => {
  return useQuery({
    queryKey: queryKeys.checkIn.byDateRange(
      params.startDate || "",
      params.endDate || ""
    ),
    queryFn: () => checkInService.listByDateRange(params),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes for lists
  });
};

export const useGetRecentCheckIns = (days = 10) => {
  const endDate = dayjs().format("YYYY-MM-DD");
  const startDate = dayjs().subtract(days, "day").format("YYYY-MM-DD");

  return useListCheckInsByDateRange({ startDate, endDate });
};
