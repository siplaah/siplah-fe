import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from "@/services/httpClient";

export const useApiEmployeeStore = defineStore('api-employee', () => {
  const listEmployee = ref([]);
  const detailEmployee = ref({});
  const selectedEmployee = ref([])

  const getEmployee = async (params) => {
    try {
      const res = await httpClient.query('/employee', params);
      listEmployee.value = Array.isArray(res.data.data) ? res.data.data : [];
      selectedEmployee.value = res.data?.data?.map((v) => ({
        value: v.id_employee,
        label: v.name,
        detail: v
      }))
    } catch (error) {
      console.error(error);
      listEmployee.value = [];
    }
  };

  const getDetailEmployee = async (id) => {
    try {
      const res = await httpClient.get(`/employee/${id}`);
      detailEmployee.value = res.data;
      return res.data;
    } catch (error) {
      console.error(error);
      detailEmployee.value = {};
    }
  };

  const postEmployee = async (params) => {
    try {
      const res = await httpClient.post('/employee', params);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const patchEmployee = async (params, id) => {
    try {
      const res = await httpClient.patch(`/employee/${id}`, params);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const res = await httpClient.delete(`/employee/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    listEmployee,
    detailEmployee,
    selectedEmployee,
    getEmployee,
    getDetailEmployee,
    postEmployee,
    patchEmployee,
    deleteEmployee,
  };
});