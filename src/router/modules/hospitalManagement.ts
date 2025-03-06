import { $t } from "@/plugins/i18n";
import { hospital } from "@/router/enums";

export default {
  path: "/hospitalManagement",
  redirect: "/hospitalManagement/hospitalList",
  meta: {
    icon: "ic:baseline-location-city",
    title: $t("menus.pureHospital"),
    rank: hospital
  },
  children: [
    {
      path: "/hospitalManagement/hospitalList",
      name: "hospitalList",
      component: () => import("@/views/hospitalManagement/hospitalList.vue"),
      meta: {
        title: $t("menus.pureHospitalList")
      }
    },
    {
      path: "/hospitalManagement/departmentsAndOther",
      name: "departmentsAndOther",
      component: () => import("@/views/hospitalManagement/departmentsList.vue"),
      meta: {
        title: $t("menus.pureDepartmentsAndOther")
      }
    },
    {
      path: "/hospitalManagement/doctorTitlesList",
      name: "doctorTitlesList",
      component: () =>
        import("@/views/hospitalManagement/doctorTitlesList.vue"),
      meta: {
        title: $t("menus.pureDoctorsTitles")
      }
    },
    {
      path: "/hospitalManagement/doctorTagsList",
      name: "doctorTagsList",
      component: () => import("@/views/hospitalManagement/doctorTagsList.vue"),
      meta: {
        title: $t("menus.pureDoctorsTags")
      }
    }
  ]
} satisfies RouteConfigsTable;
