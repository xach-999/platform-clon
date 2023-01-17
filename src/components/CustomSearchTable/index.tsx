import React, {ChangeEvent, useEffect, useMemo, useState} from "react"
import {
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell, TableContainer,
  TableHead,
  TableRow
} from "@mui/material"
import {
  IActionItem,
  IAvatarItem,
  ICheckboxItem,
  ICustomItem,
  ICustomSearchTableProps,
  isInteractiveHeaderText,
  ITextItem
} from "./types.t"
import DefaultCell from "./components/DefaultCell"
import CheckboxCell from "./components/CheckboxCell"
import AvatarCell from "./components/AvatarCell"
import ActionsCell from "./components/ActionsCell"
import SearchTablePaginationFooter from "./components/SearchTablePaginationFooter"

export default function CustomSearchTable({
  rows,
  rowsPerPageOption,
  fullWidth,
  searchFields,
  searchInput,
  tableSchema,
  loading,
  onGetPageChangeInfo
}: ICustomSearchTableProps) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOption || 20)

  const paginatedRows = useMemo(() => {
    if (!rows?.length) return []

    if (!searchInput || !searchFields?.length) {
      return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }

    const lowerQuery = searchInput.toLowerCase()

    const queriedTeachers = rows.filter((t, index) => {
      let isValid = false

      searchFields.forEach((sf) => {
        let valueToCheck = t[sf]

        if (!valueToCheck) {
          console.log(`Field "${sf}" doesn't exists in table row object index ${index}!\nCheck "searchFields" prop!`)
          return
        }

        if (typeof valueToCheck !== "string") {
          valueToCheck = String(valueToCheck)
        }

        if (valueToCheck && valueToCheck.toLowerCase().includes(lowerQuery))
          isValid = true
      })

      return isValid
    })

    return queriedTeachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [rows, page, rowsPerPage, searchInput])

  useEffect(() => {
    if (!onGetPageChangeInfo) return

    onGetPageChangeInfo({
      page,
      rowsPerPage,
      currentPaginatedRows: paginatedRows
    })
  }, [onGetPageChangeInfo, page, rowsPerPage, paginatedRows])

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRowsPerPage(parseInt(event?.target?.value || "20", 10))
    setPage(0)
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  return (
    <>
      <Box minHeight="4px">
        {loading && (
          <Box>
            <LinearProgress color="primary"/>
          </Box>
        )}
      </Box>
      {!!rows?.length && (
        <Box width="100%" minWidth={700}>
          <TableContainer className="scrollbar-hidden" sx={{position: "relative", width: "100%"}}>
            <Table style={{tableLayout: fullWidth ? "fixed" : "auto"}}>
              <TableHead>
                <TableRow>
                  {tableSchema.map(({headerText, type}, num) => {
                    if (!isInteractiveHeaderText(headerText)) {
                      return (
                        <TableCell
                          align={type === "actions" ? "center" : "left"}
                          key={`${num} `}>
                          {headerText}
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell
                        key={`${num} ${headerText}`}
                        padding="checkbox"
                        align={type === "actions" ? "center" : "left"}>
                        {headerText.element}
                      </TableCell>
                    )
                  })}
                </TableRow>
              </TableHead>
              {!!paginatedRows?.length && (
                <TableBody>
                  {paginatedRows.map((cell, index) => {
                    const id = "id" in cell ? cell?.id : cell?._id

                    return (
                      <TableRow key={id || index + "row"}>
                        {tableSchema.map((i, num) => {
                          switch (i.type) {
                            case "actions":
                              return (
                                <ActionsCell
                                  controls={(i as IActionItem).actions}
                                  key={num + " TableBody"}
                                  cell={cell}
                                />
                              )
                            case "avatar":
                              return (
                                <AvatarCell
                                  cell={cell}
                                  schemaItem={i as IAvatarItem}
                                  key={num + " AvatarCell"}
                                />
                              )
                            case "checkbox":
                              return (
                                <CheckboxCell
                                  cell={cell}
                                  schemaItem={i as ICheckboxItem}
                                  key={num + " CheckboxCell"}
                                />
                              )
                            case "custom":
                              return (
                                <TableCell key={`custom_cell-${index}-${num}`} sx={{whiteSpace: "pre-line"}}>
                                  {(i as ICustomItem).content(cell)}
                                </TableCell>
                              )
                            default:
                              return (
                                <DefaultCell
                                  cell={cell}
                                  schemaItem={i as ITextItem}
                                  index={num}
                                  key={num + " DefaultCell"}
                                />
                              )
                          }
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              )}
              <SearchTablePaginationFooter
                rows={rows}
                rowsPerPage={rowsPerPage}
                page={page}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  )
}
