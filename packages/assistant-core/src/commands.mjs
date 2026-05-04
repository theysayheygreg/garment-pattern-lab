const clone = (value) => structuredClone(value);

const numberMm = (command) => {
  const match = command.match(/(\d+(?:\.\d+)?)\s*mm\b/i);
  return match ? Number(match[1]) : null;
};

export function interpretCommand(sourceCommand) {
  const normalized = sourceCommand.trim().toLowerCase();
  const amount = numberMm(normalized);

  if (!amount) {
    throw new Error(`Could not find a millimeter amount in command: "${sourceCommand}"`);
  }

  if (/\b(lengthen|extend|make longer)\b/.test(normalized) && /\b(hem|length|dress|tunic)\b/.test(normalized)) {
    return {
      id: "lengthen-hem",
      sourceCommand,
      summary: `Lengthen the garment hem by ${amount}mm.`,
      operations: [{ op: "increment", path: ["length"], value: amount, units: "mm" }],
    };
  }

  if (/\b(shorten|raise)\b/.test(normalized) && /\b(hem|length|dress|tunic)\b/.test(normalized)) {
    return {
      id: "shorten-hem",
      sourceCommand,
      summary: `Shorten the garment hem by ${amount}mm.`,
      operations: [{ op: "increment", path: ["length"], value: -amount, units: "mm" }],
    };
  }

  if (/\b(deepen|lower|open)\b/.test(normalized) && /\b(front neckline|neckline|neck)\b/.test(normalized)) {
    return {
      id: "deepen-front-neckline",
      sourceCommand,
      summary: `Deepen the front neckline by ${amount}mm.`,
      operations: [{ op: "increment", path: ["neckline", "frontDepth"], value: amount, units: "mm" }],
    };
  }

  if (/\b(raise|shallow|make shallower)\b/.test(normalized) && /\b(front neckline|neckline|neck)\b/.test(normalized)) {
    return {
      id: "raise-front-neckline",
      sourceCommand,
      summary: `Raise the front neckline by ${amount}mm.`,
      operations: [{ op: "increment", path: ["neckline", "frontDepth"], value: -amount, units: "mm" }],
    };
  }

  throw new Error(`Unsupported v0.1 edit command: "${sourceCommand}"`);
}

export function applyParameterEdit(baseParams, interpretedCommand) {
  const params = clone(baseParams);
  const appliedOperations = interpretedCommand.operations.map((operation) => {
    const target = operation.path.slice(0, -1).reduce((node, key) => node[key], params);
    const key = operation.path.at(-1);
    const before = target[key];
    const after = operation.op === "increment" ? before + operation.value : operation.value;
    target[key] = after;
    return { ...operation, before, after };
  });

  const intent = {
    ...interpretedCommand,
    operations: appliedOperations,
    status: "applied-to-parameters",
  };

  params.designerEdits = [...(params.designerEdits ?? []), intent];
  return { params, intent };
}

export function buildEditSummary(intent) {
  return `# Edit Summary

Command: ${intent.sourceCommand}

Interpretation: ${intent.summary}

Status: ${intent.status}

## Parameter Changes

| Path | Before | After | Units |
| --- | ---: | ---: | --- |
${intent.operations
  .map((operation) => `| ${operation.path.join(".")} | ${operation.before} | ${operation.after} | ${operation.units ?? ""} |`)
  .join("\n")}
`;
}
