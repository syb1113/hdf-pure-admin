import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取疾病列表 */
export const requestDiseaseList = (params: object = { page: 1, per: 999 }) => {
  return http.request<requestResult>("get", baseUrlAdmin("illnesses"), {
    params
  });
};

/**获取单个疾病信息 */
export const requestOneDisease = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`illnesses/${id}`));
};

/**新增疾病 */
export const requestAddDisease = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("illnesses"), {
    data
  });
};

/**修改单个疾病信息 */
export const requestEditDisease = (id: string, data: object) => {
  return http.request<requestResult>("patch", baseUrlAdmin(`illnesses/${id}`), {
    data
  });
};

/**删除某个疾病*/
export const requsestDelDisease = (id: string) => {
  return http.request<requestResult>("delete", baseUrlAdmin(`illnesses/${id}`));
};

/** 获取疾病分类列表 */
export const requestDiseaseTypeList = (
  params: object = { page: 1, per: 999 }
) => {
  return http.request<requestResult>(
    "get",
    baseUrlAdmin("illness_categories"),
    {
      params
    }
  );
};

/**获取单个疾病分类信息 */
export const requestOneDiseaseType = (id: string) => {
  return http.request<requestResult>(
    "get",
    baseUrlAdmin(`illness_categories/${id}`)
  );
};

/**新增疾病分类 */
export const requestAddDiseaseType = (data: object) => {
  return http.request<requestResult>(
    "post",
    baseUrlAdmin("illness_categories"),
    {
      data
    }
  );
};

/**修改单个疾病分类信息 */
export const requestEditDiseaseType = (id: string, data: object) => {
  return http.request<requestResult>(
    "patch",
    baseUrlAdmin(`illness_categories/${id}`),
    {
      data
    }
  );
};

/**删除某个疾病分类 */
export const requsestDelDiseaseType = (id: string) => {
  return http.request<requestResult>(
    "delete",
    baseUrlAdmin(`illness_categories/${id}`)
  );
};
