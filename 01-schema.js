
const axios = require('axios')
const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull, } = graphql

const FactionType = new GraphQLObjectType({
    name: 'Faction',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        characters: {
            type: new GraphQLList(CharacterType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/factions/${parentValue.id}/characters`).then(res => res.data)
            }
        }
    })
})

const CharacterType = new GraphQLObjectType({
    name: 'Character',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        faction: {
            type: FactionType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/factions/${parentValue.factionId}`).then(res => res.data)
            }
        }
    })
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

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCharacter: {
            type: CharacterType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                factionId: { type: GraphQLString }, // OPTIONAL FIELD
            },
            resolve(parentValue, args) {
                const { name, age, factionId } = args
                return axios.post(`http://localhost:3000/characters`, {
                    name,
                    age,
                    factionId,
                }).then(res => res.data)
            }
        },
        deleteCharacter: {
            type: CharacterType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                return axios.delete(`http://localhost:3000/characters/${args.id}`).then(res => res.data)
            }
        },
        editCharacter: {
            type: CharacterType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                factionId: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                const { id, name, age, factionId } = args
                return axios.patch(`http://localhost:3000/characters/${id}`, {
                    name,
                    age,
                    factionId,
                }).then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})
