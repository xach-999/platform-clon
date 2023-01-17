import type {ReactNode} from "react"
import {matchPath} from "react-router-dom"
import {List, ListSubheader} from "@mui/material"
import type {ListProps} from "@mui/material"
import NavItem from "./components/NavItem"

interface Item {
  path?: string
  icon?: ReactNode
  info?: ReactNode
  children?: Item[]
  title: string
}

interface Props extends ListProps {
  items: Item[]
  pathname: string
  title: string
}

const renderNavItems = ({
  depth = 0,
  items,
  pathname
}: {
  items: Item[]
  pathname: string
  depth?: number
}): JSX.Element => (
  <List disablePadding>
    {items.reduce(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
      (acc, item) =>
        reduceChildRoutes({
          acc,
          item,
          pathname,
          depth
        }),
      []
    )}
  </List>
)

const reduceChildRoutes = ({
  acc,
  pathname,
  item,
  depth
}: {
  acc: JSX.Element[]
  pathname: string
  item: Item
  depth: number
}): Array<JSX.Element> => {
  const key = `${item.title}-${depth}`
  const exactMatch = item.path
    ? !!matchPath({
      path: item.path,
      end: true
    }, pathname)
    : false

  if (item.children) {
    const partialMatch = item.path
      ? !!matchPath({
        path: item.path,
        end: false
      }, pathname)
      : false

    acc.push(
      <NavItem
        active={partialMatch}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={partialMatch}
        path={item.path}
        title={item.title}>
        {renderNavItems({
          depth: depth + 1,
          items: item.children,
          pathname
        })}
      </NavItem>
    )
  } else {
    acc.push(
      <NavItem
        active={exactMatch}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        path={item.path}
        title={item.title}
      />
    )
  }

  return acc
}

export default function NavSection({items, pathname, title}: Props) {
  return (
    <List
      subheader={
        <ListSubheader
            disableGutters
            disableSticky
            sx={{
              color: "white.main",
              fontSize: "0.75rem",
              lineHeight: 2.5,
              fontWeight: 700,
              textTransform: "uppercase"
            }}>
            {title}
          </ListSubheader>
      }>
      {renderNavItems({items, pathname})}
    </List>
  )
}
