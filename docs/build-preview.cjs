const fs = require("fs");
const path = require("path").join(__dirname, "..");
const code = fs.readFileSync(path + "/lib/client.js", "utf8");
const at = code.indexOf("const CSS = `");
const css = code.slice(at + "const CSS = `".length, code.indexOf("`;", at));

const tokens = `
:root{
  --dsw-alias-label-primary:#f5f6f7;
  --dsw-alias-label-secondary:#adb2b8;
  --dsw-alias-label-tertiary:#979da6;
  --dsw-alias-label-caption:#979da6;
  --dsw-alias-label-dimmed:#43454a;
  --dsw-alias-border-l1:#ffffff0f;
  --dsw-alias-border-l2:#ffffff1f;
  --dsw-alias-border-l3:#ffffff29;
  --dsw-alias-bg-layer-2:#2c2c2e;
  --dsw-alias-bg-module-platform:#353638;
  --dsw-alias-interactive-bg-hover:#ffffff14;
  --dsw-alias-state-business-primary:#4d93f8;
  --dsw-alias-state-error-primary:#f25a5a;
  --dsw-alias-switch-thumb:#adb2b8;
  --dsw-static-deepseek-400:#7aaaff;
  --dsw-static-deepseek-500:#4176e6;
  --dsw-static-blue-300:#93c5fd;
  --dsw-static-blue-400:#60a5fa;
  --dsw-radius-sm:8px;--dsw-radius-md:12px;--dsw-radius-lg:16px;--dsw-radius-xl:20px;
  --dsw-elevation-prominent:0 0 0 .5px #ffffff29,0 3px 8px #0000000a,0 0 20px #0000000d;
  --dsw-specific-menu:#43454a73;
  --dsw-menu-backdrop-filter:blur(40px) saturate(150%);
  --dsw-focus-ring-color:#4d93f8;
  --dsw-font-family:"Segoe UI","Microsoft YaHei",system-ui,sans-serif;
}
body{
  margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(120% 90% at 20% 0%,#3b2a63 0%,#191423 45%,#0e0d12 100%);
  font-family:var(--dsw-font-family);
}
.stage{display:flex;flex-direction:column;gap:10px;padding:28px;}
.composer{display:flex;align-items:center;justify-content:flex-end;height:46px;padding:0 10px;border-radius:16px;background:#232325;box-shadow:0 0 0 .5px #ffffff1f;}
`;

const check = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const chevron = `<svg class="dep-seat-chevron" width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6.5l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const row = (name, selected) =>
  `<button type="button" class="dep-model" data-selected="${selected ? "true" : "false"}"><span class="dep-model-name">${name}</span>${selected ? `<span class="dep-check">${check}</span>` : ""}</button>`;

const page = (dark) => `<!doctype html><html><head><meta charset="utf-8"><style>
${tokens.replace("--dsw-specific-menu:#43454a73;", dark ? "--dsw-specific-menu:#43454a73;" : "--dsw-specific-menu:#f8f9faf0;")}
${dark ? "" : `body{background:radial-gradient(120% 90% at 20% 0%,#d8c8f0 0%,#eee9f7 45%,#f7f5fb 100%);} .composer{background:#fff;box-shadow:0 0 0 .5px #0000001a;} :root{--dsw-alias-label-primary:#0f0f0f;--dsw-alias-label-secondary:#545557;--dsw-alias-label-caption:#81858c;--dsw-alias-border-l1:#0000000a;--dsw-alias-border-l2:#0000001a;--dsw-alias-bg-module-platform:#ebeef2;--dsw-alias-interactive-bg-hover:#2631480f;--dsw-alias-label-dimmed:#dcdcdc;--dsw-elevation-prominent:0 0 0 .5px #00000029,0 3px 8px #0000000a,0 0 20px #0000000d;}`}
${css}
.dep-panel{position:static !important;width:308px;animation:none !important;}
</style></head><body><div class="stage">
<div class="composer"><button type="button" class="dep-seat"><span class="dep-seat-model">deepseek-flash</span><span class="dep-seat-effort">High</span>${chevron}</button></div>
<div class="dep-panel" role="dialog">
  <div class="dep-head"><span class="dep-head-title">模型</span></div>
  <div class="dep-models">
    <div class="dep-group">DeepSeek</div>
    ${row("deepseek-flash", true)}
    ${row("deepseek-reasoner", false)}
   ${row("deepseek-chat", false)}
  </div>
  <div class="dep-effort">
    <div class="dep-effort-head"><span class="dep-effort-label">思考强度</span><span class="dep-effort-value">High</span></div>
    <div class="dep-slider" role="slider" aria-valuemin="0" aria-valuemax="3" aria-valuenow="2" aria-valuetext="High">
      <div class="dep-rail">
        <div class="dep-track"><div class="dep-fill" style="width:calc(66.67% - 3px)"><div class="dep-spark dep-spark-slow"></div><div class="dep-spark"></div></div></div>
        <div class="dep-thumb" style="left:clamp(14px, 66.67%, calc(100% - 14px))"></div>
      </div>
    </div>
    <div class="dep-stops"><span>Off</span><span>Low</span><span data-active="true">High</span><span>Max</span></div>
  </div>
  <div class="dep-stats">
    <div class="dep-stat"><span class="dep-stat-k">本会话</span><span class="dep-stat-v">12.6k tokens</span></div>
    <div class="dep-stat"><span class="dep-stat-k">余额</span><span class="dep-stat-v">CNY 1.84</span></div>
    <span class="dep-ver">v${require(path + "/package.json").version}</span>
  </div>
</div>
</div></body></html>`;

fs.mkdirSync(path + "/docs", { recursive: true });
fs.writeFileSync(path + "/docs/preview-dark.html", page(true));
fs.writeFileSync(path + "/docs/preview-light.html", page(false));
console.log("wrote preview pages");
