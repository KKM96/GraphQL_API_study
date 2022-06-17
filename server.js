import { ApolloServer, gql} from "apollo-server";

const typeDefs = gql`
    type User {
        id:ID!
        username: String!
    }
    type Tweet {
        id:ID!
        text:String
        author : User!
    }
    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet!
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id:ID!): Boolean!
    }

`;
// ''이 아니라 ``사용
// ``안에는 SDL (Schema Definition Language)
// data의 type 설명
// GET / api/v1/tweet/:id 와 동일 = tweet(id: ID)
// GET = Query
// POST, DELETE, PUT = Mutation

const server = new ApolloServer({ typeDefs });

server.listen().then(({url}) => {
    console.log('Running on ${url}');
});