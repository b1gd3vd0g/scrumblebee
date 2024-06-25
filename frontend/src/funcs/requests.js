import { User } from '../../../user-ms/models';
import {
  validateEmail,
  validatePassword,
  validateUsername
} from './validators';

const requestCreateAcct = async (username, email, password) => {
  // 1. Trim and validate input. Store invalid fields in err. Fail if invalid.
  const un = username.trim();
  const em = email.trim();
  const pw = password.trim();
  const err = [];
  if (!validateUsername(un)) err.push('username');
  if (!validatePassword(pw)) err.push('password');
  if (!validateEmail(em)) err.push('email');
  if (err.length)
    return { success: false, message: 'bad request', fields: err };
  // 2. Make the request
  const result = await fetch('http://localhost:4043/', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      username: un,
      email: em,
      password: pw
    })
  });
  const creation = await result.json();
  console.log(creation);
  return creation;
};

const authenticateCredentials = async (usernameOrEmail, password) => {
  const un = usernameOrEmail.trim();
  const pw = password.trim();
  const result = await fetch('http://localhost:4043/auth', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      username: un,
      password: pw
    })
  });
  const signin = await result.json();
  return signin;
};

export { requestCreateAcct };
