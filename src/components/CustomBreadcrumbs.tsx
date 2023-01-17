import React, {useMemo} from "react"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import {Box, Breadcrumbs, Link, Typography} from "@mui/material"
import {Link as RouterLink} from "react-router-dom"

export interface CustomBreadcrumbsProps {
  title?: string
  breadcrumbs: Array<{
    text: string
    path?: string
  }>
}

export default React.memo(function CustomBreadcrumbs({
  breadcrumbs,
  title
}: CustomBreadcrumbsProps) {
  const crumbsToRender = useMemo(() => {
    if (!breadcrumbs || !breadcrumbs?.length) return null

    return breadcrumbs.map((breadItem) => {
      if (!breadItem.path) {
        return (
          <Typography
            key={breadItem.text}
            color="textSecondary"
            variant="subtitle2">
            {breadItem.text}
          </Typography>
        )
      }

      return (
        <Link
          color="textPrimary"
          key={breadItem.text}
          component={RouterLink}
          to={breadItem.path}
          variant="subtitle2">
          {breadItem.text}
        </Link>
      )
    })
  }, [breadcrumbs])

  return (
    <Box>
      <Typography color="textPrimary" variant="h5">
        {title}
      </Typography>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          <ChevronRightIcon fontSize="small"/>
        }
        sx={{mt: 1}}>
        {crumbsToRender}
      </Breadcrumbs>
    </Box>
  )
})
