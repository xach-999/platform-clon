import {PaletteColor} from "@mui/material"
import {Theme as BaseTheme} from "@mui/material/styles"

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends BaseTheme {}
}

declare module "@emotion/react" {
  interface Theme extends BaseTheme {}
}

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    warningText: PaletteColor
    kpPrimaryColors: PaletteColor
    kpYellowColors: PaletteColor
    kpPurpleColors: PaletteColor
    kpGreenColors: PaletteColor
    kpOrangeColors: PaletteColor
    kpNeutralColors: PaletteColor
    white: PaletteColor
  }

  interface PaletteOptions {
    warningText?: PaletteColorOptions
    kpPrimaryColors?: PaletteColorOptions
    kpYellowColors?: PaletteColorOptions
    kpPurpleColors?: PaletteColorOptions
    kpGreenColors?: PaletteColorOptions
    kpOrangeColors?: PaletteColorOptions
    kpNeutralColors?: PaletteColorOptions
    white?: PaletteColorOptions
  }
}
