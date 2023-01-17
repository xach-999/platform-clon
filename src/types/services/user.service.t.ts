import {IServiceMethodFunc, IUserInfo} from "../common"

export interface IUpdateUserServiceMethods {
  registerAsAProctor: IServiceMethodFunc<void, IUserInfo>
}
export interface IFetchUserServiceMethods {
  fetchUserInfo: IServiceMethodFunc<void, IUserInfo>
  updateCurrentUser: IServiceMethodFunc<{ payload: any }, any>
}

export interface IUserService
  extends IUpdateUserServiceMethods,
    IFetchUserServiceMethods {}
