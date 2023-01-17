import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client"
import {setContext} from "@apollo/client/link/context"
import {Auth} from "aws-amplify"

const httpLink = createHttpLink({
  // Sorry for this hack, i have no control over client env vars –Alex
  uri:
    // process.env.REACT_APP_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_BASE_URL.replace(/\/api$/, "/graphql")
})

const authLink = setContext(async (_, {headers}) => {
  let idtoken: string = ""

  try {
    idtoken = (await Auth.currentSession()).getIdToken().getJwtToken()
  } catch (err) {
    console.error(err)
  }

  return {
    headers: {
      ...headers,
      idtoken: idtoken
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default client
