import {useRef, useState, memo} from "react"
import {
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material"
import ArchiveIcon from "assets/icons/Archive"
import DocumentTextIcon from "assets/icons/DocumentText"
import DotsHorizontalIcon from "assets/icons/DotsHorizontal"
import DownloadIcon from "assets/icons/Download"
import DuplicateIcon from "assets/icons/Duplicate"

export default memo(function MoreMenu(props) {
  const anchorRef = useRef<HTMLButtonElement | null>(null)
  const [openMenu, setOpenMenu] = useState<boolean>(false)

  const handleMenuOpen = (): void => {
    setOpenMenu(true)
  }

  const handleMenuClose = (): void => {
    setOpenMenu(false)
  }

  return (
    <>
      <Tooltip title="More options">
        <IconButton
          onClick={handleMenuOpen}
          ref={anchorRef}
          {...props}
          size="large"
        >
          <DotsHorizontalIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: "left",
          vertical: "top"
        }}
        onClose={handleMenuClose}
        open={openMenu}
        PaperProps={{
          sx: {
            maxWidth: "100%",
            width: 256
          }
        }}
        transformOrigin={{
          horizontal: "left",
          vertical: "top"
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Import" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <DocumentTextIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Export" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Copy" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Archive" />
        </MenuItem>
      </Menu>
    </>
  )
})
