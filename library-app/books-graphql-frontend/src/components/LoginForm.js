import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/client';
import { LOGIN } from '../mutations';
import { ME } from '../queries';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const client = useApolloClient();
  const [login, result] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      const token = data.login.value;
      localStorage.setItem('library-user-token', token);
      await client.refetchQueries({ include: [ME] });
      navigate('/');
    },
  });
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username:{' '}
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password:{' '}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
