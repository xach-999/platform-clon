export enum Group {
  Admin = "admin",
  District = "district",
  School_Admin = "school_admin",
  School_Teacher = "school_teacher",
  Sme = "sme",
  Student = "student",
}

export interface RouteAccess {
  route: string
  groups: Group[]
}
