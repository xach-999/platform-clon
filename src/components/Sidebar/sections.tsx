import EqualizerIcon from "@mui/icons-material/Equalizer"
import PersonIcon from "@mui/icons-material/Person"
import {Group} from "types/access"
import VpnKeyIcon from "@mui/icons-material/VpnKey"
import DesktopMacIcon from "@mui/icons-material/DesktopMac"
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck"
import SchoolIcon from "@mui/icons-material/School"
import {LINKS} from "consts/links"

const sections = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        path: "/dashboard",
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [Group.Student]
      },
      {
        title: "My Classrooms",
        path: "/my-classrooms",
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [Group.Student]
      },
      {
        title: "Account",
        path: "/account",
        icon: <PersonIcon fontSize="small" style={{color: "white"}} />,
        groups: [Group.Student]
      },
      {
        title: "Redeem Key",
        path: "/redeem-key",
        icon: <VpnKeyIcon fontSize="small" style={{color: "white"}} />,
        groups: [Group.Student]
      }
      /*{
        title: "My Exam Vouchers",
        path: "/my-exam-vouchers",
        icon: <VpnKeyIcon fontSize="small" style={{ color: "white" }}/>,
        groups: [Group.Student],
      },*/
    ]
  },
  {
    title: "Management",
    items: [
      /*{
        title: "Overview",
        path: LINKS.examAnalytics,
        icon: <EqualizerIcon fontSize="small" style={{ color: "white" }}/>,
        groups: [Group.School_Admin, Group.Sme],
      },*/
      {
        title: "Classrooms",
        path: LINKS.classrooms,
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [
          Group.School_Admin,
          // Group.Sme,
          Group.School_Teacher
          // Group.District,
        ]
      },
      {
        title: "Exam results",
        path: LINKS.examResults,
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        title: "Practice test results",
        path: LINKS.studentPracticeResults,
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        title: "Assign practice tests",
        path: LINKS.assignPracticeTestsPage,
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [Group.School_Admin, Group.School_Teacher, Group.District]
      },
      {
        title: "Register as proctor",
        path: LINKS.registerAsProctor,
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [Group.School_Teacher, Group.School_Admin]
      },
      {
        title: "Manage student accounts",
        path: LINKS.studentsListPage,
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      {
        title: "Admin, Teachers and Proctors",
        path: LINKS.teachersPage,
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [Group.School_Admin]
      },
      /*{
        title: "Classroom",
        path: LINKS.classroomListPage,
        icon: <EqualizerIcon fontSize="small" style={{ color: "white" }}/>,
        groups: [Group.School_Admin, Group.Sme, Group.School_Teacher, Group.District],
      },*/
      {
        title: "Testing groups",
        path: LINKS.testingGroup,
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      },
      /*{
        title: "Assign practice tests",
        path: "/assign-practice-tests",
        icon: <EqualizerIcon fontSize="small" style={{ color: "white" }}/>,
        groups: [Group.School_Admin, Group.Sme, Group.School_Teacher, Group.District],
      },*/
      /*{
        title: "Start/Finish exam",
        path: "/start-finish-exam",
        icon: <EqualizerIcon fontSize="small" style={{ color: "white" }}/>,
        groups: [Group.School_Admin, Group.Sme, Group.School_Teacher, Group.District],
      },*/
      {
        title: "Inventory",
        path: LINKS.licenseListPage,
        icon: <EqualizerIcon fontSize="small" style={{color: "white"}} />,
        groups: [
          Group.School_Admin,
          Group.Sme,
          Group.School_Teacher,
          Group.District
        ]
      }
      /*{
        title: "Vouchers",
        path: LINKS.vouchersListPage,
        icon: <EqualizerIcon fontSize="small" style={{ color: "white" }}/>,
        groups: [Group.School_Admin, Group.Sme, Group.School_Teacher, Group.District],
      },*/
    ]
  },
  {
    title: "Practice",
    items: [
      {
        title: "My Practice Tests",
        icon: <DesktopMacIcon fontSize="small" style={{color: "white"}} />,
        groups: [Group.Student],
        path: "/practice-tests"
      },
      {
        title: "Practice Results",
        path: "/practice-results",
        icon: (
          <PlaylistAddCheckIcon fontSize="small" style={{color: "white"}} />
        ),
        groups: [Group.Student]
      }
    ]
  },
  {
    title: "Certify",
    items: [
      /*{
        title: "Redeem Voucher",
        path: "/redeem-voucher",
        icon: <GetAppIcon fontSize="small" style={{ color: "white" }} />,
      },
      {
        title: "My Exams",
        path: "/my-exams",
        icon: <FormatListBulletedIcon fontSize="small" style={{ color: "white" }} />,
      },
      {
        title: "Prepare for examination",
        path: "/prepare-exam",
        icon: <CreateIcon fontSize="small" style={{ color: "white" }} />,
      },*/
      {
        title: "Exam Results",
        path: "/my-results",
        icon: (
          <PlaylistAddCheckIcon fontSize="small" style={{color: "white"}} />
        ),
        groups: [Group.Student]
      },
      {
        title: "Take Exam",
        path: LINKS.certify,
        icon: <SchoolIcon fontSize="small" style={{color: "white"}} />,
        groups: [Group.Student]
      }
    ]
  }
  // {
  //   title: "SME",
  //   items: [
  //     {
  //       title: "Item",
  //       path: "/dashboard/sme",
  //     },
  //   ],
  // },
  // {
  //   title: "Admin",
  //   items: [
  //     {
  //       title: "Item",
  //       path: "/dashboard/admin",
  //     },
  //   ],
  // },
]

export default sections
