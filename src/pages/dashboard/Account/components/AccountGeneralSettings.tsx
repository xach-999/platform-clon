import * as Yup from "yup"
import {Formik} from "formik"
import {Country, State, City} from "country-state-city"
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from "@mui/material"
import useAuth from "hooks/useAuth"
import {useDispatch, useSelector} from "store"
import {notifyUser} from "store/slices/notifier/notifier"
import useMainPageLink from "hooks/useMainPageLink"
import {useEffect, useMemo, useState} from "react"
import {CognitoUserAddress} from "contexts/AmplifyContext"
import UserService from "services/user.service/user.service"

const SelectTemplate = ({
  touched,
  values,
  errors,
  fieldName,
  label,
  options,
  handleChange
}: {
  touched: any
  values: any
  errors: any
  fieldName: string
  label: string
  options: any
  handleChange: any
}) => {
  return (
    <Grid item md={6} xs={12}>
      <Autocomplete
        disableClearable
        forcePopupIcon={false}
        id="country-select-demo"
        options={options.map((a) => a?.name)}
        value={values[fieldName] || ""}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            error={Boolean(touched[fieldName] && errors[fieldName])}
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps
            }}
          />
        )}
      />
      {Boolean(touched[fieldName] && errors[fieldName]) && (
        <FormHelperText
          sx={{
            ml: "14px",
            mr: "14px"
          }}
          error>
          {touched[fieldName] && errors[fieldName]}
        </FormHelperText>
      )}
    </Grid>
  )
}

const FieldTemplate = ({
  touched,
  values,
  errors,
  fieldName,
  label,
  type = "text",
  handleBlur,
  handleChange
}: {
  touched: any
  values: any
  errors: any
  fieldName: string
  label: string
  type?: "text" | "password" | "email" | "date"
  handleBlur: any
  handleChange: any
}) => {
  return (
    <Grid item md={6} xs={12}>
      <TextField
        error={Boolean(touched[fieldName] && errors[fieldName])}
        helperText={touched[fieldName] && errors[fieldName]}
        value={values[fieldName]}
        label={label}
        name={fieldName}
        onBlur={handleBlur}
        onChange={handleChange}
        type={type}
        fullWidth
        disabled={fieldName === "email"}
        variant="outlined"
        InputLabelProps={type === "date" ? {shrink: true} : {}}
      />
    </Grid>
  )
}

