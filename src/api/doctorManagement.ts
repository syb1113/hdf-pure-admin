import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取医生列表 */
export const requestDoctoresList = (params: object = { page: 1, per: 999 }) => {
  return http.request<requestResult>("get", baseUrlAdmin("doctors"), {
    params
  });
};

/**获取职称信息列表 */
export const requestDoctorTitleIdList = (
  params: object = { per: 999, page: 1 }
) => {
  return http.request<requestResult>("get", baseUrlAdmin("doctor_titles"), {
    params
  });
};

/**获取科室信息列表 */
export const requestDepartmentIdList = (
  params: object = { per: 999, page: 1 }
) => {
  return http.request<requestResult>("get", baseUrlAdmin("departments/all"), {
    params
  });
};

/**获取医院信息列表 */
export const requestHospitalIdList = (
  params: object = { per: 999, page: 1 }
) => {
  return http.request<requestResult>("get", baseUrlAdmin("hospitals"), {
    params
  });
};

/**添加医生 */
export const requestDoctoresAdd = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("doctors"), {
    data
  });
};

/** 获取单个医生的信息 */
export const requestDoctorDetails = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`doctors/${id}`));
};

/** 修改医生 */
export const requestDoctorModify = (id: string, data: object) => {
  return http.request<requestResult>("patch", baseUrlAdmin(`doctors/${id}`), {
    data
  });
};

/** 删除医生 */
export const requestDoctorDelete = (id: string) => {
  return http.request<requestResult>("delete", baseUrlAdmin(`doctors/${id}`));
};
