import React, {useRef} from "react"
import {Link} from "@mui/material"

interface Props {
  label: string
  fileName?: string
}

export default function DownloadCSV({
  label,
  fileName = "Template.csv"
}: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  const createObjToUrlCsv = (csv) => {
    const myURL = window.URL || window.webkitURL
    const blob = new Blob([csv], {type: "text/csv"})

    return myURL.createObjectURL(blob)
  }

  const handleDownload = () => {
    if (!!linkRef.current) {
      linkRef.current.href = createObjToUrlCsv(["Student ID", "First Name", "Last Name", "Email", "Password"].join(","))
      linkRef.current.download = fileName
      linkRef.current.click()
    }
  }

  return (
    <>
      <a ref={linkRef} style={{visibility: "hidden", pointerEvents: "none"}}/>
      <Link
        sx={{cursor: "pointer"}}
        color="secondary"
        underline="always"
        onClick={handleDownload}>
        {label}
      </Link>
    </>
  )
}
