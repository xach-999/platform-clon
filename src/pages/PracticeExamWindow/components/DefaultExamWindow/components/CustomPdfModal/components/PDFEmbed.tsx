import React, {useState, useCallback, useEffect} from "react"
import {Button, Grid, Typography, CircularProgress, Box} from "@mui/material"
import {Page} from "react-pdf"
import {Document} from "react-pdf/dist/esm/entry.webpack"
import classNames from "classnames"
import {makeStyles} from "@mui/styles"
import {pdfjs} from "react-pdf"

const useStyles = makeStyles(() => ({
  container: {
    zIndex: 3
  },
  PDFdoc: {
    position: "relative",
    margin: "1rem 0 0",
    boxShadow: "0 0 3px 1px rgba(16, 36, 94, 0.2)",
    "&:hover": {
      "& .controls-item": {
        opacity: "10"
      }
    },
    "& .controls-item": {
      opacity: "0.3"
    },
    overflow: "auto"
  },
  description: {
    padding: "2rem 0"
  },
  controlsContainer: {
    position: "absolute",
    bottom: "1%",
    transition: "opacity ease-in-out 0.2s"
  },
  controls: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    dropShadow: "0 30px 40px 0 rgba(16, 36, 94, 0.2)",
    borderRadius: "4px"
  },
  button: {
    "&:hover": {
      cursor: "pointer"
    }
  },
  PDFloader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "1100px",
    width: "777px"
  }
}))

interface Props {
  file?: any
  url?: string
  description?: string
  pageHeight?: number
}

export default function PDFEmbed({
  file,
  url,
  description,
  pageHeight = 1100
}: Props) {
  const s = useStyles()

  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    if (pdfjs.version) {
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
      } catch (err) {
        console.error(err)
      }
    }
  }, [pdfjs.version])

  const handleDocumentLoadSuccess = useCallback(
    (arg) => {
      const {numPages} = arg

      setNumPages(numPages)
    },
    [numPages, setNumPages]
  )

  return (
    <Grid
      item
      container
      direction="column"
      alignItems="center"
      className={s.container}>
      <Typography variant="h6" className={s.description}>
        {description}
      </Typography>
      <Document
        className={s.PDFdoc}
        file={url ? {url: url} : file && file}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={console.error}
        loading={
          <Box className={s.PDFloader}>
            <CircularProgress color="inherit"/>
          </Box>
        }
        onItemClick={(e) => {
          console.warn(e)
        }}>
        {numPages ? (
          new Array(numPages).fill(1).map((_, num) => {
            return (
              <Page
                key={num}
                pageNumber={num + 1}
                height={pageHeight}
                renderAnnotationLayer={false}
                renderInteractiveForms
                onItemClick={(e) => {
                  console.log(e)
                }}
              />
            )
          })
        ) : (
          <Page
            pageNumber={pageNumber}
            height={pageHeight}
            renderAnnotationLayer={false}
            renderInteractiveForms
          />
        )}
        <Grid
          item
          container
          className={classNames(s.controlsContainer, "controls-item")}
          alignItems="center">
          {!pageNumber && (
            <Grid item className={s.controls}>
              <Button
                className={s.button}
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber === 1}>
                {"<"}
              </Button>
              <p>
                {pageNumber} of {numPages}
              </p>
              <Button
                className={s.button}
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={pageNumber === numPages}>
                {">"}
              </Button>
            </Grid>
          )}
        </Grid>
      </Document>
    </Grid>
  )
}
