const { getDeploymentContext } = require("./context");
const { buildDeploymentResult } = require("./result");
const { buildSummaryList } = require("./summary");

async function run({
  github,
  context,
  core,
  environment,
  deploymentEnvironment,
  url,
  eventName,
  hasFailed,
  failedJobs,
  extra,
}) {
  const deploymentContext = await getDeploymentContext({
    github,
    context,
    environment,
    deploymentEnvironment,
    url,
    eventName,
    hasFailed,
    failedJobs,
    extra,
  });

  const deploymentUrl = deploymentContext.url ?? null;
  core.setOutput("url", deploymentUrl);

  if (deploymentContext.isIssueComment) {
    core.setOutput("is-issue-comment", true);
  }

  const result = buildDeploymentResult({ core, ...deploymentContext });

  core.setOutput("state", result.state);
  core.setOutput("title", result.title);
  core.setOutput("message", result.message);
  core.setOutput("reaction", result.reaction);

  const summaryList = buildSummaryList({ core, ...deploymentContext });

  await core.summary
    .addHeading(
      `Deployment summary${
        deploymentContext.environment
          ? ` - ${deploymentContext.environment}`
          : ""
      }`,
      2,
    )
    .addRaw(result.title, true)
    .addBreak()
    .addBreak()
    .addRaw(result.message, false)
    .addSeparator()
    .addList(summaryList)
    .write();
}

module.exports = run;
