import {Link as RouterLink} from "react-router-dom"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Link,
  Paper,
  Typography
} from "@mui/material"

const plan = {
  adsLeft: 10,
  currency: "$",
  hasAnalytics: true,
  hasEmailAlerts: true,
  invitesLeft: 24,
  name: "Premium",
  price: 29,
  proposalsLeft: 12,
  templatesLeft: 5
}

export default function AccountBillingSettings(props) {
  return (
    <Card {...props}>
      <CardHeader title="Manage your plan"/>
      <Divider />
      <CardContent>
        <Paper variant="outlined">
          <Box
            sx={{
              alignItems: {
                lg: "center",
                xs: "flex-start"
              },
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              flexDirection: {
                lf: "row",
                xs: "column-reverse"
              },
              p: 3
            }}>
            <Box>
              <Typography color="textPrimary" display="inline" variant="h4">
                {plan.currency}
                {plan.price}
              </Typography>
              <Typography
                color="textPrimary"
                display="inline"
                variant="subtitle1">
                /mo
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                color="textSecondary"
                sx={{ml: 1}}
                variant="overline">
                {plan.name}
              </Typography>
            </Box>
          </Box>
          <Divider/>
          <Box
            sx={{
              alignItems: {
                lg: "center",
                xs: "flex-start"
              },
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              flexDirection: {
                lg: "row",
                xs: "column-reverse"
              },
              p: 3
            }}>
            <Box>
              <Typography color="textPrimary" variant="body2">
                {`${plan.proposalsLeft} proposals left`}
              </Typography>
              <Typography color="textPrimary" variant="body2">
                {`${plan.templatesLeft} templates`}
              </Typography>
            </Box>
            <Box>
              <Typography color="textPrimary" variant="body2">
                {`${plan.invitesLeft} invites left`}
              </Typography>
              <Typography color="textPrimary" variant="body2">
                {`${plan.adsLeft} ads left`}
              </Typography>
            </Box>
            <Box>
              {plan.hasAnalytics && (
                <Typography color="textPrimary" variant="body2">
                  Analytics dashboard
                </Typography>
              )}
              {plan.hasEmailAlerts && (
                <Typography color="textPrimary" variant="body2">
                  Email alerts
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button color="primary" size="small" variant="contained">
            Upgrade Plan
          </Button>
        </Box>
        <Box mt={2}>
          <Typography color="textSecondary" variant="body2">
            The refunds don&apos;t work once you have the plan, but you can
            always{" "}
            <Link color="primary" component={RouterLink} to="#">
              Cancel your plan
            </Link>
            .
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
