import React, {useEffect, useMemo, useState} from "react"
import {useDispatch, useSelector} from "store"
import {getVouchersBySchoolThunk} from "store/slices/practiceVouchers/practiceVouchers"
import useSearchInput from "hooks/useSearchInput"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import Scrollbar from "components/Scrollbar"
import {Box, Link, Typography} from "@mui/material"
import CustomSearchTable from "components/CustomSearchTable"
import {getSchoolVouchersSelector} from "store/slices/schoolSlice/selectors"
import CustomAutocomplete from "./components/CustomAutocomplete"
import ConfirmationAlert from "components/ConfirmationAlert"
import {IStudentItem} from "types/common"
import useMainPageLink from "hooks/useMainPageLink"
import {ITableSchema} from "components/CustomSearchTable/types.t"

export default function Vouchers() {
  const dispatch = useDispatch()

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const students = useSelector((store) => store.schoolSlice.students)
  const vouchers = useSelector(getSchoolVouchersSelector)
  const loading = useSelector((state) => state.practiceVouchers.loading)

  const [isConfAlertOpened, setIsConfAlertOpened] = useState<boolean>(false)
  const [selectedStudent, setSelectedStudent] = useState<IStudentItem | null>(
    null
  )
  const [selectedExam, setSelectedExam] = useState<string | null>(null)

  const {mainPageLink} = useMainPageLink()

  const {SearchInputJSX, searchInput} = useSearchInput("Search Vouchers")

  const handleStudentChange = (student) => {
    if (typeof student !== "string") {
      setSelectedStudent(student)
    }
  }

  const handleConfirmExamAssign = () => {
    setIsConfAlertOpened(false)
    setSelectedStudent(null)
  }

  const handleCancelExamAssign = () => {
    setIsConfAlertOpened(false)
    setSelectedStudent(null)
  }

  const handleAssignExamClick = (id) => {
    setSelectedExam(id)
    setSelectedStudent(null)
    setIsConfAlertOpened(true)
  }

  useEffect(() => {
    if (!schoolId) return
    dispatch(getVouchersBySchoolThunk(schoolId))
  }, [schoolId])

  const tableSchema: ITableSchema = useMemo(() => {
    return [
      {
        type: "text",
        headerText: "Voucher key",
        fieldName: "code"
      },
      {
        type: "text",
        headerText: "Exam code",
        fieldName: "examCode"
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
        headerText: "Retake available",
        fieldName: "retakeAvaillable"
      },
      {
        type: "text",
        headerText: "Voucher expiration date",
        fieldName: "expirationDate"
      },
      {
        type: "text",
        headerText: "Status",
        fieldName: "status"
      }
    ]
  }, [])

  const examAssignContent = useMemo(() => {
    if (!students) return
    return (
      <CustomAutocomplete
        options={students}
        labelField={"email"}
        onValueSelected={handleStudentChange}
      />
    )
  }, [students])

  return (
    <CardWithBreadcrumbs
      helmetTabTitle={"Vouchers"}
      pageTitle={"Vouchers"}
      breadcrumbs={[
        {
          path: mainPageLink,
          text: "Dashboard"
        },
        {
          path: null,
          text: "Vouchers"
        }
      ]}
    >
      <Scrollbar>
        <ConfirmationAlert
          isOpen={isConfAlertOpened}
          setOpen={setIsConfAlertOpened}
          handleConfirm={handleConfirmExamAssign}
          handleCancel={handleCancelExamAssign}
          dialogTitle={"Please select a student:"}
          dialogContent={examAssignContent}
          cancelText={"Cancel"}
          confirmText={"Assign voucher"}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/*SEARCH INPUT*/}
          {!!vouchers?.length && SearchInputJSX}
        </Box>
        {!vouchers?.length && !loading && (
          <>
            <Typography variant={"h6"} textAlign={"center"}>
              No available vouchers.
            </Typography>
            <Typography
              variant={"body1"}
              color={"primary"}
              textAlign={"center"}
            >
              Flexible vouchers options are available to meet the needs of your
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
          rows={vouchers}
          searchFields={["examCode", "productType", "status"]}
          searchInput={searchInput}
        />
      </Scrollbar>
    </CardWithBreadcrumbs>
  )
}
