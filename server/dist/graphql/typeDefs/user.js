const UserTypeDefs = `#graphql
  type User {
    id : String
    username: String
  }

  type Query {
    searchUsername(username: String): [User]
  }

  type Mutation {
    createUsername(username: String) : createUsernameResponse
  }

  type createUsernameResponse {
    success : Boolean
    error : String
  }

`;
export default UserTypeDefs;
