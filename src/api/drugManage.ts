import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取药品列表 */
export const requestDrugList = (params: object) => {
  return http.request<requestResult>("get", baseUrlAdmin("medicines"), {
    params
  });
};

/**获取单个药品信息 */
export const requestOneDrug = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`medicines/${id}`));
};

/**新增药品 */
export const requestAddDrug = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("medicines"), {
    data
  });
};

/**修改单个药品信息 */
export const requestEditDrug = (id: string, data: object) => {
  return http.request<requestResult>("patch", baseUrlAdmin(`medicines/${id}`), {
    data
  });
};

/**删除某个药品*/
export const requsestDelDrug = (id: string) => {
  return http.request<requestResult>("delete", baseUrlAdmin(`medicines/${id}`));
};

/** 获取药品分类列表 */
export const requestDrugTypeList = (params?: object) => {
  return http.request<requestResult>(
    "get",
    baseUrlAdmin("medicine_categories"),
    {
      params
    }
  );
};

/**获取单个药品分类信息 */
export const requestOneDrugType = (id: string) => {
  return http.request<requestResult>(
    "get",
    baseUrlAdmin(`medicine_categories/${id}`)
  );
};

/**新增药品分类 */
export const requestAddDrugType = (data: object) => {
  return http.request<requestResult>(
    "post",
    baseUrlAdmin("medicine_categories"),
    {
      data
    }
  );
};

/**修改单个药品分类信息 */
export const requestEditDrugType = (id: string, data: object) => {
  return http.request<requestResult>(
    "patch",
    baseUrlAdmin(`medicine_categories/${id}`),
    {
      data
    }
  );
};

/**删除某个药品分类 */
export const requsestDelDrugType = (id: string) => {
  return http.request<requestResult>(
    "delete",
    baseUrlAdmin(`medicine_categories/${id}`)
  );
};
