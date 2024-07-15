<template>
  <div class="mx-auto w-[44rem]">
    <form @submit.prevent="submit">
      <div class="grid grid-cols-2 gap-x-4 gap-y-2">
        <form-input
          v-model="form.title"
          label="Tiêu đề:"
          name="title"
          class="col-span-2"
          :disabled="mode === 'view'"
          :error="error?.title"
        />
        <form-input
          v-model="form.code"
          label="Số, ký hiệu văn bản:"
          name="code"
          :disabled="mode === 'view'"
          :error="error?.code"
        />
        <form-switch
          v-model="form.direction"
          label="Gửi hay nhận:"
          name="direction"
          required
          :options="[
            { value: '1', label: 'Gửi' },
            { value: '2', label: 'Nhận' },
          ]"
          :disabled="mode === 'view'"
          :error="error?.direction"
        />
        <form-select
          v-model="form.documentTypeId"
          label="Loại văn bản:"
          name="documentTypeId"
          required
          value-is-string
          :options="docTypeOptions"
          :disabled="mode === 'view'"
          :error="error?.documentTypeId"
        />
        <form-input
          v-model="form.signer"
          label="Người ký:"
          name="signer"
          required
          :disabled="mode === 'view'"
          :error="error?.signer"
        />
        <form-input
          v-model="form.date"
          label="Ngày văn bản:"
          type="date"
          name="date"
          required
          :disabled="mode === 'view'"
          :error="error?.date"
        />
        <form-input
          v-model="form.quantity"
          label="Số lượng bản:"
          type="number"
          name="quantity"
          required
          :disabled="mode === 'view'"
          :error="error?.quantity"
        />
        <form-input
          v-model="form.receiveUnit"
          label="Nơi nhận:"
          name="receiveUnit"
          required
          :disabled="mode === 'view'"
          :error="error?.receiveUnit"
        />
        <form-input
          v-model="form.receiver"
          label="Đơn vị hoặc người nhận bản lưu:"
          name="receiver"
          required
          :disabled="mode === 'view'"
          :error="error?.receiver"
        />
        <form-textarea
          v-model="form.content"
          label="Trích yếu:"
          name="content"
          class="col-span-2"
          required
          :disabled="mode === 'view'"
          :error="error?.content"
        />
        <form-input
          v-model="form.description"
          label="Ghi chú:"
          name="description"
          class="col-span-2"
          required
          :disabled="mode === 'view'"
          :error="error?.description"
        />
      </div>
      <div class="mt-2 space-y-2 font-semibold">
        <div class="space-x-2">
          File văn bản:
          <form-button
            v-if="mode !== 'view'"
            type="button"
            mode="success"
            @click="handleUploadButton"
          >
            <Icon name="fa6-solid:cloud-arrow-up" class="mr-2" />Tải lên
          </form-button>
          <form-button
            v-if="fileAsBase64"
            type="button"
            mode="primary"
            @click="handleDownloadButton"
          >
            <Icon name="fa6-solid:cloud-arrow-down" class="mr-2" />Tải xuống
          </form-button>
          <form-button
            v-if="fileAsBase64 && mode !== 'view'"
            type="button"
            mode="danger"
            @click="handleDeleteButton"
          >
            <Icon name="fa6-solid:file-circle-minus" class="mr-2" />Xóa
          </form-button>
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            @change="handleFileChange"
          />
          <div
            v-show="fileAsBase64"
            ref="filePreview"
            class="mt-2 max-h-96 overflow-auto rounded border border-sky-100 p-2 text-center"
          >
            <img
              v-if="!isPdf"
              :src="fileAsBase64"
              class="inline-block w-full"
            />
            <div id="canvas-container" class="w-full">
              <canvas
                v-for="(_val, index) of [...Array(numPages)]"
                :id="`pdf-canvas-${index}`"
                :key="index"
              />
            </div>
          </div>
        </div>
        <div>
          Người nhập văn bản này:
          <span class="font-bold">{{ form.createdUserName }}</span>
        </div>
        <div
          class="-mx-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded bg-sky-100 p-4"
        >
          <label class="col-span-2 cursor-pointer">
            Văn bản này cần phải được xử lý và phản hồi:
            <input
              type="checkbox"
              class="ml-2 h-6 w-6 -translate-y-0.5"
              :checked="form.needReply"
              :disabled="mode === 'view'"
              @change="
                (e) => (form.needReply = (e.target as HTMLInputElement).checked)
              "
            />
          </label>
          <template v-if="form.needReply">
            <form-select
              v-model="form.replyBy"
              label="Người xử lí:"
              name="replyBy"
              value-is-string
              blank-value
              required
              :options="userOptions"
              :disabled="mode === 'view'"
              :error="error?.replyBy"
            />
            <form-input
              v-model="form.replyDeadline"
              label="Hạn cuối để xử lí:"
              name="replyDeadline"
              type="date"
              required
              :disabled="mode === 'view'"
              :error="error?.replyDeadline"
            />
            <div>Tình trạng: Đang xử lí</div>
          </template>
        </div>
      </div>
      <div class="mt-4 space-x-2 text-center">
        <NuxtLink
          :to="{ name: 'doc-editor', query: { replyTo: route.query.id } }"
        >
          <form-button
            v-if="mode !== 'add' && doc?.replyBy === userInfo?.id"
            type="button"
            mode="success"
          >
            <Icon name="fa6-solid:paper-plane" class="mr-2" />
            Tạo văn bản phản hồi
          </form-button>
        </NuxtLink>
        <form-button v-if="mode === 'edit' || mode === 'add'" mode="primary">
          <Icon name="fa6-solid:floppy-disk" class="mr-2" />Lưu lại
        </form-button>
        <form-button v-if="mode === 'edit'" type="button" mode="danger">
          <Icon name="fa6-solid:trash-can" class="mr-2" @click="remove" />
          Xóa văn bản
        </form-button>
        <NuxtLink :to="{ name: 'doc-list' }">
          <form-button type="button">
            <Icon name="humbleicons:arrow-go-back" class="mr-2" />Quay lại
          </form-button>
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { reduce } from 'lodash';
import * as pdfjs from 'pdfjs-dist';

