const assert = require("node:assert/strict");
const { execFile } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { promisify } = require("node:util");
const vm = require("node:vm");
const sharp = require("sharp");

test("locked Jampack CLI processes CSS, JavaScript and local and remote images", async (t) => {
	const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "jampack-test-"));
	t.after(() => fs.rmSync(workspace, { recursive: true, force: true }));
	const siteDirectory = "static {site}";
	const sitePath = path.join(workspace, siteDirectory);
	fs.mkdirSync(sitePath);
	const png = await sharp({
		create: { width: 32, height: 24, channels: 3, background: "red" },
	})
		.png()
		.toBuffer();
	let requests = 0;
	const server = http.createServer((_request, response) => {
		requests++;
		response.writeHead(200, { "Content-Type": "image/png" });
		response.end(png);
	});
	t.after(() => {
		server.closeAllConnections();
		server.close();
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	const remoteImage = `http://127.0.0.1:${server.address().port}/remote.png`;
	fs.writeFileSync(path.join(sitePath, "local.png"), png);
	fs.writeFileSync(
		path.join(sitePath, "index.html"),
		`<!doctype html><html><head><meta charset="utf-8"><title>Test site</title></head><body><h1>Test site</h1><img src="local.png" alt="Local"><img src="${remoteImage}" alt="Remote"></body></html>`,
	);
	fs.writeFileSync(path.join(sitePath, "style.css"), "body { color: red; }\n");
	fs.writeFileSync(
		path.join(sitePath, "script.js"),
		"globalThis.result = [1, 2, 3].map((value) => value * 2).join(',');\n",
	);
	fs.writeFileSync(
		path.join(workspace, "jampack.config.mjs"),
		'export default { image: { embed_size: 0, external: { process: "download" } } };\n',
	);
	const cliPath = path.join(__dirname, "node_modules", ".bin", "jampack");

	await promisify(execFile)(
		process.execPath,
		[
			cliPath,
			"--fail",
			"--cache_folder",
			path.join(workspace, "cache folder"),
			"--",
			siteDirectory,
		],
		{ cwd: workspace, encoding: "utf8", timeout: 30_000 },
	);

	assert.equal(
		fs.readFileSync(path.join(sitePath, "style.css"), "utf8").trim(),
		"body{color:red}",
	);
	const context = {};
	vm.runInNewContext(
		fs.readFileSync(path.join(sitePath, "script.js"), "utf8"),
		context,
	);
	assert.equal(context.result, "2,4,6");
	const html = fs.readFileSync(path.join(sitePath, "index.html"), "utf8");
	assert.match(html, /<h1>Test site<\/h1>/);
	assert.equal(requests, 1);
	assert.ok(
		!html.includes(remoteImage),
		"Remote image must be downloaded locally",
	);
	const images = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)];
	assert.equal(images.length, 2);
	for (const [, src] of images) {
		const metadata = await sharp(path.join(sitePath, src)).metadata();
		assert.equal(metadata.width, 32);
		assert.equal(metadata.height, 24);
	}
});
