# scrumblebee-authentication-microservice

By Devin Peevy <devin@bigdevdog.com>

## Quick Facts

**Production server**: https://www.api.bigdevdog.com:4043

**Test server**: http://localhost:4042

**version**: 1.0.0

## Overview

The authentication microservice is relied upon by all other microservices for the application Scrumblebee. It can provide tokens for the other services to use, and verify the payloads of existing tokens to ensure the API end user is who they say they are.

## Security

This API is only accessible by an API Key. This API key is a jwt, and should be put in the authorization header. The API key is only ever meant to be accessible to the other Scrumblebee microservices - direct usage of this API is otherwise forbidden.

## How it works

All other microservices have some functions which are not allowed unless you are signed into an account. For example, you must be signed in in order to:

- delete your account
- create a new project

These microservices all utilize sessions. The sessions (when signed in) store:

- username
- userid
- token

The token is the critical part here - the POST request creates these, and they will be valid until the expiration date. So every request which requires authentication checks that the token contains the same information as the session, and is unexpired.

## Routes

There are two major methods, both located at the base route. Find more information about them at ./documentation.yaml

### /

- **POST**
  - Provides a token which is valid for 60 minutes with a given payload.
- **GET**
  - Verifies that a token is valid, unexpired, and meets expectations.
