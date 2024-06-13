import { ref } from 'vue';
import { defineStore } from 'pinia';
import httpClient from '../../../services/httpClient';

export const useApiKeyResultStore = defineStore('api-key-result', () => {
  const listKeyResult = ref([]);
  const selectKeyResult = ref([]);
  const detailKeyResult = ref({});

  const getKeyResult = async (params) => {
    try {
      const res = await httpClient.query('/key-result', params);
      listKeyResult.value = res.data;
      selectKeyResult.value = res.data.map((v) => ({
        value: v.id_key_result,
        label: v.key_result,
      }));
    } catch (error) {
      throw error;
    }
  };

  const getDetailKeyResult = async (id) => {
    try {
      const res = await httpClient.get(`/key-result/${id}`);
      detailKeyResult.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postKeyResult = async (params) => {
    try {
      const res = await httpClient.post('/key-result', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const putKeyResult = async (params, id) => {
    try {
      const res = await httpClient.put(`/key-result/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteKeyResult = async (id) => {
    try {
      const res = await httpClient.delete(`/key-result/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    listKeyResult,
    selectKeyResult,
    detailKeyResult,
    getKeyResult,
    getDetailKeyResult,
    postKeyResult,
    putKeyResult,
    deleteKeyResult,
  };
});
