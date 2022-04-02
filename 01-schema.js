
const axios = require('axios')
const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, } = graphql

const FactionType = new GraphQLObjectType({
    name: 'Faction',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
    }
})

const CharacterType = new GraphQLObjectType({
    name: 'Character',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        faction: {
            type: FactionType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/factions/${parentValue.factionId}`).then(res => res.data)
            }
        }
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
        },
        faction: {
            type: FactionType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/factions/${args.id}`).then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
