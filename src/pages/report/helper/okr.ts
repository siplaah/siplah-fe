import { ref } from 'vue';
import { useApiAssessmentStore } from '@/stores/api/report/assessment';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import { useApiKeyResultStore } from '@/stores/api/master/keyResult';
import { storeToRefs } from 'pinia';
import { format, parseISO, isValid } from 'date-fns';
import { id } from 'date-fns/locale';

const paramsKeyResult = ref({ page: 1, pageSize: 10 });
const paramsAssessment = ref({ page: 1, pageSize: 10 });
const searchQuery = ref('');
const searchMonthYear = ref('');

export const apiAssessmentStore = useApiAssessmentStore();
export const { listAssessment, totalData } = storeToRefs(apiAssessmentStore);
export const apiEmployeeStore = useApiEmployeeStore();
export const { selectedEmployee } = storeToRefs(apiEmployeeStore);
export const apiKeyResultStore = useApiKeyResultStore();
export const { listKeyResult, selectKeyResult } = storeToRefs(apiKeyResultStore);

export const getData = async () => {
  await apiAssessmentStore.getAssessment({ ...paramsAssessment.value, q: searchQuery.value, date: searchMonthYear.value});
  await apiEmployeeStore.getEmployee();
  await apiKeyResultStore.getKeyResult({ ...paramsKeyResult.value });
};

export const getAvgTarget = () => {
  if (!Array.isArray(listKeyResult.value) || listKeyResult.value.length === 0) return 0;
  const totalTarget = listKeyResult.value.reduce((acc: any, kr: { target: any }) => acc + kr.target, 0);
  return totalTarget / listKeyResult.value.length;
};

export const formatDateForInput = (date: string) => {
  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); 
  return `${year}-${month}`;
};


export const getKeyResultName = (id_key_result: number) => {
  const keyResult = listKeyResult.value.find((kr: { id_key_result: number }) => kr.id_key_result === id_key_result);
  return keyResult ? keyResult.key_result : 'Unknown';
};

export const getKeyResultTarget = (id_key_result: number) => {
  const keyResult = listKeyResult.value.find((kr: { id_key_result: number }) => kr.id_key_result === id_key_result);
  return keyResult ? keyResult.target : 0;
};

export const formatTanggal = (tanggal: string) => {
  const date = parseISO(tanggal);
  if (!isValid(date)) {
    return 'Invalid Date';
  }
  return format(date, 'MMMM yyyy', { locale: id });
};

export const formatType = (type: string) => {
  return type.replace(/_/g, ' ');
};
