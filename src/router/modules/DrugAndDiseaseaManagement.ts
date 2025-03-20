import { $t } from "@/plugins/i18n";
import { drug } from "@/router/enums";

export default {
  path: "/drugAndDiseaseManagement",
  redirect: "/drugAndDiseaseManagement/drugManagement",
  meta: {
    icon: "ic:baseline-coronavirus",
    title: $t("menus.pureDrugAndDisManage"),
    rank: drug
  },
  children: [
    {
      path: "/drugAndDiseaseManagement/drugTypeManagement",
      name: "drugTypeManagement",
      component: () =>
        import("@/views/DrugAndDiseaseaManagement/drugTypeManagement.vue"),
      meta: {
        title: $t("menus.pureDrugType"),
        roles: ["admin", "common"]
      }
    },
    {
      path: "/drugAndDiseaseManagement/drugManagement",
      name: "drugManagement",
      component: () =>
        import("@/views/DrugAndDiseaseaManagement/drugManagement.vue"),
      meta: {
        title: $t("menus.pureDrugManage"),
        roles: ["admin", "common"]
      }
    },
    {
      path: "/drugAndDiseaseManagement/diseaseTypeManage",
      name: "diseaseTypeManage",
      component: () =>
        import("@/views/DrugAndDiseaseaManagement/diseaseTypeManage.vue"),
      meta: {
        title: $t("menus.pureDisType"),
        roles: ["admin", "common"]
      }
    },
    {
      path: "/drugAndDiseaseManagement/diseaseaManage",
      name: "diseaseaManage",
      component: () =>
        import("@/views/DrugAndDiseaseaManagement/diseaseaManage.vue"),
      meta: {
        title: $t("menus.pureDisManage"),
        roles: ["admin", "common"]
      }
    }
  ]
} satisfies RouteConfigsTable;
