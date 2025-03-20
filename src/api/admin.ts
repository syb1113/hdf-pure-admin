import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取管理员信息列表 */
export const requestAdminList = (params: object) => {
  return http.request<requestResult>("get", baseUrlAdmin("managers"), {
    params
  });
};

/**添加管理员 */
export const requestAdminAdd = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("managers"), {
    data
  });
};

/** 获取单个管理员信息 */
export const requestAdminDetails = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`managers/${id}`));
};

/** 修改管理员信息*/
export const requestAdminModify = (id: string, data: object) => {
  return http.request<requestResult>("patch", baseUrlAdmin(`managers/${id}`), {
    data
  });
};

/** 删除管理员 */
export const requestAdminDelete = (id: string) => {
  return http.request<requestResult>("delete", baseUrlAdmin(`managers/${id}`));
};
