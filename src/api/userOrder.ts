import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 分页获取用户订单列表 */
export const requestOrdersList = (params: object) => {
  return http.request<requestResult>("get", baseUrlAdmin("orders"), {
    params
  });
};

/** 获取单个订单信息 */
export const requestOrdersDetails = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`orders/${id}`));
};

/** 删除订单*/
export const requestOrdersDelete = (id: string) => {
  return http.request<requestResult>("delete", baseUrlAdmin(`orders/${id}`));
};

/**
 * 获取指定用户订单信息
 * @param params 指定用户id
 * @returns
 */
export const requestUserOrders = (params: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`orders`), {
    params
  });
};
