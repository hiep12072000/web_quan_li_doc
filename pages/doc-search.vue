<template>
  <div>
    <div class="mx-auto w-[44rem]">
      <div class="mb-2 grid grid-cols-2 text-center">
        <form-switch
          v-model="direction1"
          label="Văn bản đi:"
          name="direction"
          align="vertical"
          bg-change
          :options="[
            { value: '1', label: '' },
            { value: '2', label: '' },
          ]"
        />
        <form-switch
          v-model="direction2"
          label="Văn bản đến:"
          name="direction"
          align="vertical"
          bg-change
          :options="[
            { value: '1', label: '' },
            { value: '2', label: '' },
          ]"
        />
      </div>
      <form-input
        v-if="mode === 'basic'"
        v-model="form.searchKey"
        label="Từ khóa:"
        name="searchKey"
      />
      <div v-else class="grid grid-cols-2 gap-x-4 gap-y-2">
        <form-input
          v-model="form.code"
          label="Số, ký hiệu văn bản:"
          name="code"
        />
        <div>
          <div class="flex flex-col">
            <label class="mb-1 font-semibold"> Loại văn bản: </label>
            <div class="flex flex-wrap gap-x-4">
              <label
                v-for="dt of docTypes || []"
                :key="dt.id"
                class="inline-block cursor-pointer whitespace-nowrap"
              >
                <input
                  v-model="docType[dt.id]"
                  :value="dt.id"
                  type="checkbox"
                  class="mb-1 mr-1"
                />
                {{ dt.name }}
              </label>
            </div>
          </div>
        </div>
        <form-input v-model="form.signer" label="Người ký:" name="signer" />
        <form-input
          v-model="form.date"
          label="Ngày văn bản:"
          type="date"
          name="date"
        />
        <form-input
          v-model="form.receiveUnit"
          label="Nơi nhận:"
          name="receiveUnit"
        />
        <form-input
          v-model="form.receiver"
          label="Đơn vị hoặc người nhận bản lưu:"
          name="receiver"
        />
        <form-textarea
          v-model="form.content"
          label="Trích yếu:"
          name="content"
          class="col-span-2"
        />
      </div>
      <div class="mt-4 text-center">
        <form-button
          type="button"
          mode="primary"
          class="mr-2"
          @click="
            page = 1;
            search();
          "
        >
          <Icon name="fa6-solid:magnifying-glass" class="mr-2" />Tìm kiếm
        </form-button>
        <form-button
          type="button"
          mode="success"
          class="mr-2"
          @click="changeMode"
        >
          <Icon name="fa6-solid:gears" class="mr-2" />Tìm kiếm
          {{ mode === 'basic' ? 'nâng cao' : 'căn bản' }}
        </form-button>
        <form-button type="button" mode="warning" @click="clearForm">
          <Icon name="fa6-solid:eraser" class="mr-2" />Xóa điều kiện tìm kiếm
        </form-button>
      </div>
    </div>
    <table class="dms-table mt-4 w-full">
      <thead>
        <tr>
          <th width="100px">Số VB</th>
          <th width="200px">Tiêu đề</th>
          <th width="110px">Ngày gửi</th>
          <th width="400px">Trích yếu nội dung</th>
          <th width="60px">Xem</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc of result?.data || []" :key="doc.id">
          <td>{{ doc.code }}</td>
          <td>{{ doc.title }}</td>
          <td>{{ doc.date }}</td>
          <td>{{ doc.content }}</td>
          <td class="text-center">
            <NuxtLink :to="{ name: 'doc-editor', query: { id: doc.id } }">
              <span class="text-sky-600 hover:underline">Xem</span>
            </NuxtLink>
          </td>
        </tr>
        <tr v-if="!result?.data || result.data.length === 0">
          <td colspan="3">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
    <div v-if="result && result.count > 0" class="mt-4 text-center">
      <div class="inline-block space-x-1 rounded bg-sky-100 p-0.5">
        <div
          :class="paginationClass(1, true)"
          @click="
            page = 1;
            search();
          "
        >
          Trang đầu
        </div>
        <div
          v-for="i in range(1, Math.ceil(result.count / LIMIT) + 1)"
          :key="i"
          :class="paginationClass(i)"
          @click="
            page = i;
            search();
          "
        >
          {{ i }}
        </div>
        <div
          :class="paginationClass(Math.ceil(result.count / LIMIT), true)"
          @click="
            page = Math.ceil(result.count / LIMIT);
            search();
          "
        >
          Trang cuối
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import range from 'lodash/range';

useSetHeader('Tìm kiếm văn bản');

const LIMIT = 10;

const mode = ref<'basic' | 'advanced'>('basic');
const direction1 = ref('1');
const direction2 = ref('2');
const direction = computed(() => {
  const result = [] as number[];
  if (direction1.value === '1') result.push(1);
  if (direction2.value === '1') result.push(2);
  return result;
});
const docType = reactive<Record<string, boolean>>({});
const form = reactive({
  searchKey: '',
  code: '',
  signer: '',
  date: '',
  receiveUnit: '',
  receiver: '',
  content: '',
  documentTypeId: [] as string[],
});
const page = ref(1);
const searchForm = ref({
  ...form,
  direction: direction.value,
  skip: (page.value - 1) * 10,
  limit: LIMIT,
});

const clearForm = () => {
  form.code = '';
  form.signer = '';
  form.date = '';
  form.receiveUnit = '';
  form.receiver = '';
  form.content = '';
  form.searchKey = '';
  Object.keys(docType).forEach((id) => (docType[id] = false));
};

const changeMode = () => {
  mode.value = mode.value === 'basic' ? 'advanced' : 'basic';
  clearForm();
};

const { $client } = useNuxtApp();
const { data: result, error } = await $client.doc.search.useQuery(searchForm);
useErrorHandler(error);

const search = () => {
  searchForm.value = {
    ...form,
    documentTypeId: Object.keys(docType).filter((id) => docType[id]),
    direction: direction.value,
    skip: (page.value - 1) * LIMIT,
    limit: LIMIT,
  };
};

const { data: docTypes, error: docTypeListError } =
  await $client.docType.list.useQuery();
useErrorHandler(docTypeListError);

const paginationClass = (pageNumber: number, metaButton = false) => {
  let className = 'inline-block rounded p-2 transition-all';
  if (pageNumber !== page.value) {
    className += ' hover:bg-white cursor-pointer hover:shadow';
  } else {
    className += ' cursor-default';

    if (!metaButton) {
      className += ' bg-white shadow';
    }
  }

  return className;
};
</script>
