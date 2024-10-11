export default function retried(job, { tries = 5, delay: delayTime = 125 } = {}) {
  const delay = delayTime >= 10
    ? (() => new Promise((r) => setTimeout(r, delayTime)))
    : (() => new Promise((r) => setImmediate(r)));
  return async function(...args) {
    let result;
    let error;
    let retries = tries;
    while (!result && retries > 0) {
      try {
        error = undefined;
        result = [await job.apply(this, args)];
      } catch (e) {
        result = undefined;
        error = [e];
        retries--;
        if (retries !== 0) await delay();
      }
    }
    if (error) {
      throw error[0];
    }
    return result[0];
  };
}