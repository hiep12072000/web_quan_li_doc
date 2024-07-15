<template>
  <div class="m-auto max-w-[36rem]">
    <table class="dms-table mt-4 w-full">
      <thead>
        <tr>
          <th width="100px">Số VB</th>
          <th width="300px">Tiêu đề</th>
          <th width="200px">Ngày hết hạn</th>
          <th width="60px">Xóa</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="doc of data || []"
          :key="doc.id"
          :class="{ 'cursor-pointer': !isExpired(doc.replyDeadline) }"
          @click="gotoDoc(doc.id)"
        >
          <td :class="{ 'text-gray-500': isExpired(doc.replyDeadline) }">
            {{ doc.code }}
          </td>
          <td :class="{ 'text-gray-500': isExpired(doc.replyDeadline) }">
            {{ doc.title ? doc.title : '\<Không có tiêu đề\>' }}
          </td>
          <td
            class="text-center"
            :class="{ 'text-gray-500': isExpired(doc.replyDeadline) }"
          >
            {{ replyDeadline(doc.replyDeadline) }}
          </td>
          <td class="text-center">
            <Icon
              name="fa6-solid:trash-can"
              class="cursor-pointer"
              @click.prevent.stop="remove(doc.id)"
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
import dayjs from 'dayjs';

import { messages, titles } from '~/factory/constants';

useSetHeader('Thông báo');

const { $client } = useNuxtApp();

const { data, error, refresh } = $client.doc.assignedToMe.useQuery();
useErrorHandler(error);

const { executer: remove } = useMutationErrorHandler(async (id: string) => {
  const confirmed = await useDisplayConfirm({
    title: titles.delete,
    message: messages.deleteConfirmation,
  });
  if (confirmed) {
    await $client.doc.ignoreDocReply.mutate(id);
    await refresh();
  }
});

const isExpired = (d: string | null) =>
  !d ? false : dayjs(d).isBefore(dayjs(new Date()));

const replyDeadline = (d: string | null) => {
  if (!d) return '';

  let dateStr = date(d);
  if (isExpired(d)) {
    dateStr += ' (Đã hết hạn)';
  }
  return dateStr;
};

const router = useRouter();
const gotoDoc = (id: string) => {
  router.push({ name: 'doc-editor', query: { id } });
};
</script>
