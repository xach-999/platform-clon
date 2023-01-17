import type {FC} from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"

interface KpLogoProps {
  imageUrl?: string
  width?: string
  height?: string
}

const KpLogo: FC<KpLogoProps> = (props) => {
  const {imageUrl, height, width} = props
  const logoStyle = {height, width}

  return (
    <Box>
      <img style={logoStyle} src={imageUrl} alt="kp_logo" />
    </Box>
  )
}

KpLogo.propTypes = {
  imageUrl: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string
}

KpLogo.defaultProps = {
  imageUrl: "/static/kp_logo_name.svg",
  width: "50px",
  height: "50px"
}

export default KpLogo
