import { $t } from "@/plugins/i18n";
import { permission } from "@/router/enums";

export default {
  path: "/SystemManagement",
  redirect: "/SystemManagement/RoleInformation",
  meta: {
    icon: "ep:lollipop",
    title: $t("menus.pureSystemManage"),
    rank: permission
  },
  children: [
    {
      path: "/SystemManagement/RoleInformation",
      name: "RoleInformation",
      component: () => import("@/views/SystemManagement/RoleInformation.vue"),
      meta: {
        title: $t("menus.pureRoleInformation"),
        roles: ["admin"],
        showParent: true
      }
    },
    {
      path: "/SystemManagement/AdminManagement",
      name: "adminManagement",
      component: () => import("@/views/SystemManagement/adminManagement.vue"),
      meta: {
        title: $t("menus.pureAdminList"),
        roles: ["admin"],
        showParent: true
      }
    },
    {
      path: "/SystemManagement/PermissionManagement",
      name: "permissionManagement",
      component: () =>
        import("@/views/SystemManagement/permissionManagement.vue"),
      meta: {
        title: $t("menus.purePermissionManage"),
        showParent: true,
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
