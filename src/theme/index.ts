import {
  Direction,
  Theme,
  createTheme as createMuiTheme,
  responsiveFontSizes
} from "@mui/material"
import createPalette from "@mui/material/styles/createPalette"
import {kpPrimaryColors, kpNeutralsColors, kpSecondaryColors} from "consts"
import {lightShadows} from "./shadows"

interface ThemeConfig {
  direction?: Direction
  responsiveFontSizes?: boolean
  roundedCorners?: boolean
  theme?: string
}

const palette = createPalette({
  action: {
    active: "#6b778c"
  },
  background: {
    default: "#00000",
    paper: "#fafafa"
  },
  error: {
    contrastText: "#ffffff",
    main: "#f44336"
  },
  mode: "light",
  primary: {
    light: kpPrimaryColors.lightBlue,
    main: kpPrimaryColors.darkBlue,
    contrastText: "#ffffff"
  },
  secondary: {
    main: kpPrimaryColors.lightBlue,
    contrastText: "#ffffff"
  },
  white: {
    main: "#ffffff"
  },
  success: {
    contrastText: "#ffffff",
    main: "#4caf50"
  },
  text: {
    primary: "#172b4d",
    secondary: "#6b778c"
  },
  warning: {
    contrastText: "#ffffff",
    main: "#ff9800"
  },
  warningText: {
    main: "#ee8d00"
  },
  kpYellowColors: {
    main: kpPrimaryColors.kpYellow
  },
  kpPurpleColors: {
    main: kpSecondaryColors.purple
  },
  kpGreenColors: {
    main: kpSecondaryColors.green
  },
  kpOrangeColors: {
    main: kpSecondaryColors.orange
  },
  kpNeutralColors: {
    main: kpNeutralsColors.lightGray,
    dark: kpNeutralsColors.darkGray,
    light: kpNeutralsColors.contrastGray
  }
})

export const createTheme = (config: ThemeConfig = {}): Theme => {
  let theme = createMuiTheme({
    direction: "ltr",
    components: {
      MuiLink: {
        defaultProps: {
          underline: "hover"
        }
      },
      MuiAvatar: {
        styleOverrides: {
          fallback: {
            height: "75%",
            width: "75%"
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none"
          }
        }
      },
      MuiCardHeader: {
        defaultProps: {
          titleTypographyProps: {
            variant: "h6"
          }
        }
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 3,
            overflow: "hidden"
          }
        }
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: "auto",
            marginRight: "16px"
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffff"
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&::placeholder": {
              opacity: 0.86,
              color: "#42526e"
            }
          }
        }
      }
    },
    typography: {
      button: {
        fontWeight: 600
      },
      fontFamily:
        "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"",
      h1: {
        fontWeight: 600,
        fontSize: "3.5rem"
      },
      h2: {
        fontWeight: 600,
        fontSize: "3rem"
      },
      h3: {
        fontWeight: 600,
        fontSize: "2.25rem"
      },
      h4: {
        fontWeight: 600,
        fontSize: "2rem"
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.5rem"
      },
      h6: {
        fontWeight: 600,
        fontSize: "1.125rem"
      },
      overline: {
        fontWeight: 600
      }
    },
    palette,
    shadows: lightShadows,
    shape: {
      borderRadius: 12
    },
    zIndex: {
      snackbar: 9999999
    }
  })

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme)
  }

  return theme
}
