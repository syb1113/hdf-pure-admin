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

/**修改单个医院信息 */
export const requestEditHospital = (id: string, data: object) => {
  return http.request<requestResult>("patch", baseUrlAdmin(`hospitals/${id}`), {
    data
  });
};

/**删除某个医院 */
export const requsestDelHospital = (id: string) => {
  return http.request<requestResult>("delete", baseUrlAdmin(`hospitals/${id}`));
};

/**获取医生职称列表 */
export const requsestDoctortitles = (params?: object) => {
  return http.request<requestResult>("get", baseUrlAdmin(`doctor_titles`), {
    params
  });
};

/**获取科室列表 */
export const requsestDepartments = (params?: object) => {
  return http.request<requestResult>("get", baseUrlAdmin(`departments`), {
    params
  });
};

/**获取医生标签 */
export const requsestDoctorTags = (params?: object) => {
  return http.request<requestResult>("get", baseUrlAdmin(`doctor_tags`), {
    params
  });
};

/**单个职称删除 */
export const requestDocTitleDel = (id: string) => {
  return http.request<requestResult>(
    "delete",
    baseUrlAdmin(`doctor_titles/${id}`)
  );
};

/**单个科室删除 */
export const requestDocDepartmentsDel = (id: string) => {
  return http.request<requestResult>(
    "delete",
    baseUrlAdmin(`departments/${id}`)
  );
};

/**单个医生标签删除 */
export const requestDocTagsDel = (id: string) => {
  return http.request<requestResult>(
    "delete",
    baseUrlAdmin(`doctor_tags/${id}`)
  );
};
