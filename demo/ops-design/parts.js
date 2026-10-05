// shared fake data for the mockups
const ONUS=[["Abonent_A (пример)","0/1/0 · 7","-26.57","warn","2985 m","—"],["Abonent_B","0/1/0 · 3","-21.4","","1210 m","—"],["Abonent_C","0/1/0 · 12","-19.8","","640 m","2 d ago · LOSi"],["Abonent_D","0/1/0 · 15","-24.9","","2410 m","—"],["Abonent_E","0/1/0 · 21","-22.1","","1890 m","5 d ago · dying-gasp"],["Abonent_F","0/1/0 · 22","-20.3","","870 m","—"],["Abonent_G","0/1/0 · 24","-23.7","","2020 m","—"],["Abonent_H","0/1/0 · 26","-18.9","","430 m","—"],["Abonent_I","0/1/0 · 27","-25.2","warn","2770 m","—"],["Abonent_J","0/1/0 · 30","-21.9","","1500 m","—"]];
function chart(w,h,limit){ // Rx 24h line with the limit line
  let p="",x=0;const n=96;for(let i=0;i<=n;i++){const y=-26.6+Math.sin(i/9)*.15+(i>60?Math.sin(i*1.7)*.35+.4:0)-(i>40&&i<50?.25:0);x=i*w/n;const py=h-((y+28)/4)*h;p+=(i?"L":"M")+x.toFixed(1)+","+py.toFixed(1)}
  const ly=h-((limit+28)/4)*h;
  return `<svg width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity=".35"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient></defs>
  <rect x="0" y="${ly}" width="${w}" height="${h-ly}" fill="#ef4444" opacity=".08"/><line x1="0" x2="${w}" y1="${ly}" y2="${ly}" stroke="#ef4444" stroke-dasharray="5 4"/><text x="${w-4}" y="${ly-4}" fill="#ef4444" font-size="10" text-anchor="end">предел -27 dBm</text>
  <path d="${p} L${w},${h} L0,${h}Z" fill="url(#g)"/><path d="${p}" fill="none" stroke="#38bdf8" stroke-width="1.8"/></svg>`;}
function sidebar(){return `<div class="side"><div class="row" style="font-weight:700;font-size:14px">Netherra <span class="mut" style="font-size:10px;font-weight:400">ISP Operations</span></div>
<div class="row" style="border:1px solid #222c35;margin:8px 0;color:#8b98a5">⌕ Устройство, серийник ONU, абонент…</div>
<h4>Сеть</h4><div class="row"><i class="dot" style="background:#38bdf8"></i>Network overview<span class="c">2/3 online</span></div>
<div class="row"><i class="dot" style="background:#ef4444"></i>huawei<span class="c">108/162 ONU</span></div>
<div class="row ind sel"><i class="dot" style="background:#f59e0b"></i>PON 0/1/0<span class="c">27/27</span></div>
<div class="row ind"><i class="dot" style="background:#ef4444"></i>PON 0/0/4<span class="c">15/29 · 14 LOS</span></div>
<div class="row ind"><i class="dot" style="background:#ef4444"></i>PON 0/0/5<span class="c">13/28 · 15 LOS</span></div>
<div class="row ind"><i class="dot" style="background:#22c55e"></i>PON 0/1/2<span class="c">9/9</span></div>
<div class="row"><i class="dot" style="background:#22c55e"></i>MikroTik<span class="c">online</span></div>
<div class="row"><i class="dot" style="background:#6b7280"></i>FastLink<span class="c">never polled</span></div>
<h4>Проблемы</h4><div class="row">⚠ Open alerts<span class="c">1</span></div><div class="row crit">✂ Mass outages now<span class="c crit">2</span></div>
<div class="row">⦸ Lost light (24 h)<span class="c crit">54</span></div><div class="row">📶 Weak signal<span class="c warn">11</span></div>
<h4>Not monitored · 3</h4></div>`;}
function statusbar(){return `<div class="status"><div><div class="k">Network</div><div class="v crit">Degraded</div><div class="s">PON 0/0/5: 13 of 28 ONU lost light at once</div></div>
<div><div class="k">Devices up</div><div class="v good">2/3</div><div class="s">1 not polled</div></div><div><div class="k">ONU online</div><div class="v good">108/155</div><div class="s">+7 inactive</div></div>
<div><div class="k">Lost light</div><div class="v crit">54</div><div class="s">24 h</div></div><div><div class="k">Outages</div><div class="v crit">2</div><div class="s">now</div></div><div><div class="k">Weak Rx</div><div class="v warn">11</div><div class="s">near the limit</div></div></div>`;}
