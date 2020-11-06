const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Events = require('./models/Events');

dotenv.config();

const app = express();

app.use(bodyParser.json());

//Route for GraphQl
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
        }

        type RootQuery {
            events(limit: Int!): [Event!]!
        }
         
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: (limit) => {
            return Events.aggregate([
                {
                    $match: {}
                }
            ]).then(result => {
                return result
            }).catch(err => {
                throw err
            })
        },
        createEvent: (args) => {
            const event = new Events(args.eventInput);

            return event.save().then(result => {
                return {...result._doc}
            }).catch(err => {
                throw err;
            })
        }
    },
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@graphql.znwja.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log(">>> Connexion à la base de données réussi...")
    app.listen(3000, () => {
        console.info(">>> Server started...")
    });
}).catch(err => {
    console.error(err)
})