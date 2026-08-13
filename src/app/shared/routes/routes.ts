import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "admin",
    loadChildren: () => import("../../components/apps/admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "settings",
    loadChildren: () => import("../../components/apps/admin/usermodule/usermodule-routing.module").then((m) => m.UsermoduleRoutingModule),
  },
];
