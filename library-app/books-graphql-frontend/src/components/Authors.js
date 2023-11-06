import { useQuery } from '@apollo/client';
import { ALL_AUTHORS, ME } from '../queries';
import BirthYearForm from './BirthYearForm';

const Authors = () => {
  const meResponse = useQuery(ME);
  const authorsResponse = useQuery(ALL_AUTHORS);

  if (authorsResponse.loading || meResponse.loading) {
    return <div>loading...</div>;
  }

  if (authorsResponse.error) {
    return <div>failed to load authors</div>;
  }

  const authors = authorsResponse.data.allAuthors;
  const me = meResponse.error ? null : meResponse.data.me;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {me && <BirthYearForm authors={authors} />}
    </div>
  );
};

export default Authors;
