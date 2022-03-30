
const axios = require('axios')
const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, } = graphql

const CharacterType = new GraphQLObjectType({
    name: 'Character',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        character: {
            type: CharacterType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/characters/${args.id}`).then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
