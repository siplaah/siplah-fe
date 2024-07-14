import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "../../../services/httpClient";

export const useApiOvertimeStrore = defineStore('api-overtime', () => {
  const listOvertime = ref([]);
  const detailOvertime = ref({});
  const overtimeAttachment = ref(null);

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
      const res = await httpClient.postFormData('/overtime', params);
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

  const approvedOvertime = async (id) => {
    try {
      const res = await httpClient.put(`/overtime/${id}/approve`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const rejectOvertime = async (id, description) => {
    try {
      const res = await httpClient.put(`/overtime/${id}/reject`, { description });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const fetchOvertimeAttachment = async (id_overtime) => {
    try {
      const res = await httpClient.get(`/overtime/${id_overtime}/attachment`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      overtimeAttachment.value = url;
    } catch (error) {
      throw error;
    }
  };

  return {
    listOvertime,
    overtimeAttachment,
    detailOvertime,
    getOvertime,
    getDetailOvertime,
    postOvertime,
    putOvertime,
    deleteOvertime,
    approvedOvertime,
    rejectOvertime,
    fetchOvertimeAttachment,
  };
});
