import React, {FC, useRef, useState} from "react"
import {useDispatch, useSelector} from "store"
import {makeStyles} from "@mui/styles"
import {handleError} from "store/slices/notifier/notifier"
import CustomErrorClass from "store/slices/notifier/customErrorClass"
import {customErrors} from "store/slices/notifier/errorObject"

const useStyles = makeStyles(() => ({
  iFrame: {
    overflow: "hidden",
    height: "100%",
    width: "100%",
    position: "absolute"
  },
  iFrameWrapper: {
    flexGrow: 1,
    position: "relative",
    background: "#ffffff",
    height: "100%"
  },
  iFrameSpinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    position: "absolute",
    color: "rgb(255,255,255)",
    backgroundColor: "grey",
    zIndex: 1250
  }
}))

interface Props {
  iframeWasLoaded: boolean
  setOpenHint: (hintStatus: boolean) => void
  setIframeWasLoaded: (iframeStatus: boolean) => void
}

const WordpressExamSpace: FC<Props> = ({
  setOpenHint,
  iframeWasLoaded,
  setIframeWasLoaded
}) => {
  const styles = useStyles()
  const gridIframe = useRef(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const handleIframeLoaded = () => {
    setLoading(false)
    if (iframeWasLoaded) return
    setIframeWasLoaded(true)
    setOpenHint(true)
  }
  const handleIframeError = () => {
    setLoading(false)
    dispatch(handleError(new CustomErrorClass(customErrors.CANT_LOAD_IFRAME)))
  }

  // ! selectors
  const sessionInstance = useSelector(
    (state) => state.practiceSession.currentSession?.instance
  )

  // ! render
  return (
    <div className={styles.iFrameWrapper}>
      {loading && <div className={styles.iFrameSpinner}>loading...</div>}
      {/*WORDPRESS IFRAME*/}
      {sessionInstance?.url && (
        <iframe
          src={sessionInstance.url}
          frameBorder={0}
          title="wp-exam"
          className={styles.iFrame}
          width="100%"
          height="100%"
          ref={gridIframe}
          onLoad={handleIframeLoaded}
          onError={handleIframeError}
        />
      )}
    </div>
  )
}

export default WordpressExamSpace
