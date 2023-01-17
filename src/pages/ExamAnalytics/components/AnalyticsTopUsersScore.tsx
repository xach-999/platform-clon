import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material"
import InformationCircleIcon from "assets/icons/InformationCircle"
import getInitials from "utils/getInitials"

const studentsMock = [
  {
    id: "5e887ac47eed253091be10cb",
    avatar: "/static/mock-images/avatars/avatar-carson_darrin.png",
    name: "Carson Darrin",
    exam: "PCA",
    score: 80,
    status: true
  },
  {
    id: "5e887b209c28ac3dd97f6db5",
    avatar: "/static/mock-images/avatars/avatar-fran_perez.png",
    name: "Fran Perez",
    exam: "PCA",
    score: 80,
    status: false
  },
  {
    id: "5e887b7602bdbc4dbb234b27",
    avatar: "/static/mock-images/avatars/avatar-jie_yan_song.png",
    name: "Jie Yan Song",
    exam: "PCA",
    score: 80,
    status: false
  },
  {
    id: "5e86809283e28b96d2d38537",
    avatar: "/static/mock-images/avatars/avatar-jane_rotanson.png",
    name: "Jane Rotanson",
    exam: "PCA",
    score: 80,
    status: true
  },
  {
    id: "5e86805e2bafd54f66cc95c3",
    avatar: "/static/mock-images/avatars/avatar-miron_vitold.png",
    name: "Miron Vitold",
    exam: "PCA",
    score: 80,
    status: true
  },
  {
    id: "5e887a1fbefd7938eea9c981",
    avatar: "/static/mock-images/avatars/avatar-penjani_inyene.png",
    name: "Penjani Inyene",
    exam: "PCA",
    score: 80,
    status: true
  },
  {
    id: "5e887d0b3d090c1b8f162003",
    avatar: "/static/mock-images/avatars/avatar-omar_darobe.png",
    name: "Omar Darobe",
    exam: "PCA",
    score: 80,
    status: false
  },
  {
    id: "5e88792be2d4cfb4bf0971d9",
    avatar: "/static/mock-images/avatars/avatar-siegbert_gottfried.png",
    name: "Siegbert Gottfried",
    exam: "PCA",
    score: 80,
    status: true
  },
  {
    id: "5e8877da9a65442b11551975",
    avatar: "/static/mock-images/avatars/avatar-iulia_albu.png",
    name: "Iulia Albu",
    exam: "PCA",
    score: 80,
    status: false
  },
  {
    id: "5e8680e60cba5019c5ca6fda",
    avatar: "/static/mock-images/avatars/avatar-nasimiyu_danai.png",
    name: "Nasimiyu Danai",
    exam: "PCA",
    score: 80,
    status: true
  }
]

export default function AnalyticsTopUsersScore() {
  return (
    <Card>
      <CardHeader
        disableTypography
        title={<Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <Typography color="textPrimary" variant="h6">
              Top students by score
            </Typography>
            <Tooltip title="Refresh rate is 24h">
              <InformationCircleIcon fontSize="small" />
            </Tooltip>
          </Box>}
      />
      <Table>
        <TableHead>
          <TableRow
            sx={{
              "& > th": {
                fontWeight: "bold"
              }
            }}
          >
            <TableCell>Student</TableCell>
            <TableCell>Exam</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studentsMock.map((student) => (
            <TableRow
              key={student.id}
              sx={{
                "&:last-child td": {
                  border: 0
                }
              }}
            >
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={student.avatar}
                    sx={{
                      height: 42,
                      width: 42
                    }}>
                    {getInitials(student.name)}
                  </Avatar>
                  <Typography
                    color="textPrimary"
                    sx={{ml: 2}}
                    variant="body2">
                    {student.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{student.exam}</TableCell>
              <TableCell>{student.score}</TableCell>
              <TableCell
                sx={{
                  color: student.status ? "green" : "red"
                }}>
                {student.status ? "passed" : "failed"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
