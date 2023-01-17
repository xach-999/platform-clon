import React from "react"
import {ICheckboxItem, TRow} from "components/CustomSearchTable/types.t"
import {Checkbox, TableCell} from "@mui/material"

interface CheckboxCellProps {
  cell: TRow
  schemaItem: ICheckboxItem
}

export default function CheckboxCell({cell, schemaItem}: CheckboxCellProps) {
  const id = "id" in cell ? cell?.id : cell?._id
  let varForCB = schemaItem?.fieldToReturn
  let isChecked = false
  if (varForCB) varForCB = cell[varForCB]
  if (!varForCB) varForCB = id
  if ("checked" in cell) isChecked = cell.checked

  return (
    <TableCell
      align="center"
      key={id}
      padding="checkbox"
      sx={{textAlign: "center"}}>
      <Checkbox
        checked={isChecked}
        color="primary"
        onChange={() => schemaItem.checkHandler(varForCB)}
      />
    </TableCell>
  )
}
