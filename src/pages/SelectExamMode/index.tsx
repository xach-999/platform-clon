import React, {useEffect, useMemo} from "react"
import {makeStyles} from "@mui/styles"
import {Grid, Typography} from "@mui/material"
import OneSideCard from "./components/OneSideCard"
import {useNavigate} from "react-router"
import {LINKS} from "consts/links"
import gtm from "lib/gtm"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import {useLocation, useParams} from "react-router-dom"
import useExamFullName from "hooks/useExamFullName"
import createBreadCrumbsQuery from "utils/createBreadCrumbsQuery"
import {useSelector} from "store"
import BackdropLoad from "components/BackdropLoad"

const useStyles = makeStyles(() => {
  return {
    root: {
      display: "flex",
      width: "100%",
      height: "calc(100vh - 60px - 86px)",
      alignItems: "center",
      justifyContent: "center",
      "& *": {
        boxSizing: "border-box"
      }
    },
    msWrap: {
      minWidth: "600px",
      border: "1px solid #cfcfcf",
      display: "flex",
      flexDirection: "column",
      borderRadius: "4px",
      boxShadow: "3px 3px 9px 0px rgba(0, 0, 0, 0.1)"
    },
    msTitle: {
      textAlign: "center",
      borderBottom: "1px solid #cfcfcf91",
      margin: 0,
      padding: "0.7rem",
      fontWeight: "normal",
      fontSize: "22px"
    },
    msContent: {
      display: "flex"
    },
    msContentColumn: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      padding: "40px",
      width: "50%",
      "&:hover svg": {
        opacity: "0.7"
      }
    },
    msContentImage: {
      width: "150px",
      height: "150px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& > svg": {
        cursor: "pointer",
        color: "#656565",
        transition: ".4s ease"
      }
    },
    msContentDescription: {
      maxWidth: "300px"
    },
    msContentTitle: {
      textAlign: "center",
      textTransform: "uppercase",
      color: "#3c4851",
      lineHeight: "1.2",
      fontSize: "17px",
      margin: "0 0 10px 0"
    },
    msContentText: {
      textAlign: "center",
      color: "#6b7680",
      lineHeight: "22px",
      fontSize: "15px"
    }
  }
})

export default function SelectExamMode() {
  const params = useParams()
  const styles = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const examFullName = useExamFullName(params)

  const loading = useSelector((store) => store.practiceSession.loading)

  const breadcrumbs = useMemo(() => {
    const query = ["/dashboard"]
    if (location.pathname.includes("/practice-tests"))
      query.push("/practice-tests")

    return createBreadCrumbsQuery(query, "Select Test Mode", examFullName)
  }, [])

  useEffect(() => {
    gtm.push({event: "page_view"})
  }, [])

  const handleSelectExamMode = (selectedMode) => {
    let pathToOptions = `${LINKS.selectModeOptions}/${params.examName}`
    if (location.pathname.includes("/practice-tests"))
      pathToOptions = `/practice-tests${pathToOptions}`
    if (selectedMode === "practice") navigate(pathToOptions)
    if (selectedMode === "real") {
      const voucherId = params.examName.split("-")[0]
      navigate(`${LINKS.additionalExamInfoPage}/${voucherId}`)
      // realExamModeFunctionality()
    }
  }

  return (
    <>
      <BackdropLoad open={loading} />
      <CardWithBreadcrumbs
        helmetTabTitle={"Select Mode"}
        pageTitle={`${
          examFullName ? `${examFullName} -` : ""
        } Select Practice Mode`}
        breadcrumbs={breadcrumbs}
      >
        <Grid container item direction="column" xs={12}>
          <Typography color={"primary"} className={styles.msTitle}>
            Please Select Practice Mode
          </Typography>
          <Grid container>
            <OneSideCard
              examType={"real"}
              onSelectExamMode={handleSelectExamMode}
            />
            <OneSideCard
              examType={"practice"}
              onSelectExamMode={handleSelectExamMode}
            />
          </Grid>
        </Grid>
      </CardWithBreadcrumbs>
    </>
  )
}
