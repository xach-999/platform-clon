import {ISchoolItem} from "./common"

export const isISchoolItem = (item: ISchoolItem | any): item is ISchoolItem => {
  return (
    !!(item as ISchoolItem)?.id &&
    !!(item as ISchoolItem)?.code &&
    !!(item as ISchoolItem)?.name
  )
}
