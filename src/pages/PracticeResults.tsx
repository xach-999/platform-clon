import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import TestResults from "components/TestResults"
import useMainPageLink from "hooks/useMainPageLink"

export default function PracticeResults() {
  const {mainPageLink} = useMainPageLink()

  return (
    <CardWithBreadcrumbs
      helmetTabTitle="Practice test results"
      pageTitle="Practice test results"
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        path: null,
        text: "Practice test results"
      }]}>
      <TestResults practice/>
    </CardWithBreadcrumbs>
  )
}
