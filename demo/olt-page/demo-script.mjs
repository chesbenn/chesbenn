import { chromium } from "@playwright/test";
const OUT = "/home/user/chesbenn/demo/olt-page", B = "http://127.0.0.1:8730";
// ── TEST FIXTURE (demo browser only): a network shaped like the user's — 6 devices, 1 OLT, 169 ONU ──
const now = Date.now(), M = 60e3, H = 3600e3, iso = (t) => new Date(t).toISOString();
const reg = (id, name, cs, extra = {}) => ({ device_id: id, display_name: name, model: extra.model ?? "", vendor: extra.vendor ?? "", management_address: extra.ip ?? "",
  connection_status: cs, polling_status: cs === "connected" ? "active" : cs === "disabled" ? "disabled" : "never", last_poll_at: cs === "connected" ? iso(now - 20e3) : null,
  last_seen_at: cs === "connected" ? iso(now - 20e3) : null, olt_device_id: extra.olt ?? null, enabled: cs !== "disabled", configured: true, live_verified: false,
  device_role: extra.role ?? "", product_family: "", transport_type: "snmp", adapter_id: null, last_error: null, capabilities: {}, endpoints: [] });
const legacy = (d, poll) => ({ ...d, connection_status: d.enabled ? "unknown" : "disabled", polling_status: poll, last_seen_at: poll === "active" ? iso(now - 20e3) : null });
const devices0 = [
  reg(1, "huawei", "connected", { olt: 7, model: "MA5608T", vendor: "Huawei", ip: "10.5.5.2", role: "olt" }),
  reg(2, "FastLink", "unknown", { ip: "10.5.5.10" }), reg(3, "MikroTik", "connected", { model: "RB4011", ip: "10.5.5.1" }),
  reg(4, "Huawei Technologies Co., Ltd", "disabled"), reg(5, "Huawei Technologies Co., Ltd", "disabled"), reg(6, "HWTC 003307", "disabled"),
];
devices0[3].serial_number = "48575443" + "00000011"; devices0[4].category = "onu_ont_cpe";
const devices = devices0.map((d, i) => legacy(d, ["active", "never", "active", "disabled", "disabled", "disabled"][i]));
const ports = [...Array(8)].map((_, p) => ({ id: `e${p}`, type: "EPON", frame: 0, slot: 0, port: p, name: "", status: p === 2 ? "down" : "up", onuTotal: 0, onuOnline: 0, onuOffline: 0, onuStale: 0, onuList: [] }))
  .concat([...Array(8)].map((_, p) => ({ id: `g${p}`, type: "GPON", frame: 0, slot: 1, port: p, name: "", status: [3, 7].includes(p) ? "down" : "up", onuTotal: 0, onuOnline: 0, onuOffline: 0, onuStale: 0, onuList: [] })));
const onts = []; let k = 0;
const mk = (slot, port, f = {}) => { k++; onts.push({ frame: 0, slot, port, ont_id: k % 64, sn: f.sn ?? `HWTC${String(k).padStart(8, "0")}`, model: "HG8546M", vendor: "HWTC",
  run_state: f.down ? "offline" : "online", config_state: "normal", match_state: "match", line_profile: "LP-100M", service_profile: "SP-1", rx_power_dbm: f.down ? null : (f.rx ?? -18 - (k % 8)),
  rx_health: f.health ?? (f.down ? "unknown" : "good"), rx_margin_db: f.margin ?? null, distance_m: 400 + (k * 37) % 3000, description: f.name ?? `abon ${k}`, last_up_time: f.up ? iso(now - f.up) : iso(now - 30 * H),
  last_down_time: f.downAt != null ? iso(now - f.downAt) : null, last_down_cause: f.cause ?? "", port_path: `0/${slot}/${port}`, ont_path: `0/${slot}/${port}/${k % 64}`, last_seen: iso(now - 25e3), freshness: "fresh" }); };
// GPON 0/1/0: 30 healthy, 3 serials from the local example design (for the designer link)
["HWTC0000A012", "HWTC0000A013", "HWTC0000B040"].forEach((sn, i) => mk(1, 0, { sn, name: `кв. ${12 + i}` }));
for (let i = 0; i < 27; i++) mk(1, 0, i % 9 === 0 ? { down: true, downAt: 40 * H, cause: "dying-gasp" } : {});
// 0/1/1: 20 ONU, a branch of 4 lost light together 2 h ago and came back
mk(1, 2, { sn: "HWTC7B003307", name: "ONU behind HWTC 003307" });
for (let i = 0; i < 20; i++) mk(1, 1, i < 4 ? { downAt: 2 * H + i * 20e3, cause: "LOSi", up: 1.5 * H } : {});
// 0/1/3: whole port dark 25 min ago (fibre cut) — 12 ONU
for (let i = 0; i < 12; i++) mk(1, 3, { down: true, downAt: 25 * M + i * 7e3, cause: "LOSi" });
// 0/1/4: 18 ONU, 2 weak, 1 single LOS
for (let i = 0; i < 18; i++) mk(1, 4, i === 0 ? { rx: -28.4, health: "critical", margin: 0.6 } : i === 1 ? { rx: -26.9, health: "warning", margin: 2.1 } : i === 2 ? { down: true, downAt: 3 * H, cause: "LOS" } : {});
// 0/1/5: 15 ONU, 5 dying gasp together 40 min ago (power outage), still down
for (let i = 0; i < 15; i++) mk(1, 5, i < 5 ? { down: true, downAt: 40 * M + i * 10e3, cause: "dying-gasp" } : {});
// 0/1/6: 22 ONU, 12 inactive for days
for (let i = 0; i < 22; i++) mk(1, 6, i < 12 ? { down: true, downAt: (3 + i) * 24 * H, cause: "dying-gasp" } : {});
// EPON 0/0/0, 0/0/1: 52 ONU, a few weak, a few old
for (let i = 0; i < 26; i++) mk(0, 0, i === 3 ? { rx: -27.9, health: "critical", margin: 0.4 } : i % 7 === 0 ? { down: true, downAt: 60 * H, cause: "LOS" } : {});
for (let i = 0; i < 26; i++) mk(0, 1, i === 5 ? { rx: -26.5, health: "warning", margin: 2.5 } : i % 5 === 0 ? { down: true, downAt: 90 * H, cause: "dying-gasp" } : {});
const met = (cur, unit, base) => ({ current: cur, unit, status: "ok", source: "snmp", error: "", lastUpdated: iso(now), details: [],
  history: [...Array(40)].map((_, i) => ({ ts: iso(now - (40 - i) * 15 * M), value: Math.round((base + Math.sin(i / 4) * 3) * 10) / 10 })) });
