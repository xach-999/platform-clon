import React, {useEffect, useMemo} from "react"
import Scrollbar from "components/Scrollbar"
import {Box, Link, Typography} from "@mui/material"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import CustomSearchTable from "components/CustomSearchTable"
import useSearchInput from "hooks/useSearchInput"
import {useDispatch, useSelector} from "store"
import {fetchLicensesThunk} from "store/slices/schoolSlice/schoolSlice"
import {getLicensesSelector} from "store/slices/schoolSlice/selectors"
import {ILicenseItem} from "types/common"
import useMainPageLink from "hooks/useMainPageLink"
import {ITableSchema} from "components/CustomSearchTable/types.t"

export default function LicenseList() {
  const dispatch = useDispatch()

  const licenses: ILicenseItem[] = useSelector(getLicensesSelector)
  const loading = useSelector((store) => store.schoolSlice.loading)
  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)

  const {SearchInputJSX, searchInput} = useSearchInput("Search Inventory")
  const {mainPageLink} = useMainPageLink()

  useEffect(() => {
    if (!schoolId) return
    dispatch(fetchLicensesThunk(schoolId))
  }, [])

  const tableSchema: ITableSchema = useMemo(() => {
    return [
      {
        type: "text",
        headerText: "Inventory code",
        fieldName: "code"
      },
      {
        type: "text",
        headerText: "Inventory name",
        fieldName: "name"
      },
      {
        type: "text",
        headerText: "Exam code",
        fieldName: "examCodes"
      },
      {
        type: "text",
        headerText: "Product Type",
        fieldName: "productType"
      },
      {
        type: "text",
        headerText: "Proctoring",
        fieldName: "proctoring"
      },
      {
        type: "text",
        headerText: "Inventory expiration date",
        fieldName: "expirationDate"
      },
      {
        type: "text",
        headerText: "Total units",
        fieldName: "vouchersTotal"
      },
      {
        type: "text",
        headerText: "Available units",
        fieldName: "vouchersRemain"
      }
    ]
  }, [])

  return (
    <CardWithBreadcrumbs
      helmetTabTitle={"Inventory"}
      pageTitle={"Inventory"}
      breadcrumbs={[
        {
          path: mainPageLink,
          text: "Dashboard"
        },
        {
          path: null,
          text: "Inventory"
        }
      ]}
    >
      <Scrollbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {!!licenses?.length && SearchInputJSX}
        </Box>
        {!licenses?.length && !loading && (
          <>
            <Typography variant={"h6"} textAlign={"center"}>
              No available inventory.
            </Typography>
            <Typography
              variant={"body1"}
              color={"primary"}
              textAlign={"center"}
            >
              Flexible licensing options are available to meet the needs of your
              educational institution and students.
            </Typography>
            <Typography
              variant={"body1"}
              color={"primary"}
              textAlign={"center"}
            >
              Please contact our{" "}
              <Link
                underline="always"
                target="_blank"
                color="primary"
                href="https://knowledge-pillars.com/contact-us/"
              >
                sales support
              </Link>{" "}
              for more information
            </Typography>
          </>
        )}
        <CustomSearchTable
          loading={loading}
          tableSchema={tableSchema}
          rows={licenses}
          searchFields={["code", "expirationDate", "proctoring"]}
          searchInput={searchInput}
        />
      </Scrollbar>
    </CardWithBreadcrumbs>
  )
}
