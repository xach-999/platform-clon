import type {FC} from "react"
import Chart from "react-apexcharts"
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
  alpha
} from "@mui/material"
import {useTheme} from "@mui/material"
import ArrowRightIcon from "assets/icons/ArrowRight"
import ChevronDownIcon from "assets/icons/ChevronDown"
import ChevronUpIcon from "assets/icons/ChevronUp"

const LineChart: FC = () => {
  const theme = useTheme()

  const chart: Chart["props"] = {
    options: {
      chart: {
        background: "transparent",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: ["#7783DB"],
      dataLabels: {
        enabled: false
      },
      grid: {
        show: false
      },
      stroke: {
        width: 3
      },
      theme: {
        mode: theme.palette.mode
      },
      tooltip: {
        enabled: false
      },
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      }
    },
    series: [
      {
        data: [0, 60, 30, 60, 0, 30, 10, 30, 0]
      }
    ]
  }

  return <Chart type="line" width={120} {...chart} />
}

export default function AnalyticsGeneralOverview() {
  return (
    <Grid container spacing={2}>
      <Grid item md={3} sm={6} xs={12}>
        <Card>
          <Box display="flex" alignItems="center" justifyContent="space-between" p={3}>
            <Box>
              <Typography color="textPrimary" variant="subtitle2">
                Total students
              </Typography>
              <Typography color="textPrimary" sx={{mt: 1}} variant="h4">
                1626
              </Typography>
            </Box>
            <LineChart/>
          </Box>
          <Divider/>
          <Box px={3} py={2}>
            <Button
              sx={{color: "#7783DB"}}
              endIcon={<ArrowRightIcon fontSize="small" />}
              variant="text">
              See all students
            </Button>
          </Box>
        </Card>
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <Card>
          <Box display="flex" alignItems="center" justifyContent="space-between" p={3}>
            <div>
              <Typography color="textPrimary" variant="subtitle2">
                Passed
              </Typography>
              <Typography color="green" mt={1} variant="h5">
                968
              </Typography>
            </div>
            <LineChart/>
          </Box>
          <Divider/>
          <Box display="flex" alignItems="center" px={3} py={2}>
            <Avatar
              sx={{
                backgroundColor: (theme) => alpha(theme.palette.success.main, 0.08),
                color: "success.main",
                height: 36,
                width: 36
              }}>
              <ChevronUpIcon fontSize="small"/>
            </Avatar>
            <Typography color="textSecondary" ml={1} variant="caption">
              12% more then last month
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <Card>
          <Box display="flex" alignItems="center" justifyContent="space-between" p={3}>
            <Box>
              <Typography color="textPrimary" variant="subtitle2">
                Failed
              </Typography>
              <Typography color="error" sx={{mt: 1}} variant="h5">
                133
              </Typography>
            </Box>
            <LineChart/>
          </Box>
          <Divider/>
          <Box display="flex" alignItems="center" px={3} py={2}>
            <Avatar
              sx={{
                backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                color: "error.main",
                height: 36,
                width: 36
              }}>
              <ChevronDownIcon fontSize="small" />
            </Avatar>
            <Typography color="textSecondary" ml={1} variant="caption">
              30% less then last month
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}
