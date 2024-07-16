
import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "@/services/ts/httpClient";

interface Meeting {
  id_meeting: number;
  id_employee: string[];
  date: string;
  start_time: string;
  end_time: string;
  link_meeting: string;
  description: string;
  meetingEmployees: { id_employee: number }[];
}

export const useApiMeetingStore = defineStore('api-meeting', () => {
  const listMeeting = ref<Meeting[]>([]);
  const detailMeeting = ref({});
  const totalData = ref(0);

  const getMeeting = async (params: any) => {
    try {
      const res = await httpClient.query('/meeting', params);
      listMeeting.value = res.data.data;
      totalData.value = res.data.totalData;
    } catch (error) {
      throw error;
    }
  };

  const getDetailMeeting = async (id: any) => {
    try {
      const res = await httpClient.get(`/meeting/${id}`);
      detailMeeting.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postMeeting = async (params: any) => {
    try {
      const res = await httpClient.post('/meeting', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const putMeeting = async (params: any, id: any) => {
    try {
      const res = await httpClient.put(`/meeting/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteMeeting = async (id: any) => {
    try {
      const res = await httpClient.delete(`/meeting/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    listMeeting,
    totalData,
    detailMeeting,
    getMeeting,
    getDetailMeeting,
    postMeeting,
    putMeeting,
    deleteMeeting,
  };
});
