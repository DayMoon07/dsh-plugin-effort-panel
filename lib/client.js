window.__ModuleLoader__.load({
	id: "dsh-plugin-effort-panel",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const React = require("react");
		const { jsx, jsxs, Fragment } = require("react/jsx-runtime");
		const { createPortal } = require("react-dom");

		const PLUGIN = "dsh-plugin-effort-panel";
		const SLOT = "conversation.input.model";
		const VERSION = "v0.4.7";
		const DSH_VERSION = (() => {
			try {
				const boot = globalThis.__DSH_BOOT__;
				const release = boot !== void 0 && boot !== null ? boot.release : void 0;
				if (release !== void 0 && release !== null && typeof release.version === "string" && release.version !== "") return release.version;
			} catch (_) {
				/* fall through to the known-good build */
			}
			return "0.2.2-rc.1";
		})();
		const NS = PLUGIN + "/styles/" + VERSION;

		const COPY = {
			models: "模型",
			effort: "思考强度",
			fallback: "选择模型",
			loading: "加载中…",
			empty: "暂无可用模型",
			failed: "切换失败，请重试",
			dialog: "模型与思考强度",
			noEffort: "该模型未提供思考强度",
			session: "本会话",
			balance: "余额",
		};

		const ONE = 1;
		const NO_STORE = {
			subscribe: () => () => {},
			getSnapshot: () => null,
		};

		const CSS = `
.dep-seat{display:flex;align-items:center;gap:4px;min-width:0;max-width:min(360px,45cqw);height:28px;padding:0 4px 0 8px;border:none;outline:none;background:0 0;border-radius:var(--dsw-radius-sm);color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;font-weight:400;line-height:20px;cursor:pointer}
.dep-seat:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.dep-seat:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.dep-seat:focus-visible{box-shadow:0 0 0 2px var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary))}
.dep-seat-model{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dep-seat-effort{flex-shrink:1000;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-caption)}
.dep-seat-chevron{flex:none;opacity:.65}

.dep-panel{position:fixed;z-index:1100;box-sizing:border-box;display:flex;flex-direction:column;padding:10px;border:0;border-radius:var(--dsw-radius-panel,28px) !important;background:color-mix(in srgb,var(--dsw-alias-bg-layer-2,#232325) 92%,transparent);-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter);backdrop-filter:var(--dsw-menu-backdrop-filter);box-shadow:var(--dsw-elevation-prominent),0 0 0 1px var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;outline:none;overflow:hidden;transform-origin:bottom center;animation:dep-in .16s cubic-bezier(.2,.8,.2,1)}
.dep-panel::before{content:"";position:absolute;left:0;right:0;top:0;height:84px;pointer-events:none;background:radial-gradient(120% 90% at 50% -30%,color-mix(in srgb,var(--dsw-static-deepseek-500) 8%,transparent),transparent 72%)}
@keyframes dep-in{from{opacity:0;transform:translateY(6px) scale(.985)}to{opacity:1;transform:none}}

.dep-head{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 10px 4px}
.dep-head-title{font-size:11px;line-height:14px;letter-spacing:.04em;color:var(--dsw-alias-label-caption);text-transform:uppercase}

.dep-models{position:relative;display:flex;flex-direction:column;gap:2px;max-height:min(228px,36vh);overflow-y:auto;overscroll-behavior:contain;padding:2px}
.dep-models::-webkit-scrollbar{width:6px}
.dep-models::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l2);border-radius:3px}
.dep-group{padding:8px 8px 2px;font-size:11px;line-height:14px;color:var(--dsw-alias-label-caption);opacity:.75}
.dep-model{display:flex;align-items:center;gap:8px;width:100%;min-height:36px;padding:0 10px;border:none;background:0 0;border-radius:calc(var(--dsw-radius-md) + 2px);color:var(--dsw-alias-label-secondary);font:inherit;text-align:left;cursor:pointer;transition:background .12s ease,color .12s ease}
.dep-model:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dep-model[data-selected="true"]{color:var(--dsw-alias-label-primary);background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 8%,transparent)}
.dep-model:focus-visible{outline:none;box-shadow:inset 0 0 0 2px var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary))}
.dep-model-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dep-check{flex:none;display:flex;color:var(--dsw-alias-state-business-primary)}

.dep-effort{position:relative;margin-top:4px;padding:2px 2px 0;border-radius:18px;background:transparent;box-shadow:none}
.dep-effort-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.dep-effort-label{font-size:11px;line-height:14px;color:var(--dsw-alias-label-caption);letter-spacing:.02em}
.dep-effort-value{font-size:12px;line-height:16px;font-weight:500;color:var(--dsw-alias-label-primary)}

.dep-slider{position:relative;height:60px;margin-top:6px;padding:0 8px;cursor:pointer;touch-action:none;border-radius:999px;outline:none}
.dep-slider:focus-visible{box-shadow:0 0 0 2px var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary))}
.dep-slider[data-disabled="true"]{cursor:default;opacity:.6}
.dep-rail{position:relative;height:100%}
.dep-track{position:absolute;left:0;right:0;top:50%;height:28px;margin-top:-14px;border-radius:999px;background:var(--dsw-alias-bg-module-platform);overflow:hidden;box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l2),inset 0 2px 6px rgba(0,0,0,.28)}
.dep-fill{position:absolute;left:3px;top:3px;bottom:3px;border-radius:999px 0 0 999px;background:linear-gradient(180deg,rgba(255,255,255,.24),rgba(255,255,255,0) 50%),linear-gradient(90deg,#2f5cff,#3f8bff 45%,#59d5ff 82%,#67e8f9);box-shadow:0 0 30px rgba(63,139,255,.7),0 0 60px rgba(63,139,255,.35),inset 0 1px 0 rgba(255,255,255,.4);transition:width .42s cubic-bezier(.4,0,.2,1),opacity .24s ease;overflow:hidden}
.dep-fill::after{display:none}
@keyframes dep-sheen{from{background-position:180% 0}to{background-position:-80% 0}}
.dep-spark{position:absolute;inset:0;pointer-events:none;background-repeat:repeat;background-image:radial-gradient(2.1px 2.1px at 18% 36%,rgba(255,255,255,.95),transparent 62%),radial-gradient(1.6px 1.6px at 64% 66%,rgba(228,248,255,.9),transparent 62%),radial-gradient(2.5px 2.5px at 34% 28%,rgba(255,255,255,.85),transparent 62%),radial-gradient(1.5px 1.5px at 82% 70%,rgba(205,240,255,.8),transparent 62%),radial-gradient(1.9px 1.9px at 8% 64%,rgba(255,255,255,.8),transparent 62%),radial-gradient(2.3px 2.3px at 52% 46%,rgba(235,250,255,.88),transparent 62%),radial-gradient(1.4px 1.4px at 26% 74%,rgba(255,255,255,.75),transparent 62%),radial-gradient(2px 2px at 70% 22%,rgba(220,245,255,.82),transparent 62%),radial-gradient(1.7px 1.7px at 44% 58%,rgba(255,255,255,.7),transparent 62%),radial-gradient(2.2px 2.2px at 88% 44%,rgba(210,240,255,.78),transparent 62%);background-size:56px 100%,68px 100%,88px 100%,74px 100%,104px 100%,120px 100%,62px 100%,96px 100%,78px 100%,132px 100%;animation:dep-drift 1.45s linear infinite}
.dep-spark-slow{position:absolute;inset:0;pointer-events:none;opacity:.55;background-repeat:repeat;background-image:radial-gradient(4px 4px at 30% 48%,rgba(210,240,255,.6),transparent 70%),radial-gradient(6px 6px at 74% 42%,rgba(190,230,255,.42),transparent 72%),radial-gradient(5px 5px at 52% 66%,rgba(200,235,255,.5),transparent 71%);background-size:148px 100%,210px 100%,176px 100%;animation:dep-drift-slow 3.7s linear infinite}
@keyframes dep-drift{from{background-position:0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0}to{background-position:56px 0,68px 0,88px 0,74px 0,104px 0,120px 0,62px 0,96px 0,78px 0,132px 0}}
@keyframes dep-drift-slow{from{background-position:0 0,0 0,0 0}to{background-position:148px 0,210px 0,176px 0}}
.dep-thumb{position:absolute;z-index:2;top:50%;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.34),0 0 0 .5px rgba(0,0,0,.12),0 0 0 4px color-mix(in srgb,var(--dsw-static-deepseek-400) 20%,transparent),0 0 26px color-mix(in srgb,var(--dsw-static-blue-400) 70%,transparent),0 0 48px color-mix(in srgb,var(--dsw-static-blue-400) 35%,transparent);transition:left .42s cubic-bezier(.4,0,.2,1),transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease}
.dep-slider[data-dragging="true"] .dep-thumb{transform:scale(1.14);transition:left .24s cubic-bezier(.22,.61,.36,1),transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease}
.dep-slider[data-dragging="true"] .dep-fill{transition:width .24s cubic-bezier(.22,.61,.36,1)}


.dep-slider[data-settling="true"] .dep-thumb{transform:scale(1.06);box-shadow:0 1px 4px rgba(0,0,0,.34),0 0 0 .5px rgba(0,0,0,.12),0 0 0 4px color-mix(in srgb,var(--dsw-static-deepseek-400) 24%,transparent),0 0 32px color-mix(in srgb,var(--dsw-static-blue-400) 80%,transparent),0 0 60px color-mix(in srgb,var(--dsw-static-blue-400) 42%,transparent)}
.dep-slider:not([data-dragging="true"]) .dep-fill{transition:width .42s cubic-bezier(.4,0,.2,1)}
.dep-stops{display:flex;justify-content:space-between;gap:4px;margin:2px 8px 0;font-size:10px;line-height:14px;color:var(--dsw-alias-label-caption)}
.dep-stops span{max-width:26%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;transition:color .12s ease}
.dep-stops span[data-active="true"]{color:var(--dsw-alias-label-primary)}

.dep-stats{display:flex;align-items:center;gap:10px;margin-top:8px;padding:8px 10px 4px;border-top:1px solid transparent;border-image:linear-gradient(90deg,transparent,var(--dsw-alias-border-l2),transparent) 1}
.dep-stat{display:flex;align-items:baseline;gap:5px;min-width:0}
.dep-stat-k{font-size:10px;line-height:14px;color:var(--dsw-alias-label-caption);opacity:.8}
.dep-stat-v{font-size:11px;line-height:14px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dep-stat-v[data-loading="true"]{opacity:.5}
.dep-ver{margin-left:auto;font-size:9px;line-height:14px;letter-spacing:.06em;color:var(--dsw-alias-label-caption);opacity:.45;font-variant-numeric:tabular-nums}
.dep-note{padding:2px 10px 4px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-caption)}
.dep-error{padding:2px 10px 4px;font-size:11px;line-height:16px;color:var(--dsw-alias-state-error-primary)}
.dep-track,.dep-fill,.dep-thumb,.dep-spark,.dep-stat,.dep-seat,.dep-slider{corner-shape:round !important}
.dep-panel,.dep-model,.dep-effort{corner-shape:squircle !important;corner-shape:superellipse(1.5) !important}
@media (prefers-reduced-motion:reduce){.dep-panel{animation:none}.dep-thumb{transition:none}.dep-fill{transition:none}}
`;

		function ensureStyle() {
			if (typeof document === "undefined") return;
			if (document.querySelector('style[data-plugin-css="' + NS + '"]') !== null) return;
			const tag = document.createElement("style");
			tag.dataset.plugin = PLUGIN;
			tag.dataset.pluginCss = NS;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}

		function clamp(value, low, high) {
			return Math.min(high, Math.max(low, value));
		}

		function modelOf(state) {
			const current = state.current;
			if (!current) return void 0;
			const groups = state.groups || [];
			for (const group of groups) {
				if (group.id !== current.provider) continue;
				for (const model of group.models || []) {
					if (model.id === current.model) return { group, model };
				}
			}
			return void 0;
		}

		function effortsOf(state) {
			const found = modelOf(state);
			const reasoning = found === void 0 ? void 0 : found.model.reasoning;
			if (reasoning === void 0 || !Array.isArray(reasoning.efforts)) return [];
			return reasoning.efforts;
		}

		function effortOf(state) {
			const found = modelOf(state);
			const reasoning = found === void 0 ? void 0 : found.model.reasoning;
			const current = state.current;
			return (current && current.reasoningEffort) || (reasoning && reasoning.defaultEffort) || void 0;
		}

		function labelOf(efforts, id, fallback) {
			if (id === void 0) return fallback;
			for (const level of efforts) if (level.id === id) return level.name || id;
			return fallback;
		}

		function compact(value) {
			if (typeof value !== "number" || !isFinite(value)) return null;
			if (value < 1000) return String(Math.round(value));
			if (value < 1e6) return (value / 1000).toFixed(value < 1e4 ? 1 : 0) + "k";
			return (value / 1e6).toFixed(1) + "M";
		}

		/** Total tokens of one session's usage snapshot, when the projection exposes it. */
		function usageField(value) {
			return typeof value === "number" && Number.isFinite(value) ? value : 0;
		}

		function usageBreakdown(usage) {
			if (usage === null || usage === void 0 || typeof usage !== "object") return null;
			const parts = {
				uncached: usageField(usage.uncachedInputTokens),
				cacheRead: usageField(usage.cacheReadTokens),
				cacheWrite: usageField(usage.cacheWriteTokens),
				output: usageField(usage.outputTokens),
			};
			const total = parts.uncached + parts.cacheRead + parts.cacheWrite + parts.output;
			if (total > 0) return Object.assign({ total }, parts);
			const legacy = usageField(usage.inputTokens) + usageField(usage.totalTokens);
			if (legacy > 0) return { total: legacy, uncached: usageField(usage.inputTokens), cacheRead: 0, cacheWrite: 0, output: usageField(usage.outputTokens) };
			return null;
		}

		function usageTotal(usage) {
			const breakdown = usageBreakdown(usage);
			return breakdown === null ? null : breakdown.total;
		}

		/** First wallet of an account balance payload: `{status, value: [{currency, balance}]}`. */
		function walletOf(balance) {
			if (balance === null || balance === void 0) return null;
			if (balance.status !== void 0 && balance.status !== "ready") return null;
			const value = balance.value;
			let wallets = [];
			if (Array.isArray(value)) wallets = value;
			else if (value !== null && value !== void 0 && Array.isArray(value.value)) wallets = value.value;
			else if (value !== null && value !== void 0 && Array.isArray(value.normal_wallets)) wallets = value.normal_wallets;
			else if (Array.isArray(balance.normal_wallets)) wallets = balance.normal_wallets;
			const wallet = wallets[0];
			if (wallet === void 0 || wallet === null) return null;
			const raw = wallet.balance ?? wallet.amount ?? wallet.value;
			if (raw === void 0 || raw === null || raw === "") return null;
			const numeric = Number(raw);
			return {
				amount: isFinite(numeric) ? numeric.toFixed(2) : String(raw),
				currency: wallet.currency || "",
			};
		}

		const CHECK = jsx("svg", {
			width: 14,
			height: 14,
			viewBox: "0 0 16 16",
			fill: "none",
			"aria-hidden": "true",
			children: jsx("path", {
				d: "M3.5 8.5l3 3 6-7",
				stroke: "currentColor",
				strokeWidth: 1.6,
				strokeLinecap: "round",
				strokeLinejoin: "round",
			}),
		});

		const CHEVRON = jsx("svg", {
			className: "dep-seat-chevron",
			width: 12,
			height: 12,
			viewBox: "0 0 16 16",
			fill: "none",
			"aria-hidden": "true",
			children: jsx("path", {
				d: "M4 6.5l4 4 4-4",
				stroke: "currentColor",
				strokeWidth: 1.5,
				strokeLinecap: "round",
				strokeLinejoin: "round",
			}),
		});

		function Seat(props) {
			const { locked, available, directory, load, select, usageOf, balanceOf, sessionId } = props;
			const subscribe = React.useCallback((notify) => directory.subscribe(notify), [directory]);
			const snapshot = React.useCallback(() => directory.getSnapshot(), [directory]);
			const state = React.useSyncExternalStore(subscribe, snapshot, snapshot);

			const usageRef = React.useRef(usageOf);
			usageRef.current = usageOf;
			const balanceRef = React.useRef(balanceOf);
			balanceRef.current = balanceOf;
			const [usage, setUsage] = React.useState(null);

			const [open, setOpen] = React.useState(false);
			const [pos, setPos] = React.useState(null);
			const [optimistic, setOptimistic] = React.useState(null);
			const [error, setError] = React.useState(null);
			const [dragging, setDragging] = React.useState(false);
			const [settling, setSettling] = React.useState(false);
			const settleTimer = React.useRef(0);
			const [balance, setBalance] = React.useState(void 0);

			const seatRef = React.useRef(null);
			const panelRef = React.useRef(null);
			const railRef = React.useRef(null);
			const inFlight = React.useRef(false);
			const queued = React.useRef(null);

			const found = modelOf(state);
			const efforts = effortsOf(state);
			const storeEffort = effortOf(state);
			const effort = optimistic === null ? storeEffort : optimistic;
			let index = efforts.findIndex((level) => level.id === effort);
			if (index < 0) index = 0;
			const last = Math.max(0, efforts.length - 1);
			const pct = last === 0 ? 100 : (index / last) * 100;

			const modelName = found === void 0 ? void 0 : found.model.name || found.model.id;
			const effortName = labelOf(efforts, effort, state.retainedEffort);
			const triggerText = modelName === void 0 ? (state.status === "loading" ? COPY.loading : COPY.fallback) : modelName;

			React.useEffect(() => {
				if (optimistic !== null && storeEffort === optimistic) setOptimistic(null);
			}, [storeEffort, optimistic]);

			React.useEffect(() => {
				if (!open) return;
				load();
			}, [open]);

			React.useEffect(() => {
				if (!open) return;
				try {
					const value = usageRef.current === void 0 ? null : usageRef.current(sessionId);
					setUsage(value === void 0 ? null : value);
				} catch (_) {
					setUsage(null);
				}
			}, [open, sessionId]);

			React.useEffect(() => {
				if (!open) return;
				const read = balanceRef.current;
				if (read === void 0) return;
				let dead = false;
				setBalance(void 0);
				read().then(
					(value) => {
						if (!dead) setBalance(value);
					},
					() => {
						if (!dead) setBalance(null);
					},
				);
				return () => {
					dead = true;
				};
			}, [open]);

			const place = React.useCallback(() => {
				const el = seatRef.current;
				if (el === null) return;
				const rect = el.getBoundingClientRect();
				const width = Math.min(304, Math.max(244, window.innerWidth - 24));
				const left = clamp(rect.right - width, 12, Math.max(12, window.innerWidth - width - 12));
				const bottom = Math.min(window.innerHeight - 12, window.innerHeight - rect.top + 8);
				setPos({ left, bottom, width });
			}, []);

			React.useEffect(() => {
				if (!open) return;
				place();
				const onResize = () => place();
				window.addEventListener("resize", onResize);
				window.addEventListener("scroll", onResize, true);
				return () => {
					window.removeEventListener("resize", onResize);
					window.removeEventListener("scroll", onResize, true);
				};
			}, [open, place]);

			React.useEffect(() => {
				if (!open) return;
				const onDown = (event) => {
					const target = event.target;
					if (!(target instanceof Node)) return;
					if (panelRef.current !== null && panelRef.current.contains(target)) return;
					if (seatRef.current !== null && seatRef.current.contains(target)) return;
					setOpen(false);
				};
				const onKey = (event) => {
					if (event.key === "Escape") {
						event.stopPropagation();
						setOpen(false);
					}
				};
				document.addEventListener("pointerdown", onDown, true);
				document.addEventListener("keydown", onKey, true);
				const timer = window.setTimeout(() => {
					if (panelRef.current !== null) panelRef.current.focus({ preventScroll: true });
				}, 0);
				return () => {
					window.clearTimeout(timer);
					document.removeEventListener("pointerdown", onDown, true);
					document.removeEventListener("keydown", onKey, true);
				};
			}, [open]);

			React.useEffect(() => {
				if (!open) return;
				const rail = railRef.current;
				if (rail === null) return;
				const target = 1 + Math.max(0, index - 1) * 0.55;
				const nodes = rail.querySelectorAll(".dep-spark, .dep-spark-slow");
				const animations = [];
				for (const node of nodes) {
					if (typeof node.getAnimations !== "function") continue;
					for (const animation of node.getAnimations()) animations.push(animation);
				}
				if (animations.length === 0) return;
				let raf = 0;
				const rates = animations.map((animation) => (typeof animation.playbackRate === "number" ? animation.playbackRate : 1));
				const tick = () => {
					let moving = false;
					animations.forEach((animation, i) => {
						const next = rates[i] + (target - rates[i]) * 0.16;
						rates[i] = next;
						try {
							animation.playbackRate = next;
						} catch (_) {
							/* playbackRate is best effort */
						}
						if (Math.abs(target - next) > 0.01) moving = true;
					});
					if (moving) raf = window.requestAnimationFrame(tick);
				};
				raf = window.requestAnimationFrame(tick);
				return () => window.cancelAnimationFrame(raf);
			}, [open, index]);

			const commit = (id) => {
				const current = state.current;
				if (!current) return;
				setOptimistic(id);
				setError(null);
				queued.current = id === void 0 ? "" : id;
				const pump = () => {
					if (inFlight.current) return;
					const target = queued.current;
					if (target === null) return;
					queued.current = null;
					inFlight.current = true;
					const selection = { provider: current.provider, model: current.model };
					if (target !== "") selection.reasoningEffort = target;
					select(selection).then(
						(ok) => {
							inFlight.current = false;
							if (!ok) {
								setOptimistic(null);
								setError(COPY.failed);
								return;
							}
							if (queued.current !== null) pump();
						},
						() => {
							inFlight.current = false;
							setOptimistic(null);
							setError(COPY.failed);
						},
					);
				};
				pump();
			};

			const pickModel = (group, model) => {
				const levels = model.reasoning && Array.isArray(model.reasoning.efforts) ? model.reasoning.efforts : [];
				const keep = effort !== void 0 && levels.some((level) => level.id === effort) ? effort : void 0;
				const next = keep !== void 0 ? keep : model.reasoning && model.reasoning.defaultEffort;
				const selection = { provider: group.id, model: model.id };
				if (next !== void 0) selection.reasoningEffort = next;
				setOptimistic(next === void 0 ? null : next);
				setError(null);
				select(selection).then(
					(ok) => {
						if (!ok) setError(COPY.failed);
					},
					() => setError(COPY.failed),
				);
			};

			const indexAt = (clientX) => {
				const rail = railRef.current;
				if (rail === null || efforts.length < 2) return 0;
				const rect = rail.getBoundingClientRect();
				const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
				return Math.round(clamp(ratio, 0, 1) * (efforts.length - 1));
			};

			const pressRef = React.useRef(null);

			const onPointerDown = (event) => {
				if (locked || !available || efforts.length < 2) return;
				event.preventDefault();
				const el = event.currentTarget;
				try {
					el.setPointerCapture(event.pointerId);
				} catch (_) {
					/* capture is optional */
				}
				pressRef.current = { x: event.clientX, moved: false };
				const i = indexAt(event.clientX);
				commit(efforts[i].id);
			};

			const onPointerMove = (event) => {
				const press = pressRef.current;
				if (press === null || efforts.length < 2) return;
				if (!press.moved) {
					if (Math.abs(event.clientX - press.x) <= 3) return;
					press.moved = true;
					setDragging(true);
				}
				const i = indexAt(event.clientX);
				if (i !== index) commit(efforts[i].id);
			};

			const onPointerUp = (event) => {
				pressRef.current = null;
				if (dragging) {
					setDragging(false);
					setSettling(true);
					window.clearTimeout(settleTimer.current);
					settleTimer.current = window.setTimeout(() => setSettling(false), 340);
				}
				try {
					event.currentTarget.releasePointerCapture(event.pointerId);
				} catch (_) {
					/* capture is optional */
				}
			};

			const onSliderKey = (event) => {
				if (efforts.length < 2) return;
				let next = index;
				if (event.key === "ArrowRight" || event.key === "ArrowUp") next = Math.min(last, index + 1);
				else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = Math.max(0, index - 1);
				else if (event.key === "Home") next = 0;
				else if (event.key === "End") next = last;
				else return;
				event.preventDefault();
				commit(efforts[next].id);
			};

			const trigger = jsxs("button", {
				ref: seatRef,
				type: "button",
				className: "dep-seat",
				disabled: locked || !available,
				"aria-haspopup": "dialog",
				"aria-expanded": open,
				title: effortName === void 0 ? triggerText : triggerText + " · " + effortName,
				onMouseDown: (event) => event.preventDefault(),
				onClick: () => setOpen((value) => !value),
				children: [
					jsx("span", { className: "dep-seat-model", children: triggerText }),
					effortName !== void 0 ? jsx("span", { className: "dep-seat-effort", children: effortName }) : null,
					CHEVRON,
				],
			});

			const usageInfo = usageBreakdown(usage);
			const tokens = compact(usageTotal(usage));
			const tokensTitle = usageInfo === null ? "" : "输入 " + compact(usageInfo.uncached) + " · 缓存读 " + compact(usageInfo.cacheRead) + " · 缓存写 " + compact(usageInfo.cacheWrite) + " · 输出 " + compact(usageInfo.output);
			const wallet = balance !== void 0 && balance.status === "ready" ? balance.wallet : null;
			const balanceText =
				balance === void 0
					? "…"
					: balance.status === "ready"
						? (wallet.currency ? wallet.currency + " " : "") + wallet.amount
						: balance.detail || "读取失败";

			let panel = null;
			if (open && pos !== null && typeof document !== "undefined") {
				const groups = state.groups || [];
				const rows = groups.map((group) =>
					jsxs(
						Fragment,
						{
							children: [
								groups.length > 1 ? jsx("div", { className: "dep-group", children: group.name || group.id }) : null,
								(group.models || []).map((model) => {
									const selected = state.current !== null && state.current !== void 0 && state.current.provider === group.id && state.current.model === model.id;
									return jsxs(
										"button",
										{
											type: "button",
											className: "dep-model",
											"data-selected": selected ? "true" : "false",
											"aria-checked": selected,
											role: "menuitemradio",
											disabled: locked,
											onClick: () => pickModel(group, model),
											children: [jsx("span", { className: "dep-model-name", children: model.name || model.id }), selected ? jsx("span", { className: "dep-check", children: CHECK }) : null],
										},
										group.id + "/" + model.id,
									);
								}),
							],
						},
						group.id,
					),
				);

				const stops = efforts.map((level, i) =>
					jsx(
						"span",
						{
							className: "dep-stop",
							style: { left: last === 0 ? "100%" : (i / last) * 100 + "%" },
							"data-passed": i <= index ? "true" : "false",
						},
						"dot-" + level.id,
					),
				);

				const labels = efforts.map((level, i) =>
					jsx(
						"span",
						{
							"data-active": i === index ? "true" : "false",
							children: level.name || level.id,
						},
						"label-" + level.id,
					),
				);

				const slider =
					efforts.length > 1
						? jsxs("div", {
								className: "dep-effort",
								children: [
									jsxs("div", {
										className: "dep-effort-head",
										children: [jsx("span", { className: "dep-effort-label", children: COPY.effort }), jsx("span", { className: "dep-effort-value", children: effortName === void 0 ? "" : effortName })],
									}),
									jsxs("div", {
										className: "dep-slider",
										"data-disabled": locked || !available ? "true" : "false",
										"data-dragging": dragging ? "true" : "false",
										"data-settling": settling ? "true" : "false",
										role: "slider",
										tabIndex: 0,
										"aria-label": COPY.effort,
										"aria-valuemin": 0,
										"aria-valuemax": last,
										"aria-valuenow": index,
										"aria-valuetext": effortName === void 0 ? "" : effortName,
										onPointerDown,
										onPointerMove,
										onPointerUp,
										onPointerCancel: onPointerUp,
										onKeyDown: onSliderKey,
										children: [
											jsxs("div", {
												className: "dep-rail",
												ref: railRef,
												children: [
													jsx("div", {
														className: "dep-track",
														children: jsxs("div", {
															className: "dep-fill",
															style: {
																width: index <= 0 ? "0px" : "calc(max(14px, min(" + pct + "%, 100% - 14px)) - 3px)",
																opacity: index <= 0 ? 0 : 1,
															},
															children: [jsx("div", { className: "dep-spark dep-spark-slow" }), jsx("div", { className: "dep-spark" })],
														}),
													}),
													stops,
													jsx("div", { className: "dep-thumb", style: { left: "clamp(14px, " + pct + "%, calc(100% - 14px))", borderRadius: "50%", zIndex: 2 } }),
												],
											}),
										],
									}),
									jsx("div", { className: "dep-stops", children: labels }),
								],
							})
						: jsx("div", { className: "dep-note", children: COPY.noEffort });

				const stats = jsxs("div", {
					className: "dep-stats",
					children: [
						jsxs("div", {
							className: "dep-stat",
							children: [jsx("span", { className: "dep-stat-k", children: COPY.session }), jsx("span", { className: "dep-stat-v", title: tokensTitle, children: tokens === null ? "—" : tokens + " tokens" })],
						}),
						jsxs("div", {
							className: "dep-stat",
							children: [
								jsx("span", { className: "dep-stat-k", children: COPY.balance }),
								jsx("span", {
									className: "dep-stat-v",
									"data-loading": balance === void 0 ? "true" : "false",
									title: balance === void 0 ? "" : balance.detail || "",
									children: balanceText,
								}),
							],
						}),
						jsx("span", { className: "dep-ver", children: VERSION }),
					],
				});

				panel = createPortal(
					jsxs("div", {
						ref: panelRef,
						className: "dep-panel",
						style: Object.assign({}, pos, { borderRadius: 28, overflow: "hidden" }),
						role: "dialog",
						"aria-label": COPY.dialog,
						tabIndex: -1,
						children: [
							jsx("div", {
								className: "dep-head",
								children: jsx("span", { className: "dep-head-title", children: COPY.models }),
							}),
							jsxs("div", {
								className: "dep-models",
								children: [rows.length === 0 ? jsx("div", { className: "dep-note", children: state.status === "loading" ? COPY.loading : COPY.empty }) : null, rows],
							}),
							slider,
							stats,
							error === null ? null : jsx("div", { className: "dep-error", children: error }),
						],
					}),
					document.body,
				);
			}

			return jsxs(Fragment, { children: [trigger, panel] });
		}

		function apply(ctx) {
			try {
				ensureStyle();
			} catch (_) {
				/* styling is best effort */
			}

			ctx.inject(["slots", "modelDirectories", "sessions"], (scope) => {
				const models = scope.modelDirectories;
				const sessions = scope.sessions;

				const remoteOf = () => {
					try {
						return ctx.remote;
					} catch (_) {
						/* fall through to the service lookup */
					}
					try {
						return typeof ctx.get === "function" ? ctx.get("remote") : void 0;
					} catch (_) {
						return void 0;
					}
				};

				const faceFor = (sessionId) => {
					const directory = models.directoryFor(sessionId);
					const available = sessions.subagentAddress(sessionId) === void 0;
					return {
						sessionId,
						available,
						directory: directory.store,
						load: () => {
							if (available) directory.load().catch(() => {});
						},
						select: (selection) =>
							available
								? directory.select(selection).then(
										(result) => result.ok === true,
										() => false,
									)
								: Promise.resolve(false),
						usageOf: (id) => {
							try {
								const binding = sessions.binding(id);
								const projections = binding === void 0 || binding.session === void 0 ? void 0 : binding.session.projections;
								if (projections === void 0 || typeof projections.faceOf !== "function") return null;
								const face = projections.faceOf("tokenUsage");
								if (face === null || face === void 0 || typeof face.getSnapshot !== "function") return null;
								return face.getSnapshot();
							} catch (_) {
								return null;
							}
						},
						balanceOf: () => {
							try {
								const remote = remoteOf();
								const account = remote === void 0 ? void 0 : remote.account !== void 0 ? remote.account : (() => { try { const direct = typeof ctx.get === "function" ? ctx.get("remote.account") : void 0; return direct !== void 0 && typeof direct.getBalance === "function" ? direct : void 0; } catch (_) { return void 0; } })();
								if (account === void 0 || typeof account.getBalance !== "function") {
									return Promise.resolve({ status: "unavailable", detail: "no account remote" });
								}
								let activeLocale = "zh-CN";
								try {
									const snapshot = ctx.locale !== void 0 && ctx.locale !== null && typeof ctx.locale.getSnapshot === "function" ? ctx.locale.getSnapshot() : void 0;
									if (snapshot !== void 0 && snapshot !== null && typeof snapshot.active === "string") activeLocale = snapshot.active;
								} catch (_) {
									/* locale is optional */
								}
								const meta = {
									version: DSH_VERSION,
									locale: activeLocale,
									timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
								};
								const signedOut = typeof account.getState === "function"
									? Promise.resolve(account.getState()).then(
											(state) => state !== null && state !== void 0 && state.ok === true && state.value !== null && state.value !== void 0 && state.value.status === "signed-out",
											() => false,
										)
									: Promise.resolve(false);
								return signedOut.then((out) => {
									if (out) return { status: "signed-out", detail: "no credential stored" };
									return Promise.resolve(account.getBalance(meta)).then(
										(result) => {
											if (result === null || result === void 0) return { status: "signed-out", detail: "null result" };
											if (result.ok !== true) return { status: "denied", detail: (result.error && result.error.code) || "rejected" };
											const wallet = walletOf(result.value);
											if (wallet === null) {
												const reason = result.value && result.value.status ? result.value.status : "no wallet";
												return { status: reason === "failed" ? "failed" : "empty", detail: reason };
											}
											return { status: "ready", wallet, detail: "ok" };
										},
										(error) => ({ status: "failed", detail: String((error && error.message) || error) }),
									);
								});
							} catch (error) {
								return Promise.resolve({ status: "failed", detail: String((error && error.message) || error) });
							}
						},
					};
				};

				const register = () => scope.slots.register({ name: SLOT, priority: -100, inject: faceFor }, Seat);
				if (typeof scope.slots.inject === "function") scope.slots.inject(SLOT, register);
				else register();

				// Adopt whichever entry is elected for the model seat, so registration
				// order or priority cannot keep the official two-level menu.
				const adopt = () => {
					try {
						if (typeof scope.slots.entries !== "function") return;
						for (const entry of scope.slots.entries(SLOT)) {
							if (entry === null || entry === void 0) continue;
							const original = entry.component;
							if (typeof original !== "function") continue;
							if (original === Seat || original.__depAdopted === true) continue;
							const Wrapped = (props) => {
								if (props === null || props === void 0 || props.directory === void 0 || typeof props.directory.subscribe !== "function") {
									return jsx(original, props || {});
								}
								let face;
								try {
									face = faceFor(props.sessionId);
								} catch (_) {
									return jsx(original, props);
								}
								return jsx(Seat, Object.assign({}, props, face));
							};
							Wrapped.__depAdopted = true;
							entry.component = Wrapped;
						}
					} catch (_) {
						/* adoption is best effort */
					}
				};
				adopt();
				try {
					ctx.on("slots/changed", (key) => {
						if (key === SLOT) adopt();
					});
				} catch (_) {
					/* event subscription is optional */
				}
			});
		}

		exports.apply = apply;
		exports.inject = ["slots", "sessions", "modelDirectories", "remote", "remote.account", "locale"];
		exports.__internals = { Seat, modelOf, effortsOf, effortOf };

		return module.exports;
	},
});
