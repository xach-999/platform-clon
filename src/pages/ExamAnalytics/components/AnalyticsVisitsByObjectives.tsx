import {useState} from "react"
import numeral from "numeral"
import {
  Box,
  Card,
  CardHeader,
  CardProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography
} from "@mui/material"
import InformationCircleIcon from "assets/icons/InformationCircle"

interface IObjectiveItem {
  objectiveName: string
  rate: number
  examName: string
}

const sortCountries = (
  countries: IObjectiveItem[],
  order: "asc" | "desc"
): IObjectiveItem[] =>
  countries.sort((a, b) => {
    if (order === "asc") {
      return a.rate < b.rate ? -1 : 1
    }

    return a.rate > b.rate ? -1 : 1
  })

const countries: IObjectiveItem[] = [
  {
    objectiveName: "Functions",
    rate: 40,
    examName: "PCA"
  },
  {
    objectiveName: "Lists",
    rate: 47,
    examName: "PCA"
  },
  {
    objectiveName: "Loops",
    rate: 65,
    examName: "PCA"
  },
  {
    objectiveName: "Conditionals",
    rate: 23,
    examName: "PCA"
  },
  {
    objectiveName: "Variables",
    rate: 45,
    examName: "PCA"
  }
]

export default function AnalyticsVisitsByObjectives(props: CardProps) {
  const [order, setOrder] = useState<"asc" | "desc">("desc")

  const handleSort = (): void => {
    setOrder((prevOrder) => {
      if (prevOrder === "asc") {
        return "desc"
      }

      return "asc"
    })
  }

  const sortedCountries = sortCountries(countries, order)

  return (
    <Card {...props}>
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
              Overview by objectives
            </Typography>
            <Tooltip title="Refresh rate is 24h">
              <InformationCircleIcon fontSize="small" />
            </Tooltip>
          </Box>}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Objectives</TableCell>
            <TableCell sortDirection={order}>
              <TableSortLabel active direction={order} onClick={handleSort}>
                Rate
              </TableSortLabel>
            </TableCell>
            <TableCell>Exam</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCountries.map((country) => (
            <TableRow
              key={country.objectiveName}
              sx={{
                "&:last-child td": {
                  border: 0
                }
              }}
            >
              <TableCell>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex"
                  }}
                >
                  {/*<Box
                    sx={{
                      height: 36,
                      width: 36,
                      "& img": {
                        height: 36,
                        width: 36
                      }
                    }}
                  >
                    <img
                      alt={country.name}
                      src={country.flag}
                    />
                  </Box>*/}
                  <Typography
                    color="textPrimary"
                    // sx={{ ml: 2 }}
                    variant="subtitle2"
                  >
                    {country.objectiveName}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{numeral(country.rate).format("0,0")}</TableCell>
              <TableCell>{country.examName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
