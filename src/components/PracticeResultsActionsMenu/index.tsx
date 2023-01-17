import {useEffect} from "react"
import * as React from "react"
import {
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  SxProps,
  Box
} from "@mui/material"
import {FileDownload, MoreVert} from "@mui/icons-material"
import JsFileDownloader from "js-file-downloader"
import {getApiCallHeaders} from "api/rest"
import importCertificatesApi from "./actions"

const baseApiUrl = process.env.REACT_APP_API_BASE_URL

interface ResultsMenuProps {
  results?: any
  searchInput?: string
  groupName?: string
  exportQuery: {
    schoolId: string
    groupId: string
    examCode: string
    type: "practice" | "exam"
    classroomId?: string
    startDate?: number
    endDate?: number
  }
  sx?: SxProps
}

export default function PracticeResultsActionsMenu(props: ResultsMenuProps) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === "Escape") {
      setOpen(false)
    }
  }

  const prevOpen = React.useRef(open)

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  const downloadResults = async () => {
    const headers = await getApiCallHeaders()

    new JsFileDownloader({
      url:
        `${baseApiUrl}/export/student-results?` +
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(props.exportQuery)
              .filter((_) => !!_[1])
              .map(([key, value]) => [key, String(value)])
          )
        ),
      filename: `${props.groupName || "results"}.csv`,
      headers: Object.entries(headers).map(([name, value]) => ({
        name,
        value
      }))
    })
    setOpen(false)
  }

  const searchFields  = ["user.studentId", "user.username"]

  const getNestedObject = (nestedObj, pathStr) => {
    const pathArr = pathStr.split(".")
    return pathArr.reduce(
      (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
      nestedObj
    )
  }

  const importCertificates = async () => {
    if (!props.results?.length) {
      setOpen(false)
      return []
    }

    const lowerQuery = props.searchInput.toLowerCase()

    const queriedTeachers = props.results.filter((t, index) => {
      let isValid = false

      searchFields.forEach((sf) => {
        let valueToCheck = getNestedObject(t, sf)

        if (typeof valueToCheck !== "string") {
          valueToCheck = String(valueToCheck)
        }

        if (valueToCheck && valueToCheck.toLowerCase().includes(lowerQuery))
          isValid = true
      })

      return isValid
    })

    const credential_ids = []

    queriedTeachers.forEach((item) => {
      if (item.accredibleCredentialId) {
        credential_ids.push(`${item.accredibleCredentialId}`)
      }
    })

    importCertificatesApi(credential_ids)
    setOpen(false)
  }

  return (
    <Box sx={props.sx}>
      <Button
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}>
        <MoreVert/>
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition>
        {({TransitionProps, placement}) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom-start" ? "left top" : "left bottom"
            }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={downloadResults}>
                    <ListItemIcon>
                      <FileDownload/>
                    </ListItemIcon>
                    <ListItemText>Export CSV</ListItemText>
                  </MenuItem>
                  {props.exportQuery.type !== "practice" &&
                    <MenuItem onClick={importCertificates}>
                      <ListItemIcon>
                        <FileDownload/>
                      </ListItemIcon>
                      <ListItemText>Export Certificates</ListItemText>
                    </MenuItem>
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}
