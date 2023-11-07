let authors = [
  {
    _id: new ObjectId(),
    name: 'Robert Martin',
    born: 1952,
  },
  {
    _id: new ObjectId(),
    name: 'Martin Fowler',
    born: 1963,
  },
  {
    _id: new ObjectId(),
    name: 'Fyodor Dostoevsky',
    born: 1821,
  },
  {
    _id: new ObjectId(),
    name: 'Joshua Kerievsky', // birthyear not known
  },
  {
    _id: new ObjectId(),
    name: 'Sandi Metz', // birthyear not known
  },
];

let books = [
  {
    _id: new ObjectId(),
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring'],
  },
  {
    _id: new ObjectId(),
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    _id: new ObjectId(),
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring'],
  },
  {
    _id: new ObjectId(),
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns'],
  },
  {
    _id: new ObjectId(),
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design'],
  },
  {
    _id: new ObjectId(),
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime'],
  },
  {
    _id: new ObjectId(),
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution'],
  },
];

books = books.map((book) => ({
  ...book,
  author: authors.find((a) => a.name === book.author)._id,
}));

authors = authors.map((author) => ({
  ...author,
  books: books
    .filter((b) => b.author === author._id)
    .map((author) => author._id),
}));

db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('authors');
db.createCollection('books');

db.authors.insertMany(authors);
db.books.insertMany(books);
