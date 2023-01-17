export const amplifyConfig = {
  aws_project_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_cognito_identity_pool_id: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_user_pools_id: process.env.REACT_APP_AWS_COGNITO_USERPOOL_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_AWS_COGNITO_USERPOOL_WEB_CLIENT_ID
}

export const gtmConfig = {
  containerId: process.env.REACT_APP_GTM_CONTAINER_ID
}
