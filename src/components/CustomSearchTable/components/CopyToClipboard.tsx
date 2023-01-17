import React, {useCallback, useState} from "react"
import {Button, Tooltip, Zoom} from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import copyToClipboard from "copy-to-clipboard"

interface Props {
  value: string
}

export default function CopyToClipboard({value}: Props) {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleCopy = useCallback(() => {
    copyToClipboard(value)
    setShowTooltip(true)
  }, [value])

  return (
    <Tooltip
      open={showTooltip}
      title={"Copied to clipboard!"}
      leaveDelay={300}
      arrow
      TransitionComponent={Zoom}
      onClose={() => setShowTooltip(false)}
    >
      <Button size="small" onClick={handleCopy} sx={{minWidth: 0}}>
        <ContentCopyIcon fontSize="small"/>
      </Button>
    </Tooltip>
  )
}
