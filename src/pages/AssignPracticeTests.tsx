import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import AssignPracticeTestsComponent from "components/AssignPracticeTests"
import useMainPageLink from "hooks/useMainPageLink"

export default function AssignPracticeTests() {
  const {mainPageLink} = useMainPageLink()

  return (
    <CardWithBreadcrumbs
      helmetTabTitle="Assign Practice Test"
      pageTitle="Assign Practice Test"
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        path: null,
        text: "Assign Practice Test"
      }]}>
      <AssignPracticeTestsComponent/>
    </CardWithBreadcrumbs>
  )
}
