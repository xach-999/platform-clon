import {useSelector} from "store"
import {useMemo} from "react"
import {Group} from "types/access"
import {LINKS} from "consts/links"

const useMainPageLink = () => {
  const {userGroups, fakeGroup} = useSelector((state) => state.userSlice)

  const {isStudent, mainPageLink, groupsLoading} = useMemo(() => {
    if (!userGroups?.length && !fakeGroup?.length)
      return {
        isStudent: true,
        mainPageLink: LINKS.dashboard,
        groupsLoading: true
      }

    if (
      userGroups?.includes(Group.Student) ||
      fakeGroup?.includes(Group.Student)
    ) {
      return {
        isStudent: true,
        mainPageLink: LINKS.dashboard,
        groupsLoading: false
      }
    }
    return {
      isStudent: false,
      mainPageLink: LINKS.classrooms,
      groupsLoading: false
    }
  }, [userGroups, fakeGroup])

  return {
    isStudent,
    mainPageLink,
    groupsLoading
  }
}

export default useMainPageLink
