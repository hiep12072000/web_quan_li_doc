<template>
  <div>
    <div
      class="relative mx-auto grid w-[32rem] cursor-pointer grid-cols-2 rounded bg-sky-100 text-center font-semibold"
    >
      <div
        class="absolute z-10 h-full w-1/2 p-0.5 transition-all"
        :class="direction === 'in' ? 'translate-x-full' : ''"
      >
        <div class="h-full w-full rounded bg-white shadow"></div>
      </div>
      <div class="z-20 py-4" @click="direction = 'out'">Văn bản đi</div>
      <div class="z-20 py-4" @click="direction = 'in'">Văn bản đến</div>
    </div>

    <table class="dms-table mt-4 w-full">
      <thead>
        <tr>
          <th width="100px">Số VB</th>
          <th width="200px">Tiêu đề</th>
          <th width="110px">Ngày gửi</th>
          <th width="400px">Trích yếu nội dung</th>
          <th width="60px">Xem</th>
          <th width="60px">Xóa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc of data || []" :key="doc.id">
          <td>{{ doc.code }}</td>
          <td>{{ doc.title }}</td>
          <td>{{ doc.date }}</td>
          <td>{{ doc.content }}</td>
          <td class="text-center">
            <NuxtLink :to="{ name: 'doc-editor', query: { id: doc.id } }">
              <span class="text-sky-600 hover:underline">Xem</span>
            </NuxtLink>
          </td>
          <td class="text-center">
            <Icon
              name="fa6-solid:trash-can"
              class="cursor-pointer"
              @click="remove(doc.id)"
            />
          </td>
        </tr>
        <tr v-if="data === null || data.length === 0">
          <td colspan="3">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: 'My home page',
  alias: '/',
});
useSetHeader('Danh sách văn bản');

const direction = ref<'in' | 'out'>('out');

const { $client } = useNuxtApp();
const { data, refresh, error } = await $client.doc.list.useQuery(
  computed(() => ({
    direction: direction.value === 'in' ? 2 : 1,
  })),
);
useErrorHandler(error);

const { executer: remove } = useMutationErrorHandler(async (id: string) => {
  const confirm = await useDisplayConfirm({
    title: 'Xóa văn bản?',
    message: 'Bạn chắc chắn muốn xóa văn bản này chứ?',
  });
  if (confirm) {
    await $client.doc.remove.mutate(id);
    await refresh();
  }
});
</script>
