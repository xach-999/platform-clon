import {useState, useEffect} from "react"
import {Helmet} from "react-helmet-async"
import {Box, Typography, Paper} from "@mui/material"
import {makeStyles} from "@mui/styles"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"

const FAQ = [
  {
    q: "What’s a certification?",
    a: "A certification is an official document, or digital document, attesting the status of a certain achievement. In the IT learning industries, this can come in the form of a digital certificate and often a hard copy is also sent.        "
  },
  {
    q: "Are certifications all the same?",
    a: "No, certifications have value if they are coming from a recognised body and are accredited by endorsements, credentials or badge."
  },
  {
    q: "What are credentials?",
    a: "Credentials are qualification of someone’s background, that make him suitable for some specific job. "
  },
  {
    q: "Do I always need to certify? Aren’t my skills enough?",
    a: "Certifications prove your skills, allowing an employer to make a faster decision to hire you, without running specific assessments to test your knowledge. For the same reason, certification add value to your professional profile, increasing your chances of getting a better job with a higher salary."
  },
  {
    q: "What is a badge?",
    a: "A badge, in learning industries, is a digital stamp provided by an independent, that guarantees accreditation to a certificate. The badge is generally digital and can be shown on personal curriculum or on social media profiles. Acclaim is the most known digital badge."
  },
  {
    q: "What is a practice test?",
    a: "A practice test is an assessment that prepares students to take a certain exam, providing with pretty much the same questions of the exam. In many cases, it simulates the exact exam environment, providing students with the same feeling of taking the actual exam."
  },
  {
    q: "How can I buy your products?",
    a: "Knowledge Pillars sells to different categories of customers. Whether you are a student or a school, organization, university you need to register on our page and access our webshop. To register, left click on the login icon on the right top of the www.knowledge-pillars.com and a registration form will pop-up."
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
  }
}))

function createData(question, answer) {
  return (
    <Box sx={{padding: "16px 0"}}>
      <Typography style={{display: "flex", marginBottom: "5px"}}>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <HelpOutlineIcon />
        </Box>
        <b style={{marginLeft: "8px", textDecoration: "underline"}}>
          {question}
        </b>
      </Typography>
      <Typography style={{display: "flex"}}>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <ChatBubbleOutlineIcon />
        </Box>
        <span style={{marginLeft: "8px"}}>{answer}</span>
      </Typography>
    </Box>
  )
}

const mapFQSs = () => {
  const allRows = []

  FAQ.forEach((faq) => {
    allRows.push(createData(faq.q, faq.a))
  })

  return allRows
}

export default function FAQs() {
  const classes = useStyles()

  const [faqs, setFaqs] = useState([])

  useEffect(() => {
    setFaqs(mapFQSs())
  }, [])

  return (
    <>
      <Helmet>
        <title>FAQs | KP Platform</title>
      </Helmet>
      <Box className={classes.root}>
        <Paper className={classes.paperContainer}>
          <Typography
            align="center"
            variant="h4"
            color="primary"
            sx={{mb: 3}}
          >
            <b>FAQs</b>
          </Typography>
          {faqs}
        </Paper>
      </Box>
    </>
  )
}
