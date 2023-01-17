import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import TestResults from "components/TestResults"
import useMainPageLink from "hooks/useMainPageLink"

export default function ExamResults() {
  const {mainPageLink} = useMainPageLink()

  return (
    <CardWithBreadcrumbs
      helmetTabTitle="Exam Results"
      pageTitle="Exam Results"
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        path: null,
        text: "Exam Results"
      }]}>
      <TestResults/>
    </CardWithBreadcrumbs>
  )
}
