import useAuth from "hooks/useAuth"
import {useSelector} from "store"
import {useMemo} from "react"

const useUserInfo = () => {
  const auth = useAuth()
  const userFromStore = useSelector((state) => state.userSlice)
  const user = useMemo(
    () => ({
      ...(auth?.user || {}),
      ...userFromStore
    }),
    [auth, userFromStore]
  )
  return {user}
}
export default useUserInfo
