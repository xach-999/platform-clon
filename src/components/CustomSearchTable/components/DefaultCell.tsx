import React, {useEffect, useState, useMemo} from "react"
import get from "lodash/get"
import CopyToClipboard from "./CopyToClipboard"
import {ITextItem, TRow} from "../types.t"
import {Box, List, ListItem, ListItemText, TableCell} from "@mui/material"

interface DefaultCellProps {
  cell: TRow
  schemaItem: ITextItem
  index: number
}

export default function DefaultCell({
  cell,
  index,
  schemaItem
}: DefaultCellProps) {
  const [cellContent, setCellContent] = useState(null)
  const fieldInCell = useMemo(
    () => get(cell, schemaItem?.fieldName) || "",
    [cell, schemaItem]
  )

  useEffect(() => {
    if (!cell) return
    if (!Array.isArray(fieldInCell)) return
    if (!fieldInCell?.length) return

    const textItems = fieldInCell.map((el, idx) => {
      return (
        <ListItem sx={{padding: 0}} key={`${idx} _cell_array_item`}>
          <ListItemText>{el}</ListItemText>
        </ListItem>
      )
    })

    setCellContent(<List sx={{padding: 0}}>{textItems}</List>)
  }, [cell])

  useEffect(() => {
    if (!cell) return
    if (!(typeof fieldInCell === "string" || typeof fieldInCell === "number"))
      return

    setCellContent(fieldInCell)
  }, [cell])

  return (
    <TableCell key={index + " default_cell"}>
      {schemaItem.copyAction ? (
        <Box display="flex" alignItems="center">
          {cellContent}
          <Box ml={1}>
            <CopyToClipboard value={cellContent}/>
          </Box>
        </Box>
      ) : (
        cellContent
      )}
    </TableCell>
  )
}
