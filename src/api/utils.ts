// 第一个代理后端地址
const { VITE_BASE_URL } = import.meta.env;
export const baseUrlAdmin = (url: string) => VITE_BASE_URL + `/admin/${url}`;
export const baseUrlAuth = (url: string) => VITE_BASE_URL + `/auth/${url}`;
