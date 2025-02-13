import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取医院列表 */
export const requestHospitalList = (params: object) => {
  return http.request<requestResult>("get", baseUrlAdmin("hospitals"), {
    params
  });
};
