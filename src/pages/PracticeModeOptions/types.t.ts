import {ChangeEvent} from "react"

type OnInputType = {
  fieldName: string
  inputValue: string
}

export type OptFieldType = {
  fieldName: string
  isChecked: boolean
  preDescription: string
  postDescription?: string
  buttonText?: string
  inputValue?: string
  id: string
}

export type OptionsFieldsType = {
  [key: string]: OptFieldType
}

export interface CheckInputOptionProps {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  isChecked: boolean
  preDescription?: string
  postDescription?: string
  fieldName: string
  buttonText?: string
  onModalButtonClick?: () => void
  onInput?: (data: OnInputType) => void
}

export interface ObjectiveField {
  id: string
  title: string
  examCode: string
  objectiveCode: string
  isChecked: boolean
}

export type ObjectivesListType = {
  [key: string]: ObjectiveField
}

export interface ObjectivesModalProps {
  modalName: string
  isModal: boolean
  setIsModal: (modalName: string, state: boolean) => void
  onConfirmModal: (objectives: ObjectivesListType) => void
  objectivesList: ObjectivesListType
}

export interface OneFieldType {
  fieldName: string
  isChecked: boolean
  preDescription?: string
  postDescription?: string
  inputValue?: string
  buttonText?: string
  id: string
}

interface FieldsType {
  [key: string]: OneFieldType
}

interface InputValueArgs {
  fieldName
  inputValue
}

export interface OptionsColumnProps {
  handleCheck: (event: ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void
  handleInput: (event: InputValueArgs) => void
  setIsModal: (modalName: string, state: boolean) => void
  fields: FieldsType
  selectState
}
