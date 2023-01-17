import {createContext, useEffect, useState} from "react"
import type {FC} from "react"
import PropTypes, {InferProps} from "prop-types"
import {THEMES} from "consts"

interface Settings {
  compact?: boolean
  direction?: "ltr" | "rtl"
  responsiveFontSizes?: boolean
  roundedCorners?: boolean
  theme?: string
}

export interface SettingsContextValue {
  settings: Settings
  saveSettings: (update: Settings) => void
}

const componentProps = {
  children: PropTypes.element.isRequired
}

const initialSettings: Settings = {
  compact: true,
  direction: "ltr",
  responsiveFontSizes: true,
  roundedCorners: true,
  theme: THEMES.LIGHT
}

export const restoreSettings = (): Settings | null => {
  let settings = null

  try {
    const storedData: string | null = window.localStorage.getItem("settings")

    if (storedData) {
      settings = JSON.parse(storedData)
    } else {
      settings = {
        compact: true,
        direction: "ltr",
        responsiveFontSizes: true,
        roundedCorners: true,
        theme: window.matchMedia("(prefers-color-scheme: dark)").matches
          ? THEMES.DARK
          : THEMES.LIGHT
      }
    }
  } catch (err) {
    console.error(err)
    // If stored data is not a strigified JSON this will fail,
    // that"s why we catch the error
  }

  return settings
}

export const storeSettings = (settings: Settings): void => {
  window.localStorage.setItem("settings", JSON.stringify(settings))
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: initialSettings,
  saveSettings: () => {}
})

export const SettingsProvider: FC<InferProps<typeof componentProps>> = (
  props
) => {
  const {children} = props
  const [settings, setSettings] = useState<Settings>(initialSettings)

  useEffect(() => {
    const restoredSettings = restoreSettings()

    if (restoredSettings) {
      setSettings(restoredSettings)
    }
  }, [])

  const saveSettings = (updatedSettings: Settings): void => {
    setSettings(updatedSettings)
    storeSettings(updatedSettings)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

SettingsProvider.propTypes = componentProps

export const SettingsConsumer = SettingsContext.Consumer

export default SettingsContext
