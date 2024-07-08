module.exports = {
  /**
   * Call the auth-ms POST method to authenticate a username and password
   * and return a username, uid, and token to store in the session.
   * @param {string} username The username of the account signing in.
   * @param {string} password The password of the account signing in.
   * @returns The HTTP response.
   */
  callInitializeSession: async (username, password) => {
    return await fetch(require('./paths').AUTH, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.AUTH_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
  },
  /**
   * Calls the GET request to the auth-ms, verifying session information.
   * @param {string} token The session token.
   * @param {string} username The session username.
   * @param {string} uid The session uid.
   * @returns The HTTP response.
   */
  callValidateSession: async (token, username, uid) => {
    return await fetch(
      `${require('./paths').AUTH}?username=${encodeURI(
        username
      )}&uid=${encodeURI(uid.toString())}`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${process.env.AUTH_API_KEY}`,
          scrumblebee: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
