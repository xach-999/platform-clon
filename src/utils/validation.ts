export const signUpKeys = {
  GIVEN_NAME: {key: "given_name", label: "First Name"},
  SURNAME: {key: "family_name", label: "Last Name"},
  EMAIL: {key: "email", label: "Email"},
  PASSWORD: {key: "password", label: "Password"},
  BIRTHDATE: {key: "birthdate", label: "Birthdate"},
  PHONE: {key: "phone_number", label: "Phone"},
  ADDRESS: {key: "address", label: "Address", address: true},
  CITY: {key: "city", label: "City", address: true},
  COUNTRY: {key: "country", label: "Country", address: true},
  POSTCODE: {key: "postcode", label: "Postcode", address: true}
}

export const forgotPasswordKeys = {
  EMAIL: {key: "email", label: "Email"},
  PASSWORD: {key: "password", label: "Password"}
}

export const proctorVerifyKeys = {
  EMAIL: {key: "email", label: "Email"},
  PASSWORD: {key: "password", label: "Password"}
}

export const groupsKeys = {
  GROUP_NAME: {key: "name", label: "Group Name"},
  STATUS: {key: "status", label: "Status"},
  LICENSE: {key: "licenseId", label: "License"},
  PROGRAM: {key: "programId", label: "Program"},
  EXAM: {key: "examId", label: "Exam"},
  TEACHERS: {key: "teacherIds", label: "Teachers"},
  PROCTORING: {key: "typeProctoring", label: "Proctoring"}
}

export const updateUserInfoKeys = {
  GIVEN_NAME: {key: "given_name", label: "First Name"},
  SURNAME: {key: "family_name", label: "Last Name"},
  EMAIL: {key: "email", label: "Email"},
  BIRTHDATE: {key: "birthdate", label: "Birthdate"},
  PHONE: {key: "phone_number", label: "Phone"},
  ADDRESS: {key: "address", label: "Address", address: true},
  CITY: {key: "city", label: "City", address: true},
  COUNTRY: {key: "country", label: "Country", address: true},
  POSTCODE: {key: "postcode", label: "Postcode", address: true}
}

export const updateOrganizationInfoKeys = {
  WEBSITE: {key: "website", label: "Website"},
  EMAIL: {key: "contactEmail", label: "Email"},
  COUNTRY: {key: "country", label: "Country", address: true},
  ADDRESS: {key: "address1", label: "Address", address: true},
  POSTCODE: {key: "postalCode", label: "Postcode", address: true},
  CITY: {key: "city", label: "City", address: true},
  PHONE: {key: "phone", label: "Phone"},
  BILLING_ADDRESS: {key: "billingAddress"}
}

export const billingAddressKeys = {
  CUS_ADDRESS: {key: "address1", label: "Address"},
  CUS_COUNTRY: {key: "country", label: "Country"},
  CUS_POSTCODE: {key: "postalCode", label: "Postcode"},
  CUS_CITY: {key: "city", label: "City"}
}

const isEmpty = (value) => {
  return value === ""
}

const isValidEmail = (value) => {
  const rule =
    /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return rule.test(value)
}

function isValidPhone(str) {
  const rule = /^\+(?:[0-9]●?){6,14}[0-9]$/
  return rule.test(str)
}

const isValidUsername = (value) => {
  const rule = /^[a-zA-Z-]+$/
  return rule.test(value)
}

const isValidBirthDate = (value) => {
  const rule = /^[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}$/g
  return rule.test(value)
}

const isValidWebsiteUrl = (value) => {
  const rule =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
  return rule.test(value)
}

const isValidPassword = (value) => {
  const rule = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/
  return rule.test(value)
}

export const getInitialState = (keys) => {
  const values = {}

  Object.values(keys).map((item: any) => {
    return (values[item.key] = "")
  })

  return values
}

export const getAttributes = (values, keys) => {
  const address = {}
  const attr = {}

  Object.values(keys).forEach((key: any) => {
    let value =
      undefined === values[key.key] || null === values[key.key]
        ? ""
        : values[key.key]
    if (key.address) {
      address[key.key] = value
    } else {
      if (key.key !== "password") {
        attr[key.key] = value
      }
    }
  })

  return {...attr, address: JSON.stringify(address)}
}

export const checkEmail = (email) => {
  if (isEmpty(email)) {
    return "This value should not be blank."
  }

  if (!isValidEmail(email)) {
    return "This value is not a valid Email."
  }

  return false
}

export const checkWebsiteUrl = (value) => {
  if (isEmpty(value)) {
    return "This value should not be blank."
  }

  if (!isValidWebsiteUrl(value)) {
    return "This value is not a valid Website Url."
  }

  return false
}

export const checkUserName = (username) => {
  if (isEmpty(username)) {
    return "This value should not be blank."
  }

  if (!isValidUsername(username)) {
    return "This value is not a valid UserName."
  }

  return false
}

export const checkPhone = (phone_number) => {
  if (isEmpty(phone_number)) {
    return "This value should not be blank."
  }

  if (!isValidPhone(phone_number)) {
    return "Valid phone example: +15417543010"
  }

  return false
}

export const checkPassword = (password) => {
  if (8 > password.length) {
    return "Password must be at least 8 characters long"
  }
  if (!isValidPassword(password)) {
    return "Password must contain at least 1 uppercase 1 lowercase and 1 number characters"
  }
  return false
}

export const chekBirthDate = (value) => {
  if (isEmpty(value)) {
    return "This value should not be blank."
  }
  if (!isValidBirthDate(value)) {
    return "Valid birth date example: 12/12/2012"
  }

  return false
}

export const checkEmptyInput = (value) => {
  if (isEmpty(value)) {
    return "This value should not be blank."
  }

  return false
}

export const checkSelect = (value) => {
  if (isEmpty(value) || !value || value.length === 0) {
    return "This value should not be blank."
  }
  return false
}
