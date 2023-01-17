import React, {useState} from "react"
import {NavLink as RouterLink} from "react-router-dom"
import {Box, Button, Collapse, ListItem} from "@mui/material"
import ChevronDownIcon from "assets/icons/ChevronDown"
import ChevronRightIcon from "assets/icons/ChevronRight"

interface Props {
  active?: boolean
  depth: number
  icon?: React.ReactNode
  info?: React.ReactNode
  open?: boolean
  path?: string
  title: string
}

const ExternalLink = (props) => {
  return <a {...props} href={props.to} />
}

const isExternalUrl = (path) => {
  return (
    new URL(document.baseURI).origin !== new URL(path, document.baseURI).origin
  )
}

export default function NavItem({
  active = false,
  depth,
  icon,
  info,
  open: openProp = false,
  path,
  title,
  children
}: React.PropsWithChildren<Props>) {
  const [open, setOpen] = useState<boolean>(openProp)

  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen)
  }

  let paddingLeft = 16

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth
  }

  if (children) {
    return (
      <ListItem
        disableGutters
        sx={{
          display: "block",
          py: 0
        }}
      >
        <Button
          endIcon={!open ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronDownIcon fontSize="small" />
            )}
          onClick={handleToggle}
          startIcon={icon}
          sx={{
            color: "white.main",
            fontWeight: "fontWeightMedium",
            justifyContent: "flex-start",
            pl: `${paddingLeft}px`,
            pr: "8px",
            py: "12px",
            textAlign: "left",
            textTransform: "none",
            width: "100%"
          }}
          variant="contained"
        >
          <Box flexGrow={1}>{title}</Box>
          {info}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    )
  }

  return (
    <ListItem
      disableGutters
      sx={{
        display: "flex",
        py: 0
      }}
    >
      <Button
        component={!isExternalUrl(path) ? RouterLink : ExternalLink}
        startIcon={icon}
        sx={{
          color: "white.main",
          fontWeight: "fontWeightMedium",
          justifyContent: "flex-start",
          textAlign: "left",
          pl: `${paddingLeft}px`,
          pr: "8px",
          py: "12px",
          textTransform: "none",
          width: "100%",
          ...(active && {
            backgroundColor: "rgba(255, 255, 255, .05)",
            color: "white.main",
            textShadow: "0 0 1px white",
            "& svg": {
              color: "primary.main"
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, .05)"
            }
          })
        }}
        variant="text"
        to={path}
      >
        <Box flexGrow={1}>{title}</Box>
        {info}
      </Button>
    </ListItem>
  )
}
