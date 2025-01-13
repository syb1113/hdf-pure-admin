// 第一个代理后端地址
const VITE_BASE_URL = "http://192.168.3.119:3006";
export const baseUrlAdmin = (url: string) => VITE_BASE_URL + `/admin/${url}`;
export const baseUrlAuth = (url: string) => VITE_BASE_URL + `/auth/${url}`;
