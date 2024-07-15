<template>
  <div class="w-scree h-screen overflow-auto bg-zinc-200">
    <alert />
    <div class="mx-auto flex h-full max-w-[80rem] bg-white shadow-md">
      <aside class="border-r-solid w-56 shrink-0 border-r border-blue-100">
        <div class="text-center">
          <img src="/logo.png" alt="logo" class="inline-block h-52 w-52" />
        </div>
        <dl>
          <NuxtLink
            v-for="(menu, i) of permittedMenuItems"
            :key="i"
            :to="{ name: menu.link }"
          >
            <dt
              class="group overflow-hidden px-6 py-4 font-semibold transition-all hover:cursor-pointer"
              :class="
                isActive(menu.link)
                  ? 'bg-sky-100 text-sky-600'
                  : 'hover:bg-sky-50 hover:text-sky-600'
              "
            >
              <span
                class="mr-2 inline-block h-full rounded-md"
                :class="
                  isActive(menu.link)
                    ? 'bg-sky-400 text-sky-400'
                    : '-translate-x-8 bg-zinc-400 text-zinc-400 transition-all group-hover:translate-x-0 group-hover:bg-sky-400 group-hover:text-sky-400'
                "
              >
                .
              </span>
              {{ menu.label }}
            </dt>
          </NuxtLink>
        </dl>
      </aside>
      <div class="flex flex-auto flex-col">
        <header
          class="relative z-10 flex flex-shrink-0 border-b border-sky-100 bg-white"
        >
          <div class="flex-auto border-r border-sky-100 p-4 text-lg font-bold">
            {{ header }}
          </div>
          <div
            class="group relative min-w-[12rem] cursor-pointer bg-white p-2 transition-all hover:bg-sky-50"
          >
            <div class="font-bold text-sky-600">{{ userInfo?.name }}</div>
            <div class="text-xs text-zinc-600">
              {{ Role[userInfo?.role || 0] }}
            </div>

            <div
              class="absolute -top-full left-0 z-[-1] w-full rounded-b bg-white shadow-md shadow-sky-300 transition-all group-hover:top-full"
            >
              <NuxtLink :to="{ name: 'user-change-password' }">
                <div
                  class="flex items-center px-4 py-2 font-semibold transition-all hover:bg-sky-50"
                >
                  <Icon name="fa6-solid:key" class="mr-2 w-5" />
                  Đổi mật khẩu
                </div>
              </NuxtLink>
              <div
                class="flex items-center px-4 py-2 font-semibold transition-all hover:bg-sky-50"
                @click="logout"
              >
                <Icon name="majesticons:logout" class="mr-2 h-5 w-5" />
                Đăng xuất
              </div>
            </div>
          </div>
        </header>
        <div class="flex-auto overflow-y-auto overflow-x-hidden p-4 pb-8">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Role } from '~/factory/types/auth';

const menuItems = [
  { label: 'Xem văn bản', link: 'doc-list' },
  { label: 'Nhập nội dung', link: 'doc-editor' },
  { label: 'Quản lý loại văn bản', link: 'doc-type-list' },
  {
    label: 'Quản lý người dùng',
    link: 'user-list',
    roles: [Role['Quản trị viên'], 9],
  },
  { label: 'Tìm kiếm văn bản', link: 'doc-search' },
  { label: 'Thống kê', link: 'summary' },
  { label: 'Thông báo', link: 'notification' },
];

const { userInfo, accessToken } = useAuth();
const { header } = useHeader();
const route = useRoute();
const router = useRouter();

const permittedMenuItems = computed(() =>
  menuItems.reduce(
    (result, i) => {
      if (
        i.roles &&
        userInfo.value?.role &&
        !i.roles.includes(userInfo.value.role)
      ) {
        return result;
      }
      result.push(i);
      return result;
    },
    [] as typeof menuItems,
  ),
);

const isActive = (name: string) => route.name === name;

const logout = () => {
  accessToken.value = null;
  userInfo.value = null;
  const redirect = route.query.redirect || encodeURIComponent(route.fullPath);
  router.push({ name: 'login', query: { redirect } });
};
</script>
