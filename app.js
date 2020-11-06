const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Events = require('./models/Events');
const Users = require('./models/Users');

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

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
        }

        input EventUser {
            email: String!
            password: String
        }

        type RootQuery {
            events(limit: Int!): [Event!]!
        }
         
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(eventUser: EventUser): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        // Récupération des events
        events: (limit) => {
            return Events.aggregate([
                {
                    $match: {}
                },
                {
                    $limit: parseInt(limit.limit)
                }
            ]).then(result => {
                return [...result]
            }).catch(err => {
                throw err
            })
        },

        // Création des events
        createEvent: (args) => {
            const event = new Events(args.eventInput);

            return event.save().then(result => {
                return {...result._doc}
            }).catch(err => {
                throw err;
            })
        },

        // Enregistrement du user
        createUser: (args) => {
            return Users.findOne({email: args.eventUser.email}).then(user => {
                if (user) {
                    throw new Error('Cet adresse email est déjà utilisé')
                }

                return bcrypt.hash(`CRYPT${args.eventUser.password}CRYPT`, 10)
            })
            .then(hash => {
                args.eventUser.password = hash;

                const user = new Users(args.eventUser);
    
                return user.save();
                
            })
            .then(result => {
                delete result._doc.password;
                return {...result._doc}
            })
            .catch(err => {
                throw err
            })
            .catch(err => {
                throw err
            })
            .catch(err => {
                throw err
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