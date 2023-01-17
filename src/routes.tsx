import ExamResults from "pages/ExamResults"
import {lazy, Suspense} from "react"
import {RouteObject} from "react-router"
import AuthGuard from "components/AuthGuard"
import DashboardLayout from "components/DashboardLayout"
import GuestGuard from "components/GuestGuard"
import LoadingScreen from "components/LoadingScreen"
import MainLayout from "components/MainLayout"
import {LINKS} from "consts/links"
import DashboardExamsSelection from "pages/DashboardExamsSelection"
import MyClassrooms from "pages/MyClassrooms"
import PracticeModeOptions from "pages/PracticeModeOptions"
import AddExamByVoucher from "pages/AddExamByVoucher"
import ExamDetails from "pages/dashboard/ExamDetails"
import PracticeExamWindow from "pages/PracticeExamWindow"
import PracticeResults from "pages/PracticeResults"
import Teachers from "pages/Teachers"
import {Group} from "types/access"
import {isRouteAllowed} from "utils/security"
import AddTestingGroup from "pages/AddTestingGroup"
import TestingGroups from "pages/TestingGroups"
import IndividualTestingGroup from "pages/IndividualTestingGroup"
import ManageStudents from "pages/ManageStudents"
import LicenseList from "pages/LicenseList"
import AdditionalExamInfo from "pages/AdditionalExamInfo"
import RegisterAsProctor from "pages/authentication/RegisterAsProctor"
import ViewTestingGroup from "pages/ViewTestingGroup"
import ManageClassrooms from "pages/ManageClassrooms"
import ManageClassroom from "pages/ManageClassroom"
import CreateClassroom from "pages/CreateClassroom"

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen/>}>
    <Component {...props}/>
  </Suspense>
)

// Auth
const Login = Loadable(lazy(() => import("pages/authentication/Login")))
const PasswordRecovery = Loadable(lazy(() => import("pages/authentication/PasswordRecovery")))
const PasswordReset = Loadable(lazy(() => import("pages/authentication/PasswordReset")))
const Register = Loadable(lazy(() => import("pages/authentication/Register")))
const VerifyCode = Loadable(lazy(() => import("pages/authentication/VerifyCode")))
const Account = Loadable(lazy(() => import("pages/dashboard/Account")))

// Dashboard
const PracticeTests = Loadable(lazy(() => import("pages/dashboard/PracticeTests")))
const TermsAndContions = Loadable(lazy(() => import("pages/TermsAndConditions")))
const PrivacyPolicy = Loadable(lazy(() => import("pages/PrivacyPolicy")))
const FAQs = Loadable(lazy(() => import("pages/FAQs")))
const RedeemVoucher = Loadable(lazy(() => import("pages/dashboard/RedeemVoucher")))
const MyExams = Loadable(lazy(() => import("pages/dashboard/MyExams")))
const PrepareExam = Loadable(lazy(() => import("pages/dashboard/PrepareExam")))
const MyResults = Loadable(lazy(() => import("pages/dashboard/MyResults")))
const NotFound = Loadable(lazy(() => import("pages/NotFound")))
const SelectExamMode = Loadable(lazy(() => import("pages/SelectExamMode")))
const PracticeAnswers = Loadable(lazy(() => import("pages/PracticeAnswers")))
const AssignPracticeTests = Loadable(lazy(() => import("pages/AssignPracticeTests")))

interface ChildrenObjectWithGroups extends RouteObject {
  groups?: Group[]
}

export interface RouteObjectWithRoute extends ChildrenObjectWithGroups {
  children: ChildrenObjectWithGroups[]
}

