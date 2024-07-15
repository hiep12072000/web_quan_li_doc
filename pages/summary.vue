<template>
  <div>
    <div class="grid grid-cols-3 gap-4">
      <form-input
        v-model="form.date.from"
        label="Từ ngày:"
        type="date"
        name="dateFrom"
      />
      <form-input
        v-model="form.date.to"
        label="Đến ngày:"
        type="date"
        name="dateTo"
      />
      <form-select
        v-model="form.userId"
        label="Người xử lí:"
        name="userId"
        value-is-string
        :options="userOptions"
      />
    </div>
    <div v-show="result" class="mt-12 grid grid-cols-2 px-16">
      <div class="text-center">
        <div class="inline-block rounded bg-blue-100 px-4 py-2 text-left">
          <div>
            <span class="font-semibold"> Đã tạo: </span>
            {{ result?.createdDoc }} văn bản
          </div>
          <div>
            <span class="font-semibold">Số văn bản trả lời đúng hạn: </span>
            {{ result?.fulfilledDoc }}
          </div>
          <div>
            <span class="font-semibold">Số văn bản trả lời quá hạn: </span>
            {{ result?.overlookedDoc }}
          </div>
        </div>
      </div>
      <div class="h-96">
        <canvas
          v-show="result?.fulfilledDoc || result?.overlookedDoc"
          ref="ctx"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ArcElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  Tooltip,
} from 'chart.js';
import dayjs from 'dayjs';
import reduce from 'lodash/reduce';

useSetHeader('Thống kê');
Chart.register(
  ArcElement,
  LinearScale,
  LineController,
  PieController,
  CategoryScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
);

const form = reactive({
  date: {
    from: dayjs().set('day', 0).format('YYYY-MM-DD'),
    to: dayjs().set('day', 6).format('YYYY-MM-DD'),
  },
  userId: '',
});

const ctx = ref<HTMLCanvasElement | null>(null);
let chart: Chart<'pie'>;

onMounted(() => {
  chart = new Chart(ctx.value!, {
    type: 'pie',
    data: {
      datasets: [
        {
          data: [1],
          borderWidth: 0,
          backgroundColor: ['#4acccd', '#fcc468'],
        },
      ],
      labels: ['Số văn bản trả lời đúng hạn', 'Số văn bản trả lời quá hạn'],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          align: 'center',
          position: 'bottom',
          labels: { usePointStyle: true },
        },
        tooltip: {
          callbacks: {
            label: (val) => {
              const sum = val.dataset.data[0] + val.dataset.data[1];
              return `${Math.round(
                (val.dataset.data[val.dataIndex] * 100) / sum,
              )}%`;
            },
          },
        },
      },
      maintainAspectRatio: false,
    },
  });
});

const { $client } = useNuxtApp();
const {
  data: result,
  error,
  refresh,
} = await $client.doc.summary.useLazyQuery(form, {
  immediate: false,
});
useErrorHandler(error);

watch(
  form,
  async () => {
    await refresh();
    chart.data.datasets[0].data = [
      result.value?.fulfilledDoc || 0,
      result.value?.overlookedDoc || 0,
    ];
    chart.update();
  },
  { deep: true },
);

const { data: users, error: userListError } =
  await $client.user.list.useQuery();
const userOptions = computed(() =>
  reduce(
    users.value,
    (result, dt) => {
      result[dt.id] = dt.name;
      return result;
    },
    {} as Record<string, string>,
  ),
);
useErrorHandler(userListError);
form.userId = users.value?.[0].id || '';
</script>
