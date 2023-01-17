import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import React, {useState} from "react"
import {Box, Tab, Tabs} from "@mui/material"
import AccountGeneralSettings from "./components/AccountGeneralSettings"
import AccountSecuritySettings from "./components/AccountSecuritySettings"
import useMainPageLink from "hooks/useMainPageLink"

const tabs = [
  {label: "General", value: "general"},
  {label: "Security", value: "security"}
]

export default function Account() {
  const [currentTab, setCurrentTab] = useState("general")

  const {mainPageLink} = useMainPageLink()

  return (
    <CardWithBreadcrumbs
      helmetTabTitle="Account | KP Platform"
      pageTitle="Account | KP Platform"
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        text: "Account"
      }]}>
      <Box pb={4}>
        <Tabs
          indicatorColor="primary"
          onChange={(_, value) => setCurrentTab(value)}
          scrollButtons="auto"
          textColor="primary"
          value={currentTab}
          variant="scrollable">
          {tabs.map(i => (
            <Tab key={i.value} label={i.label} value={i.value}/>
          ))}
        </Tabs>
        <Box position="relative" display="flex" alignItems="center" gap="2rem" mt={1}>
          {currentTab === "general" ? (
            <AccountGeneralSettings/>
          ) : (
            <AccountSecuritySettings/>
          )}
        </Box>
      </Box>
    </CardWithBreadcrumbs>
  )
}
