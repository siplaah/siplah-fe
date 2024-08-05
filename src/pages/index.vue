<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/api/authStore';
import { useApiTimeOffStore } from '@/stores/api/ajuan/time-off';
import { useApiOvertimeStrore } from '@/stores/api/ajuan/overtime';
import { useApiMeetingStore } from '@/stores/api/meeting/meeting';
import { useApiAssessmentStore } from '@/stores/api/report/assessment';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import { storeToRefs } from 'pinia';
import { parseISO, format, isValid, subMonths, getMonth } from 'date-fns';
import { id } from 'date-fns/locale';

const paramsMeeting = ref({ page: 1, pageSize: 10 });
const paramsTimeOff = ref({ page: 1, pageSize: 10 });
const paramsAssessment = ref({ page: 1, pageSize: 10 });

const auth = useAuthStore();
const lembur = useApiOvertimeStrore();
const employeeName = computed(() => auth.employee?.name);
const totalLembur = computed(() => lembur.totalData);

const apiMeetingStore = useApiMeetingStore();
const { listMeeting } = storeToRefs(apiMeetingStore);
const apiTimeOffStore = useApiTimeOffStore();
const { listTimeOff, totalData } = storeToRefs(apiTimeOffStore);
const apiEmployeeStore = useApiEmployeeStore();
const { listEmployee } = storeToRefs(apiEmployeeStore);
const apiAssessmentStore = useApiAssessmentStore();
const { listAssessment } = storeToRefs(apiAssessmentStore);

const getData = async () => {
  await apiMeetingStore.getMeeting({ ...paramsMeeting.value });
  await apiTimeOffStore.getTimeOff({ ...paramsTimeOff.value });
  await apiAssessmentStore.getAssessment({ ...paramsAssessment.value });
  await apiEmployeeStore.getEmployee();
};

onMounted(() => {
  getData();
});

const Assessment = computed(() => {
  const Month = subMonths(new Date(), 1);
  const MonthIndex = getMonth(Month);
  const employeeAssessment = listAssessment.value.filter(assessment => {
    const assessmentDate = parseISO(assessment.date);
    const isMatchingEmployee = assessment.employee.id_employee === auth.employee?.id;
    const isInPreviousMonth = isValid(assessmentDate) && getMonth(assessmentDate) === MonthIndex;

    console.log('Assessment Date:', assessmentDate, 'Matching Employee:', isMatchingEmployee, 'In Previous Month:', isInPreviousMonth);
    
    return isMatchingEmployee && isInPreviousMonth;
  });
  return employeeAssessment.reduce((total, assessment) => total + assessment.total_nilai, 0)
});

const formatTanggal = (tanggal: string) => {
  const date = parseISO(tanggal);
  if (!isValid(date)) {
    return 'Invalid Date';
  }
  return format(date, 'dd MMMM yyyy', { locale: id });
};

const getEmployeeName = (id_employee: string) => {
  const employee = listEmployee.value.find((employee: { id_employee: string }) => employee.id_employee === id_employee);
  return employee ? employee.name : 'Unknown';
};
</script>
<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <div class="row">
      <div
        :class="
          auth.employee?.jabatan === 'HRD' || auth.employee?.jabatan === 'PM' || auth.employee?.jabatan === 'CTO'
            ? 'col-lg-12 mb-4 order-0'
            : 'col-lg-8 mb-4 order-0'
        "
      >
        <div class="card">
          <div class="d-flex align-items-end row">
            <div class="col-sm-7">
              <div class="card-body">
                <h5 class="card-title text-primary">Hai {{ employeeName }}! 👋</h5>
                <p class="mb-4">
                  Waktunya untuk memulai hari dengan semangat! Ayo mulai hari ini dengan penuh energi dan produktivitas.
                </p>
                <router-link to="/absensi/absensi">
                  <button type="button" class="btn btn-primary">Presensi Sekarang</button>
                </router-link>
              </div>
            </div>
            <div class="col-sm-5 text-center text-sm-left">
              <div class="card-body pb-0 px-0 px-md-4">
                <img
                  src="../assets/img/illustrations/man-with-laptop-light.png"
                  height="140"
                  alt="View Badge User"
                  data-app-dark-img="illustrations/man-with-laptop-dark.png"
                  data-app-light-img="illustrations/man-with-laptop-light.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="auth.employee?.jabatan !== 'HRD' && auth.employee?.jabatan !== 'PM' && auth.employee?.jabatan !== 'CTO'"
      >
        <div class="col-4 mb-4">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-column align-items-center justify-content-center text-center">
                <div class="card-title">
                  <h5 class="text-nowrap text-primary mb-2">Congratulations {{ employeeName }}! 🎉</h5>
                  <span class="badge bg-label-warning rounded-pill">Juni 2024</span>
                </div>
                <div class="mt-auto">
                  <h5 class="mb-0 display-1">{{Assessment}}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-12 col-md-4 order-1">
        <div class="row">
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bx-user me-4" style="font-size: 2rem; color: green"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Karyawan</span>
                    <h3 class="card-title fw-bold mb-2">8</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bxl-codepen me-4" style="font-size: 2rem; color: orange"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Jabatan</span>
                    <h3 class="card-title fw-bold mb-2">5</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bx-task me-4" style="font-size: 2rem; color: red"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Project</span>
                    <h3 class="card-title fw-bold mb-2">4</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bx-time me-4" style="font-size: 2rem; color: black"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Presensi</span>
                    <h3 class="card-title fw-bold mb-2">10</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bx-sun me-4" style="font-size: 2rem; color: yellow"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Cuti</span>
                    <h3 class="card-title fw-bold mb-2">{{ totalData }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bxs-hourglass me-4" style="font-size: 2rem; color: green"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Lembur</span>
                    <h3 class="card-title fw-bold mb-2">{{ totalLembur }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6 col-lg-6 col-xl-6 order-0 mb-4">
        <div class="card">
          <h5 class="card-header">Meeting hari ini</h5>
          <div class="table-responsive text-nowrap">
            <table class="table table-striped table-borderless">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Deskripsi</th>
                </tr>
              </thead>
              <tbody class="table-border-bottom-0">
                <tr v-if="listMeeting.length === 0">
                  <td colspan="2">Tidak ada meeting hari ini</td>
                </tr>

                <tr v-else v-for="(item, index) in listMeeting" :key="index">
                  <td>{{ formatTanggal(item.date) }}</td>
                  <td>{{ item.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-lg-6 col-xl-6 order-0 mb-4">
        <div class="card">
          <h5 class="card-header">Cuti Selama 7 hari kedepan</h5>
          <div class="table-responsive text-nowrap">
            <table class="table table-striped table-borderless">
              <thead>
                <tr>
                  <th>Karyawan Cuti</th>
                  <th>Tgl. Cuti</th>
                </tr>
              </thead>
              <tbody class="table-border-bottom-0">
                <tr v-if="listTimeOff.length === 0">
                  <td colspan="2">Tidak ada yang Cuti selama 7 hari kedepan</td>
                </tr>

                <tr v-else v-for="(item, index) in listTimeOff" :key="index">
                  <td>{{ getEmployeeName(item.id_employee) }}</td>
                  <td>{{ formatTanggal(item.start_date) }} - {{ formatTanggal(item.end_date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
