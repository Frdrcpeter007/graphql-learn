const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');

const app = express();

app.use(bodyParser.json());

//Route for GraphQl
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
         
        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ["Année de merde", "Hola Hola", "Mon livre de con"]
        },
        createEvent: (args) => {
            return `Your name is ${args.name}`
        }
    },
    graphiql: true
}))

app.listen(3000, () => {
    console.info(">>> Server started...")
});