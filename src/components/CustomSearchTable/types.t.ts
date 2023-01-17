import {Classroom, Invitation, WaitingList} from "generated/graphql"
import {ReactElement} from "react"
import {
  ICheckboxStudentItem,
  ILicenseItem,
  IClassroomItem,
  ISerializedTeacherItem,
  ISerializedTestingGroupItem,
  IStudentItem,
  IVoucherItem,
  IStudentClassroomItem,
  ITeacherItem
} from "types/common"
import {IStudentResultItem} from "components/TestResults"

export type TRow =
  | ISerializedTeacherItem
  | ISerializedTestingGroupItem
  | IStudentItem
  | ILicenseItem
  | IVoucherItem
  | ICheckboxStudentItem
  | IStudentResultItem
  | IClassroomItem
  | Classroom
  | IStudentClassroomItem
  | ITeacherItem
  | Invitation
  | WaitingList
  | null

export type SchemaItemTypes =
  | "text"
  | "actions"
  | "avatar"
  | "checkbox"
  | "custom"

export interface IHeaderTextInteractive {
  element: JSX.Element
}

export interface IControl {
  icon: JSX.Element
  handler: (id: string) => void
  tooltipText?: string
  enabled?: {
    field: string
    value: string
  }
  variableToReturn?: string
}

export interface ITextItem {
  type: SchemaItemTypes
  headerText: string | IHeaderTextInteractive
  fieldName: string
  copyAction?: boolean
}

export interface IAvatarItem {
  type: SchemaItemTypes
  headerText: string | IHeaderTextInteractive
  fieldName: Array<string>
  image: string
}

export interface IActionItem {
  type: SchemaItemTypes
  headerText: string | IHeaderTextInteractive
  actions: Array<IControl>
}

export interface ICheckboxItem {
  type: SchemaItemTypes
  headerText: string | IHeaderTextInteractive
  fieldToReturn?: string
  checkHandler: (field: string) => void
}

export interface ICustomItem {
  type: SchemaItemTypes
  headerText: string | IHeaderTextInteractive
  content: (data: TRow) => ReactElement | string
}

export type ITableSchema = Array<
  ITextItem | IAvatarItem | IActionItem | ICheckboxItem | ICustomItem
>

export interface ICurrentTableData {
  currentPaginatedRows: Array<any>
  page: number
  rowsPerPage: number
}

export interface ICustomSearchTableProps {
  tableSchema: ITableSchema
  rows: Array<TRow> | null
  rowsPerPageOption?: number
  fullWidth?: boolean
  searchFields?: Array<string>
  searchInput?: string
  loading?: boolean
  onGetPageChangeInfo?: (currentTableData: ICurrentTableData) => void
}

export const isInteractiveHeaderText = (
  el: string | IHeaderTextInteractive
): el is IHeaderTextInteractive => !!(el as IHeaderTextInteractive).element
