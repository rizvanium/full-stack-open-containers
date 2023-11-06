import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR } from '../mutations';
import { ALL_AUTHORS } from '../queries';

const BirthYearForm = ({ authors }) => {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [updateAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  useEffect(() => {
    if (authors.length > 0) {
      setName(authors[0].name);
    }
  }, [authors]);

  const changeBirthYear = (event) => {
    event.preventDefault();
    updateAuthor({ variables: { name, setBornTo: +birthYear } });
    setBirthYear('');
  };

  return (
    <>
      <h2>set birthyear</h2>
      <form onSubmit={changeBirthYear}>
        <label>
          name:{' '}
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <div>
          <label>
            born:{' '}
            <input
              type="number"
              value={birthYear}
              onChange={({ target }) => setBirthYear(target.value)}
            />
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </>
  );
};

export default BirthYearForm;
