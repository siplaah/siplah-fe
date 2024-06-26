import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "@/services/httpClient";

export const useApiDailyReportStore = defineStore('api-daily-report', () => {
  const listDailyReport = ref([]);
  const detailDailyReport = ref({});

  const getDailyReport = async (params) => {
    try {
      const res = await httpClient.query('/daily-report', params);
      
      listDailyReport.value = res.data.data;
    } catch (error) {
      console.error(error);
      listDailyReport.value = [];
    }
  };

  const getDetailDailyReport = async (id) => {
    try {
      const res = await httpClient.get(`/daily-report/${id}`);
      detailDailyReport.value = res.data;
      return res.data;
    } catch (error) {
      console.error(error);
      detailDailyReport.value = {};
    }
  };

  const postDailyReport = async (params) => {
    try {
      const res = await httpClient.post('/daily-report', params);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const patchDailyReport = async (params, id) => {
    try {
      const res = await httpClient.patch(`/daily-report/${id}`, params);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDailyReport = async (id) => {
    try {
      const res = await httpClient.delete(`/daily-report/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    listDailyReport,
    detailDailyReport,
    getDailyReport,
    getDetailDailyReport,
    postDailyReport,
    patchDailyReport,
    deleteDailyReport,
  };
});