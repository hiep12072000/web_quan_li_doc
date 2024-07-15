export enum Role {
  'Quản trị viên' = 0,
  'Người dùng' = 1,
  // 'Hệ thống' = 9,
}

export type UserInfo = {
  id: string;
  name: string;
  username: string;
  role: Role;
  resetId: string;
};