export const routes: RouteObjectWithRoute[] = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <DashboardLayout/>
      </AuthGuard>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardExamsSelection/>,
        groups: [Group.Student]
      },
      {
        path: "/my-classrooms",
        element: <MyClassrooms/>,
        groups: [Group.Student]
      },
      {
        path: "/exam-window/:examCode/:sessionId/:taskId",
        element: <PracticeExamWindow/>
      },
      {
        path: "/practice-answers/:sessionId",
        element: <PracticeAnswers/>
      },
      {
        path: "/account",
        element: <Account/>,
        groups: [
          Group.Student,
          Group.Sme,
          Group.School_Admin,
          Group.Admin,
          Group.District,
          Group.School_Teacher
        ]
      },
      {
        path: "/redeem-key",
        element: <AddExamByVoucher/>,
        groups: [Group.Student]
      },
      {
        path: `/practice-tests${LINKS.selectExamMode}/:examName`,
        element: <SelectExamMode/>
      },
      {
        path: "/practice-tests/add-exam-by-voucher",
        element: <AddExamByVoucher/>
      },
      {
        path: "/practice-tests/add-exam-by-voucher/:examName",
        element: <AddExamByVoucher/>
      },
      {
        path: "/practice-tests",
        element: <PracticeTests/>,
        groups: [Group.Student]
      },
      {
        path: "/redeem-voucher",
        element: <RedeemVoucher/>
      },
      {
        path: "/buy-new-voucher",
        element: <RedeemVoucher/>
      },
      {
        path: "/my-exams",
        element: <MyExams/>
      },
      {
        path: "/prepare-exam",
        element: <PrepareExam/>
      },
      {
        path: "/my-results",
        element: <MyResults/>,
        groups: [Group.Student]
      },
      {
        path: "/practice-results",
        element: <MyResults/>,
        groups: [Group.Student]
      },
      {
        path: "/my-results/exam-details/:examId",
        element: <ExamDetails/>
      },
      {
        path: "/practice-results/exam-details/:sessionId",
        element: <ExamDetails/>
      },
      {
        path: `${LINKS.selectExamMode}/:examName`,
        element: <SelectExamMode/>
      },
      {
        path: `${LINKS.selectModeOptions}/:examName`,
        element: <PracticeModeOptions/>
      },
      {
        path: `/practice-tests${LINKS.selectModeOptions}/:examName`,
        element: <PracticeModeOptions/>
      },
      {
        path: `${LINKS.addExamByVoucher}`,
        element: <AddExamByVoucher/>
      },
      {
        path: `${LINKS.addExamByVoucher}/:examName`,
        element: <AddExamByVoucher/>
      },
      {
        path: `${LINKS.testingGroup}/:testingGroupId`,
        element: <IndividualTestingGroup/>
      },
      /*{
        path: `${LINKS.examAnalytics}`,
        element: <ExamAnalytics/>,
        groups: [Group.School_Admin, Group.Sme, Group.School_Teacher, Group.District]
      },*/
      {
        path: `${LINKS.examResults}`,
        element: <ExamResults/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        path: `${LINKS.studentPracticeResults}`,
        element: <PracticeResults/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        path: `${LINKS.teachersPage}`,
        element: <Teachers/>,
        groups: [Group.School_Admin]
      },
      {
        path: `${LINKS.addTestingGroup}`,
        element: <AddTestingGroup/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        path: `${LINKS.licenseListPage}`,
        element: <LicenseList/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      /*{
        path: `${LINKS.vouchersList}`,
        element: <VouchersList/>,
        groups: [Group.School_Admin, Group.Sme, Group.School_Teacher, Group.District],
      },*/
      {
        path: `${LINKS.testingGroup}`,
        element: <TestingGroups/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        path: `${LINKS.addEditTestingGroup}/:groupId`,
        element: <AddTestingGroup/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        path: `${LINKS.viewTestingGroup}/:groupId`,
        element: <ViewTestingGroup/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        path: `${LINKS.studentsListPage}`,
        element: <ManageStudents/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        path: LINKS.classrooms,
        element: <ManageClassrooms/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        path: `${LINKS.classrooms}/:classroomId`,
        element: <ManageClassroom/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        path: `${LINKS.createClassroom}`,
        element: <CreateClassroom/>,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      /*{
        path: LINKS.classroomListPage,
        element: <ClassroomListPage/>,
        groups: [Group.School_Admin, Group.Sme, Group.School_Teacher, Group.District],
      },*/
      {
        path: `${LINKS.additionalExamInfoPage}/:voucherId`,
        element: <AdditionalExamInfo/>,
        groups: [Group.Student]
      },
      {
        path: `${LINKS.registerAsProctor}`,
        element: <RegisterAsProctor/>,
        groups: [Group.School_Teacher, Group.School_Admin]
      },
      {
        path: `${LINKS.assignPracticeTestsPage}`,
        element: <AssignPracticeTests/>,
        groups: [Group.School_Teacher, Group.School_Admin, Group.District]
      }
    ]
  },
  {
    path: "authentication",
    children: [
      {
        path: "login",
        element: (
          <GuestGuard>
            <Login/>
          </GuestGuard>
        )
      },
      {
        path: "password-recovery",
        element: <PasswordRecovery/>
      },
      {
        path: "password-reset",
        element: <PasswordReset/>
      },
      {
        path: "register",
        element: (
          <GuestGuard>
            <Register/>
          </GuestGuard>
        )
      },
      {
        path: "verify-code",
        element: <VerifyCode/>
      }
    ]
  },
  {
    path: "*",
    element: <MainLayout/>,
    children: [
      {
        path: "404",
        element: <NotFound/>
      },
      {
        path: "*",
        element: <NotFound/>
      }
    ]
  },
  {
    path: "terms-and-conditions",
    element: <MainLayout/>,
    children: [
      {
        path: "",
        element: <TermsAndContions/>
      }
    ]
  },
  {
    path: "privacy-policy",
    element: <MainLayout/>,
    children: [
      {
        path: "",
        element: <PrivacyPolicy/>
      }
    ]
  },
  {
    path: "faqs",
    element: <MainLayout/>,
    children: [
      {
        path: "",
        element: <FAQs/>
      }
    ]
  }
]

const getAllowedRoutes = (userGroups): RouteObjectWithRoute[] => {
  return routes.reduce((acc, mainRoute) => {
    if (!isRouteAllowed(mainRoute.groups, userGroups)) return acc

    if (mainRoute?.children?.length) {
      const allowedChildren = mainRoute.children.reduce((acc, childRoute) => {
        if (isRouteAllowed(childRoute.groups, userGroups)) acc.push(childRoute)
        return acc
      }, [])

      const allowedRoute = {
        ...mainRoute,
        children: allowedChildren
      }

      acc.push(allowedRoute)

      return acc
    }

    if (isRouteAllowed(mainRoute.groups, userGroups)) acc.push(mainRoute)

    return acc
  }, [])
}

export default getAllowedRoutes
