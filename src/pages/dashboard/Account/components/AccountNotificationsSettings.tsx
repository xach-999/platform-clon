import type {FormEvent} from "react"
import {useSnackbar} from "notistack"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography
} from "@mui/material"
import wait from "utils/wait"

export default function AccountNotificationsSettings(props) {
  const {enqueueSnackbar} = useSnackbar()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    // TODO: Make API request
    await wait(500)

    enqueueSnackbar("Changes saved", {
      anchorOrigin: {
        horizontal: "right",
        vertical: "top"
      },
      variant: "success"
    })
  }

  return (
    <form onSubmit={handleSubmit} {...props}>
      <Card>
        <CardHeader title="Notifications"/>
        <CardContent>
          <Grid container spacing={6} wrap="wrap">
            <Grid item md={4} sm={6} xs={12}>
              <Typography color="textPrimary" gutterBottom variant="subtitle2">
                System
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                You will receive emails in your business email address
              </Typography>
              <Box>
                <FormControlLabel
                  control={<Checkbox color="primary" defaultChecked/>}
                  label="Email alerts"
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={<Checkbox color="primary"/>}
                  label="Push Notifications"
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={<Checkbox color="primary" defaultChecked/>}
                  label="Text message"
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={<Checkbox color="primary" defaultChecked/>}
                  label={
                    <>
                      <Typography color="textPrimary" variant="body1">
                        Phone calls
                      </Typography>
                      <Typography color="textSecondary" variant="caption">
                        Short voice phone updating you
                      </Typography>
                    </>
                  }
                />
              </Box>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Typography color="textPrimary" gutterBottom variant="subtitle2">
                Chat App
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                You will receive emails in your business email address
              </Typography>
              <Box>
                <FormControlLabel
                  control={<Checkbox color="primary" defaultChecked/>}
                  label="Email"
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={<Checkbox color="primary" defaultChecked/>}
                  label="Push notifications"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <Divider/>
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button color="primary" type="submit" variant="contained">
            Save Settings
          </Button>
        </Box>
      </Card>
    </form>
  )
}
