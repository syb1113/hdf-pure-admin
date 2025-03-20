import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 分页获取用户购物车列表 */
export const requestShopCartsList = (params: object) => {
  return http.request<requestResult>("get", baseUrlAdmin("shop_carts"), {
    params
  });
};

/** 获取单个购物车信息 */
export const requestShopCartsDetails = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`shop_carts/${id}`));
};

/** 修改购物车信息*/
export const requestShopCartsModify = (id: string, data: object) => {
  return http.request<requestResult>(
    "patch",
    baseUrlAdmin(`shop_carts/${id}`),
    {
      data
    }
  );
};

/**
 * 获取指定用户购物车信息
 * @param params 指定用户id
 * @returns
 */
export const requestUserShopCarts = (params: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`shop_carts`), {
    params
  });
};
