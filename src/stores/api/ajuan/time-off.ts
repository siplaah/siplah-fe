import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "@/services/ts/httpClient";

interface TimeOff {
  id_time_off: string;
  id_employee: string;
  start_date: string;
  end_date: string;
  type: string;
  attachment: string;
  status: string;
  description: string;
  jumlah_cuti: number;
}

export const useApiTimeOffStore = defineStore('api-time-off', () => {
  const listTimeOff = ref<TimeOff[]>([]);
  const detailTimeOff = ref<TimeOff | null>(null);
  const timeOffAttachment = ref('');
  const totalData = ref(0);

  const getTimeOff = async (params: any) => {
    try {
      const res = await httpClient.query('/time-off', params);
      listTimeOff.value = res.data.data;
      totalData.value = res.data.totalData;
    } catch (error) {
      throw error;
    }
  };

  const getDetailTimeOff = async (id: any) => {
    try {
      const res = await httpClient.get(`/time-off/${id}`);
      detailTimeOff.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postTimeOff = async (params: any) => {
    try {
      const res = await httpClient.postFormData('/time-off', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const putTimeOff = async (params: any, id: any) => {
    try {
      const res = await httpClient.put(`/time-off/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteTimeOff = async (id: any) => {
    try {
      const res = await httpClient.delete(`/time-off/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const approvedTimeOff = async (id: any) => {
    try {
      const res = await httpClient.putApprove(`/time-off/${id}/approve`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const rejectTimeOff = async (id: any, description: any) => {
    try {
      const res = await httpClient.put(`/time-off/${id}/reject`, { description });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const fetchTimeOffAttachment = async (id_time_off: any) => {
    try {
      const res = await httpClient.getFormData(`/time-off/${id_time_off}/attachment`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      timeOffAttachment.value = url;
    } catch (error) {
      throw error;
    }
  };

  return {
    listTimeOff,
    totalData,
    fetchTimeOffAttachment,
    timeOffAttachment,
    detailTimeOff,
    getTimeOff,
    getDetailTimeOff,
    postTimeOff,
    putTimeOff,
    deleteTimeOff,
    approvedTimeOff,
    rejectTimeOff,
  };
});
