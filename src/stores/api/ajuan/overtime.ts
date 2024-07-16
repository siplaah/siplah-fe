import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from '@/services/ts/httpClient';

interface Overtime {
  id_employee: string;
  id_overtime: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  attachment: string;
  status: string;
  description: string;
}

export const useApiOvertimeStrore = defineStore('api-overtime', () => {
  const listOvertime = ref<Overtime[]>([]);
  const detailOvertime = ref({});
  const overtimeAttachment = ref('');
  const totalData = ref(0);

  const getOvertime = async (params: any) => {
    try {
      const res = await httpClient.query('/overtime', params);
      listOvertime.value = res.data.data;
      totalData.value = res.data.totalData;
    } catch (error) {
      throw error;
    }
  };

  const getDetailOvertime = async (id: any) => {
    try {
      const res = await httpClient.get(`/overtime/${id}`);
      detailOvertime.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postOvertime = async (params: any) => {
    try {
      const res = await httpClient.postFormData('/overtime', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const putOvertime = async (params: any, id: any) => {
    try {
      const res = await httpClient.put(`/overtime/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteOvertime = async (id: any) => {
    try {
      const res = await httpClient.delete(`/overtime/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const approvedOvertime = async (id: any) => {
    try {
      const res = await httpClient.putApprove(`/overtime/${id}/approve`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const rejectOvertime = async (id: any, description: any) => {
    try {
      const res = await httpClient.put(`/overtime/${id}/reject`, { description });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const fetchOvertimeAttachment = async (id_overtime: any) => {
    try {
      const res = await httpClient.getFormData(`/overtime/${id_overtime}/attachment`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      overtimeAttachment.value = url;
    } catch (error) {
      throw error;
    }
  };

  return {
    listOvertime,
    totalData,
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
