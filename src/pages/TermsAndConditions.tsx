import {Helmet} from "react-helmet-async"
import {Box, Typography, Paper} from "@mui/material"
import {useTheme} from "@mui/material"
import {makeStyles} from "@mui/styles"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, "10%")
  },
  paperContainer: {
    background: theme.palette.background.paper,
    padding: theme.spacing(5, 7),
    [theme.breakpoints.down("lg")]: {
      padding: theme.spacing(2.5)
    }
  },
  list: {
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
    margin: theme.spacing(3, 0, 1, 0)
  }
}))

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />
}

export default function TermsAndContions() {
  const theme = useTheme()
  const classes = useStyles()

  return (
    <>
      <Helmet>
        <title>Terms of use | KP Platform</title>
      </Helmet>
      <Box className={classes.root}>
        <Paper className={classes.paperContainer}>
          <Typography align="center" variant="h4" color="primary">
            <b>Terms of Service</b>
          </Typography>
          <List
            component="nav"
            aria-label="secondary mailbox folders"
            className={classes.list}
          >
            <ListItemLink href="#acceptance" className={classes.listItem}>
              <ListItemText primary="1. Acceptance and Conditions of Use" />
            </ListItemLink>
            <ListItemLink href="#prohibited" className={classes.listItem}>
              <ListItemText primary="2. Prohibited Conduct" />
            </ListItemLink>
            <ListItemLink href="#confidentiality" className={classes.listItem}>
              <ListItemText primary="3. Confidentiality of Certification Process and Materials" />
            </ListItemLink>
            <ListItemLink href="#access" className={classes.listItem}>
              <ListItemText primary="4. Access to Online Services" />
            </ListItemLink>
            <ListItemLink href="#intellectual" className={classes.listItem}>
              <ListItemText primary="5. Intellectual Property Rights" />
            </ListItemLink>
            <ListItemLink href="#material" className={classes.listItem}>
              <ListItemText primary="6. Materials Provided “As Is”" />
            </ListItemLink>
            <ListItemLink href="#credit" className={classes.listItem}>
              <ListItemText primary="7. Credit Card Payment, Cancellation, Rescheduling and Refund Policy" />
            </ListItemLink>
            <ListItemLink href="#links" className={classes.listItem}>
              <ListItemText primary="8. Links to Third Party Websites" />
            </ListItemLink>
            <ListItemLink href="#changes" className={classes.listItem}>
              <ListItemText primary="9. Changes to Products and Services" />
            </ListItemLink>
            <ListItemLink href="#law" className={classes.listItem}>
              <ListItemText primary="10. Law" />
            </ListItemLink>
            <ListItemLink href="#exclusions" className={classes.listItem}>
              <ListItemText primary="11. Exclusions and Limitations of Liability" />
            </ListItemLink>
            <ListItemLink href="#amendments" className={classes.listItem}>
              <ListItemText primary="12. Amendments to Terms and Conditions" />
            </ListItemLink>
            <ListItemLink href="#severability" className={classes.listItem}>
              <ListItemText primary="13. Severability" />
            </ListItemLink>
          </List>
          <Typography variant="subtitle2">
            These Terms of Service (“Terms”) apply to use of websites and
            associated online services operated by{" "}
            <b>Knowledge Pillars Education Inc.</b> (together “Knowledge
            Pillars” or “we”), including{" "}
            <a href="www.knowledge-pillars.com">www.knowledge-pillars.com</a>.
            Additional terms may apply to specific Knowledge Pillars
            examination, assessment and certification services.
          </Typography>

          <Typography
            id="acceptance"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>1. Acceptance and Conditions of Use</b>
          </Typography>
          <Typography variant="subtitle2">
            Registered users of Knowledge Pillars services are required to
            accept these Terms. If you intend to use our Online Services as a
            visitor, you must comply with these Terms (if you do not agree
            please do not use the Online Services). Both registered users and
            visitors of the Online Services are referred to in these Terms as
            “Users”. <br />
            If you breach any of these Terms, your authorization to use the
            Online Services is terminated and you must immediately destroy any
            materials downloaded from the Online Services.
          </Typography>

          <Typography
            id="prohibited"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>2. Prohibited Conduct</b>
          </Typography>
          <Typography variant="subtitle2">
            Users shall not, directly or indirectly, perform any of the
            following actions:
            <Box style={{paddingLeft: theme.spacing(2)}}>
              1.&nbsp;Transmit, install, upload or otherwise transfer any
              content, software, virus, advertisement, communication, or other
              item or process to the Online Services which in any way impairs
              their use, or adversely affects Knowledge Pillars’ computers,
              servers or databases. <br />
              2.&nbsp;Copy, modify, reverse engineer, disassemble, redistribute,
              republish, alter, create derivative works from, assign, license,
              transfer or adapt any of the software, information, text,
              graphics, source code or HTML code, or other content available on
              the Online Services. <br />
              3.&nbsp;Remove or modify any copyright, trademark, legal notices,
              or other proprietary notices from the content available via the
              Online Services. <br />
              4.&nbsp;Breach or bypass the Online Services’ security mechanisms
              or attempt to do so – this includes accessing any data or server
              you are not authorized to access. <br />
              5.&nbsp;Use any device (such as a “web crawler” or other automatic
              retrieval mechanism or other means) to harvest information about
              the Online Services, other Users or Knowledge Pillars. <br />
            </Box>
          </Typography>

          <Typography
            id="confidentiality"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>3. Confidentiality of Certification Process and Materials</b>
          </Typography>
          <Typography variant="subtitle2">
            The entire certification process is confidential. Examination,
            assessment and certification services (“Certification Services”) are
            made available to individuals solely for their own assessment. In
            connection with Certification Services, you undertake the obligation
            to comply with applicable{" "}
            <a href="pages/TermsAndConditions">Exam Policies</a> which are made
            available upon registration. You are expressly prohibited from
            disclosing, publishing, reproducing, or transmitting any material
            related to the certification process, in whole or in part, in any
            form or by any means including visual, aural, verbal, written,
            electronic or mechanical, for any purpose, without the prior express
            written permission of Knowledge Pillars.
          </Typography>

          <Typography
            id="access"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>4. Access to Online Services</b>
          </Typography>
          <Typography variant="subtitle2">
            If you access the Online Services using a Username (e.g. Candidate
            ID) and a Password (e.g. Examination PIN) received from us, you are
            responsible for maintaining the confidentiality of your Username and
            Password, and for restricting access to any computer while logged in
            with your Username and Password. Your account is strictly personal
            and should not be shared or transferred to anyone else. You agree to
            accept responsibility for all activities that occur under your
            Username and Password. Knowledge Pillars may terminate accounts at
            its sole discretion for any violation of these requirements or of
            Candidate Certification Guides. <br />
            Users are solely responsible for ensuring that they have sufficient
            and compatible hardware, software, telecommunications equipment and
            Internet service necessary for use of the Online Services. You will
            be notified by email where any such hardware, software, equipment
            and service is required. This information is also available in the
            “Technical Requirements” section of the Knowledge Pillars
            certifications pages. <br />
            Knowledge Pillars will make all commercially reasonable efforts to
            provide uninterrupted access to the Online Services. However,
            Knowledge Pillars does not warrant availability of the Online
            Services. Unavailability of the Online Services may occur due to
            factors outside of Knowledge Pillars’ control. The Online Services
            may be unavailable due to periodic maintenance or related reasons,
            and in such cases Knowledge Pillars will take all commercially
            reasonable steps to restore access within a reasonable period. The
            term “commercially reasonable” means reasonable efforts taken in
            good faith without an undue or burdensome use or expenditure of
            time, resources, personnel or money. <br />
          </Typography>

          <Typography
            id="intellectual"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>5. Intellectual Property Rights</b>
          </Typography>
          <Typography variant="subtitle2">
            This Online Services and all information they contain (“Materials”)
            are proprietary to Knowledge Pillars Education Inc. and Test Owners,
            who reserve all intellectual property rights in all materials
            included in the Online Services. You should assume that everything
            you see, read and hear on the Online Services (such as products,
            trademarks, logos, service marks, images, video, audio, photographs,
            illustrations, text, testimonials and other materials) is copyright
            and/or trademark protected. <br />
            You may not sell, reproduce, distribute, modify, display, prepare
            derivative works of, re-post or otherwise use, store or distribute
            any Materials without the written consent of Knowledge Pillars.
            Knowledge Pillars reserves the right to take legal action in case of
            any breach of these rights and restrictions.
            <br />
          </Typography>

          <Typography
            id="material"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>6. Materials Provided “As Is”</b>
          </Typography>
          <Typography variant="subtitle2">
            The Materials have been prepared to provide information about
            Knowledge Pillars and its products and services. Whilst Knowledge
            Pillars has taken reasonable care in the preparation of the
            Materials, the Online Services and Materials are provided on an “as
            is” basis and without warranties of any kind with regard to the
            accuracy, completeness or usefulness of any information. All
            warranties whether statutory or implied (including fitness for
            purpose, satisfactory quality and timely delivery) are hereby
            expressly excluded to the fullest extent permitted by law.
          </Typography>

          <Typography
            id="credit"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>
              7. Credit Card Payment, Cancellation, Rescheduling and Refund
              Policy
            </b>
          </Typography>
          <Typography variant="subtitle2">
            Knowledge Pillars offers products, exams and services for purchase
            remotely and electronically. Credit card payments are processed
            securely by our selected payment processors and are not accessed by
            Knowledge Pillars. A charge from “www.knowledge-pillars.com” will
            appear on your credit card statement for any purchase.
            <br />
            If you have made a purchase by mistake or have changed your mind,
            you have the right to cancel your purchase by filing a written
            request of cancellation within 14 days of your initial payment as
            follows: <br />
            <b>i.For Exams:</b> If you have not booked a specific exam date,
            cancellation can be made within 14 days from your initial purchase.
            If you have booked a specific exam date, cancellation can be made
            within 14 days from your initial purchase, provided that this date
            is at least 14 days prior to the exam date. <br />
            <b>ii.For Assessments:</b> If you have not redeemed your assessment
            key, cancellation can be made within 14 days from your initial
            purchase. <br />
            All requests for cancellation must be emailed to{" "}
            <a href="mailto:support@knowledge-pillars.com">
              support@knowledge-pillars.com
            </a>
            . In the event of an appropriate cancellation request, Knowledge
            Pillars will provide you with a refund. Refunds will always be made
            to the same credit card used for purchase. <br />
            If you have booked a specific exam date but would like to reschedule
            your exam, you have the right to do so via your Knowledge Pillars
            account. In this case, a reasonable fee may apply. <br />
          </Typography>

          <Typography
            id="links"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>8. Links to Third Party Websites</b>
          </Typography>
          <Typography variant="subtitle2">
            The Online Services may provide links to other websites maintained
            by third parties, for your convenience only. Knowledge Pillars has
            no responsibility for the content in any linked website. Knowledge
            Pillars does not endorse or make any representations about them, or
            any information, software or other products, services or materials
            found there, or any results that may be obtained from using them. If
            you decide to access any of the third-party websites linked from the
            Online Services, you do this entirely at your own risk.
          </Typography>

          <Typography
            id="changes"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>9. Changes to Products and Services</b>
          </Typography>
          <Typography variant="subtitle2">
            Products and services available via the Online Services are subject
            to change and removal without notice. Knowledge Pillars will not be
            responsible for any additional costs, delay or liability which you
            or your company or agents may incur as a result of such changes.
          </Typography>

          <Typography
            id="law"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>10. Law</b>
          </Typography>
          <Typography variant="subtitle2">
            These terms and conditions are governed by the laws of United States
            of America, and any dispute relating to the Terms and conditions
            shall be subject to the jurisdiction of the courts of USA. You agree
            to indemnify Knowledge Pillars for any claims or damages resulting
            from your breach of the Terms.
          </Typography>

          <Typography
            id="exclusions"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>11. Exclusions and Limitations of Liability</b>
          </Typography>
          <Typography variant="subtitle2">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, KNOWLEDGE PILLARS, ITS
            SUPPLIERS, AND OTHER APPROVED THIRD PARTIES SHALL NOT BE LIABLE FOR
            ANY DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION, THOSE
            RESULTING FROM LOST PROFITS, LOST DATA, LOST TIME OR INTERRUPTION,
            LOST BUSINESS OR ANTICIPATED SAVINGS) ARISING OUT OF THE USE,
            INABILITY TO USE, OR THE RESULTS OF USE OF THIS SITE, ANY WEBSITES
            LINKED TO THIS SITE, OR THE MATERIALS OR INFORMATION OR SERVICES
            CONTAINED AT ANY OR ALL SUCH SITES, WHETHER BASED ON WARRANTY,
            CONTRACT, TORT OR ANY OTHER LEGAL THEORY AND WHETHER OR NOT
            KNOWLEDGE PILLARS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
            DAMAGES. IF YOUR USE OF THE MATERIALS, INFORMATION OR SERVICES FROM
            THIS SITE RESULTS IN THE NEED FOR ADDITIONAL SUPPORT, SERVICING OR
            REPAIR, YOU ASSUME ALL COSTS THEREOF. Nothing in this clause shall
            exclude Knowledge Pillars’ liability for personal injury resulting
            from negligence or for fraud.
          </Typography>

          <Typography
            id="amendments"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>12. Amendments to Terms and Conditions</b>
          </Typography>
          <Typography variant="subtitle2">
            We may revise these Terms to reflect changes in Knowledge Pillars
            products or the law, or for other reasons, and the revised Terms
            will be posted on this page. If we make any material change to the
            Terms and you are a registered User, we will notify you by email. If
            you use the Online Services after changes have been notified, it
            will be deemed that you have accepted the amended Terms.
          </Typography>

          <Typography
            id="severability"
            align="center"
            variant="h6"
            color="primary"
            className={classes.listTitle}
          >
            <b>13. Severability</b>
          </Typography>
          <Typography variant="subtitle2">
            If a provision of these Terms is or becomes illegal, invalid or
            unenforceable, that shall not affect the legality, validity or
            enforceability of any other provision of the Terms.
          </Typography>
        </Paper>
      </Box>
    </>
  )
}
