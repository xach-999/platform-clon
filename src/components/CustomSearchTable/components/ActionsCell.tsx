import React from "react"
import {IControl, TRow} from "components/CustomSearchTable/types.t"
import {Box, IconButton, TableCell, Tooltip} from "@mui/material"

interface ActionsCellProps {
  controls: IControl[]
  cell: TRow
}

export default function ActionsCell({cell, controls}: ActionsCellProps) {
  const id = "id" in cell ? cell?.id : cell?._id

  return (
    <TableCell align="center" key={id}>
      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
        {controls.map((i, num) => {
          let disabled = false
          let variableForCb = i?.variableToReturn
          if (variableForCb) variableForCb = cell[variableForCb]
          if (i?.enabled) {
            disabled = cell[i.enabled.field] !== i.enabled.value
          }
          if (!variableForCb) variableForCb = id

          return (
            <Tooltip title={i.tooltipText || ""} key={num + " _tooltip"}>
              <span>
                <IconButton
                  size="small"
                  onClick={() => i.handler(variableForCb)}
                  disabled={disabled}>
                  {i.icon}
                </IconButton>
              </span>
            </Tooltip>
          )
        })}
      </Box>
    </TableCell>
  )
}
