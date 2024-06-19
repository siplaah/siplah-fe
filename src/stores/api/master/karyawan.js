
import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "@/services/httpClient";

export const useApiEmployeeOffStrore = defineStore('api-employee', () => {
  const listEmployee = ref([]);
  const detailEmployee = ref({});

  const getEmployee = async (params) => {
    try {
      const res = await httpClient.query('/employee', params);
      listEmployee.value = res.data;
    } catch (error) {
      throw error;
    }
  };

  const getDetailEmployee= async (id) => {
    try {
      const res = await httpClient.get(`/employee/${id}`);
      detailEmployee.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postEmployee = async (params) => {
    try {
      const res = await httpClient.post('/employee', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const patchEmployee = async (params, id) => {
    try {
      const res = await httpClient.patch(`/employee/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const res = await httpClient.delete(`/employee/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    listEmployee,
    detailEmployee,
    getEmployee,
    getEmployee,
    postEmployee,
    patchEmployee,
    deleteEmployee,
  };
});
