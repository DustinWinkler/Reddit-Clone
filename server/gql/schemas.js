import { gql } from 'apollo-server-express'

const Schemas = gql`
  type Query {
    hello: String
  }

  type Mutation {
    meme: String
  }
`

export default Schemas 