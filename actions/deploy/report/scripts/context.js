async function getDeploymentContext({
  github,
  context,
  environment,
  deploymentEnvironment,
  url,
  eventName,
  hasFailed,
  failedJobs,
  extra,
}) {
  const trimmedDeploymentEnvironment = (deploymentEnvironment || "").trim();
  const trimmedInputEnvironment = (environment || "").trim();

  const resolvedEnvironment =
    trimmedDeploymentEnvironment || trimmedInputEnvironment || "";
  const resolvedUrl = url ? url : null;
  const isIssueComment = (eventName || "") === "issue_comment";

  const {
    data: { html_url: htmlUrl },
  } = await github.rest.actions.getWorkflowRun({
    owner: context.repo.owner,
    repo: context.repo.repo,
    run_id: context.runId,
  });

  return {
    environment: resolvedEnvironment,
    url: resolvedUrl,
    isIssueComment,
    htmlUrl,
    hasFailed: String(hasFailed || "").toLowerCase() === "true",
    failedJobsRaw: failedJobs || "",
    extraRaw: extra || "",
    workflowName: context.workflow,
  };
}

module.exports = { getDeploymentContext };
