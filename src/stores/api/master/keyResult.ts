import { ref } from 'vue';
import { defineStore } from 'pinia';
import httpClient from '@/services/ts/httpClient';

interface KeyResult {
  id_key_result: number;
  key_result: string;
  target: number;
}

export const useApiKeyResultStore = defineStore('api-key-result', () => {
  const listKeyResult = ref<KeyResult[]>([]);
  const selectKeyResult = ref<{ value: number; label: string }[]>([]);
  const detailKeyResult = ref<KeyResult>({ id_key_result: 0, key_result: '', target: 0 });
  const totalData = ref(0);

  const getKeyResult = async (params: any) => {
    try {
      const res = await httpClient.query('/key-result', params);
      listKeyResult.value = res.data.data;
      totalData.value = res.data.totalData;
      selectKeyResult.value = Array.isArray(res.data.data)
        ? res.data.data.map((v: KeyResult) => ({
            value: v.id_key_result,
            label: v.key_result
          }))
        : [];
    } catch (error) {
      console.error('Error fetching key results:', error);
      throw error;
    }
  };

  const getDetailKeyResult = async (id: number) => {
    try {
      const res = await httpClient.get(`/key-result/${id}`);
      detailKeyResult.value = res.data;
      return res.data;
    } catch (error) {
      console.error(`Error fetching key result detail for ID ${id}:`, error);
      throw error;
    }
  };

  const postKeyResult = async (params: any) => {
    try {
      const res = await httpClient.post('/key-result', params);
      return res.data;
    } catch (error) {
      console.error('Error creating key result:', error);
      throw error;
    }
  };

  const putKeyResult = async (params: any, id: number) => {
    try {
      const res = await httpClient.put(`/key-result/${id}`, params);
      return res.data;
    } catch (error) {
      console.error(`Error updating key result ID ${id}:`, error);
      throw error;
    }
  };

  const deleteKeyResult = async (id: number) => {
    try {
      const res = await httpClient.delete(`/key-result/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting key result ID ${id}:`, error);
      throw error;
    }
  };

  return {
    listKeyResult,
    totalData,
    selectKeyResult,
    detailKeyResult,
    getKeyResult,
    getDetailKeyResult,
    postKeyResult,
    putKeyResult,
    deleteKeyResult
  };
});
