const { GraphQLError } = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const resolvers = {
  Author: {
    bookCount: (root) => {
      return root.books ? root.books.length : 0;
    },
  },

  Query: {
    bookCount: async () => await Book.countDocuments({}),
    authorCount: async () => await Author.countDocuments({}),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate('author');
      }

      if (!args.author && args.genre) {
        return Book.find({ genres: args.genre }).populate('author');
      }

      const author = await Author.findOne({ name: args.author });
      if (args.author && !args.genre) {
        return Book.find({ author: author?.id }).populate('author');
      }

      return Book.find({ author: author?.id, genres: args.genre }).populate(
        'author'
      );
    },
    allAuthors: async () => await Author.find({}),
    me: async (root, args, context) => context.currentUser,
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('unauthorized', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let author = await Author.findOne({ name: args.author });
      try {
        if (!author) {
          author = new Author({ name: args.author, books: [] });
          await author.save();
        }
      } catch (error) {
        throw new GraphQLError('Adding new author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error,
          },
        });
      }

      const book = new Book({ ...args, author: author.id });
      try {
        await book.save();
        author.books = author.books.concat(book.id);
        await author.save();
        await book.populate('author');
      } catch (error) {
        throw new GraphQLError('Saving new book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book });

      return book;
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('unauthorized', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      try {
        const updatedAuthor = await Author.findOneAndUpdate(
          { name: args.name },
          {
            born: args.setBornTo,
          },
          { new: true, runValidators: true, context: 'query' }
        );
        return updatedAuthor;
      } catch (error) {
        throw new GraphQLError('Updating author info failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      }
    },

    createUser: async (root, args) => {
      const { HASH_SALT_ROUNDS, UNIVERSAL_PASSWORD } = process.env;

      const passwordHash = await bcrypt.hash(
        UNIVERSAL_PASSWORD,
        +HASH_SALT_ROUNDS
      );
      const user = new User({ ...args, passwordHash });
      try {
        return user.save();
      } catch (error) {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        });
      }
    },

    login: async (root, args) => {
      const { username, password } = args;
      const user = await User.findOne({ username });
      const passwordIsCorrect = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false;

      if (!user || !passwordIsCorrect) {
        throw new GraphQLError('invalid username or password', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userInfo = {
        id: user.id,
        username: user.username,
      };

      return {
        value: jwt.sign(userInfo, process.env.SECRET, { expiresIn: 3600 }),
      };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
};

module.exports = resolvers;
