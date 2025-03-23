import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取医院列表 */
export const requestHospitalList = (params: object = { page: 1, per: 999 }) => {
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
export const requsestDoctortitles = (
  params: object = { page: 1, per: 999 }
) => {
  return http.request<requestResult>("get", baseUrlAdmin(`doctor_titles`), {
    params
  });
};

/**获取科室列表 */
export const requsestDepartments = (params: object = { page: 1, per: 999 }) => {
  return http.request<requestResult>("get", baseUrlAdmin(`departments`), {
    params
  });
};

/**获取医生标签 */
export const requsestDoctorTags = (params: object = { page: 1, per: 999 }) => {
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

/**单个职称获取 */
export const requestOneDocTitle = (id: string) => {
  return http.request<requestResult>(
    "get",
    baseUrlAdmin(`doctor_titles/${id}`)
  );
};

/**单个科室获取 */
export const requestOneDocDepartments = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`departments/${id}`));
};

/**单个医生标签获取 */
export const requestOneDocTags = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`doctor_tags/${id}`));
};

/**修改单个职称*/
export const requestOneDocTitleUp = (data: object, id: string) => {
  return http.request<requestResult>(
    "patch",
    baseUrlAdmin(`doctor_titles/${id}`),
    {
      data
    }
  );
};

/**修改单个科室*/
export const requestOneDocDepartmentsUp = (data: object, id: string) => {
  return http.request<requestResult>(
    "patch",
    baseUrlAdmin(`departments/${id}`),
    {
      data
    }
  );
};

/**修改医生标签 */
export const requestOneDocTagsUp = (data: object, id: string) => {
  return http.request<requestResult>(
    "patch",
    baseUrlAdmin(`doctor_tags/${id}`),
    {
      data
    }
  );
};

/**新增医生职称 */
export const requestAddDoctortitles = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("doctor_titles"), {
    data
  });
};

/**新增医生标签 */
export const requestAddDocTags = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("doctor_tags"), {
    data
  });
};

/**新增科室信息 */
export const requestAddDocDepartments = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("departments"), {
    data
  });
};
