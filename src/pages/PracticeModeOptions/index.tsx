import React, {ChangeEvent, useEffect, useMemo, useState} from "react"
import {Box, Typography} from "@mui/material"
import BackdropLoad from "components/BackdropLoad"
import PrevNextSection from "components/PrevNextSection"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {LINKS} from "consts/links"
import ObjectivesModal from "./components/ObjectivesModal"
import OptionsColumn from "./components/OptionsColumn"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import useExamFullName from "hooks/useExamFullName"
import createBreadCrambsQuery, {
  PathQueryType
} from "utils/createBreadCrumbsQuery"
import {
  ObjectivesListType,
  OptionsFieldsType
} from "pages/PracticeModeOptions/types.t"
import {useDispatch, useSelector} from "store"
import {
  createNewSession,
  getObjectives,
  resetSessionInfo
} from "store/slices/practiceSession/practiceSession"
import {unwrapResult} from "@reduxjs/toolkit"
import {fetchVoucherById} from "store/slices/practiceVouchers/practiceVouchers"
import {
  NewSessionBodySelect,
  NewSessionOptions
} from "store/slices/practiceSession/practiceSession.t"

const mockFields: OptionsFieldsType = {
  duration: {
    fieldName: "duration",
    isChecked: false,
    preDescription: "Custom duration of ",
    postDescription: "minutes",
    inputValue: "",
    id: "ksahbd1"
  },
  /*randomize_questions: {
    fieldName: "randomize_questions",
    isChecked: false,
    preDescription: "Randomize the question order of your test.* ",
    id: "ksahbd1a",
  },
  missed_questions: {
    fieldName: "missed_questions",
    isChecked: false,
    preDescription: "Show me questions I missed from last ",
    postDescription: "tests",
    inputValue: "", id: "ksahbd1r",

  },
  not_displayed_questions: {
    fieldName: "not_displayed_questions",
    isChecked: false,
    preDescription: "Show me questions not displayed from last ",
    postDescription: "tests",
    inputValue: "",
    id: "ksahbd1m",
  },
  change_answer_ability: {
    fieldName: "change_answer_ability",
    isChecked: false,
    preDescription: "Allow me to change my answers before scoring my test ",
    id: "ksahbd15",
  },*/
  show_objectives: {
    fieldName: "show_objectives",
    isChecked: false,
    preDescription: "Only show questions from:",
    buttonText: "Show Objectives",
    id: "ksahbd19"
  }
  /*show_question_types: {
    fieldName: "show_question_types",
    isChecked: false,
    preDescription: "Only show these question types:",
    buttonText: "Question Types",
    id: "show_question_types1",
  },*/
}

const mockQTypes = {
  parsons_id: {
    id: "parsons_id",
    title: "Include Parsons Type Questions",
    examCode: "Parsons Exam Code",
    objectiveCode: "Parsons Objective code",
    isChecked: false
  },
  Match_id: {
    id: "Match_id",
    title: "Include Match Type Questions",
    examCode: "Parsons Exam Code",
    objectiveCode: "Parsons Objective code",
    isChecked: false
  },
  Mutliple_id: {
    id: "Mutliple_id",
    title: "Include Mutliple Type Questions",
    examCode: "Parsons Exam Code",
    objectiveCode: "Parsons Objective code",
    isChecked: false
  },
  Practical_id: {
    id: "Practical_id",
    title: "Include Practical Type Questions",
    examCode: "Parsons Exam Code",
    objectiveCode: "Parsons Objective code",
    isChecked: false
  }
}

