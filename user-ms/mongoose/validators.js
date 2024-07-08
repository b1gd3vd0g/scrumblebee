const { prettify } = require('../functions');

const noVal = { val: '', probs: ['no value provided'] };

const validateUsername = (input) => {
  const poss = {
    tooShort: 'username requires a minimum of 6 characters.',
    tooLong: 'username can be no more than 24 characters.',
    alreadyExists: 'username already exists.',
    illSymb: 'username includes illegal symbols.',
    noStr: 'username is not a string.'
  };
  const un = prettify(input);
  if (!un) return noVal;
  const probs = [];
  if (typeof un !== 'string') return [poss.noStr];
  if (un.length < 6) probs.push(poss.tooShort);
  else if (un.length > 24) probs.push(poss.tooLong);
  if (!/^[A-Za-z0-9_.-]+$/.test(un)) probs.push(poss.illSymb);
  return {
    val: probs.length ? '' : un,
    probs: probs
  };
};

/**
 * Validates a string representing an email address.
 * @param {string} input The string to test for validity
 * @returns an object [val]: the prettified string, [probs]: an array of problems
 */
const validateEmail = (input) => {
  // possible errors
  const poss = {
    noAt: 'email address must separate the prefix and the domain with an @',
    twoAt: 'only one @ allowed',
    invCharP: 'prefix contains illegal characters',
    invCharD: 'domain contains illegal characters',
    edgeSymbP: 'prefix cannot start or end with a symbol',
    edgeSymbD: 'domain cannot start or end with a symbol',
    consecSymb: 'email contains consecutive symbols',
    noDotD: 'domain does not contain any dots',
    alreadyExists: 'username already exists.'
  };
  // prettify
  const email = prettify(input);
  if (!email) return noVal;

  const probs = [];
  // split pref/dom
  const spl = email.split('@');

  if (spl.length < 2) {
    probs.push(poss.noAt);
  } else if (spl.length > 2) {
    probs.push(poss.twoAt);
  } else {
    // we have a prefix and a domain.
    //proceed to more advanced testing.
    const [prefix, domain] = spl;
    // allowed symbols in dom and pref
    const pSym = '_.-';
    const dSym = '.-';
    // ensure valid chars
    if (!new RegExp(`^[A-Za-z0-9${pSym}]+$`).test(prefix))
      probs.push(poss.invCharP);
    if (!new RegExp(`^[A-Za-z0-9${dSym}]+$`).test(domain))
      probs.push(poss.invCharD);
    // ensure no edge symbols
    if (pSym.includes(prefix[0]) || pSym.includes(prefix[prefix.length - 1]))
      probs.push(poss.edgeSymbP);
    if (dSym.includes(domain[0]) || dSym.includes(domain[domain.length - 1]))
      probs.push(poss.edgeSymbD);
    // ensure no consecutive symbols
    if (/[._-][._-]/.test(email)) probs.push(poss.consecSymb);
    if (!domain.includes('.')) probs.push(poss.noDotD);
  }
  return {
    val: probs.length ? '' : email,
    probs: probs
  };
};

const validatePassword = (input) => {
  const poss = {
    noCap: 'password must include a capital letter.',
    noLow: 'password must contain a lowercase letter.',
    noNum: 'password must contain a number.',
    noSymb: 'password must include one of these symbols: !@#$%^&*?/+=_-',
    illChar: 'password contains an illegal character.',
    tooShort: 'password must contain at least 8 characters.',
    tooLong: 'password can contain no more than 32 characters.'
  };
  const pw = prettify(input);
  if (!pw) return noVal;
  const probs = [];
  if (!/[A-Z]/.test(pw)) probs.push(poss.noCap);
  if (!/[a-z]/.test(pw)) probs.push(poss.noLow);
  if (!/[0-9]/.test(pw)) probs.push(poss.noNum);
  if (!/[!@#$%^&*?/+=_-]/.test(pw)) probs.push(poss.noSymb);
  if (!/[A-Za-z0-9!@#$%^&*?/+=_-]/.test(pw)) probs.push(poss.illChar);
  if (pw.length < 8) probs.push(poss.tooShort);
  if (pw.length > 32) probs.push(poss.tooLong);
  return { val: probs.length ? '' : pw, probs: probs };
};

const validateAll = (un, email, pw) => {
  const unVal = validateUsername(un);
  const emailVal = validateEmail(email);
  const pwVal = validatePassword(pw);
  if (unVal.val && emailVal.val && pwVal.val) {
    return {
      valid: true,
      values: {
        username: unVal.val,
        email: emailVal.val,
        password: pwVal.val
      }
    };
  }
  const probs = {};
  if (!unVal.val) probs.username = unVal.probs;
  if (!emailVal.val) probs.email = emailVal.probs;
  if (!pwVal.val) probs.password = pwVal.probs;
  return {
    valid: false,
    probs: probs
  };
};

module.exports = {
  prettify,
  validateAll,
  validateEmail,
  validatePassword,
  validateUsername
};
