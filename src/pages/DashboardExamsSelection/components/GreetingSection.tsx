import React, {useMemo} from "react"
import {Box, Typography} from "@mui/material"
import useAuth from "hooks/useAuth"

export default function GreetingSection() {
  const {cognitoUser} = useAuth()

  const greetingsSign = useMemo(() => {
    const {given_name: firstName, family_name: lastName} = cognitoUser.attributes || {}
    let result = "Hello"

    if (firstName) result += `, ${firstName}`
    if (lastName) result += ` ${lastName}`

    result = `${result}!`

    return result
  }, [cognitoUser])

  return (
    <Box>
      <Typography color="textPrimary" variant="h5">
        Overview
      </Typography>
      <Typography color="textPrimary" variant="subtitle1" mt={.5}>
        {greetingsSign}
      </Typography>
    </Box>
  )
}
