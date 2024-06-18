const requestCreateAcct = async (username, email, password) => {
  // 0: Define validation functions
  const validateUsername = (un) => {
    return (
      typeof un === String &&
      // Good length
      un.length > 5 &&
      un.length <= 15 &&
      // No illegal characters
      /^[A-Za-z0-9._-]+$/.test(un)
    );
  };
  const validateEmail = (em) => {
    return typeof em === String && /^.+@.+\..+$/.test(em);
  };
  const validatePassword = (pw) => {
    return (
      typeof pw === String &&
      // contains uppercase, lowercase, number, symbol
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[!@#$%^&*?/+=_-]/.test(pw) &&
      // no unexpected characters
      /^[A-Za-z0-9!@#$%^&*?/+=_-]$+/.test(pw)
    );
  };
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
  const result = await fetch('localhost:4043/auth', {
    username: un,
    email: em,
    password: pw
  });
  const creation = await result.json();
  console.log(creation);
};
