import React, {useMemo} from "react"
import {Box, Typography} from "@mui/material"
import {makeStyles} from "@mui/styles"
import CustomSearchTable from "components/CustomSearchTable"
import {ITableSchema} from "components/CustomSearchTable/types.t"
import useSearchInput from "hooks/useSearchInput"
import {IClassroomItem} from "types/common"

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "500px",
    [theme.breakpoints.down(undefined)]: {
      width: "95%",
      minWidth: "0"
    }
  }
}))

export interface AddItemModalProps {
  classroom: IClassroomItem
  data: any[]
  checkedIds: string[]
  tableSchema: ITableSchema
  checkActionHandler: (action: "REMOVE" | "ADD", id: string) => Promise<void>
  searchFields: string[]
  searchPlaceholder?: string
  checkboxTitle?: string
}

export default function AddItemForm(props: AddItemModalProps) {
  const s = useStyles()

  const {SearchInputJSX, searchInput} = useSearchInput(props.searchPlaceholder || "Search")
  const isLoading = !props.data

  const checkedItemsMap = useMemo(() => {
    return (props.checkedIds || []).reduce((acc, value) => {
      acc[value] = true
      return acc
    }, {} as { [id: string]: boolean })
  }, [props.data, props.checkedIds])

  const formattedData = useMemo(() => {
    return (props.data || [])
      .map((_) => {
        return {..._, checked: checkedItemsMap[_._id]}
      })
      .sort((a, b) => {
        return a.checked && !b.checked ? -1 : 1
      })
  }, [checkedItemsMap])

  const tableSchema: ITableSchema = useMemo(() => {
    return [
      ...props.tableSchema,
      {
        type: "checkbox",
        headerText: props.checkboxTitle || "Enrolled",
        fieldToReturn: "_id",
        checked: true,
        checkHandler: async (_id) => {
          const isAdded = checkedItemsMap[_id]
          await props.checkActionHandler(isAdded ? "REMOVE" : "ADD", _id)
        }
      }
    ]
  }, [checkedItemsMap])

  return (
    <Box className={s.root} py={3} px={4}>
      <Typography variant="h5" mb={2}>
        Teachers for Classroom {props.classroom.name}
      </Typography>
      {SearchInputJSX}
      <CustomSearchTable
        rows={formattedData}
        rowsPerPageOption={50}
        tableSchema={tableSchema}
        loading={isLoading}
        searchInput={searchInput}
        searchFields={props.searchFields}
      />
    </Box>
  )
}
