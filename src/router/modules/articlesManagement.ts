import { $t } from "@/plugins/i18n";
import { article } from "@/router/enums";

export default {
  path: "/ArticlesManagement",
  redirect: "/ArticlesManagement/articleType",
  meta: {
    icon: "ic:baseline-import-contacts",
    title: $t("menus.pureAticleManage"),
    rank: article
  },
  children: [
    {
      path: "/ArticlesManagement/articleType",
      name: "articleType",
      component: () => import("@/views/ArticlesManagement/articleType.vue"),
      meta: {
        title: $t("menus.pureAticleType"),
        // roles: ["common"],
        showParent: true
      }
    },
    {
      path: "/ArticlesManagement/articlesList",
      name: "articlesList",
      component: () => import("@/views/ArticlesManagement/articlesList.vue"),
      meta: {
        title: $t("menus.pureAticleList"),
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
