import React, {ChangeEvent} from "react"
import {TableFooter, TablePagination, TableRow} from "@mui/material"
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions"
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles({
  paginationRow: {
    "& .MuiTablePagination-spacer": {
      display: "none"
    }
  }
})

interface SearchTablePaginationFooterProps {
  rows: Array<any>
  rowsPerPage: number
  page: number
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void
  handleChangeRowsPerPage: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
}

export default function SearchTablePaginationFooter({
  rows,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage
}: SearchTablePaginationFooterProps) {
  const {paginationRow} = useStyles()

  return (
    <TableFooter>
      <TableRow className={paginationRow}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100, {label: "All", value: -1}]}
          colSpan={3}
          count={Object.keys(rows)?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {"aria-label": "rows per page"},
            native: true
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
          sx={{
            borderBottom: 0,
            minWidth: "450px"
          }}
        />
      </TableRow>
    </TableFooter>
  )
}
