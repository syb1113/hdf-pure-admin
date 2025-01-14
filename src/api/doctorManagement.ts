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
