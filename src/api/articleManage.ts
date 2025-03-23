import { baseUrlAdmin } from "./utils";
import { http } from "@/utils/http";
export type requestResult = {
  success: boolean;
  data: object;
  errorMessage: string;
};

/** 获取文章列表 */
export const requestArticlesList = (params: object = { page: 1, per: 999 }) => {
  return http.request<requestResult>("get", baseUrlAdmin("articles"), {
    params
  });
};

/** 获取文章详情 */
export const requestArticlesDetails = (id: string) => {
  return http.request<requestResult>("get", baseUrlAdmin(`articles/${id}`));
};

/** 新增文章 */
export const requestAddArticle = (data: object) => {
  return http.request<requestResult>("post", baseUrlAdmin("articles"), {
    data
  });
};

/** 修改文章 */
export const requestUpArticle = (data: object, id: string) => {
  return http.request<requestResult>("patch", baseUrlAdmin(`articles/${id}`), {
    data
  });
};

/** 删除文章 */
export const requestDelArticle = (id: string) => {
  return http.request<requestResult>("delete", baseUrlAdmin(`articles/${id}`));
};

/**
 * 文章分类api
 */

/** 获取文章分类列表 */
export const requestArticlesTypeList = (params?: object) => {
  return http.request<requestResult>(
    "get",
    baseUrlAdmin("article_categories"),
    {
      params
    }
  );
};

/** 获取文章分类详情 */
export const requestArticlesTypeDetails = (id: string) => {
  return http.request<requestResult>(
    "get",
    baseUrlAdmin(`article_categories/${id}`)
  );
};

/** 新增文章分类 */
export const requestAddArticleType = (data: object) => {
  return http.request<requestResult>(
    "post",
    baseUrlAdmin("article_categories"),
    {
      data
    }
  );
};

/** 修改文章分类 */
export const requestUpArticleType = (data: object, id: string) => {
  return http.request<requestResult>(
    "patch",
    baseUrlAdmin(`article_categories/${id}`),
    {
      data
    }
  );
};

/** 删除文章分类 */
export const requestDelArticleType = (id: string) => {
  return http.request<requestResult>(
    "delete",
    baseUrlAdmin(`article_categories/${id}`)
  );
};
