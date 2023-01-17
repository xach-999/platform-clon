import {useState, useEffect} from "react"
import {Helmet} from "react-helmet-async"
import {Box, Typography, Paper} from "@mui/material"
import {useTheme} from "@mui/material"
import {makeStyles} from "@mui/styles"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

const tableData = [
  {
    context: "Account Registration",
    typesOfData:
      "We collect your name, contact information, and professional information such as your company or industry when you create an account. We also collect information relating to the actions that you perform while logged into your account.",
    primaryPurpose:
      "We have a legitimate interest in providing account related functionalities to our users. Accounts can be used to save your preferences and transaction history."
  },

  {
    context: "Cookies and first party tracking",
    typesOfData:
      "We use cookies. “Cookies” are small pieces of information that a website sends to a computer’s hard drive while a web site is viewed.",
    primaryPurpose:
      "We have a legitimate interest in making our website operate efficiently."
  },

  {
    context: "Cookies and Third-Party Tracking",
    typesOfData:
      "We participate in behavior-based advertising, this means that a third party uses technology (e.g., a cookie) to collect information about your use of our website so that they can provide advertising about products and services tailored to your interests on our website, or on other websites.",
    primaryPurpose:
      "We have a legitimate interest in engaging in behavior-based advertising and capturing website analytics."
  },

  {
    context: "Demographic Information",
    typesOfData:
      "We collect your name, contact information, and professional information such as your company or industry when you create an account. We also collect information relating to the actions that you perform while logged into your account.",
    primaryPurpose:
      "We have a legitimate interest in understanding our users and providing tailored services."
  },

  {
    context: "Email Interconnectivity",
    typesOfData:
      "If you receive email from us, we use certain tools to capture data related to when you open our message, click on any links or banners it contains and make purchases.",
    primaryPurpose:
      "We have a legitimate interest in understanding how you interact with our communications to you."
  },

  {
    context: "Feedback/Support",
    typesOfData:
      "If you provide us feedback or contact us for support, we will collect your name and e-mail address, as well as any other content that you send to us, in order to reply.",
    primaryPurpose:
      "We have a legitimate interest in receiving, and acting upon, your feedback or issues."
  },

  {
    context: "Mailing List",
    typesOfData:
      "When you sign up for one of our mailing lists, we collect your email address or postal address.",
    primaryPurpose:
      "We share information about our products and services with individuals that consent to receive such information. We also have a legitimate interest in sharing information about our products or services."
  },

  {
    context: "Mobile Devices",
    typesOfData:
      "We collect information from your mobile device such as unique identifying information broadcast from your device and location when visiting our website or using our application.",
    primaryPurpose:
      "We have a legitimate interest in identifying unique visitors, and in understanding how users interact with us on their mobile devices."
  },

  {
    context: "Partner Promotion",
    typesOfData:
      "We collect information that you provide as part of a co-branded promotion with another company. We may also have service providers collect information on our or our partners’ behalf.",
    primaryPurpose:
      "We have a legitimate interest in fulfilling our promotions."
  },

  {
    context: "Surveys",
    typesOfData:
      "When you participate in a survey, we collect information that you provide through the survey. If the survey is provided by a third-party service provider, the third party’s privacy policy applies to the collection, use, and disclosure of your information.",
    primaryPurpose:
      "We have a legitimate interest in understanding your opinions and collecting information relevant to our organization."
  },

  {
    context: "Website interactions",
    typesOfData:
      "We use technology to monitor how you interact with our website. This may include which links you click on, or information that you type into our online forms. This may also include information about your device or browser.",
    primaryPurpose:
      "We have a legitimate interest in understanding how you interact with our website to better improve it, and to understand your preferences and interests in order to select offerings that you might find most useful. We also have a legitimate interest in detecting and preventing fraud or other security incidents."
  },

  {
    context: "Web logs",
    typesOfData:
      "We collect information, including your browser type, operating system, Internet Protocol (IP) address (a number that is automatically assigned to a computer when the Internet is used), domain name, click-activity, referring website, and/or a date/time stamp for visitors.",
    primaryPurpose:
      "We have a legitimate interest in monitoring our networks and the visitors to our websites. Among other things, it helps us understand which of our services is the most popular."
  }
]

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, "10%")
  },
  paperContainer: {
    background: theme.palette.background.paper,
    padding: theme.spacing(5, 7),
    [theme.breakpoints.down("lg")]: {
      padding: theme.spacing(2)
    },
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(1)
    }
  },
  list: {
    marginLeft: theme.spacing(-1),
    marginTop: theme.spacing(3)
  },
  listItem: {
    width: "fit-content",
    textDecoration: "underline",
    color: theme.palette.primary.main,
    padding: theme.spacing(0.1, 1),
    "&:hover": {
      textDecoration: "underline"
    }
  },
  listTitle: {
    margin: theme.spacing(3, 0, 2, 0)
  }
}))

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />
}

