import {LINKS} from "consts/links"
import React, {useState} from "react"
import {Navigate, useLocation} from "react-router-dom"
import useAuth from "hooks/useAuth"
import Login from "pages/authentication/Login"

export default function AuthGuard({children}: React.PropsWithChildren<{}>) {
  const auth = useAuth()
  const location = useLocation()
  const [requestedLocation, setRequestedLocation] = useState(null)

  if (!auth.isAuthenticated) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname)
    }

    return <Login/>
  }

  /**
   * If routes now allowed - redirect to /dashboard
   */
  // const routeAllowed = isRouteAllowed(location.pathname, auth.user.groups)
  // if (!routeAllowed) {
  //   return <Navigate to="/dashboard" />
  // }

  // This is done so that in case the route changes by any chance through other
  // means between the moment of request and the render we navigate to the initially
  // requested route.
  if (location.pathname === "/")
    return (
      <Navigate to={!auth?.user?.groups?.length ? LINKS.dashboard : LINKS.classrooms}/>
    )

  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null)

    return <Navigate to={requestedLocation}/>
  }

  return <>{children}</>
}
