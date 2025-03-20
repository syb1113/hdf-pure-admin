import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取权限列表 */
export const requestPermissionsList = (params: object) => {
  return http.request<requestResult>("get", baseUrlAdmin("permissions"), {
    params
  });
};

/**添加权限 */
export const requestPermissionsAdd = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("permissions"), {
    data
  });
};

/** 获取单个权限信息 */
export const requestPermissionsDetails = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`permissions/${id}`));
};

/** 修改权限信息*/
export const requestPermissionsModify = (id: string, data: object) => {
  return http.request<requestResult>(
    "patch",
    baseUrlAdmin(`permissions/${id}`),
    {
      data
    }
  );
};

/** 删除权限*/
export const requestPermissionsDelete = (id: string) => {
  return http.request<requestResult>(
    "delete",
    baseUrlAdmin(`permissions/${id}`)
  );
};
