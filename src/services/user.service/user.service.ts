import apiCall from "api/rest"
import client from "api/apollo"
import {GET_USER} from "api/apollo/queries"
import {Query} from "generated/graphql"
import {IUserInfo} from "types/common"
import {ENDPOINT} from "consts/endpoints"
import {
  IFetchUserServiceMethods,
  IUpdateUserServiceMethods,
  IUserService
} from "types/services/user.service.t"

const UpdateUserServiceMethods: IUpdateUserServiceMethods = {
  registerAsAProctor: () => {
    return apiCall({
      url: ENDPOINT.registerAsProctor,
      method: "POST"
    })
  }
}

const FetchUserServiceMethods: IFetchUserServiceMethods = {
  fetchUserInfo: async () => {
    const {data} = await client.query<Query>({
      query: GET_USER,
      fetchPolicy: "network-only"
    })

    return data.me as IUserInfo
  },
  updateCurrentUser: ({payload}) => {
    return apiCall({
      url: ENDPOINT.updateUserInfo,
      method: "PATCH",
      data: payload
    })
  }
}

const userService: IUserService = {
  ...UpdateUserServiceMethods,
  ...FetchUserServiceMethods
}

export default userService
