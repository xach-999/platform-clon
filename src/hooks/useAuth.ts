import {useContext} from "react"
import AmplifyContext from "contexts/AmplifyContext"

const useAuth = () => useContext(AmplifyContext)

export default useAuth
