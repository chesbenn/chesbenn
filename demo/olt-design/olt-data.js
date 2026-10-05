// Numbers from the user's own OLT page screenshot (huawei MA5608T, 10.10.0.3) — mockup only.
const PORTS = [
  ["0/0/0","EPON",1,1,0,-10.9,-10.9,0,0],["0/0/1","EPON",1,1,0,-21.6,-21.6,0,0],["0/0/2","EPON",0,0,0,null,null,0,0],["0/0/3","EPON",12,10,2,-23.0,-25.7,0,0],
  ["0/0/4","EPON",29,15,14,-24.2,-30.0,1,1],["0/0/5","EPON",31,13,18,-23.6,-29.2,3,0],["0/0/6","EPON",24,18,6,-23.4,-30.4,0,1],["0/0/7","EPON",8,2,6,-20.0,-22.0,0,0],
  ["0/1/0","GPON",13,8,5,-23.9,-27.4,1,0],["0/1/1","GPON",6,3,3,-22.9,-24.3,0,0],["0/1/2","GPON",9,9,0,-18.5,-25.7,1,0],["0/1/3","GPON",1,0,1,null,null,0,0],
  ["0/1/4","GPON",18,16,2,-21.3,-30.0,0,1],["0/1/5","GPON",2,1,1,-19.9,-19.9,0,0],["0/1/6","GPON",14,12,2,-23.0,-30.0,0,1],["0/1/7","GPON",0,0,0,null,null,0,0],
].map(([p,t,tot,on,off,avg,worst,weak,crit])=>({p,t,tot,on,off,avg,worst,weak,crit}));
const verdict = (x) => x.tot===0 ? "unused" : (x.off>=0.4*x.tot && x.off>=3) ? "bad" : (x.off||x.crit||x.weak) ? "warn" : "ok";
const VC = { ok:"#22c55e", warn:"#f59e0b", bad:"#ef4444", unused:"#4b5563" };
function spark(seed, w=110, h=22, col="#38bdf8"){let p="";for(let i=0;i<=30;i++){const y=h-4-(Math.sin(i/3+seed)+1)/2*(h-8)-(i%4)*0.6;p+=(i?"L":"M")+(i*w/30).toFixed(1)+","+y.toFixed(1)}return `<svg width="${w}" height="${h}"><path d="${p}" fill="none" stroke="${col}" stroke-width="1.5"/></svg>`}
function area(w,h,col,seed=0,lo=0.2,hi=0.8){let p="";const n=60;for(let i=0;i<=n;i++){const v=lo+(hi-lo)*((Math.sin(i/7+seed)+1)/2*0.7+((i*13)%7)/7*0.3);p+=(i?"L":"M")+(i*w/n).toFixed(1)+","+(h-v*h).toFixed(1)}return `<svg width="${w}" height="${h}"><path d="${p} L${w},${h} L0,${h}Z" fill="${col}" opacity=".18"/><path d="${p}" fill="none" stroke="${col}" stroke-width="1.6"/></svg>`}
function leftnav(){return `<div style="background:#0f141a;border-right:1px solid #222c35;padding:14px 10px;font-size:12px;color:#8b98a5;line-height:2.1">
<div style="color:#e6edf3;font-weight:700;letter-spacing:.08em;font-size:10px">WORKSPACE</div>
<div>Devices</div><div>Dashboard</div><div>Subscribers</div><div>Topology</div><div>Optical Designer</div><div>Monitoring</div><div>Alerts</div><div>Operations Mode</div><div>Config Backup</div><div>Logs Center</div></div>`}
