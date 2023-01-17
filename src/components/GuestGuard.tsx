import {LINKS} from "consts/links"
import React from "react"
import {Navigate} from "react-router-dom"
import useAuth from "hooks/useAuth"

export default function GuestGuard({children}) {
  const {isAuthenticated, user} = useAuth()

  if (isAuthenticated) {
    return (
      <Navigate
        to={!user?.groups?.length ? "/dashboard" : LINKS.classrooms}
      />
    )
  }

  return <>{children}</>
}
