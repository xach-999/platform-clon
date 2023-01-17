export interface MultipleCorrectAnswerItem {
  id: string
  text: string
}

interface WithPositionAnswerItem extends MultipleCorrectAnswerItem {
  position?: number
}

export type IMultipleCorrectAnswer = Array<MultipleCorrectAnswerItem>

export type WithPositionAnswer = Array<WithPositionAnswerItem>

export interface MultipleCorrectAnswerProps {
  correctAnswer: IMultipleCorrectAnswer
}

export interface MatchCorrectAnswerProps {
  correctAnswer: WithPositionAnswer
}

export interface CodeCorrectAnswerProps {
  correctAnswer: WithPositionAnswer
}
