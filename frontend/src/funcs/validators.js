const validateUsername = (un) => {
  return (
    typeof un === 'string' &&
    // Good length
    un.length > 5 &&
    un.length <= 15 &&
    // No illegal characters
    /^[A-Za-z0-9._-]+$/.test(un)
  );
};

const validateEmail = (em) => {
  // allowed symbols
  const domainSpCh = '.-';
  const userSpCh = '!#$%^&*+=|/?_.-';
  // separate into user and domain
  const spl = em.split('@');
  if (spl.length !== 2) return false;
  const [user, domain] = spl;
  // evaluate username
  const userRegex = new RegExp(`^[A-Za-z0-9${userSpCh}]{1,64}$`);
  if (!userRegex.test(user)) return false;
  // scan through username
  for (let i = 0; i < user.length; i++) {
    // Is it a special character?
    if (userSpCh.includes(user[i])) {
      if (
        // First or last index?
        i === 0 ||
        i === user.length - 1 ||
        // Is the next character a symbol?
        userSpCh.includes(user[i + 1])
      ) {
        return false;
      }
    }
  }
  // username should be fine.
  // evaluate domain
  const domainRegex = new RegExp(`^[A-Za-z0-9${domainSpCh}]{4,}$`);
  if (!domainRegex.test(domain)) return false;
  for (let i = 0; i < domain.length; i++) {
    if (domainSpCh.includes(domain[i])) {
      if (
        i === 0 ||
        i === user.length - 1 ||
        domainSpCh.includes(domain[i + 1])
      ) {
        return false;
      }
    }
  }
  // It has passed all my tests.
  return true;
};

const validatePassword = (pw) => {
  return (
    typeof pw === 'string' &&
    // contains uppercase, lowercase, number, symbol
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[!@#$%^&*?/+=_-]/.test(pw) &&
    // no unexpected characters
    /^[A-Za-z0-9!@#$%^&*?/+=_-]+$/.test(pw)
  );
};

export { validateEmail, validatePassword, validateUsername };
