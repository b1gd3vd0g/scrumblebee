const host = process.env.HOST;
const userPort = process.env.USER_PORT;
const authPort = process.env.AUTH_PORT;
const projPort = process.env.PROJ_PORT;

module.exports = {
  AUTH: `${host}:${authPort}`,
  USER: `${host}:${userPort}`,
  PROJ: `${host}:${projPort}`
};
