function formatLabel(key) {
  if (!key) {
    return "";
  }

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function createSummaryHelper(core) {
  const summary = core.summary;

  function withTemporaryBuffer(callback) {
    const previousBuffer = summary.stringify();
    summary.emptyBuffer();

    let result = "";

    try {
      callback(summary);
      result = summary.stringify().replace(/\r?\n$/, "");
    } finally {
      summary.emptyBuffer();
      summary.addRaw(previousBuffer);
    }

    return result;
  }

  function list(items, ordered = false) {
    const normalizedItems = (Array.isArray(items) ? items : [items])
      .filter((item) => item !== undefined && item !== null)
      .map((item) => String(item));

    if (!normalizedItems.length) {
      return "-";
    }

    return withTemporaryBuffer((summaryInstance) => {
      summaryInstance.addList(normalizedItems, ordered);
    });
  }

  function concat(chunks) {
    return withTemporaryBuffer((summaryInstance) => {
      for (const chunk of chunks) {
        if (chunk === undefined || chunk === null) {
          continue;
        }

        summaryInstance.addRaw(String(chunk));
      }
    });
  }

  function link(text, href) {
    if (!href) {
      return String(text || "-");
    }

    return withTemporaryBuffer((summaryInstance) => {
      summaryInstance.addLink(String(text || href), String(href));
    });
  }

  return { list, concat, link };
}

function getSummaryHelpers(core) {
  const helpers = createSummaryHelper(core);

  if (!helpers) {
    const message =
      "core.summary is not available or missing required methods.";

    return core.setFailed(message);
  }

  return helpers;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function formatScalar(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value);
}

function formatNestedItem(label, value, helpers) {
  const formattedValue = formatValue(value, helpers);
  if (!label) {
    return formattedValue;
  }

  return helpers.concat([`${label}: `, formattedValue]);
}

function formatArray(items, helpers) {
  if (!items.length) {
    return "-";
  }

  const listItems = items.map((item, index) =>
    formatNestedItem(`Item ${index + 1}`, item, helpers),
  );

  return helpers.list(listItems);
}

function formatObject(value, helpers) {
  const entries = Object.entries(value);

  if (!entries.length) {
    return "-";
  }

  const listItems = entries.map(([childKey, childValue]) =>
    formatNestedItem(formatLabel(childKey), childValue, helpers),
  );

  return helpers.list(listItems);
}

function formatValue(value, helpers) {
  if (Array.isArray(value)) {
    return formatArray(value, helpers);
  }

  if (isPlainObject(value)) {
    return formatObject(value, helpers);
  }

  return formatScalar(value);
}

function buildSummaryItem(key, value, helpers) {
  return formatNestedItem(formatLabel(key), value, helpers);
}

function parseExtra(extraRaw, core) {
  if (!extraRaw) {
    return null;
  }

  let parsed;
  try {
    parsed = JSON.parse(extraRaw);
  } catch (error) {
    core.setFailed(`"extra" input is not a valid JSON: ${error}`);
    return null;
  }

  if (!parsed || typeof parsed !== "object") {
    core.warning('"extra" input is not a valid JSON object.');
    return null;
  }

  return parsed;
}

function buildSummaryList({
  core,
  environment,
  htmlUrl,
  workflowName,
  extraRaw,
}) {
  const helpers = getSummaryHelpers(core);

  const summaryList = [
    helpers.concat(["Logs: ", helpers.link(workflowName, htmlUrl)]),
  ];

  if (environment) {
    summaryList.unshift(helpers.concat(["Environment: ", environment]));
  }

  const extra = parseExtra(extraRaw, core);
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      summaryList.push(buildSummaryItem(key, value, helpers));
    }
  }

  return summaryList;
}

module.exports = { buildSummaryList };
