import { ref } from 'vue';
import { defineStore } from 'pinia';
import httpClient from '../../../services/httpClient';

export const useApiJabatanStore = defineStore('api-jabatan', () => {
  const listJabatan = ref([]);
  const selectJabatan = ref([]);
  const detailJabatan = ref({});

  const getJabatan = async (params) => {
    try {
      const res = await httpClient.query('/jabatan', params);
      listJabatan.value = res.data;
      selectJabatan.value = res.data.map((v) => ({
        value: v.id_jabatan,
        label: v.name_jabatan,
      }));
    } catch (error) {
      throw error;
    }
  };

  const postJabatan = async (params) => {
    try {
      const res = await httpClient.post('/jabatan', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const patchJabatan = async (params, id) => {
    try {
      const res = await httpClient.patch(`/jabatan/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteJabatan = async (id) => {
    try {
      const res = await httpClient.delete(`/jabatan/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    listJabatan,
    selectJabatan,
    detailJabatan,
    getJabatan,
    postJabatan,
    patchJabatan,
    deleteJabatan,
  };
});
