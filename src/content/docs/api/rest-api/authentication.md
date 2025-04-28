---
title: Authentication
description: Authentication and authorization for the Cosdata vector database API
---

## Authentication

The API uses a token-based authentication system. You need to create a session to obtain an access token, which is then included in the Authorization header for subsequent requests.

### Create Session

Creates an authentication session and returns an access token.

* **Method**: POST
* **Path**: `/auth/create-session`
* **Request Body**:

  ```json
  {
    "username": "admin",
    "password": "your_password"
  }
  ```

* **Response**:

  ```json
  {
    "access_token": "your_access_token",
    "created_at": 1625097600,
    "expires_at": 1625101200
  }
  ```

### Authentication Headers

After obtaining an access token, include it in the Authorization header for all subsequent API requests.

* **Required Headers**:

  ```
  Authorization: Bearer {access_token}
  Content-Type: application/json
  ```

### Token Lifecycle

The authentication system uses stateful sessions with the following characteristics:

* **Token Format**: JWT tokens with username and timestamp claims
* **Token Lifetime**: 3600 seconds (1 hour) by default
* **Session Storage**: Active sessions are stored server-side
* **Expiration Handling**: Expired tokens are automatically removed from active sessions

When a token expires, any request using that token will result in a 401 Unauthorized response. The client should then create a new session to obtain a fresh token.

### Error Handling

**Authentication Errors:**

| Error | Status Code | Description |
|-------|-------------|-------------|
| WrongCredentials | 400 | The provided username or password is incorrect. |
| InvalidToken | 401 | The token is invalid, expired, or not found in active sessions. |
| FailedToExtractTokenFromRequest | 500 | Server failed to extract the token from the request. |

**Best Practices:**

* Store tokens securely client-side
* Implement automatic token renewal mechanisms
* Have proper error handling for authentication failures
* Consider implementing a token refresh mechanism for long-running applications 