export default function PracticeModeOptions() {
  const params = useParams()
  const history = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const examFullName = useExamFullName(params)

  const [fields, setFields] = useState(mockFields)
  const [objectives, setObjectives] = useState(null)
  const [modalsState, setModalsState] = useState({
    show_objectives: false,
    show_question_types: false
  })
  const [selectState, setSelectState] = useState<NewSessionBodySelect>("task")
  const [questionTypes, setQuestionTypes] = useState(null)

  const loading = useSelector((state) => state.practiceSession.loading)
  const objectivesRedux = useSelector(state => state.practiceSession.objectives)
  const voucherExamCategory = useSelector(state => state.practiceVouchers.currentVoucher?.examCat)
  const voucherExamCode = useSelector(state => state.practiceVouchers.currentVoucher?.examCode)

  const breadcrumbs = useMemo(() => {
    const query: Array<string | PathQueryType> = ["/dashboard"]
    let path = "/select-exam-mode"

    if (location.pathname.includes("/practice-tests")) {
      query.push("/practice-tests")
      path = `/practice-tests${path}`
    }

    query.push({path, prepend: params.examName})

    return createBreadCrambsQuery(query, "Select Test Options", examFullName)
  }, [])

  const handlePrev = () => {
    history(`${LINKS.selectExamMode}/${params.examName}`)
  }

  const handleNext = async () => {
    if (!params.examName) return

    const objectiveAnswers = objectives && (
      Object.values(objectives as ObjectivesListType).reduce((acc, fd) => {
        if (!fd.isChecked) return acc
        acc.push(fd.objectiveCode)
        return acc
      }, [])
    )

    const voucherId = params.examName.split("-")[0]
    const type = "practice"
    const options: Partial<NewSessionOptions> = {
      showResult: selectState
    }

    if (fields.duration.isChecked)
      options["duration"] = Number.parseInt(fields.duration.inputValue) || 45
    if (fields.show_objectives.isChecked)
      options["objectives"] = objectiveAnswers

    const sessionResult = await dispatch(createNewSession({
      options,
      voucherId,
      type
    }))
    const normalizedSessionAnswer = unwrapResult(sessionResult)

    if (!normalizedSessionAnswer?.tasks?.length) return

    const currentSessionId = normalizedSessionAnswer?.id
    const examCode = normalizedSessionAnswer?.examCode
    const firstTaskId = normalizedSessionAnswer.tasks[0]?.id

    // localStorage.setItem("instructionsOpen", "true")
    history(`/exam-window/${examCode}/${currentSessionId}/${firstTaskId}`)
  }

  const handleCheck = (event) => {
    const changedField = JSON.parse(JSON.stringify(fields[event.target.name]))

    if (!changedField) return

    changedField.isChecked = !changedField.isChecked

    setFields((prev) => {
      return {
        ...prev,
        [changedField.fieldName]: changedField
      }
    })
  }

  const onConfirmModal = (obj) => {
    setObjectives(obj)
  }

  const handleInput = ({fieldName, inputValue}) => {
    const changedField = fields[fieldName]

    changedField.inputValue = inputValue

    setFields((prev) => {
      return {
        ...prev,
        [changedField.fieldName]: changedField
      }
    })
  }

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as NewSessionBodySelect

    setSelectState(value)
  }

  const onChangeModalState = (modalName, state) => {
    setModalsState((prev) => {
      return {
        ...prev,
        [modalName]: state
      }
    })
  }

  useEffect(() => {
    setFields(mockFields)
  }, [params])

  useEffect(() => {
    dispatch(resetSessionInfo())
  }, [dispatch])

  useEffect(() => {
    if (!objectivesRedux) return

    const result = objectivesRedux
      .slice()
      .sort((a, b) => {
        const firstNum = Number.parseInt(a.title)
        const secondNum = Number.parseInt(b.title)
        if (firstNum && secondNum) {
          return firstNum - secondNum
        }
        return a.title - b.title
      })
      .reduce((acc, el) => {
        acc[el.id] = {...el, isChecked: false}
        return acc
      }, {})

    setObjectives(result)
    setQuestionTypes(mockQTypes)
  }, [objectivesRedux, setObjectives])

  useEffect(() => {
    if (voucherExamCategory || !params?.examName) return

    const examId = params?.examName?.split("-")[0]

    dispatch(fetchVoucherById(examId))
  }, [params.examName, voucherExamCategory])

  useEffect(() => {
    if (!params?.examName && !voucherExamCode) return

    let examId = null
    const splitted = params?.examName?.split("-")

    if (splitted?.length) examId = splitted[1]
    if (examId) examId = examId.toLowerCase()

    if (!examId && !voucherExamCode) return
    if (voucherExamCode && voucherExamCode.toLowerCase() === "wordpress") {
      dispatch(getObjectives("wordpress"))
      return
    }

    dispatch(getObjectives(examId || voucherExamCode.toLowerCase()))
  }, [voucherExamCode, params?.examName])

  return (
    <>
      <BackdropLoad open={loading}/>
      <ObjectivesModal
        modalName="show_objectives"
        objectivesList={objectives}
        isModal={modalsState.show_objectives}
        setIsModal={onChangeModalState}
        onConfirmModal={onConfirmModal}
      />
      <ObjectivesModal
        modalName="show_question_types"
        objectivesList={questionTypes}
        isModal={modalsState.show_question_types}
        setIsModal={onChangeModalState}
        onConfirmModal={(ob) => setQuestionTypes(ob)}
      />
      <CardWithBreadcrumbs
        helmetTabTitle={"Practice Test Options"}
        pageTitle={`${examFullName ? `${examFullName} -` : ""} Practice Test Options`}
        breadcrumbs={breadcrumbs}>
        <Typography variant="h5" textAlign="center" color="primary">
          Select Practice Test Options
        </Typography>
        <Box mb={2} mt={2}>
          <Typography variant="subtitle2">
            Tests administered in Practice Test Mode allows students to
            customize their testing environment. On this screen you may
            customize the duration of the test, select specific questions based
            on the objective domains and choose to display answers to any
            response or to wait until the test is complete.
          </Typography>
          <Typography variant="subtitle2">
            You will not be able to perform changes once you submit the
            following configurations for your test instance.
          </Typography>
        </Box>
        <OptionsColumn
          setIsModal={onChangeModalState}
          fields={fields}
          handleInput={handleInput}
          handleCheck={handleCheck}
          handleSelectChange={handleSelectChange}
          selectState={selectState}
        />
        <PrevNextSection
          handlePrev={handlePrev}
          handleNext={handleNext}
          disabledNext={loading}
        />
      </CardWithBreadcrumbs>
    </>
  )
}