const dash = { device: { id: "7", name: "huawei", ip: "10.5.5.2", vendor: "Huawei", model: "MA5608T", availability: "online", error: "", snmpStatus: "online", cliStatus: "not-needed", softwareVersion: "MA5600V800R018C10", serialNumber: "", hardwareVersion: "", location: "", contact: "", lastPollTime: iso(now - 12e3), lastSuccessfulPollTime: iso(now - 12e3), source: "snmp" },
  health: { cpu: met(38, "%", 30), ram: met(7, "%", 7), temperature: { ...met(45, "C", 44), sensors: [] },
    alarms: { total: 2, critical: 0, major: 1, minor: 1, warning: 0, list: [], source: "snmp-trap", unavailable: false, error: "" },
    collector: { source: "snmp", pollDurationMs: 5900 } },
  system: { uptime_seconds: 41 * 24 * 3600, reachable: true, name: "huawei", model: "MA5608T", software_version: "" }, onuStatus: { total: 0, online: 0, offline: 0, stale: 0, epon: {}, gpon: {} }, eponPorts: ports.filter((p) => p.type === "EPON"), gponPorts: ports.filter((p) => p.type === "GPON"), performanceHistory: {}, lastUpdated: iso(now) };
const hist = [...Array(48)].map((_, i) => ({ ts: iso(now - (48 - i) * 30 * M), ont_rx_power_dbm: -27.6 - Math.sin(i / 5) * 0.5 - i * 0.012, ont_tx_power_dbm: 2, olt_rx_power_dbm: null, temperature_c: 40 }));
console.log("fixture ONU:", onts.length);


const boards = [["EPON","H808EPSD",0],["GPON","H807GPBD",1],["CONTROL","H801MCUD",2],["POWER","H801MPWD",4]].map(([t,n,s]) => ({ frame: 0, slot: s, board_name: n, board_type: t, status: "Normal",
  port_count: t.endsWith("PON") ? 8 : 0, online_count: 0, onu_total: 0, cpu_percent: null, memory_percent: null, temperature_c: t === "POWER" ? null : 44, subtype: "", slot_path: `0/${s}`, updated_at: iso(now - 20e3) }));
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", env: { ...process.env, LANG: "C.UTF-8" } });
const W = Number(process.env.W || 1700), Hh = Number(process.env.H || 950);
const ctx = await b.newContext({ viewport: { width: W, height: Hh } });
const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
await p.route(/\/api\/v1\/devices(\?.*)?$/, (r) => r.fulfill({ json: { devices, generated_at: iso(now) } }));
await p.route("**/api/olts/registry/1/dashboard", (r) => r.fulfill({ json: dash }));
await p.route(/\/api\/devices\/7\/onts(\?.*)?$/, (r) => r.fulfill({ json: onts }));
await p.route(/\/api\/devices\/7\/boards/, (r) => r.fulfill({ json: boards }));
await p.goto(B + "/login");
await p.locator("input.input").first().fill("admin"); await p.locator("input[type=password]").fill("admin");
await p.locator("button.btn-primary").click(); await p.waitForTimeout(1500);
const shot = async (n, full) => { await p.waitForTimeout(900); await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: !!full }); };
await p.goto(B + "/devices/1/dashboard"); await p.getByTestId("olt-port-list").waitFor();
const tag = process.env.TAG || "";
await shot(tag + "1-overview");
console.log("KPIS:", (await p.getByTestId("olt-kpis").innerText()).replace(/\s+/g, " "));
const sw = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth, document.querySelector("main")?.scrollWidth, document.querySelector("main")?.clientWidth]);
console.log("widths (doc, viewport, main scroll, main client):", sw);
if (!tag) {
  await p.locator(".oltp-port", { hasText: "4" }).nth(1).click(); await shot("2-port-weak");
  await p.getByTestId("olt-port-card").locator("tr").first().click(); await p.waitForTimeout(800); console.log("ONU click →", p.url().replace(B, ""));
  await p.goBack(); await p.getByTestId("olt-port-list").waitFor();
  await p.getByTestId("olt-kpis").getByRole("button", { name: /Lost light/ }).click(); await shot("3-onu-lost-light");
  await p.getByRole("tab", { name: /Device/ }).click(); await shot("4-device-hardware");
}
console.log("page errors:", errs.length ? errs : "none");
await ctx.close(); await b.close();
