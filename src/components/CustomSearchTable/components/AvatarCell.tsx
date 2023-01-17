import React, {useMemo} from "react"
import {IAvatarItem, TRow} from "components/CustomSearchTable/types.t"
import {Avatar, Box, TableCell, Typography} from "@mui/material"

interface AvatarCellProps {
  cell: TRow
  schemaItem: IAvatarItem
}

export default function AvatarCell({cell, schemaItem}: AvatarCellProps) {
  const id = "id" in cell ? cell?.id : cell?._id

  const mappedAvatarFields = useMemo(() => {
    if (!schemaItem || !cell) return ""

    const fieldNameFromSchema = schemaItem?.fieldName
    if (!fieldNameFromSchema) return ""
    if (typeof fieldNameFromSchema === "string") return fieldNameFromSchema

    return fieldNameFromSchema.map((fieldNameItem, index) => (
      <Typography key={index} color="primary" variant="body2">
        {cell[fieldNameItem]}
      </Typography>
    ))
  }, [cell, schemaItem])

  return (
    <TableCell key={(id || cell[schemaItem.image]) + " avatar_cell"}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex"
        }}
      >
        <Avatar
          src={cell[schemaItem.image]}
          sx={{
            height: 42,
            width: 42
          }}
        />
        <Box sx={{ml: 1}}>{mappedAvatarFields}</Box>
      </Box>
    </TableCell>
  )
}