function createData(context, typesOfData, primaryPurpose) {
  return {context, typesOfData, primaryPurpose}
}

const getRows = () => {
  const allRows = []
  tableData.forEach((row) => {
    allRows.push(createData(row.context, row.typesOfData, row.primaryPurpose))
  })

  return allRows
}

export default function PrivacyPolicy() {
  const theme = useTheme()

  const classes = useStyles()

  const [tableRows, setTableRows] = useState([])

  useEffect(() => {
    setTableRows(getRows())
  }, [])

  return (
    <>
      <Helmet>
        <title>Privacy Policy | KP Platform</title>
      </Helmet>
      <Box className={classes.root}>
        <Paper className={classes.paperContainer}>
          <Typography
            align="center"
            variant="h4"
            color="primary"
            sx={{mb: 3}}
          >
            <b>Privacy Policy</b>
          </Typography>
          <Typography variant="subtitle2">
            This policy describes how <b>Knowledge Pillars Education Inc.</b>{" "}
            (“Knowledge Pillars”) collects, uses, and shares personal
            information. <br />
            Please note: This policy does not cover the Knowledge Pillars store.
            You can jump to topics by going to the headings below:
          </Typography>

          <List
            component="nav"
            aria-label="secondary mailbox folders"
            className={classes.list}
          >
            <ListItemLink href="#types" className={classes.listItem}>
              <ListItemText primary="Types of Information We Collect" />
            </ListItemLink>
            <ListItemLink href="#processing" className={classes.listItem}>
              <ListItemText primary="Use and Processing of Information" />
            </ListItemLink>
            <ListItemLink href="#sharing" className={classes.listItem}>
              <ListItemText primary="Sharing of Information" />
            </ListItemLink>
            <ListItemLink href="#online" className={classes.listItem}>
              <ListItemText primary="Online Purchases" />
            </ListItemLink>
            <ListItemLink href="#choices" className={classes.listItem}>
              <ListItemText primary="Your Choices" />
            </ListItemLink>
            <ListItemLink href="#protect" className={classes.listItem}>
              <ListItemText primary="How We Protect Personal Information" />
            </ListItemLink>
            <ListItemLink href="#services" className={classes.listItem}>
              <ListItemText primary="Services to Children" />
            </ListItemLink>
            <ListItemLink href="#miscellaneous" className={classes.listItem}>
              <ListItemText primary="Miscellaneous" />
            </ListItemLink>
            <ListItemLink href="#contact" className={classes.listItem}>
              <ListItemText primary="Contact Information" />
            </ListItemLink>
          </List>

          <Typography
            id="types"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>Types of Information We Collect</b>
          </Typography>
          <Typography variant="subtitle2" sx={{mb: 2}}>
            The following provides examples of the type of information that we
            collect from you and how we use that information.
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="caption table" style={{tableLayout: "fixed"}}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Context</b>
                  </TableCell>
                  <TableCell>
                    <b>Types of Data</b>
                  </TableCell>
                  <TableCell>
                    <b>Primary Purpose for Collection and Use of Data</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => (
                  <TableRow key={row.context}>
                    <TableCell component="th" scope="row">
                      {row.context}
                    </TableCell>
                    <TableCell>{row.typesOfData}</TableCell>
                    <TableCell>{row.primaryPurpose}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="subtitle2" sx={{mt: 2}}>
            In addition to the information that we collect from you directly, we
            may also receive information about you from other sources, including
            third parties, our affiliates, or publicly available sources. For
            example, we may receive information on graduates from a university
            or an employer.
          </Typography>

          <Typography
            id="processing"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>Use and Processing of Information</b>
          </Typography>
          <Typography variant="subtitle2" sx={{mt: 2}}>
            In addition to the purposes and uses described above, we use
            information in the following ways: <br />
            <ul style={{padding: theme.spacing(2)}}>
              <li>To identify you when you visit our website.</li>
              <li>
                To track your progress through our certification programs.
              </li>
              <li>
                To verify your certifications when requested by you or a third
                party.
              </li>
              <li>To provide training and services or to process returns.</li>
              <li>To improve our services and product offerings.</li>
              <li>To conduct analytics.</li>
              <li>
                To respond to inquiries related to support, sales, or other
                requests.
              </li>
              <li>
                To send marketing and promotional materials, including
                information relating to our products, services, sales, or
                promotions.
              </li>
              <li>
                For internal administrative purposes, as well as to manage our
                relationships.
              </li>
            </ul>
            Although the sections above describe our primary purpose in
            collecting your information, in many situations we have more than
            one purpose. For example, if you register an account, we may collect
            your information to perform our contract with you. But we also
            collect your information as we have a legitimate interest in
            maintaining your information after your membership concludes so that
            we can quickly and easily respond to any questions about your
            history with the organization. As a result, our collection and
            processing of your information is based in different contexts upon
            your consent, our need to perform a contract, our obligations under
            law, and/or our legitimate interest in maintaining our programs.
          </Typography>

          <Typography
            id="sharing"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>Sharing of Information</b>
          </Typography>
          <Typography variant="subtitle2" sx={{mt: 2}}>
            In addition to the specific situations discussed elsewhere in this
            policy, we disclose information in the following situations: <br />
            <b>Affiliates and Acquisitions.</b> We may share information with
            our corporate affiliates (e.g., parent company, sister companies,
            distributors, subsidiaries, joint ventures, or other companies under
            common control). If another company acquires, or plans to acquire,
            our company, business, or our assets, we will also share information
            with that company, including at the negotiation stage.
            <br />
            <b>Other Disclosures with Your Consent.</b> We may ask if you would
            like us to share your information with other unaffiliated third
            parties who are not described elsewhere in this policy. <br />
            <b>Other Disclosures without Your Consent.</b> We may disclose
            information in response to subpoenas, warrants, or court orders, or
            in connection with any legal process, or to comply with relevant
            laws. We may also share your information in order to establish or
            exercise our rights, to defend against a legal claim, to
            investigate, prevent, or take action regarding possible illegal
            activities, suspected fraud, safety of person or property, or a
            violation of our policies, or to comply with your request for the
            shipment of products to or the provision of services by a third
            party intermediary.
            <br />
            <b>Public.</b> Some of our websites may provide the opportunity to
            post comments, or reviews, in a public forum. If you decide to
            submit information on these pages, that information may be publicly
            available.
            <br />
            <b>Partner Promotion.</b> We may offer contests, sweepstakes, or
            other promotions with third party partners. If you decide to enter a
            contest, sweepstakes, or promotion that is sponsored by a third
            party partner the information that you provide will be shared with
            us and with them. Their use of your information is not governed by
            this privacy policy. <br />
            <b>Service Providers.</b> We may share your information with service
            providers. Among other things service providers may help us to
            administer our website, conduct surveys, provide technical support,
            process payments, and assist in the fulfillment of orders. <br />
          </Typography>

          <Typography
            id="online"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>Online Purchases</b>
          </Typography>
          <Typography variant="subtitle2" sx={{mt: 2}}>
            Knowledge Pillars offers products, exams, assessments and services
            for purchase remotely and electronically. Payments are processed
            securely by our selected payment processors. Knowledge Pillars does
            not store any credit or debit card information. This information is
            securely provided by Users directly to our payment processors at the
            time of purchase. To ensure the safety of electronic purchases,
            Knowledge Pillars complies with PCI-DSS (Payment Card Industry –
            Data Security Standard).
          </Typography>

          <Typography
            id="choices"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>Your Choices</b>
          </Typography>
          <Typography variant="subtitle2" sx={{mt: 2}}>
            You can make the following choices regarding your personal
            information: <br />
            <b>Access to Your Personal Information.</b> You may request access
            to your personal information by contacting us at the address
            described below. If required by law, upon request, we will grant you
            reasonable access to the personal information that we have about
            you.
            <br />
            <b>Changes to Your Personal Information.</b> We rely on you to
            update and correct your personal information. Most of our websites
            allow you to modify or delete your account profile. Note that we may
            keep historical information in our backup files as permitted by law.
            If our website does not permit you to update or correct certain
            information, contact us at the address described below.
            <br />
            <b>Deletion of Your Personal Information.</b> Typically, we retain
            your personal information for the period necessary to fulfill the
            purposes outlined in this policy, unless a longer retention period
            is required or permitted by law. You may, however, request
            information about how long we keep a specific type of information,
            or request that we delete your personal information by contacting us
            at the address described below. If required by law we will grant a
            request to delete information, but you should note that in many
            situations we must keep your personal information to comply with our
            legal obligations, resolve disputes, enforce our agreements, or for
            another one of our business purposes.
            <br />
            <b>Objection to Certain Processing.</b> You may object to our use or
            disclosure of your personal information by contacting us at the
            address described below. <br />
            <b>Online Tracking.</b> We do not currently recognize automated
            browser signals regarding tracking mechanisms, which may include “Do
            Not Track” instructions. <br />
            <b>Promotional Emails.</b> You may choose to provide us with your
            email address for the purpose of allowing us to send free
            newsletters, surveys, offers, and other promotional materials to
            you, as well as targeted offers from third parties. You can stop
            receiving promotional emails by following the unsubscribe
            instructions in e-mails that you receive. If you decide not to
            receive promotional emails, we may still send you service-related
            communications.
            <br />
            <b>Revocation of Consent.</b> If you revoke your consent for the
            processing of personal information, then we may no longer be able to
            provide you services. In some cases, we may limit or deny your
            request to revoke consent if the law permits or requires us to do
            so, or if we are unable to adequately verify your identity. You may
            revoke consent to processing (where such processing is based upon
            consent) by contacting us at the address described below.
            <br />
          </Typography>

          <Typography
            id="protect"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>How We Protect Personal Information</b>
          </Typography>
          <Typography variant="subtitle2" sx={{mt: 2}}>
            No method of transmission over the Internet, or method of electronic
            storage, is fully secure. While we use reasonable efforts to protect
            your personal information from unauthorized access, use, or
            disclosure, we cannot guarantee the security of your personal
            information. In the event that we are required by law to inform you
            of a breach to your personal information we may notify you
            electronically, in writing, or by telephone, if permitted to do so
            by law.
            <br />
            Our website may permit you to create an account. When you do you
            will be prompted to create a password. You are responsible for
            maintaining the confidentiality of your password, and you are
            responsible for any access to or use of your account by someone else
            that has obtained your password, whether or not such access or use
            has been authorized by you. You should notify us of any unauthorized
            use of your password or account. <br />
          </Typography>

          <Typography
            id="services"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>Services to Children</b>
          </Typography>
          <Typography variant="subtitle2" sx={{mt: 2}}>
            Where the User of our services is a child below the age of 16 years,
            we will request consent for the collection and processing of
            Personal Data from a holder of parental responsibility over the
            child.
          </Typography>

          <Typography
            id="miscellaneous"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>Miscellaneous</b>
          </Typography>
          <Typography variant="subtitle2" sx={{mt: 2}}>
            The following additional information relates to our privacy
            practices: <br />
            <b>Transmission of Information to Other Countries.</b> As a
            multi-national, we transmit information between and among our
            affiliates. As a result, your information may be processed in a
            foreign country where privacy laws may be less stringent than the
            laws in your country. Nonetheless, where possible we take steps to
            treat personal information using the same privacy principles that
            apply pursuant to the law of the country in which we first received
            your information. By submitting your personal information to us you
            agree to the transfer, storage and processing of your information in
            a country other than your country of residence including, but not
            necessarily limited to, the United States. We aim to comply with the
            data protection law in all countries where we do business, including
            the laws of the European Union. We transfer Personal Data across
            borders in accordance with applicable law. When we transfer or store
            Personal Data of EU residents outside the European Economic Area, we
            do so in compliance with the applicable EU laws on data protection
            (including by working with US partners who comply with the EU-US
            Privacy Shield).
            <br />
            If you would like more information concerning our attempts to apply
            the privacy principles applicable in one jurisdiction to data when
            it goes to another jurisdiction you can contact us using the contact
            information below.
            <br />
            <b>Third Party Applications/Websites.</b> We have no control over
            the privacy practices of websites or applications that we do not
            own.
            <br />
            <b>Changes to This Privacy Policy.</b> We may change our privacy
            policy and practices over time. To the extent that our policy
            changes in a material way, the policy that was in place at the time
            that you submitted personal information to us will generally govern
            that information unless we receive your consent to the new privacy
            policy.
            <br />
          </Typography>

          <Typography
            id="contact"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>Contact Information</b>
          </Typography>
          <Typography variant="subtitle2" sx={{mt: 2}}>
            If you have any questions, comments, or complaints concerning our
            privacy practices please contact us at the appropriate address
            below. We will attempt to respond to your requests and to provide
            you with additional privacy-related information. <br />
            <Box style={{padding: "15px 0"}}>
              <a href="mailto:privacyteam@knowledge-pillars.com">
                privacyteam@knowledge-pillars.com
              </a>
              <br />
              +1 (302) 760-9056
            </Box>
            If you are not satisfied with our response, and are in the European
            Union, you may have a right to lodge a complaint with your local
            supervisory authority. EU data subject may also inquire about our
            privacy practices by contacting us as set forth below: <br />
            <Box style={{padding: "15px 0", fontSize: "italic"}}>
              <i>
                Knowledge Pillars Education Inc. <br />
                8, The Green, Suite B, Dover <br />
                DE19901 – Delaware, United States <br />
                13027609056
              </i>{" "}
              <br />
              <a href="mailto:privacyteam@knowledge-pillars.com">
                privacyteam@knowledge-pillars.com
              </a>
              <br />
            </Box>
            <Box style={{fontWeight: 400}}>
              Last Revised: 17 October 2020 <br />
              Effective Date: 17 October 2020
            </Box>
          </Typography>
        </Paper>
      </Box>
    </>
  )
}
