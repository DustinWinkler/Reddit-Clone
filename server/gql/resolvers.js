const resolvers = {
  Query: {
    hello: () => {
      console.log('meme');
      return 'hello world'
    }
  },
  Mutation: {
    meme: () => 'this is a meme'
  }
}

export default resolvers