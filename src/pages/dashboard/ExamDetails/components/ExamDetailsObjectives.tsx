import numeral from "numeral"
import Chart from "react-apexcharts"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  Link,
  useMediaQuery
} from "@mui/material"
import {useTheme} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {useMemo} from "react"

const useStyles = makeStyles((theme) => ({
  chartsContainer: {
    padding: 0,
    minWidth: "100%"
  },
  gridItem: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(1)
  },
  resultsExplanation: {
    padding: theme.spacing(2)
  },
  explanation: {
    lineHeight: "200%"
  },
  link: {
    textDecoration: "underline"
  }
}))

type ObjectiveType = {
  _id: string
  objectiveId: string
  color: string
  title: string
  score: number
}

interface Props {
  objectives: Array<ObjectiveType>
  isPassed: boolean | null
  isPracticeResPage: boolean
  examCode: string
  examName: string
}

export default function ExamDetailsObjectives({
  objectives,
  isPassed,
  isPracticeResPage,
  examCode,
  examName
}: Props) {
  const theme = useTheme()

  const s = useStyles()

  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const chart: Chart["props"] = {
    options: {
      chart: {
        background: "transparent",
        stacked: false,
        toolbar: {
          show: true
        }
      },
      colors: objectives.map((item) => item.color),
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return `${val}%`
        }
      },
      grid: {
        borderColor: theme.palette.divider,
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      legend: {
        show: false
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "75px",
          distributed: true
        }
      },
      theme: {
        mode: theme.palette.mode
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (value: number): string =>
            `${numeral(value).format("0")}%`
        }
      },
      xaxis: {
        max: 100,
        axisBorder: {
          color: theme.palette.divider,
          show: true
        },
        axisTicks: {
          color: theme.palette.divider,
          show: true
        },
        categories: objectives.map((item) => item.title)
      },
      yaxis: {
        labels: {
          show: true,
          minWidth: 150,
          maxWidth: 250,
          style: {
            colors: [],
            fontSize: "13px",
            fontFamily: "Roboto",
            fontWeight: 400,
            cssClass: "apexcharts-yaxis-label"
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          formatter: (value) => {
            return String(value)
          }
        }
      }
    },
    series: [
      {
        data: objectives.map((item) => item.score),
        name: "Result"
      }
    ]
  }

  const afterExamHref = useMemo(() => {
    if (isPracticeResPage)
      return "https://knowledge-pillars.com/practice-tests/"

    if (!examCode) return "https://knowledge-pillars.com"

    switch (examCode) {
      case "python":
        return "https://knowledge-pillars.com/python-coding-specialist/"
      case "pca":
        return "https://knowledge-pillars.com/python-coding-apprentice-certification/"
      case "wordpress":
        return "https://knowledge-pillars.com/wordpress-certified-editor/"
      case "dncs":
        return "https://knowledge-pillars.com/dotnet-coding-specialist-certification/"
      case "jscs":
        return "https://knowledge-pillars.com/javascript-coding-specialist-certification/"
      case "hccs":
        return "https://knowledge-pillars.com/html-and-css-coding-specialist-certification/"
    }
  }, [examCode])

  return (
    <Box bgcolor="background.default" pt={4}>
      <Container className={s.chartsContainer}>
        <Card style={{padding: isMobile ? 0 : theme.spacing(3)}}>
          {objectives?.length ? <CardHeader title="Objective Results" /> : null}
          <CardContent
            style={{padding: isMobile ? theme.spacing(1) : theme.spacing(2)}}>
            {objectives?.length ? (
              <Chart
                height="350"
                width={isMobile ? "100%" : "90%"}
                type="bar"
                {...chart}
              />
            ) : null}
            <Box className={s.resultsExplanation}>
              <Typography
                className={s.explanation}
                variant="subtitle2"
                color="textPrimary">
                <b>What do these results mean?</b>
                <br/>
                {isPassed ? (
                  <>
                    <b>Congratulations!</b>{" "}
                    <span>
                      You have passed the {examName || ""}{" "}
                      {examCode ? `(${examCode})` : ""}{" "}
                      {isPracticeResPage
                        ? "Practice Test"
                        : "Certification Exam"}
                      .
                    </span>
                    <br/>
                  </>
                ) : (
                  <>
                    <span>
                      Unfortunately you didn`t pass the {examName || ""}{" "}
                      {examCode ? `(${examCode})` : ""}{" "}
                      {isPracticeResPage
                        ? "Practice Test"
                        : "Certification Exam"}
                      .
                    </span>
                    <br/>
                  </>
                )}
                The information shown above indicates your relative performance
                on each objective of this {isPracticeResPage ? "test" : "exam"}.
                We hope this information will help you determine areas, if any,
                for further skills development. <br /> For a complete list of
                skills measured for each objective please visit the{" "}
                {isPracticeResPage ? "test " : "exam "}
                preparation page{" "}
                <Link className={s.link} href={afterExamHref}>
                  {afterExamHref}
                </Link>
                .
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
