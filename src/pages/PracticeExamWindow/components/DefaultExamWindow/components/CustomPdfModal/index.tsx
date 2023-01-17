import React from "react"
import {makeStyles} from "@mui/styles"
import {Modal, Backdrop, Fade, Box} from "@mui/material"
import PDFEmbed from "pages/PracticeExamWindow/components/DefaultExamWindow/components/CustomPdfModal/components/PDFEmbed"
import PDF from "assets/pdf/examDocs/PCA_DOC.pdf"

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  pdfWrapper: {
    maxHeight: "98vh",
    overflow: "auto",
    border: 0
  }
}))

export default function CustomPdfModal({open, setOpen}) {
  const s = useStyles()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={s.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}>
        <Fade in={open}>
          <div className={`${s.paper} ${s.pdfWrapper}`}>
            <PDFEmbed url={PDF}/>
          </div>
        </Fade>
      </Modal>
    </Box>
  )
}
