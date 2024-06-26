
import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "@/services/httpClient";

export const useApiAssessmentStore = defineStore('api-assessment', () => {
  const listAssessment = ref([]);
  const detailAssessment = ref({});

  const getAssessment = async (params) => {
    try {
      const res = await httpClient.query('/assessment', params);
      listAssessment.value = res.data;
    } catch (error) {
      throw error;
    }
  };

  const getDetailAssessment = async (id) => {
    try {
      const res = await httpClient.get(`/assessment/${id}`);
      detailAssessment.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postAssessment = async (params) => {
    try {
      const res = await httpClient.post('/assessment', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const putAssessment = async (params, id) => {
    try {
      const res = await httpClient.put(`/assessment/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteAssessment = async (id) => {
    try {
      const res = await httpClient.delete(`/assessment/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    listAssessment,
    detailAssessment,
    getAssessment,
    getDetailAssessment,
    postAssessment,
    putAssessment,
    deleteAssessment,
  };
});
