import { $t } from "@/plugins/i18n";
import { hospitalList } from "@/router/enums";

export default {
  path: "/hospitalManagement",
  redirect: "/hospitalManagement/hospitalList",
  meta: {
    icon: "ic:baseline-location-city",
    title: $t("menus.pureHospital"),
    rank: hospitalList
  },
  children: [
    {
      path: "/hospitalManagement/hospitalList",
      name: "hospitalList",
      component: () => import("@/views/hospitalManagement/hospitalList.vue"),
      meta: {
        title: $t("menus.pureHospitalList"),
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
