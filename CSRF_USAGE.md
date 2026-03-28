# CSRF Protection Implementation

## How to Use CSRF Protection

### 1. Get CSRF Token

Make a GET request to `/csrf/token` to get a CSRF token:

```javascript
const response = await fetch('/csrf/token');
const { csrfToken } = await response.json();
```

### 2. Include CSRF Token in Requests

#### REST API Requests

Include the token in the `X-CSRF-Token` header for protected requests:

```javascript
fetch('/api/protected-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(data),
});
```

#### GraphQL Requests

Only GraphQL **mutations** and **subscriptions** need CSRF tokens. **Queries** are automatically exempt:

```javascript
// GraphQL Query - NO CSRF token needed
const queryResponse = await fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      query GetUser {
        user {
          id
          name
        }
      }
    `,
  }),
});

// GraphQL Mutation - CSRF token REQUIRED
const mutationResponse = await fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify({
    query: `
      mutation UpdateUser($input: UserInput!) {
        updateUser(input: $input) {
          id
          name
        }
      }
    `,
    variables: { input: userData },
  }),
});
```

### 3. Exclude Routes from CSRF Protection

Use the `@ExcludeCsrf()` decorator on routes that should not be protected:

```typescript
import { ExcludeCsrf } from './csrf/csrf.decorator';

@Post('public-endpoint')
@ExcludeCsrf()
publicEndpoint() {
  // This endpoint is excluded from CSRF protection
}
```

### 4. Manual CSRF Protection

Use the `@UseCsrf()` decorator to manually apply CSRF protection:

```typescript
import { UseCsrf } from './csrf/csrf.decorator';

@Post('protected-endpoint')
@UseCsrf()
protectedEndpoint() {
  // This endpoint requires CSRF token validation
}
```

## Implementation Details

- CSRF tokens are stored in the session
- Tokens are validated against the session value
- The `/csrf/token` endpoint is automatically excluded from protection
- **GraphQL queries** are automatically exempt from CSRF protection
- **GraphQL mutations and subscriptions** require CSRF tokens
- **GET requests** are automatically exempt from CSRF protection
- All other POST/PUT/DELETE endpoints require a valid CSRF token unless explicitly excluded
- Invalid or missing tokens will result in a 403 Forbidden error
