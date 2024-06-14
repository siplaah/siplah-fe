
import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "@/services/httpClient";

export const useApiTimeOffStrore = defineStore('api-time-off', () => {
  const listTimeOff = ref([]);
  const detailTimeOff = ref({});

  const getTimeOff = async (params) => {
    try {
      const res = await httpClient.query('/time-off', params);
      listTimeOff.value = res.data;
    } catch (error) {
      throw error;
    }
  };

  const getDetailTimeOff = async (id) => {
    try {
      const res = await httpClient.get(`/time-off/${id}`);
      detailTimeOff.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postTimeOff = async (params) => {
    try {
      const res = await httpClient.post('/time-off', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const putTimeOff = async (params, id) => {
    try {
      const res = await httpClient.put(`/time-off/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteTimeOff = async (id) => {
    try {
      const res = await httpClient.delete(`/time-off/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    listTimeOff,
    detailTimeOff,
    getTimeOff,
    getDetailTimeOff,
    postTimeOff,
    putTimeOff,
    deleteTimeOff,
  };
});
