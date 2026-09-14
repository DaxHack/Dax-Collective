#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const templateDir = path.join(root, 'n8n', 'templates');

const rows = [];

for (const file of fs.readdirSync(templateDir).filter((name) => name.endsWith('.json')).sort()) {
  const fullPath = path.join(templateDir, file);
  try {
    const workflow = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const nodeTypes = [...new Set((workflow.nodes || []).map((node) => node.type))].sort();
    const credentials = [
      ...new Set(
        (workflow.nodes || []).flatMap((node) =>
          Object.values(node.credentials || {}).map((credential) => credential.name || credential.id || 'unnamed'),
        ),
      ),
    ].sort();
    const triggers = (workflow.nodes || [])
      .filter((node) => /trigger|webhook/i.test(`${node.type} ${node.name}`))
      .map((node) => node.name);

    rows.push({
      file,
      name: workflow.name || '',
      active: workflow.active === true,
      nodes: (workflow.nodes || []).length,
      triggers,
      nodeTypes,
      credentials,
      status: classify(file, workflow, nodeTypes, credentials),
    });
  } catch (error) {
    rows.push({
      file,
      name: '',
      active: false,
      nodes: 0,
      triggers: [],
      nodeTypes: [],
      credentials: [],
      status: `BROKEN - invalid JSON: ${error.message}`,
    });
  }
}

function classify(file, workflow, nodeTypes, credentials) {
  if (file === 'workflow_12_data_collection_agent.json.json') return 'BROKEN - invalid JSON';
  if (/publisher/i.test(workflow.name || file)) return 'BLOCKED - publishing credentials and approval required';
  if (/ani.?dax/i.test(workflow.name || file)) {
    if (nodeTypes.includes('n8n-nodes-base.youTube')) {
      return 'WORKS WITH REPAIR - private draft upload only; add runtime approval/QC and credential checks';
    }
    return 'PARTIAL - generation template, needs credential verification and QC';
  }
  if (credentials.length > 0) return 'UNTESTED - needs credential verification';
  return 'UNTESTED - structure parses, runtime not verified';
}

const out = {
  generatedAt: new Date().toISOString(),
  templateCount: rows.length,
  rows,
};

const outPath = path.join(root, 'artifacts', 'n8n-inventory.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);

for (const row of rows) {
  console.log(JSON.stringify(row));
}
