const host = process.env.HOST;
const userPort = process.env.USER_PORT;
const authPort = process.env.AUTH_PORT;
const projPort = process.env.PROJ_PORT;

module.exports = {
  /** The path to the auth-ms. */
  AUTH: `${host}:${authPort}`,
  /** The path to the user-ms. */
  USER: `${host}:${userPort}`,
  /** The path to the project-ms. */
  PROJ: `${host}:${projPort}`
};
