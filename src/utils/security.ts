import {Group} from "types/access"

export const isRouteAllowed = (
  routeGroups: Array<string>,
  userGroups: Array<string>
) => {
  if (
    userGroups?.length &&
    userGroups?.includes(Group.Admin) &&
    !routeGroups?.includes(Group.Student)
  )
    return true

  if (!routeGroups?.length) return true

  return routeGroups.some((routeGroup) => userGroups?.includes(routeGroup))
}
