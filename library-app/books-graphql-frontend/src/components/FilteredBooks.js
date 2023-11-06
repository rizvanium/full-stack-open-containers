import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';
import BooksContainer from './BooksContainer';

const FilteredBooks = () => {
  const [genres, setGenres] = useState([]);
  const [filter, setFilter] = useState(null);
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: filter, author: null },
  });

  useEffect(() => {
    if (result.data) {
      setGenres([
        ...new Set(genres.concat(books.flatMap((book) => book.genres))),
      ]);
    }
  }, [result.data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (result.loading) {
    return <div>loading...</div>;
  }

  if (result.error) {
    return <div>failed to load books</div>;
  }

  const books = result.data.allBooks;

  return (
    <>
      <h2>books</h2>
      {filter && (
        <p>
          in genre <b>{filter}</b>
        </p>
      )}
      <BooksContainer books={books} />
      {genres.map((genre) => (
        <button key={genre} onClick={() => setFilter(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilter(null)}>all genres</button>
    </>
  );
};

export default FilteredBooks;
