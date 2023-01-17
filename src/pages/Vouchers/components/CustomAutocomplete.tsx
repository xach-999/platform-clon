import React from "react"
import TextField from "@mui/material/TextField"
import {Autocomplete} from "@mui/material"
import {IStudentItem} from "types/common"

type ILabelField = keyof Omit<IStudentItem, "groups">

interface Props {
  options: IStudentItem[]
  labelField: ILabelField
  onValueSelected: (item: IStudentItem | string) => void
}

export default function CustomAutocomplete({
  options,
  labelField,
  onValueSelected
}: Props) {
  return (
    <Autocomplete
      id="combo-box-demo"
      options={options || []}
      getOptionLabel={(option) => option[labelField]}
      style={{width: 300}}
      onChange={(_, v) => onValueSelected(v)}
      renderInput={(params) => (
        <TextField {...params} label="Combo box" variant="outlined" />
      )}
    />
  )
}