import { messages, titles } from '~/factory/constants';
import { Role } from '~/factory/types/auth';
import { downloadFile, sleep } from '~/utils';

pdfjs.GlobalWorkerOptions.workerSrc =
  '//cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.js';

useSetHeader('Chi tiết văn bản');

const { $client } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const { userInfo } = useAuth();
const mode = ref<'add' | 'edit' | 'view'>('add');
const defaultFormData = {
  id: '',
  title: '',
  code: '',
  direction: '1',
  documentTypeId: '',
  content: '',
  description: '',
  receiveUnit: '',
  receiver: '',
  signer: '',
  quantity: 1,
  date: '',
  createdUserName: userInfo.value?.name || '',
  createdBy: userInfo.value?.id || '',
  needReply: false,
  replyBy: '',
  replyDeadline: '',
  replyTo: '',
  filePath: '',
};
const form = reactive({
  ...defaultFormData,
});

const { data: docTypes, error: docTypeListError } =
  await $client.docType.list.useQuery();
const docTypeOptions = computed(() =>
  reduce(
    docTypes.value,
    (result, dt) => {
      result[dt.id] = dt.name;
      return result;
    },
    {} as Record<string, string>,
  ),
);
useErrorHandler(docTypeListError);
form.documentTypeId = docTypes.value?.[0].id || '';

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

const {
  data: doc,
  error: getDocError,
  refresh: getDocData,
} = await $client.doc.get.useLazyQuery(
  computed(() => String(route.query.id)),
  { immediate: false },
);
useErrorHandler(getDocError);

const fileAsBase64 = ref('');
const fileName = ref('');
const isPdf = ref(false);
let pdfViewportScale = 1;
const numPages = ref(0);
const filePreview = ref<HTMLDivElement | null>(null);

const renderPdfFile = async (fileUrl: string) => {
  isPdf.value = true;
  const pdf = await pdfjs.getDocument({ url: fileUrl }).promise;

  numPages.value = pdf.numPages;
  await sleep(100); // wait until element rendered

  const container = document.getElementById('canvas-container');
  const pdfPage = await pdf.getPage(1);
  let viewport = pdfPage.getViewport({ scale: pdfViewportScale });
  pdfViewportScale = (container!.clientWidth - 20) / viewport.width;
  viewport = pdfPage.getViewport({ scale: pdfViewportScale });
  for (let i = 0; i < numPages.value; i++) {
    const pdfCanvas = <HTMLCanvasElement>(
      document.getElementById(`pdf-canvas-${i}`)
    );
    const pdfContext = pdfCanvas.getContext('2d')!;
    const pdfPage = await pdf.getPage(i + 1);
    pdfCanvas.height = viewport.height;
    pdfCanvas.width = viewport.width;
    pdfPage.render({
      canvasContext: pdfContext,
      viewport,
    });
  }
};

