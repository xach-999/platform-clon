import Chart from "react-apexcharts"
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
  colors
} from "@mui/material"
import {useTheme} from "@mui/material"
import ArrowRightIcon from "assets/icons/ArrowRight"
import InformationCircleIcon from "assets/icons/InformationCircle"

export default function AnalyticsTopObjectives() {
  const theme = useTheme()

  const chart: Chart["props"] = {
    options: {
      chart: {
        background: "transparent",
        stacked: false,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: [
        "rgba(86, 100, 210, 0.5)",
        "#FFB547",
        "#7BC67E",
        "#64B6F7",
        colors.blueGrey[700]
      ],
      dataLabels: {
        enabled: false
      },
      labels: ["Variables", "Conditionals", "Functions", "Loops", "Lists"],
      legend: {
        fontSize: "14px",
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.subtitle2.fontWeight,
        itemMargin: {
          vertical: 8
        },
        labels: {
          colors: theme.palette.text.primary
        },
        markers: {
          width: 8,
          height: 8
        },
        show: true
      },
      stroke: {
        width: 0
      },
      theme: {
        mode: theme.palette.mode
      }
    },
    series: [10, 10, 20, 10, 70]
  }

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
              Top objectives
            </Typography>
            <Tooltip title="Widget25 source by Social Media platforms">
              <InformationCircleIcon fontSize="small" />
            </Tooltip>
          </Box>}
      />
      <CardContent>
        <Chart height={300} type="donut" {...chart} />
      </CardContent>
      <CardActions
        sx={{
          px: 2,
          py: 1.5,
          backgroundColor: "background.default"
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          variant="text"
        >
          See all objectives
        </Button>
      </CardActions>
    </Card>
  )
}
