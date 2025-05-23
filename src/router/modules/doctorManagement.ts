import { $t } from "@/plugins/i18n";
import { doctor } from "@/router/enums";

export default {
  path: "/doctorManagement",
  redirect: "/doctorManagement/doctorList",
  meta: {
    icon: "ic:twotone-handshake",
    title: $t("menus.pureDoctor"),
    rank: doctor
  },
  children: [
    {
      path: "/doctorManagement/doctorList",
      name: "doctorList",
      component: () => import("@/views/doctorManagement/doctorList.vue"),
      meta: {
        title: $t("menus.pureDoctorList"),
        roles: ["admin", "common"],
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
