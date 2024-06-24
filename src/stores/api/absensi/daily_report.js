import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "@/services/httpClient";

export const useApiDailyReportStore = defineStore('api-daily_report', () => {
  const listDailyReport = ref([]);
  const detailDailyReport = ref({});

  const getDailyReport = async (params) => {
    try {
      const res = await httpClient.query('/daily_report', params);
      // Assuming res.data is an array
      listDailyReport.value = Array.isArray(res.data.data) ? res.data.data : [];
    } catch (error) {
      console.error(error);
      listDailyReport.value = [];
    }
  };

  const getDetailDailyReport = async (id) => {
    try {
      const res = await httpClient.get(`/daily_report/${id}`);
      detailDailyReport.value = res.data;
      return res.data;
    } catch (error) {
      console.error(error);
      detailDailyReport.value = {};
    }
  };

  const postDailyReport = async (params) => {
    try {
      const res = await httpClient.post('/daily_report', params);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const patchDailyReport = async (params, id) => {
    try {
      const res = await httpClient.patch(`/daily_report/${id}`, params);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDailyReport = async (id) => {
    try {
      const res = await httpClient.delete(`/daily_report/${id}`);
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