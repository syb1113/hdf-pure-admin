import { $t } from "@/plugins/i18n";
import { able } from "@/router/enums";

export default {
  path: "/able",
  redirect: "/able/watermark",
  meta: {
    icon: "ri:ubuntu-fill",
    title: $t("menus.pureAble"),
    rank: able
  },
  children: [
    {
      path: "/able/excel",
      name: "Excel",
      component: () => import("@/views/able/excel.vue"),
      meta: {
        title: $t("menus.pureExcel")
      }
    },
    {
      path: "/able/debounce",
      name: "Debounce",
      component: () => import("@/views/able/debounce.vue"),
      meta: {
        title: $t("menus.pureDebounce")
      }
    }
  ]
} satisfies RouteConfigsTable;
