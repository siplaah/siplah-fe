
import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "../../../services/httpClient";

export const useApiOvertimeStrore = defineStore('api-overtime', () => {
  const listOvertime = ref([]);
  // const selectOvertime = ref([]);
  const detailOvertime = ref({});

  const getOvertime = async (params) => {
    try {
      const res = await httpClient.query('/overtime', params);
      listOvertime.value = res.data;
    } catch (error) {
      throw error;
    }
  };

  const getDetailOvertime = async (id) => {
    try {
      const res = await httpClient.get(`/overtime/${id}`);
      detailOvertime.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postOvertime = async (params) => {
    try {
      const res = await httpClient.post('/overtime', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const putOvertime = async (params, id) => {
    try {
      const res = await httpClient.put(`/overtime/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteOvertime = async (id) => {
    try {
      const res = await httpClient.delete(`/overtime/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    listOvertime,
    // selectOvertime,
    detailOvertime,
    getOvertime,
    getDetailOvertime,
    postOvertime,
    putOvertime,
    deleteOvertime,
  };
});
