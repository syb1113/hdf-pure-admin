import { $t } from "@/plugins/i18n";
import { user } from "@/router/enums";

export default {
  path: "/UserManagement",
  redirect: "/UserManagement/userManagement",
  meta: {
    icon: "ic:baseline-people-alt",
    title: $t("menus.pureUserManage"),
    rank: user
  },
  children: [
    {
      path: "/UserManagement/userManagement",
      name: "userManagement",
      component: () => import("@/views/UserManagement/userManagement.vue"),
      meta: {
        title: $t("menus.pureUserList"),
        showParent: true
      }
    },
    {
      path: "/UserManagement/userCart",
      name: "userCart",
      component: () => import("@/views/UserManagement/userCart.vue"),
      meta: {
        title: $t("menus.pureUserCart"),
        roles: ["admin"]
      }
    },
    {
      path: "/UserManagement/userOreder",
      name: "userOreder",
      component: () => import("@/views/UserManagement/userOrder.vue"),
      meta: {
        title: $t("menus.pureUserOrer"),
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
