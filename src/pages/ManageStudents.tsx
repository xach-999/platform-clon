import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import ManageStudentsList from "components/ManageStudentList"
import useMainPageLink from "hooks/useMainPageLink"

export default function ManageStudents() {
  const {mainPageLink} = useMainPageLink()

  return (
    <CardWithBreadcrumbs
      helmetTabTitle="Manage Student Accounts"
      pageTitle="Manage Student Accounts"
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        path: null,
        text: "Manage Student Accounts"
      }]}>
      <ManageStudentsList/>
    </CardWithBreadcrumbs>
  )
}
