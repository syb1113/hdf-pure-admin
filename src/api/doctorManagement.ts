import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取医生列表 */
export const requestDoctoresList = () => {
  return http.request<requestResult>("get", baseUrlAdmin("doctors"));
};

/**获取职称信息列表 */
export const requestDoctorTitleIdList = () => {
  const params = { per: 999, page: 1 };
  return http.request<requestResult>("get", baseUrlAdmin("doctor_titles"), {
    params
  });
};

/**获取科室信息列表 */
export const requestDepartmentIdList = () => {
  return http.request<requestResult>("get", baseUrlAdmin("departments/all"));
};

/**获取医院信息列表 */
export const requestHospitalIdList = () => {
  const params = { per: 999, page: 1 };
  return http.request<requestResult>("get", baseUrlAdmin("hospitals"), {
    params
  });
};
