import { ApolloServer, gql} from "apollo-server";
import fetch from "node-fetch";

// const -> let 으로 변경
let tweets = [
    {
        id:"1",
        text:"first one!",
        userId:"2",
    },
    {
        id:"2",
        text:"second one!",
        userId:"1",
    },
];

let users = [
    {
        id: "1",
        firstName: "km",
        lastName: "Kim",
    },
    {
        id: "2",
        firstName: "ys",
        lastName: "Lee",
    },
];
// 임시 db 만들기

const typeDefs = gql`
    type User {
        id:ID!
        username: String!
        firstName: String!
        lastName: String!
        """
        Is the sum of firstName + lastName as a string
        """
        fullName: String!
    }
    """
    Tweet object represent a resource for a Tweet
    """
    type Tweet {
        id:ID!
        text:String!
        author : User
    }
    type Query {
        allMovies: [Movie!]!
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        movie(id:String!): Movie
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        """
        Deletes a Tweet if found, else returns false
        """
        deleteTweet(id:ID!): Boolean!
    },
    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String
        description_full: String!
        synopsis: String
        yt_trailer_code: String!
        language: String!
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
    },
    type test {
        tag: String!
        content: String!
    },
`;
// ''이 아니라 ``사용
// ``안에는 SDL (Schema Definition Language)
// data의 type 설명
// GET / api/v1/tweet/:id 와 동일 = tweet(id: ID)
// GET = Query
// POST, DELETE, PUT = Mutation
// firstName: String 하면 null or String
// tweet(id: ID!): Tweet => 아이디가 존재하지않을 경우 null이 될 수 있으므로 !를 안붙임

const resolvers = {
    Query: {
        allTweets(){
            return tweets;
        },
        tweet(root, { id }){
            return tweets.find((tweet) => tweet.id === id);
        },
        allUsers(){
            console.log("allUsers called!");
            return users;
        },
        allMovies(){
            return fetch("https://yts.mx/api/v2/list_movies.json")
            .then((r) => r.json())
            .then(json => json.data.movies);
        },
        movie(root,{id}){
            return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
            .then((r) => r.json())
            .then((json) => json.data.movie);
        },
    },
    Mutation: {
        postTweet(root, { text, userId }) {
            const newTweet = {
                id: tweets.length + 1,
                text,
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(root, {id}) {
            const tweet = tweets.find((tweet) => tweet.id === id);
            if (!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id !== id);
            return true;
        },
    },
    User: {
        fullName({firstName, lastName}){
            return `${firstName} ${lastName}`;
        },
    },
    Tweet:{
        author({userId}){
            return users.find(user => user.id === userId);
        }
    },
};

//return tweets.find((tweet) => this.tweet.id === id); 는 실제 할 작업은 아니고 나중에 DB에
// 접근하여 SQL 코드를 실행시킬 것
// postTweet mutation은 항상 우리가 만든 새 tweet을 줘야하기 때문에 (Tweet!) return을 넣어줌
// => return newTweet
// postTweet~ 부분은 JS로 코딩을 한 것 다른 언어로 코딩할 경우 달라진다. but args 순서는 동일
// delete 는 filter를 이용하여 삭제하려는 id 이외의 것들만 array로 필터링 하여 삭제하는 방식
// fullName, author는 기존 데이터 베이스에 없는 것을 추가적으로 resolver에서 찾아서 출력


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({url}) => {
    console.log('Running on ${url}');
});