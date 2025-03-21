import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取角色列表 */
export const requestRoleList = (params?: object) => {
  return http.request<requestResult>("get", baseUrlAdmin("roles"), {
    params
  });
};

/**添加角色 */
export const requestRoleAdd = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("roles"), {
    data
  });
};

/** 获取单个角色信息 */
export const requestRoleDetails = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`roles/${id}`));
};

/** 修改角色信息*/
export const requestRoleModify = (data: object, id: string) => {
  return http.request<requestResult>("patch", baseUrlAdmin(`roles/${id}`), {
    data
  });
};

/** 删除角色*/
export const requestRoleDelete = (id: string) => {
  return http.request<requestResult>("delete", baseUrlAdmin(`roles/${id}`));
};
