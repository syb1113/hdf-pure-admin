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

/**新增医院 */
export const requestAddHospital = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("hospitals"), {
    data
  });
};

/**获取单个医院信息 */
export const requestHostpitalDetails = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`hospitals/${id}`));
};
