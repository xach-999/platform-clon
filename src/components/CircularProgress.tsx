import {Box, Theme, useTheme} from "@mui/material"
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles<Theme, Props>((theme) => ({
  bg: {
    fill: "none",
    stroke:
      theme.palette.mode === "dark" ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.05)",
    strokeWidth: 4
  },
  value: {
    animation: "$progress 1s ease-out forwards",
    fill: "none",
    stroke: ({value}) =>
      value >= 75 ? theme.palette.success.main : theme.palette.error.main,
    strokeWidth: 4
  },
  "@keyframes progress": {
    "0%": {
      strokeDasharray: "0 100"
    }
  }
}))

interface Props {
  value: number
  width?: number
  height?: number
  showPercentage?: boolean
}

export default function CircularProgress({
  value,
  width,
  height,
  showPercentage = false
}: Props) {
  const s = useStyles({value})
  const theme = useTheme()

  return (
    <Box width={width || 56} height={height || 56}>
      <svg viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          strokeDasharray="100, 100"
          className={s.bg}
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          strokeDasharray={`${value}, 100`}
          className={s.value}
        />
        {showPercentage && (
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Roboto"
            fontSize="8"
            fill={theme.palette.text.secondary}>
            {value}%
          </text>
        )}
      </svg>
    </Box>
  )
}
