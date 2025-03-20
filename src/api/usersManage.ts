import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取用户列表 */
export const requestUsersList = (params: object) => {
  return http.request<requestResult>("get", baseUrlAdmin("users"), {
    params
  });
};

/** 获取单个用户信息 */
export const requestUsersDetails = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`users/${id}`));
};

/** 删除用户*/
export const requestUsersDelete = (id: string) => {
  return http.request<requestResult>("delete", baseUrlAdmin(`users/${id}`));
};

// /**
//  *
//  * @param userId 用户id
//  * @returns
//  */
// export const requestOneUsersCarts = (userId: string) => {
//   return http.request<requestResult>(
//     "get",
//     baseUrlAdmin(`users/carts/${userId}`)
//   );
// };
