import React, {useEffect, useMemo, useState} from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  LinearProgress,
  Link,
  TextField,
  Typography
} from "@mui/material"
import {LINKS} from "consts/links"
import {useNavigate} from "react-router"
import gtm from "lib/gtm"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import {useLocation, useParams} from "react-router-dom"
import {useDispatch, useSelector} from "store"
import {
  cleanCurrentVoucher,
  redeemVoucherByCode,
  removeVoucherError
} from "store/slices/practiceVouchers/practiceVouchers"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import useMainPageLink from "hooks/useMainPageLink"

export default function AddExamByVoucher() {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const {mainPageLink} = useMainPageLink()

  const [licenseCheck, setLicenseCheck] = useState(false)
  const [voucherLocalError, setVoucherLocalError] = useState(null)
  const [voucherCode, setVoucherCode] = useState("")

  const currentVoucherLoading = useSelector(
    (state) => state.practiceVouchers.loading
  )
  const redeemVoucherError = useSelector(
    (state) => state.practiceVouchers.errorMessage
  )
  const currentVoucher = useSelector(
    (state) => state.practiceVouchers.currentVoucher || null
  )

  const isRedeemPage = useMemo(() => {
    if (!location?.pathname) return false

    return location.pathname.includes("/redeem-key")
  }, [location])

  const breadcrumbs = useMemo(() => {
    const isFromPracticeTests = location.pathname.includes("/practice-tests")
    const result = [
      {
        path: mainPageLink,
        text: "Dashboard"
      }
    ]

    if (isFromPracticeTests) {
      result.push({
        path: "/practice-tests",
        text: "My Practice Tests"
      })
    }

    if (params?.examName) {
      result.push({
        path: null,
        text: params?.examName
      })
    }

    if (isRedeemPage) {
      result.push({
        path: null,
        text: isRedeemPage ? "Redeem Voucher Key" : "Add Practice Test"
      })
    }

    return result
  }, [location])

  const pageTitle = useMemo(() => {
    let titleResult = ""
    if (params?.examName) titleResult = `${params?.examName} -   `
    titleResult += isRedeemPage ? "Redeem Voucher Key" : "Add Practice Test"

    return titleResult
  }, [params, isRedeemPage])

  const voucherErrorMessage = useMemo(() => {
    return voucherLocalError || redeemVoucherError || null
  }, [voucherLocalError, redeemVoucherError])

  const onAddClick = async () => {
    dispatch(redeemVoucherByCode(voucherCode))
  }

  const onNextClick = () => {
    if (currentVoucher?.id && currentVoucher?.examCode) {
      navigate(
        `${LINKS.selectExamMode}/${currentVoucher?.id}-${currentVoucher?.examCode}`
      )
      return
    }

    setVoucherLocalError("Redeem a voucher first please")
  }

  const onVoucherTextFieldFocus = () => {
    dispatch(removeVoucherError())
    setVoucherLocalError(null)
  }

  useEffect(() => {
    gtm.push({event: "page_view"})
    dispatch(removeVoucherError())
    setVoucherLocalError(null)
    dispatch(cleanCurrentVoucher())
  }, [])

  return (
    <CardWithBreadcrumbs
      helmetTabTitle={isRedeemPage ? "Redeem Voucher Key" : "Add Practice Test"}
      pageTitle={pageTitle}
      breadcrumbs={breadcrumbs}
    >
      <Grid container item direction="column" xs={12}>
        <Grid item mb={3}>
          <Typography color="textPrimary" variant="h6">
            Redeem your voucher key below
          </Typography>
          <Typography color="textPrimary" variant="subtitle1">
            {currentVoucher?.examName || params.examName}
          </Typography>
        </Grid>
        <Grid item sx={{alignItems: "center", display: "flex"}}>
          <TextField
            fullWidth
            placeholder="Insert voucher key"
            size={"small"}
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            onFocus={onVoucherTextFieldFocus}
          />
          <Button
            color="primary"
            sx={{ml: 2}}
            variant="contained"
            onClick={onAddClick}
            disabled={!voucherCode || currentVoucherLoading || !licenseCheck}
            startIcon={<AddCircleIcon />}
          >
            Add
          </Button>
        </Grid>
        <Grid item p={0} m={0}>
          <Typography color="error" variant="subtitle2">
            {voucherErrorMessage}
          </Typography>
        </Grid>
        <Grid item>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
            mb={"20px"}
          >
            <FormControlLabel
              control={<Checkbox
                  checked={licenseCheck}
                  color="primary"
                  name="isTaxable"
                  onChange={() => setLicenseCheck((prev) => !prev)}
                  value={licenseCheck}
                />}
              label={<Typography variant="subtitle2">
                  I accept the{" "}
                  <Link
                    underline="always"
                    target="_blank"
                    color="primary"
                    href="https://dev.platform.knowledge-pillars.com/terms-and-conditions"
                  >
                    Terms & Conditions
                  </Link>{" "}
                </Typography>}
            />
            <Typography>
              <Link
                underline="always"
                variant="subtitle2"
                target="_blank"
                href="https://knowledge-pillars.com/shop/">
                Buy new voucher
              </Link>
            </Typography>
          </Box>
        </Grid>
        <Box minHeight="4px">
          {currentVoucherLoading && <LinearProgress color="primary"/>}
        </Box>
      </Grid>
      <Grid item display={"flex"} justifyContent={"space-between"} pt={1}>
        <Button
          variant={"outlined"}
          color={"primary"}
          size={"medium"}
          onClick={() => navigate(-1)}
          disabled={isRedeemPage}
        >
          Back
        </Button>
        <Button
          variant={"contained"}
          color={"primary"}
          size={"medium"}
          disabled={!currentVoucher}
          onClick={onNextClick}
        >
          Next
        </Button>
      </Grid>
    </CardWithBreadcrumbs>
  )
}
