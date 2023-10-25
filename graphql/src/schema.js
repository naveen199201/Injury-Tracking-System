const { gql } = require('apollo-server')

const typeDefs = gql`
 scalar DateTime
  
  type reporter {
    id: ID!
    email: String!
    password: String! 
  } 
  type User {
    id: ID!
    email:String!
    name : String
  }
  
  type Report {
    id: ID!
    nameOfReporter: String!
    dateOfInjury: DateTime!
    dateOfReport: DateTime!
    createdAt:DateTime
    listOfInjuries:[Injury!]!
  }

  type Injury{
    id:ID!
    description: String
    reportId :Int!
    report: Report!
  }

  type Query {
    user(id:ID!):User!
    users:[User!]!
    reporters: [reporter!]!
    reporter(id: String!): reporter!
    report(id: ID!): Report
    reports: [Report!]
    injuries: [Injury!]!
    injury(id: ID!): Injury!
  }

  type Mutation {
    registerReporter(email: String!, password: String!): reporter
    registerInjury(description:String!):Injury
    registerReport(input: ReportInput!): Report
    }
    input ReportInput {
      nameOfReporter: String!
      dateOfInjury : DateTime !
      dateOfReport:DateTime!
      listOfInjuries:Injury[]
    }
    registerInjury(description:String!):Injury
    
 
`
module.exports = {
  typeDefs,
}