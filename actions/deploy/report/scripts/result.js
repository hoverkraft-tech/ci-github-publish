function parseFailedJobs(rawValue, core) {
  if (!rawValue) {
    return [];
  }

  let parsed;
  try {
    parsed = JSON.parse(rawValue);
  } catch (error) {
    core.setFailed(`"failed-jobs" output is not a valid JSON: ${error}`);
    return [];
  }

  if (!Array.isArray(parsed)) {
    core.setFailed('Output "failed-jobs" expected to be a JSON array.');
    return [];
  }

  return parsed;
}

function buildFailureMessage({ htmlUrl, failedJobs }) {
  let message = `The deployment has failed. Please check the <a href="${htmlUrl}">logs</a> and try again.`;

  if (failedJobs.length > 0) {
    message += "\n\n\n### The following jobs have failed:\n";

    for (const { name, conclusion, html_url: jobUrl } of failedJobs) {
      message += `- **${name}**: [${conclusion}](${jobUrl})\n`;
    }
  }

  return message;
}

function buildSuccessMessage({ url, isIssueComment }) {
  let message = "";

  if (url) {
    message += `Here it is: <a href="${url}">${url}</a>\n\n\`\`\`\n${url}\n\`\`\`\n\n`;
  }

  if (isIssueComment) {
    message +=
      "Once the Pull Request gets merged or closed, the review app will automatically be deleted.\n\n";
  }

  return message;
}

function buildDeploymentResult({
  core,
  environment,
  htmlUrl,
  url,
  hasFailed,
  failedJobsRaw,
  isIssueComment,
}) {
  let state;
  let title;
  let message;
  let reaction;

  if (hasFailed) {
    state = "failure";
    title = `Failed to deploy${
      environment ? ` to <strong>${environment}</strong>` : ""
    } :confused: !`;

    const failedJobs = parseFailedJobs(failedJobsRaw, core);
    message = buildFailureMessage({ htmlUrl, failedJobs });
    reaction = "confused";
  } else {
    state = "success";
    title = `Successful deployment${
      environment ? ` to <strong>${environment}</strong>` : ""
    } :sparkles: !`;
    message = buildSuccessMessage({ url, isIssueComment });
    reaction = "rocket";
  }

  return {
    state,
    title,
    message,
    reaction,
  };
}

module.exports = { buildDeploymentResult };
