import {useMemo, useState} from "react"
import {useNavigate} from "react-router-dom"
import * as Yup from "yup"
import {Formik} from "formik"
import {Country, State, City} from "country-state-city"
import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  Link,
  TextField,
  Typography,
  Grid,
  Autocomplete
} from "@mui/material"
import useAuth from "hooks/useAuth"
import InputAdornment from "@mui/material/InputAdornment"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
// import TodayIcon from "@mui/icons-material/Today"
// import PhoneIcon from "@mui/icons-material/Phone"
// import HomeIcon from "@mui/icons-material/Home"
import LocationCityIcon from "@mui/icons-material/LocationCity"
import PublicIcon from "@mui/icons-material/Public"
import ApartmentIcon from "@mui/icons-material/Apartment"
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox"
import UnisexPersonIcon from "assets/icons/UnisexPersonIcon"

interface FieldTemplateProps {
  touched: any
  values: any
  errors: any
  fieldName: string
  label: string
  type?: "text" | "password" | "email" | "date"
  handleBlur: any
  handleChange: any
}
interface SelectTemplateProps {
  touched: any
  values: any
  errors: any
  fieldName: string
  label: string
  type?: "text" | "password" | "email" | "date"
  options: any
  handleChange: any
}
const getTextFieldIcon = (fieldName) => {
  switch (fieldName) {
    case "firstName":
      return <UnisexPersonIcon />
    case "lastName":
      return <UnisexPersonIcon />
    case "email":
      return <EmailIcon />
    case "password":
      return <LockIcon />
    // case "birthdate":
    //   return <TodayIcon />
    // case "phone":
    //   return <PhoneIcon />
    // case "address":
    //   return <HomeIcon />
    case "city":
      return <LocationCityIcon />
    case "country":
      return <PublicIcon />
    case "state":
      return <ApartmentIcon />
    case "postcode":
      return <MarkunreadMailboxIcon />
    default:
  }
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
}: FieldTemplateProps) => {
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
        variant="outlined"
        InputLabelProps={{
          shrink: 
          // fieldName === "birthdate" || 
          values[fieldName]
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              {getTextFieldIcon(fieldName)}
            </InputAdornment>
          )
        }}
      />
    </Grid>
  )
}

const SelecteTemplate = ({
  touched,
  values,
  errors,
  fieldName,
  label,
  options,
  handleChange
}: SelectTemplateProps) => {
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
              ...params.InputProps,
              type: "search",
              endAdornment: (
                <InputAdornment position="start" sx={{marginRight: "14px"}}>
                  {getTextFieldIcon(fieldName)}
                </InputAdornment>
              )
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
          error
        >
          {touched[fieldName] && errors[fieldName]}
        </FormHelperText>
      )}
    </Grid>
  )
}

export default function RegisterAmplify(props) {
  const navigate = useNavigate()

  const {register} = useAuth() as any

  const countries = Country?.getAllCountries()
  const [selectedCountry, setSelectedCountry] = useState<any>({})
  const [selectedState, setSelectedState] = useState<any>({})

  const states = useMemo(() => {
    return State?.getStatesOfCountry(selectedCountry?.isoCode)
  }, [selectedCountry])

  const cities = useMemo(() => {
    return City?.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode)
  }, [selectedState])

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        // birthdate: "",
        // phone: "",
        // address: "",
        city: "",
        state: "",
        country: "",
        postcode: "",
        policy: true,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().max(255).required("First Name is required"),
        lastName: Yup.string().max(255).required("Last name is Required"),
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string().min(8).max(64).required("Password is required"),
        // birthdate: Yup.string().max(255)
        // .required("Birthday is required")
        // ,
        // phone: Yup.string()
        //   .max(255)
        //   // .required("This value should not be blank.")
        //   .matches(
        //     /^\+(?:[0-9]●?){6,14}[0-9]$/,
        //     "Valid phone example: +15417543010"
        //   ),
        // address: Yup.string().max(255)
        // .required("Address is required")
        // ,
        state: Yup.string().max(255)
        // .required("State/Region is required")
        ,
        city: Yup.string().max(255),
        country: Yup.string().max(255).required("Country is required"),
        postcode: Yup.string().max(255)
        // .required("Postcode is required")
        ,
        policy: Yup.boolean().oneOf([true], "This field must be checked")
      })}
      onSubmit={async (
        values,
        {setErrors, setStatus, setSubmitting}
      ): Promise<void> => {
        try {
          await register(values)

          navigate("/authentication/verify-code", {
            state: {
              username: values.email
            }
          })
        } catch (err) {
          console.error(err)
          setStatus({success: false})
          setErrors({submit: err.message})
          setSubmitting(false)
        }
      }}
    >
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
        <form noValidate onSubmit={handleSubmit} {...props}>
          <Grid container spacing={3}>
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
            <FieldTemplate
              fieldName="password"
              label="Password"
              type="password"
              touched={touched}
              values={values}
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />

            {/* <FieldTemplate
              fieldName="birthdate"
              label="Birthdate"
              type="date"
              touched={touched}
              values={values}
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
            /> */}

            {/* <FieldTemplate
              fieldName="phone"
              label="Phone"
              touched={touched}
              values={values}
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
            /> */}
            {/* <FieldTemplate
              fieldName="address"
              label="Address"
              touched={touched}
              values={values}
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
            /> */}
            <SelecteTemplate
              fieldName="country"
              label="Country"
              touched={touched}
              values={values}
              errors={errors}
              options={countries}
              handleChange={(e, value) => {
                setSelectedCountry(
                  countries.find((a) => a.name === value)
                )
                values.state = ""
                values.city = ""
                setSelectedState({})
                setFieldValue("country", value || "")
              }}
            />
            <SelecteTemplate
              fieldName="state"
              label="State/Region"
              touched={touched}
              values={values}
              errors={errors}
              options={states}
              handleChange={(e, value) => {
                setSelectedState(
                  states.find((a) => a.name === value)
                )
                values.city = ""
                setFieldValue("state", value || "")
              }}
            />
            <SelecteTemplate
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
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              ml: -1,
              mt: 2
            }}
          >
            <Checkbox
              checked={values.policy}
              color="primary"
              name="policy"
              onChange={handleChange}
            />
            <Typography color="textSecondary" variant="body2">
              I have read the{" "}
              <Link color="primary" component="a" href="/terms-and-conditions">
                Terms and Conditions
              </Link>
            </Typography>
          </Box>
          {Boolean(touched.policy && errors.policy) && (
            <FormHelperText error>{errors.policy}</FormHelperText>
          )}
          {errors.submit && (
            <Box sx={{mt: 3}}>
              <FormHelperText error>{errors.submit as string}</FormHelperText>
            </Box>
          )}
          <Box sx={{mt: 2}}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Register
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  )
}