watch(
  () => route.query,
  async () => {
    if (route.query.id) {
      mode.value = 'edit';
      await getDocData();
      if (doc.value) {
        if (
          Number(userInfo.value?.role) !== 9 &&
          userInfo.value?.role !== Role['Quản trị viên'] &&
          doc.value.createdBy !== userInfo.value?.id
        ) {
          mode.value = 'view';
        }

        form.id = doc.value.id;
        form.title = doc.value.title || '';
        form.code = doc.value.code;
        form.direction = String(doc.value.direction);
        form.documentTypeId = doc.value.documentTypeId;
        form.content = doc.value.content;
        form.description = doc.value.description || '';
        form.receiveUnit = doc.value.receiveUnit || '';
        form.receiver = doc.value.receiver || '';
        form.date = doc.value.date;
        form.signer = doc.value.signer || '';
        form.needReply = doc.value.needReply;
        form.replyBy = doc.value.replyBy || '';
        form.replyDeadline = doc.value.replyDeadline || '';
        form.createdUserName = doc.value.createdUser.name;

        fileAsBase64.value = doc.value.fileAsBase64 || '';
        fileName.value = doc.value.fileName || '';

        if (fileName.value.includes('.pdf') && fileAsBase64.value) {
          await renderPdfFile(fileAsBase64.value);
        }
      }
    } else {
      mode.value = 'add';
      form.id = defaultFormData.id;
      form.title = defaultFormData.title;
      form.code = defaultFormData.code;
      form.direction = defaultFormData.direction;
      form.documentTypeId = defaultFormData.documentTypeId;
      form.content = defaultFormData.content;
      form.description = defaultFormData.description;
      form.receiveUnit = defaultFormData.receiveUnit;
      form.receiver = defaultFormData.receiver;
      form.signer = defaultFormData.signer;
      form.quantity = defaultFormData.quantity;
      form.date = defaultFormData.date;
      form.createdUserName = defaultFormData.createdUserName;
      form.createdBy = defaultFormData.createdBy;
      form.needReply = defaultFormData.needReply;
      form.replyBy = defaultFormData.replyBy;
      form.replyDeadline = defaultFormData.replyDeadline;
      form.replyTo = (route.query.replyTo as string) || defaultFormData.replyTo;
      form.filePath = defaultFormData.filePath;

      fileAsBase64.value = '';
      fileName.value = '';
    }
  },
  { immediate: true },
);

const convertBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const handleFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files?.length) {
    const pickedFile = files[0];

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];
    const maxFileSize = 1024 * 1024; // 1MB in bytes

    const fileExtension = '.' + pickedFile.name.split('.').pop();

    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      useDisplayFlashMessage({
        mode: 'danger',
        message: messages.fileExtensionNotAllowed,
      });
      (event.target as HTMLInputElement).value = '';
      return;
    }

    if (pickedFile.size > maxFileSize) {
      useDisplayFlashMessage({
        mode: 'danger',
        message: messages.fileTooBig,
      });
      (event.target as HTMLInputElement).value = '';
      return;
    }

    filePreview.value!.scrollTo({ top: 0 });

    fileAsBase64.value = await convertBase64(pickedFile);
    fileName.value = pickedFile.name;

    if (fileExtension === '.pdf') {
      await renderPdfFile(URL.createObjectURL(pickedFile));
    } else {
      isPdf.value = false;
      numPages.value = 0;
    }
  }
};

const fileInput = ref<HTMLInputElement | null>(null);
const handleUploadButton = () => fileInput.value!.click();
const handleDeleteButton = () => {
  fileAsBase64.value = '';
  fileName.value = '';
};
const handleDownloadButton = () => {
  downloadFile(fileAsBase64.value, fileName.value);
};

const { executer: submit, error } = useMutationErrorHandler(async () => {
  if (mode.value === 'add') {
    const newDoc = await $client.doc.add.mutate({
      ...form,
      direction: Number(form.direction),
      fileAsBase64: fileAsBase64.value,
      fileName: fileName.value,
    });
    router.replace({ name: 'doc-editor', query: { id: newDoc.id } });
  } else {
    await $client.doc.edit.mutate({
      ...form,
      direction: Number(form.direction),
      id: String(route.query.id),
      fileAsBase64: fileAsBase64.value,
      fileName: fileName.value,
    });
  }
  useDisplayFlashMessage({
    mode: 'success',
    message: 'Lưu văn bản thành công!',
  });
});

const { executer: remove } = useMutationErrorHandler(async (id: string) => {
  const confirmed = await useDisplayConfirm({
    title: titles.delete,
    message: messages.deleteConfirmation,
  });
  if (confirmed) {
    await $client.doc.remove.mutate(id);
    router.push({ name: 'doc-list' });
  }
});
</script>
