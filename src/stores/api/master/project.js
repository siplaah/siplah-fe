import { ref } from 'vue';
import { defineStore } from 'pinia';
import httpClient from '../../../services/httpClient';

export const useApiProjectStore = defineStore('api-project', () => {
  const listProject = ref([]);
  const selectProject = ref([]);
  const detailProject = ref({});

  const getProject = async (params) => {
    try {
      const res = await httpClient.query('/project', params);
      listProject.value = res.data;
      selectProject.value = res.data.map((v) => ({
        value: v.id_project,
        label: v.name_project,
      }));
    } catch (error) {
      throw error;
    }
  };

  const postProject = async (params) => {
    try {
      const res = await httpClient.post('/project', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const patchProject = async (params, id) => {
    try {
      const res = await httpClient.patch(`/project/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteProject = async (id) => {
    try {
      const res = await httpClient.delete(`/project/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    listProject,
    selectProject,
    detailProject,
    getProject,
    postProject,
    patchProject,
    deleteProject,
  };
});
