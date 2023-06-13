const UserTypeDefs = `#graphql
  type User {
    id : String
    name: String
    username: String
    email: String
    emailVerified: Boolean
    image: String
  }

  type Query {
    searchUsers(username: String): [User]
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
