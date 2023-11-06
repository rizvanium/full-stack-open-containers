import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';
import BooksContainer from './BooksContainer';

const RecommendedBooks = ({ genre }) => {
  const result = useQuery(ALL_BOOKS, {
    variables: { genre, author: null },
  });

  if (result.loading) {
    return <div>loading...</div>;
  }

  if (result.error) {
    return <div>failed to load books</div>;
  }

  const books = result.data.allBooks;
  return (
    <>
      <h2>recommended</h2>
      {genre && (
        <p>
          in genre <b>{genre}</b>
        </p>
      )}
      <BooksContainer books={books} />
    </>
  );
};

export default RecommendedBooks;
