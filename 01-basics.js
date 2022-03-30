
const express = require('express')
const { graphqlHTTP } = require('express-graphql')

express()
    .use('/graphql', graphqlHTTP({
        graphiql: true
    }))
    .listen(4000, () => {
        console.log('listening...')
    })
