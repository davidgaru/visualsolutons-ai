const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { createRoot } = require("react-dom/client");
const { renderToString } = require("react-dom/server");
const { JSDOM } = require("jsdom");

// Exercise the actual component using a DOM, controllable visibility and media APIs.
const file = path.resolve("components/ui/adaptive-video.tsx");
const loaded = new Module(file, module);
loaded.filename = file;
loaded.paths = Module._nodeModulePaths(process.cwd());
const originalRequire = loaded.require.bind(loaded);
loaded.require = (name) => name === "@/lib/media-manifest.json"
  ? require("../lib/media-manifest.json") : name === "@/lib/cms-media-manifest.json"
  ? require("../lib/cms-media-manifest.json") : originalRequire(name);
loaded._compile(ts.transpileModule(fs.readFileSync(file, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
}).outputText, file);
const { AdaptiveVideo } = loaded.exports;
const manifest = require("../lib/media-manifest.json");
const src = "/videos/WES_F02_V4.mp4";

function setup({ mobile = false, connection } = {}) {
  const dom = new JSDOM("<div id='root'></div>", { url: "http://localhost" });
  global.window = dom.window;
  global.document = dom.window.document;
  Object.defineProperty(global, "navigator", { configurable: true, value: dom.window.navigator });
  Object.defineProperty(navigator, "connection", { value: connection });
  Object.defineProperty(document, "hidden", { configurable: true, value: false });
  window.matchMedia = () => ({ matches: mobile });
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const observers = [];
  global.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    disconnect() {}
  };
  let plays = 0;
  let pauses = 0;
  dom.window.HTMLMediaElement.prototype.play = function () { plays++; return Promise.resolve(); };
  dom.window.HTMLMediaElement.prototype.pause = function () { pauses++; };
  const root = createRoot(document.getElementById("root"));
  return {
    root, observers, plays: () => plays, pauses: () => pauses,
    video: () => document.querySelector("video"),
    async render(props) { await React.act(async () => root.render(React.createElement(AdaptiveVideo, { src, autoPlay: true, muted: true, ...props }))); },
    async visible(value) { await React.act(async () => observers[0].callback([{ isIntersecting: value } ])); },
    async close() { await React.act(async () => root.unmount()); dom.window.close(); }
  };
}

test("no video payload is requested by server HTML or an offscreen player", async () => {
  assert.ok(manifest[src], "Generate media with python3 scripts/optimize-media.py first");
  const html = renderToString(React.createElement(AdaptiveVideo, { src, autoPlay: true }));
  assert.doesNotMatch(html, / src=/);
  const env = setup();
  await env.render();
  assert.equal(env.video().getAttribute("src"), null);
  assert.equal(env.video().getAttribute("preload"), "none");
  assert.equal(env.video().getAttribute("poster"), manifest[src].poster);
  await env.close();
});

for (const scenario of [
  { name: "desktop", options: {}, delivery: "desktop" },
  { name: "mobile", options: { mobile: true }, delivery: "compact" },
  { name: "data saver", options: { connection: { saveData: true } }, delivery: "compact" },
  { name: "slow desktop connection", options: { connection: { effectiveType: "3g" } }, delivery: "compact" },
  { name: "constrained 4G desktop connection", options: { connection: { effectiveType: "4g", downlink: 4 } }, delivery: "compact" }
]) {
  test(`${scenario.name}: selects correct footage when it enters view`, async () => {
    const env = setup(scenario.options);
    await env.render();
    await env.visible(true);
    assert.equal(env.video().getAttribute("src"), manifest[src][scenario.delivery]);
    assert.ok(env.plays() > 0);
    const pauses = env.pauses();
    await env.visible(false);
    assert.ok(env.pauses() > pauses);
    await env.close();
  });
}

test("hidden tabs pause playback and visible tabs resume", async () => {
  const env = setup();
  await env.render();
  await env.visible(true);
  const pauses = env.pauses();
  Object.defineProperty(document, "hidden", { value: true });
  document.dispatchEvent(new window.Event("visibilitychange"));
  assert.ok(env.pauses() > pauses);
  const plays = env.plays();
  Object.defineProperty(document, "hidden", { value: false });
  document.dispatchEvent(new window.Event("visibilitychange"));
  assert.ok(env.plays() > plays);
  await env.close();
});

test("cinema exposes a ready full-resolution source and forwards its video ref", async () => {
  const env = setup({ mobile: true });
  const ref = React.createRef();
  await env.render({ ref, autoPlay: false, fullResolution: true });
  assert.equal(ref.current, env.video());
  assert.equal(env.video().getAttribute("src"), manifest[src].desktop);
  assert.equal(env.plays(), 0, "manual playback must remain under the cinema controls");
  await env.close();
});

test("carousel source changes load the next delivery and respect manual playback", async () => {
  const env = setup({ mobile: true });
  await env.render({ autoPlay: false });
  await env.visible(true);
  assert.equal(env.plays(), 0);
  await env.render({ src: "/videos/LUB_F06_V2.mp4", autoPlay: true });
  assert.equal(env.video().getAttribute("src"), manifest["/videos/LUB_F06_V2.mp4"].compact);
  assert.ok(env.plays() > 0);
  await env.close();
});

test("CMS uploads retain their source and Sanity posters use delivery resizing", async () => {
  const env = setup();
  await env.render({ src: "https://cdn.sanity.io/files/project/production/film.mp4", poster: "https://cdn.sanity.io/images/project/production/photo.jpg" });
  await env.visible(true);
  assert.equal(env.video().getAttribute("src"), "https://cdn.sanity.io/files/project/production/film.mp4");
  assert.equal(new URL(env.video().poster).searchParams.get("w"), "960");
  await env.close();
});

test("optimized CMS uploads select compact delivery while cinema retains desktop quality", async () => {
  const [source, delivery] = Object.entries(require("../lib/cms-media-manifest.json"))[0] || [];
  assert.ok(source, "Generate CMS delivery files before testing");
  const env = setup({ mobile: true });
  await env.render({ src: source });
  await env.visible(true);
  assert.equal(env.video().getAttribute("src"), delivery.compact);
  await env.close();
  const cinema = setup({ mobile: true });
  await cinema.render({ src: source, fullResolution: true, autoPlay: false });
  assert.equal(cinema.video().getAttribute("src"), delivery.desktop);
  await cinema.close();
});
