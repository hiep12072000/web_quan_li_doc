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
            <th width="300px">Họ và tên</th>
            <th width="150px">Quyền hạn</th>
            <th width="50px">Sửa</th>
            <th width="50px">Xóa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user of data || []" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ Role[user.role] }}</td>
            <td class="text-center">
              <Icon
                name="fa6-solid:pen-to-square"
                class="cursor-pointer"
                @click="showEditModal(user)"
              />
            </td>
            <td class="text-center">
              <Icon
                name="fa6-solid:trash-can"
                class="cursor-pointer"
                @click="deleteUser(user.id)"
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
      <div class="space-y-2">
        <form-input
          v-model="form.username"
          name="username"
          label="Tên đăng nhập:"
          placeholder="4 đến 20 ký tự"
          required
          :disabled="modalData.mode === 'edit'"
          :error="error?.username"
        />
        <form-input
          v-model="form.name"
          name="name"
          label="Họ và tên:"
          placeholder="4 đến 20 ký tự"
          required
          :error="error?.name"
        />
        <form-input
          v-model="form.password"
          name="password"
          type="password"
          label="Mật khẩu:"
          placeholder="8 đến 20 ký tự"
          :required="modalData.mode == 'add'"
          :tips="
            modalData.mode === 'edit'
              ? '(Để trống nếu không muốn thay đổi)'
              : ''
          "
          :error="error?.password"
        />
        <form-input
          v-model="form.repeatPassword"
          name="repeatPassword"
          type="password"
          label="Nhập lại mật khẩu:"
          placeholder="8 đến 20 ký tự"
          :required="modalData.mode == 'add'"
          :tips="
            modalData.mode === 'edit'
              ? '(Để trống nếu không muốn thay đổi)'
              : ''
          "
          :error="error?.repeatPassword"
        />
        <form-select
          v-model="form.role"
          name="role"
          label="Quyền hạn:"
          required
          :options="Role"
          :error="error?.role"
        />
      </div>
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
import { Role } from '~/factory/types/auth';

definePageMeta({
  title: 'Danh sách người dùng',
  roles: [Role['Quản trị viên'], 9],
});

useSetHeader('Quản lý người dùng');

const { $client } = useNuxtApp();
const modalData = reactive({
  show: false,
  title: '',
  mode: 'add' as 'add' | 'edit',
});
const form = reactive({
  username: '',
  name: '',
  id: '',
  password: '',
  repeatPassword: '',
  role: 1,
});

const {
  data,
  refresh,
  error: userListError,
} = await $client.user.list.useQuery();
useErrorHandler(userListError);

const { executer: submit, error } = useMutationErrorHandler(async () => {
  if (form.password !== form.repeatPassword) {
    throw { callbackErrors: { repeatPassword: [messages.passwordNotMatch] } };
  }

  if (modalData.mode === 'edit') {
    await $client.user.edit.mutate({
      id: form.id,
      name: form.name,
      password: form.password,
    });
  } else {
    await $client.user.add.mutate({
      username: form.username,
      name: form.name,
      password: form.password,
      role: String(form.role),
    });
  }
  await refresh();
  modalData.show = false;
});

const { executer: deleteUser } = useMutationErrorHandler(async (id: string) => {
  const confirmed = await useDisplayConfirm({
    title: titles.delete,
    message: messages.deleteConfirmation,
  });
  if (confirmed) {
    await $client.user.remove.mutate({ id });
    await refresh();
  }
});

const showAddModal = () => {
  error.value = null;
  form.name = '';
  form.username = '';
  form.role = Role['Người dùng'];
  form.password = '';
  form.repeatPassword = '';
  modalData.mode = 'add';
  modalData.title = 'Thêm người dùng mới';
  modalData.show = true;
};

const showEditModal = (
  data: Omit<typeof form, 'password' | 'repeatPassword'>,
) => {
  error.value = null;
  form.id = data.id;
  form.name = data.name;
  form.username = data.username;
  form.role = data.role;
  form.password = '';
  form.repeatPassword = '';
  modalData.mode = 'edit';
  modalData.title = 'Chỉnh sửa thông tin người dùng';
  modalData.show = true;
};
</script>