export default function AccountGeneralSettings(props) {
  const {cognitoUser, user, initialize} = useAuth()

  const dispatch = useDispatch()

  const currentSchool = useSelector((state) => state.schoolSlice.currentSchool)
  const allSchools = useSelector((state) => state.schoolSlice.allSchools)
  const [selectedCountry, setSelectedCountry] = useState<any>({})
  const [selectedState, setSelectedState] = useState<any>({})
  const countries = Country?.getAllCountries()

  const {isStudent} = useMainPageLink()

  const currSchoolInfo = useMemo(() => {
    if (!currentSchool || !allSchools) return
    return allSchools.find((el) => el.id === currentSchool)
  }, [currentSchool, allSchools])

  const logoImageURL = useMemo(() => {
    // TODO: uncomment when we have real logos
    if (isStudent) return null /*user?.photoUrl*/

    return currSchoolInfo?.logo
  }, [isStudent, currSchoolInfo])

  const cognitoUserAttributes = useMemo(() => {
    return cognitoUser?.attributes
  }, [cognitoUser])

  const cognitoUserAddress = useMemo<CognitoUserAddress>(() => {
    try {
      return JSON.parse(cognitoUserAttributes.address)
    } catch {
      return {}
    }
  }, [cognitoUserAttributes])

  const states = useMemo(() => {
    return State?.getStatesOfCountry(selectedCountry?.isoCode)
  }, [selectedCountry])

  const cities = useMemo(() => {
    return City?.getCitiesOfState(
      selectedCountry?.isoCode,
      selectedState?.isoCode
    )
  }, [selectedState])

  useEffect(() => {
    let country = countries?.find((a) => a.name === cognitoUserAddress.country)

    setSelectedCountry(country)
  }, [cognitoUserAddress.country])

  useEffect(() => {
    let state = states?.find((a) => a.name === cognitoUserAddress.state)

    setSelectedState(state)
  }, [cognitoUserAddress.state, states])

  const initialValues = useMemo(() => {
    return {
      firstName: cognitoUserAttributes.given_name || "",
      lastName: cognitoUserAttributes.family_name || "",
      email: cognitoUserAttributes.email || "",
      country: cognitoUserAddress.country || "",
      state: cognitoUserAddress.state || "",
      city: cognitoUserAddress.city || "",
      postcode: cognitoUserAddress.postcode || "",
      submit: null
    }
  }, [cognitoUserAttributes, cognitoUserAttributes])

  return (
    <Grid container spacing={3} {...props}>
      <Grid item lg={4} md={6} xl={3} xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" flexDirection="column" textAlign="center">
              <Box
                sx={{
                  p: 1,
                  border: (theme) => `1px dashed ${theme.palette.divider}`,
                  borderRadius: "50%"
                }}>
                <Avatar
                  src={logoImageURL}
                  sx={{
                    height: 100,
                    width: 100
                  }}
                />
              </Box>
              <Typography
                color="textPrimary"
                variant="subtitle2"
                mt={1}>
                {user?.firstName} {user?.lastName}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button color="primary" fullWidth variant="text">
              Remove Picture
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item lg={8} md={6} xl={9} xs={12}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().max(255).required(),
            lastName: Yup.string().max(255).required(),
            email: Yup.string().email("Must be a valid email").max(255),
            country: Yup.string().max(255).required("Country is required"),
            state: Yup.string().max(255),
            city: Yup.string().max(255),
            postcode: Yup.string().max(255)
          })}
          onSubmit={async (values, {setErrors, setStatus, setSubmitting}): Promise<void> => {
            delete values.submit
            delete values.email

            try {
              await UserService.updateCurrentUser({
                payload: values
              })
              await initialize()
              setStatus({success: true})
              setSubmitting(false)
              dispatch(notifyUser({message: "PROFILE_UPDATE_SUCCESS"}))
            } catch (err) {
              console.error(err)
              setStatus({success: false})
              setErrors({submit: err.message})
              setSubmitting(false)
            }
          }}>
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue
          }): JSX.Element => (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader title="Profile"/>
                <CardContent>
                  <Grid container spacing={4}>
                    <FieldTemplate
                      fieldName="firstName"
                      label="First Name"
                      touched={touched}
                      values={values}
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                    />
                    <FieldTemplate
                      fieldName="lastName"
                      label="Last Name"
                      touched={touched}
                      values={values}
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                    />
                    <FieldTemplate
                      fieldName="email"
                      label="Email"
                      type="email"
                      touched={touched}
                      values={values}
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                    />
                    <SelectTemplate
                      fieldName="country"
                      label="Country"
                      touched={touched}
                      values={values}
                      errors={errors}
                      options={countries}
                      handleChange={(e, value) => {
                        setSelectedCountry(countries.find((a) => a.name === value))
                        setSelectedState({})
                        values.state = ""
                        values.city = ""
                        setFieldValue("country", value || "")
                      }}
                    />
                    <SelectTemplate
                      fieldName="state"
                      label="State/Region"
                      touched={touched}
                      values={values}
                      errors={errors}
                      options={states}
                      handleChange={(e, value) => {
                        setSelectedState(states.find((a) => a.name === value))
                        values.city = ""
                        setFieldValue("state", value || "")
                      }}
                    />
                    <SelectTemplate
                      fieldName="city"
                      label="City"
                      touched={touched}
                      values={values}
                      errors={errors}
                      options={cities}
                      handleChange={(e, value) => {
                        setFieldValue("city", value || "")
                      }}
                    />
                    <FieldTemplate
                      fieldName="postcode"
                      label="Postcode"
                      touched={touched}
                      values={values}
                      errors={errors}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                    />
                  </Grid>
                  {errors.submit && (
                    <Box mt={3}>
                      <FormHelperText error>
                        {errors.submit as string}
                      </FormHelperText>
                    </Box>
                  )}
                </CardContent>
                <Box display="flex" justifyContent="flex-end" p={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}>
                    Save Changes
                  </Button>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  )
}
