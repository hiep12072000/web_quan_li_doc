<template>
  <div class="m-auto max-w-[36rem]">
    <div class="mb-2 text-right">
      <form-button mode="success" type="button" @click="showAddModal">
        <Icon name="fa6-solid:plus" class="mr-2" />Thêm mới
      </form-button>
    </div>
    <div>
      <table class="dms-table">
        <thead>
          <tr>
            <th width="300px">Tên loại văn bản</th>
            <th width="50px">Sửa</th>
            <th width="50px">Xóa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="docType of data || []" :key="docType.id">
            <td>{{ docType.name }}</td>
            <td class="text-center">
              <Icon
                name="fa6-solid:pen-to-square"
                class="cursor-pointer"
                @click="showEditModal(docType)"
              />
            </td>
            <td class="text-center">
              <Icon
                name="fa6-solid:trash-can"
                class="cursor-pointer"
                @click="deleteDocType(docType.id)"
              />
            </td>
          </tr>
          <tr v-if="data === null || data.length === 0">
            <td colspan="3">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
    <modal v-model:show="modalData.show" :title="modalData.title">
      <form-input
        v-model="form.name"
        name="name"
        label="Tên loại văn bản:"
        placeholder="1 đến 20 ký tự"
        :required="true"
        :error="error?.name"
      />
      <template #button>
        <form-button mode="primary" type="button" @click="submit">
          <Icon name="fa6-solid:floppy-disk" class="mr-2" />Lưu
        </form-button>
      </template>
    </modal>
  </div>
</template>
<script setup lang="ts">
import { messages, titles } from '~/factory/constants';

useSetHeader('Quản lý loại văn bản');

const { $client } = useNuxtApp();
const modalData = reactive({
  show: false,
  title: '',
  mode: 'add' as 'add' | 'edit',
});
const form = reactive({ name: '', id: '' });

const {
  data,
  refresh,
  error: doctTypeListError,
} = await $client.docType.list.useQuery();
useErrorHandler(doctTypeListError);

const { executer: submit, error } = useMutationErrorHandler(async () => {
  modalData.mode === 'edit'
    ? await $client.docType.edit.mutate(form)
    : await $client.docType.add.mutate({
        name: form.name,
      });
  await refresh();
  modalData.show = false;
});

const { executer: deleteDocType } = useMutationErrorHandler(
  async (id: string) => {
    const confirmed = await useDisplayConfirm({
      title: titles.delete,
      message: messages.deleteConfirmation,
    });
    if (confirmed) {
      await $client.docType.remove.mutate({ id });
      await refresh();
    }
  },
);

const showAddModal = () => {
  error.value = null;
  form.name = '';
  modalData.mode = 'add';
  modalData.title = 'Thêm mới loại văn bản';
  modalData.show = true;
};

const showEditModal = (data: typeof form) => {
  error.value = null;
  modalData.mode = 'edit';
  modalData.title = 'Chỉnh sửa loại văn bản';
  modalData.show = true;
  form.id = data.id;
  form.name = data.name;
};
</script>
