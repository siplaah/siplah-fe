import { ref } from 'vue';
import { defineStore } from 'pinia';
import httpClient from '../../../services/httpClient';

export const useApiPresensiStore = defineStore('api-presensi', () => {
  const listPresensi = ref([]);
  const detailPresensi = ref({});

  const getPresensi = async (params) => {
    try {
      const res = await httpClient.query('/presensi', params);
      listPresensi.value = res.data;
    } catch (error) {
      throw error;
    }
  };

  const getDetailPresensi = async (id) => {
    try {
      const res = await httpClient.get(`/presensi/${id}`);
      detailPresensi.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postPresensi = async (params) => {
    try {
      const res = await httpClient.post('/presensi', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const patchPresensi = async (params, id) => {
    try {
      const res = await httpClient.patch(`/presensi/${id}`, params);
      return res.data;
    } catch (error) {
      console.error('Terjadi kesalahan saat patch presensi:', error);
      throw error;
    }
  };

  const deletePresensi = async (id) => {
    try {
      const res = await httpClient.delete(`/presensi/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const getPresensiByDate = async (date) => {
    try {
      const res = await httpClient.get(`/presensi/date/${date}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    listPresensi,
    detailPresensi,
    getPresensi,
    getDetailPresensi,
    postPresensi,
    patchPresensi,
    deletePresensi,
    getPresensiByDate, // Include the new method in the returned object
  };
});
