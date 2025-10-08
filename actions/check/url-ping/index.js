const MS_IN_SECOND = 1000;

const RETRY_POLICY = {
  perAttemptTimeoutCapMs: 10_000,
  baseBackoffMs: 300,
  backoffFactor: 2,
  maxBackoffMs: 15_000,
  jitterRatio: 0.2,
  minSleepMs: 50,
  safetyMarginMs: 200,
};

const formatSeconds = (milliseconds) =>
  (milliseconds / MS_IN_SECOND).toFixed(2);

const formatError = (error) => {
  if (!error) {
    return "Unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  const details = [];
  const baseMessage = error.message || error.toString();
  if (baseMessage) {
    details.push(baseMessage);
  }

  const metaParts = [];
  if (error.code) {
    metaParts.push(`code=${error.code}`);
  }
  if (error.errno && error.errno !== error.code) {
    metaParts.push(`errno=${error.errno}`);
  }
  if (error.syscall) {
    metaParts.push(`syscall=${error.syscall}`);
  }
  if (error.hostname) {
    metaParts.push(`hostname=${error.hostname}`);
  }
  if (metaParts.length) {
    details.push(`[${metaParts.join(", ")}]`);
  }

  if (error.cause) {
    details.push(`cause: ${formatError(error.cause)}`);
  }

  return details.join(" ").trim();
};

const parsePositiveInteger = (rawValue, fieldName) => {
  const parsed = parseInt(rawValue, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(
      `Invalid ${fieldName} input. Please provide a positive integer.`,
    );
  }
  return parsed;
};

const parseBooleanInput = (rawValue) => {
  if (!rawValue) {
    return false;
  }
  return rawValue.toString().toLowerCase() === "true";
};

const parseExpectedStatuses = (rawValue) => {
  if (!rawValue) {
    throw new Error("Expected statuses input is required.");
  }

  const statuses = rawValue
    .split(",")
    .map((status) => status.trim())
    .filter(Boolean);

  if (!statuses.length) {
    throw new Error("Expected statuses input cannot be empty.");
  }

  return statuses;
};

const computeBackoffDelay = (attemptNumber, policy = RETRY_POLICY) => {
  const growth =
    policy.baseBackoffMs * Math.pow(policy.backoffFactor, attemptNumber - 1);
  const capped = Math.min(policy.maxBackoffMs, growth);
  const jitterSpan = capped * policy.jitterRatio;
  const jitter = (Math.random() * 2 - 1) * jitterSpan;
  return Math.max(policy.minSleepMs, Math.floor(capped + jitter));
};

const createDeadlineController = (deadlineMs) => {
  const controller = new AbortController();
  const msLeft = deadlineMs - Date.now();

  if (msLeft <= 0) {
    controller.abort(new Error("Global deadline exceeded"));
    return controller;
  }

  const timer = setTimeout(
    () => controller.abort(new Error("Global deadline exceeded")),
    msLeft,
  );
  controller._deadlineTimer = timer;
  return controller;
};

const clearDeadlineTimer = (controller) => {
  if (controller && controller._deadlineTimer) {
    clearTimeout(controller._deadlineTimer);
    delete controller._deadlineTimer;
  }
};

const fetchStatusCode = async ({
  url,
  followRedirect,
  attemptTimeoutMs,
  globalSignal,
}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), attemptTimeoutMs);

  const linkGlobalAbort = () => controller.abort(globalSignal.reason);
  if (globalSignal) {
    if (globalSignal.aborted) {
      clearTimeout(timer);
      throw globalSignal.reason || new Error("Global deadline exceeded");
    }
    globalSignal.addEventListener("abort", linkGlobalAbort, { once: true });
  }

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: followRedirect ? "follow" : "manual",
      signal: controller.signal,
    });
    return response.status;
  } catch (error) {
    if (globalSignal && globalSignal.aborted) {
      const reason =
        globalSignal.reason instanceof Error
          ? globalSignal.reason.message
          : "Global deadline exceeded";
      throw new Error(reason);
    }
    if (error && error.name === "AbortError") {
      throw new Error(
        `Request to ${url} timed out after ${formatSeconds(
          attemptTimeoutMs,
        )} seconds (attempt budget)`,
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
    if (globalSignal) {
      globalSignal.removeEventListener("abort", linkGlobalAbort);
    }
  }
};

const ensureStatusIsExpected = (statusCode, expectedStatuses) => {
  if (!expectedStatuses.includes(statusCode.toString())) {
    throw new Error(
      `Unexpected status code: ${statusCode}. Expected one of: ${expectedStatuses.join(
        ", ",
      )}`,
    );
  }
};

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const logAttemptStart = ({
  core,
  attemptNumber,
  totalAttempts,
  url,
  attemptTimeoutMs,
  remainingTimeMs,
}) => {
  core.info(
    `Attempt ${attemptNumber}/${totalAttempts} - Checking URL: ${url} ` +
      `(attempt timeout: ${formatSeconds(
        attemptTimeoutMs,
      )}s, remaining total time: ${formatSeconds(remainingTimeMs)}s)`,
  );
};

const executeAttempt = async ({
  config,
  attemptTimeoutMs,
  core,
  globalSignal,
}) => {
  const statusCode = await fetchStatusCode({
    url: config.url,
    followRedirect: config.followRedirect,
    attemptTimeoutMs,
    globalSignal,
  });
  core.setOutput("status-code", statusCode);
  ensureStatusIsExpected(statusCode, config.expectedStatuses);
  return statusCode;
};

const createConfig = (rawInputs) => {
  const urlInput = rawInputs.url;
  if (!urlInput) {
    throw new Error("URL input is required.");
  }

  const url = new URL(urlInput.trim());
  if (!url.protocol || !url.host) {
    throw new Error("Invalid URL input. Please provide a valid URL.");
  }

  const followRedirect = parseBooleanInput(rawInputs.followRedirect);
  const timeoutSeconds = parsePositiveInteger(rawInputs.timeout, "timeout");
  const totalTimeoutMs = timeoutSeconds * MS_IN_SECOND;
  const totalAttempts = parsePositiveInteger(rawInputs.retries, "retries");
  const expectedStatuses = parseExpectedStatuses(rawInputs.expectedStatuses);

  return {
    url,
    followRedirect,
    timeoutSeconds,
    totalTimeoutMs,
    totalAttempts,
    expectedStatuses,
  };
};

const runUrlCheck = async (config, core) => {
  core.debug(`Configuration: ${JSON.stringify(config)}`);

  const startTime = Date.now();
  const deadline = startTime + config.totalTimeoutMs;
  const globalController = createDeadlineController(deadline);
  const maxAttempts = config.totalAttempts;
  const slotLength = Math.max(
    RETRY_POLICY.minSleepMs,
    Math.floor(config.totalTimeoutMs / maxAttempts),
  );

  let lastError = null;

  try {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      if (deadline - Date.now() <= 0) {
        throw new Error(
          `URL check timed out after ${config.timeoutSeconds} seconds before attempt ${attempt} could start.`,
        );
      }

      const slotStart = startTime + (attempt - 1) * slotLength;
      const slotEndExclusive =
        attempt < maxAttempts ? startTime + attempt * slotLength : deadline;

      const preSleepMs = slotStart - Date.now();
      if (preSleepMs > 0) {
        await sleep(preSleepMs);
      }

      const remainingGlobalMs = Math.max(0, deadline - Date.now());
      const remainingSlotMs = Math.max(0, slotEndExclusive - Date.now());
      const attemptTimeoutMs = Math.max(
        RETRY_POLICY.minSleepMs,
        Math.min(
          RETRY_POLICY.perAttemptTimeoutCapMs,
          Math.max(0, remainingSlotMs - RETRY_POLICY.safetyMarginMs),
        ),
      );

      logAttemptStart({
        core,
        attemptNumber: attempt,
        totalAttempts: maxAttempts,
        url: config.url,
        attemptTimeoutMs,
        remainingTimeMs: remainingGlobalMs,
      });

      try {
        const statusCode = await executeAttempt({
          config,
          attemptTimeoutMs,
          core,
          globalSignal: globalController.signal,
        });
        core.setOutput("attempt-count", attempt);
        core.info(
          `URL check succeeded with status code: ${statusCode} after ${attempt} attempt(s).`,
        );
        return;
      } catch (error) {
        core.setOutput("attempt-count", attempt);
        const failure =
          error instanceof Error ? error : new Error(String(error));
        lastError = failure;

        core.warning(
          `Attempt ${attempt}/${maxAttempts} failed: ${formatError(failure)}`,
        );
        if (failure.stack) {
          core.debug(failure.stack);
        }

        if (failure.message.includes("Global deadline exceeded")) {
          throw new Error(
            `URL check timed out after ${
              config.timeoutSeconds
            } seconds. Last error: ${formatError(failure)}`,
          );
        }

        if (attempt === maxAttempts) {
          break;
        }

        const backoffDelay = computeBackoffDelay(attempt);
        core.info(
          `Retrying in ${backoffDelay}ms (budget-aware exponential backoff).`,
        );
        await sleep(backoffDelay);
      }
    }

    const remainingToDeadline = deadline - Date.now();
    if (remainingToDeadline > 0) {
      core.info(
        `Failure detected; waiting until global deadline for ${remainingToDeadline}ms.`,
      );
      await sleep(remainingToDeadline);
    }

    const failureSummary = `URL check failed after ${maxAttempts} attempt(s) within ${config.timeoutSeconds} seconds.`;
    if (lastError) {
      throw new Error(
        `${failureSummary} Last error: ${formatError(lastError)}`,
      );
    }
    throw new Error(failureSummary);
  } finally {
    clearDeadlineTimer(globalController);
  }
};

const run = async ({ core, inputs }) => {
  try {
    const config = createConfig(inputs);
    await runUrlCheck(config, core);
  } catch (error) {
    const message = error instanceof Error ? formatError(error) : String(error);
    core.setFailed(message);
  }
};

module.exports = {
  run,
};
