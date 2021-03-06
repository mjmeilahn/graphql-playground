
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema')

express()
    .use('/graphql', graphqlHTTP({
        schema,
        graphiql: true,
    }))
    .listen(4000, () => {
        console.log('listening...')
    })
