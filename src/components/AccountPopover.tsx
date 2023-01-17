import {LINKS} from "consts/links"
import React, {useEffect, useMemo, useRef, useState} from "react"
import {Link as RouterLink, useNavigate} from "react-router-dom"
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  FormControl,
  InputLabel,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  Typography
} from "@mui/material"
import useAuth from "hooks/useAuth"
import UserIcon from "assets/icons/User"
import {useDispatch, useSelector} from "store"
import {logoutThunk, setFakeGroup} from "store/slices/userSlice/userSlice"
import {
  cleanSpecificSchoolStateField,
  setCurrentSchool
} from "store/slices/schoolSlice/schoolSlice"
import {Group} from "types/access"
import {isISchoolItem} from "types/typeUtils"
import useMainPageLink from "hooks/useMainPageLink"

export default function AccountPopover() {
  const anchorRef = useRef<HTMLButtonElement | null>(null)
  const navigate = useNavigate()

  const {logout} = useAuth()

  const [open, setOpen] = useState(false)
  const [selectAcc, setSelectAcc] = useState("student")

  const dispatch = useDispatch()

  const {cognitoUser} = useAuth()
  const {isStudent} = useMainPageLink()

  const schools = useSelector((state) => {
    const schools = state.schoolSlice?.allSchools
    if (!schools?.length) return []
    return schools.reduce((acc, {id, name}) => {
      acc.push({id, name})
      return acc
    }, [])
  })
  const userGroups = useSelector((state) => state.userSlice.userGroups)
  const currentSchool = useSelector((state) => state.schoolSlice.currentSchool)
  const allSchools = useSelector((state) => state.schoolSlice.allSchools)

  const currSchoolInfo = useMemo(() => {
    if (!currentSchool || !allSchools) return
    return allSchools.find((el) => el.id === currentSchool)
  }, [currentSchool, allSchools])

  const isDropdown = useMemo(() => {
    const isRealStudent =
      userGroups?.length === 1 && userGroups?.includes(Group.Student)
    if (isRealStudent) return false
    return !!schools?.length
  }, [userGroups, schools])

  const logoImageURL = useMemo(() => {
    // TODO: uncomment when we have real logos
    if (isStudent) return null /*user?.photoUrl*/
    return currSchoolInfo?.logo
  }, [isStudent, currSchoolInfo])

  const handleOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const onSchoolSelect = (e) => {
    const selectedOption = e.target.value

    setSelectAcc(selectedOption)

    localStorage.setItem("selectedAccount", selectedOption?.id || selectedOption)

    if (selectedOption === "student") {
      dispatch(
        cleanSpecificSchoolStateField([
          "testingGroups",
          "teachers",
          "currentSchool",
          "students"
        ])
      )

      dispatch(setFakeGroup(Group.Student))

      navigate("/dashboard", {
        replace: true
      })

      return
    }

    dispatch(setFakeGroup(null))
    dispatch(setCurrentSchool(selectedOption))

    navigate(LINKS.classrooms, {
      replace: true
    })
  }

  const handleLogout = async (): Promise<void> => {
    try {
      handleClose()
      await logout()
      localStorage.removeItem("selectedAccount")
      dispatch(logoutThunk())
      dispatch(setFakeGroup(null))
      navigate("/authentication/login")
    } catch (err) {
      navigate("/authentication/login")
    }
  }

  useEffect(() => {
    if (!currentSchool) return
    if (!schools?.length) return

    const schoolId = isISchoolItem(currentSchool)
      ? currentSchool.id
      : currentSchool
    const isExistsInList = schools.find((el) => el.id === schoolId)

    if (isExistsInList) {
      setSelectAcc(schoolId)
      return
    }

    setSelectAcc(schools[0].id)
  }, [currentSchool, schools])

  const [firstName, lastName, email] = useMemo(() => {
    return [
      cognitoUser?.attributes.given_name,
      cognitoUser?.attributes.family_name,
      cognitoUser?.attributes.email
    ]
  }, [cognitoUser])

  return (
    <>
      <ButtonBase
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: "center",
          display: "flex"
        }}>
        <Avatar
          src={logoImageURL}
          sx={{
            height: 32,
            width: 32
          }}
        />
      </ButtonBase>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom"
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {width: 240}
        }}>
        <Box sx={{p: 2}}>
          <Typography color="textPrimary" variant="subtitle2">
            {[firstName, lastName].filter((_) => _).join(" ")}
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            {email}
          </Typography>
        </Box>
        {isDropdown && (
          <Box sx={{mt: 2}}>
            <MenuItem component={ListItem}>
              <FormControl
                variant="standard"
                sx={{
                  width: "100%"
                }}
              >
                <InputLabel id="demo-simple-select-label">
                  Select account
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  name={"accSelect"}
                  value={selectAcc}
                  onChange={onSchoolSelect}>
                  <MenuItem key={1} value={"student"}>
                    Student account
                  </MenuItem>
                  {schools.map(({id, name}) => {
                    return (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </MenuItem>
          </Box>
        )}
        <Box mt={2}>
          <MenuItem component={RouterLink} to="/account">
            <ListItemIcon>
              <UserIcon fontSize="small"/>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography color="textPrimary" variant="subtitle2">
                  Account
                </Typography>
              }
            />
          </MenuItem>
        </Box>
        <Box p={2}>
          <Button
            color="primary"
            fullWidth
            onClick={handleLogout}
            variant="outlined">
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  )
}
