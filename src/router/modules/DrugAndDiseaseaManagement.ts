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
      path: "/drugAndDiseaseManagement/drugManagement",
      name: "drugManagement",
      component: () =>
        import("@/views/DrugAndDiseaseaManagement/drugManagement.vue"),
      meta: {
        title: $t("menus.pureDrugManage"),
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
