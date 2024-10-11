import { describe, it } from "node:test";
import assert from "node:assert";
import retried from "./index.js";

describe("retried", () => {
  it("retries after failure", async () => {
    let failCount = 3;
    let execCount = 0;
    const job = async () => {
      execCount++;
      if (--failCount) {
        throw new Error("failed");
      }
    };
    const retriedJob = retried(job, { tries: 3, delay: 0 });
    await retriedJob();
    assert.equal(failCount, 0);
    assert.equal(execCount, 3);
  });

  it("gives up eventually", async () => {
    let execCount = 0;
    const job = async () => {
      execCount++;
      throw new Error("failed");
    };
    const retriedJob = retried(job, { tries: 2, delay: 0 });
    await assert.rejects(async () => {
      await retriedJob();
    });
    assert.equal(execCount, 2);
  });

  it("waits between failures", async () => {
    const log = [];
    const job = async () => {
      const now = performance.now();
      log.push(now - last);
      last = now;
      throw new Error();
    };
    const retriedJob = retried(job, { tries: 5, delay: 50 });
    let last = performance.now();
    await assert.rejects(async () => {
      await retriedJob();
    });
    log.forEach((entry, index) => {
      assert(index === 0 ? entry < 1 : entry >= 50);
    });
  });
});