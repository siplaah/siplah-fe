
import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "@/services/httpClient";

export const useApiMeetingStore = defineStore('api-meeting', () => {
  const listMeeting = ref([]);
  const detailMeeting = ref({});

  const getMeeting = async (params) => {
    try {
      const res = await httpClient.query('/meeting', params);
      listMeeting.value = res.data;
    } catch (error) {
      throw error;
    }
  };

  const getDetailMeeting = async (id) => {
    try {
      const res = await httpClient.get(`/meeting/${id}`);
      detailMeeting.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postMeeting = async (params) => {
    try {
      const res = await httpClient.post('/meeting', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const putMeeting = async (params, id) => {
    try {
      const res = await httpClient.put(`/meeting/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteMeeting = async (id) => {
    try {
      const res = await httpClient.delete(`/meeting/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    listMeeting,
    detailMeeting,
    getMeeting,
    getDetailMeeting,
    postMeeting,
    putMeeting,
    deleteMeeting,
  };
});
