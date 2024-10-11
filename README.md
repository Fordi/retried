# @fordi-org/retried

```typescript
retried(job: (...args:T[]) => Promise<R, E>, { tries: number = 5, delay: number = 125 } = {}): (...args: T[]) => Promise<R, E>
```

Wrapper around an AsyncFunction that should be retried upon failure.

| name  | description                                                    |
| ----- | -------------------------------------------------------------- |
| job   | The AsyncFunction to gain implicit retry capabilities          |
| tries | How many times to retry. Set to `Infinity` to just keep trying |
| delay | Delay time in milliseconds between retries.                    |

## Example

```javascript
// The following functions can be used just like `fetch`, but will retry on specific failure types.
const retryFetchOnConnectFailure = retried(fetch, { tries: 5, delay: 125 });
const retryFetchOnInternalServerError = retried(async (...args) => {
  const response = await fetch(...args);
  if (Math.floor(response.status / 100) === 5) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  return response;
}, { tries: 5, delay: 125 });

```
