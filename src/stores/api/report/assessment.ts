import { ref } from 'vue';
import { defineStore } from "pinia";
import httpClient from '@/services/ts/httpClient';
import { saveAs } from 'file-saver';

interface AssessmentEmployee {
  id_assessment: number;
  employee: {
    id_employee: number;
    nama: string;
  };
  date: string;
  assessment: {
    id_key_result: number;
    type: string;
    target: number;
    realisasi: number;
    nilai_akhir: number;
  }[];
  total_nilai: number;
}

export const useApiAssessmentStore = defineStore('api-assessment', () => {
  const listAssessment = ref<AssessmentEmployee[]>([]);
  const detailAssessment = ref({});
  const totalData = ref(0);
  
  const getAssessment = async (params: any) => {
    try {
      const res = await httpClient.query('/assessment', params);
      listAssessment.value = res.data.data;
      totalData.value = res.data.totalData;
    } catch (error) {
      throw error;
    }
  };

  const getDetailAssessment = async (id: any) => {
    try {
      const res = await httpClient.get(`/assessment/${id}`);
      detailAssessment.value = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const postAssessment = async (params: any) => {
    try {
      const res = await httpClient.post('/assessment', params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const putAssessment = async (params: any, id: any) => {
    try {
      const res = await httpClient.put(`/assessment/${id}`, params);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteAssessment = async (id: any) => {
    try {
      const res = await httpClient.delete(`/assessment/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const exportToExcel = async () => {
    try {
      const res = await httpClient.getFormData('/assessment/export', {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      saveAs(blob, 'okr-data.xlsx');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      throw error;
    }
  };

  return {
    listAssessment,
    totalData,
    detailAssessment,
    getAssessment,
    getDetailAssessment,
    postAssessment,
    putAssessment,
    deleteAssessment,
    exportToExcel,
  };
});
