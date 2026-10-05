import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1700, height: 950 } });
for (const n of ["a", "b", "c"]) { await p.goto(`file://${process.cwd()}/${n}.html`); await p.waitForTimeout(400); await p.screenshot({ path: `variant-${n}.png` }); }
await b.close();
