# Emerging technologies for small/medium ISP tools (state 2024–2026)

Scope note: ~20 searches, snippets mostly from search results (not full-page fetches). Vendor-reported metrics are marked as such. Research date: Oct 2026.

## 1. AI/LLM in ISP operations (AIOps, support copilots, voice bots, ChatOps, agents, predictive maintenance, CV)

### Takeaway
LLM/agentic AI for small ISPs has moved from hype to a product in 2025–26, but it ships mostly *inside vendor stacks* (Calix for its own customers; Preseem plus QueSee for fixed wireless; Juniper Mist for enterprise Wi-Fi). Vendor-neutral, self-hosted "LLM agent that SSHes into a MikroTik/BDCOM/Huawei OLT and runs diagnostics" exists mainly as research (NIKA, IETF draft) and DIY MCP servers (NetBox MCP). That gap is the clearest one to build into.

### Cited Findings
**Agentic platforms aimed at small ISPs (commercial, vendor-locked)**
- Calix announced a "Calix Agent Workforce" on a next-gen Broadband Platform built on Google Cloud AI. It covers marketing, customer service, subscriber communications, operations and field techs. Platform availability to its 1,100+ customers was set for Q4 2025 — [Calix PR, Oct 2025](https://www.calix.com/press-release/2025/10/agent-workforce-broadband-roles.html); [Light Reading](https://www.lightreading.com/broadband/calix-goes-all-in-on-agentic-ai-for-broadband-providers); [Fierce: Calix + Google](https://www.fierce-network.com/broadband/calix-google-want-make-agentic-ai-easy-broadband)
- Adoption: 500 of Calix's ~1,500 ISP customers use the Calix One agentic AI platform — [Fierce Network](https://www.fierce-network.com/broadband/calix-says-500-isps-are-now-using-its-agentic-ai-platform). Calix says it invested about $100M in the AI platform, starting Nov 2023 — [Cablefax](https://www.cablefax.com/uncategorized/calix-rolls-out-agentic-ai-across-isp-base). Positioned explicitly at smaller providers — [RCR Wireless, Apr 2026](https://www.rcrwireless.com/20260407/telco-cloud/calix-brings-agentic-ai-to-small-isps-for-easy-service-differentiation); [TechNewsWorld 2026](https://www.technewsworld.com/story/calix-in-2026-a-quiet-ai-power-play-for-smaller-broadband-providers-180168.html)
- Stated capabilities: automate repetitive ops workflows, triage, churn prediction, and "self-driving" outage, promo and upsell communications — [Cablefax](https://www.cablefax.com/uncategorized/calix-rolls-out-agentic-ai-across-isp-base)
- Preseem (QoE for WISP/fiber regional ISPs) integrated with QueSee AI (May 2026). When a call comes in, the agent's screen shows the subscriber's network health, device issue count and signal quality: CPE degraded, AP congested, or network healthy — [Preseem](https://preseem.com/2026/05/preseem-quesee-ai-announce-integration/)
- Juniper/HPE Mist Marvis can do tier-1 agent tasks such as labeling or escalating tickets and auto-remediating. A Forrester TEI study is cited for a 70% reduction in network tickets over 3 years (vendor-commissioned). Integrator blogs claim MTTR falls 30–50% in 90 days — [Juniper Marvis Actions docs](https://www.juniper.net/documentation/us/en/software/mist/mist-aiops/topics/concept/marvis-actions-overview.html); [Turn-key Technologies (integrator)](https://www.turn-keytechnologies.com/blog/mist-ai-operations); [HPE agentic Mist PR Aug 2025](https://www.hpe.com/us/en/newsroom/press-release/2025/08/hpe-accelerates-self-driving-network-operations-with-new-mist-agentic-ai-native-innovations.html). Note: this is an enterprise WLAN/campus product, not an access-ISP product.

**LLM agents doing network diagnostics (research / open source)**
- NIKA "network arena" exposes 30+ monitoring and troubleshooting tools (sketches, INT, SDN controller APIs, switch CLIs) to agents via MCP. It benchmarked GPT-OSS, GPT-5 and GPT-5-mini on troubleshooting injected failures — [arXiv 2512.16381](https://arxiv.org/html/2512.16381v1)
- IETF Internet-Draft "MCP for Networks" (Nov 2025) maps MCP roles to network management: devices act as MCP servers, controllers as MCP clients — [draft-zm-rtgwg-mcp-troubleshooting-01](https://www.ietf.org/ietf-ftp/internet-drafts/draft-zm-rtgwg-mcp-troubleshooting-01.html)
- NetBox MCP server (NetBox Labs, released early 2025) lets LLMs query and act on source-of-truth data and is now an "ecosystem" — [NetBox Labs blog](https://netboxlabs.com/blog/netbox-mcp-server-tools-context-management-ecosystem/); [open-sourced announcement](https://netboxlabs.com/blog/new-ways-use-ai-netbox-open-sourced/). There is a community fork with write operations (create/update/delete) — [skuldgerry/netbox-mcp](https://github.com/skuldgerry/netbox-mcp)
- "Aether": agentic AI combined with a digital twin for network validation — [arXiv 2604.18233](https://arxiv.org/html/2604.18233)

**AI voice/chat support**
- Virgin Media O2 launched an AI voice agent for selected broadband fault queries — [The Fast Mode](https://www.thefastmode.com/technology-solutions/50761-virgin-media-o2-launches-ai-voice-agent-for-broadband-customer-support)
- Vendor claims: a UK broadband provider automated 70% of fault calls plus full billing dunning with two AI agents; Vodafone TOBi handles about 1M conversations a day. Connectivity troubleshooting (modem reboot, ONT status, signal checks) is called the highest-volume ticket type and the hardest to resolve without real actions in network systems — [Lorikeet (vendor blog)](https://www.lorikeetcx.ai/articles/best-ai-customer-support-telco-isp-2026). Low independence: vendor marketing.

**Predictive maintenance on PON**
- LSTM/GRU models trained on OLT historical data predict PON "no-light" faults in real time — [Computer Communications 2023 (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S0140366423001925)
- A two-step method: forecast performance indicators with Double Exponential Smoothing, then classify upcoming failure with kernel SVM. There is also a patent on time-to-failure prediction for PON components — [arXiv review 2208.10677](https://arxiv.org/pdf/2208.10677); [USPTO 11563487](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11563487)

**Computer vision for installation photo QA**
- DAC.digital built CV validation of fiber install photos (open/closed box, wiring pattern, labeling, equipment type) for a Dutch fiber provider that uses contractors. It reports ~90% accuracy and uses explainable AI — [DAC.digital case study](https://dac.digital/case-studies/automated-fibre-optic-installation-validation-with-computer-vision-and-machine-learning/)
- IQGeo + Deepomatic offer "smart self-validation" with real-time visual AI in fiber construction — [Fierce (sponsored)](https://www.fierce-network.com/sponsored/iqgeo-and-deepomatic-showcase-smart-self-validation); [IQGeo blog](https://www.iqgeo.com/blog/transform-fiber-connection-processes-with-visual-ai). ServicePower sells Vision AI for utilities — [ServicePower](https://www.servicepower.com/solutions/capability/vision-ai)

### Inferences
- **Not productized for small ISPs (opportunity):** an open, multi-vendor "NOC copilot / MCP toolbox" for the typical CIS/emerging-market small-ISP stack. That stack is MikroTik, BDCOM/C-Data/Huawei/ZTE OLTs, accel-ppp, plus billing such as UserSide/Splynx/LanBilling. The building blocks (MCP, NetBox MCP, OLT CLIs) exist, but nobody packages them for ISPs that aren't on Calix. Calix proves demand: 500 ISPs adopted.
- Support copilot = Preseem/QueSee pattern (CRM screen-pop with live CPE/AP/ONT state). Cheap to build with an LLM plus the billing API plus an OLT/SNMP poller, and highly valuable.
- Photo QA via a multimodal LLM (instead of custom-trained CV) is probably now feasible for small ISPs at low cost. It is not productized for small contractors; current offerings target large operators.
- PON degradation prediction is mostly academic and patents. A simple per-ONT Rx-power trend plus threshold forecast (no deep learning) would capture most of the value.

### Gaps
- No independent (non-vendor) data found on deflection rates of AI voice bots at *small* ISPs.
- No specific evidence found for LLM log summarization or automated RCA products aimed at small ISPs. No churn-prediction case studies at small ISPs beyond Calix claims.
- Fiber route planning with AI was not researched (out of time).

## 2. Telemetry/data (gNMI, eBPF/XDP BNG/QoE, flow, TSDB/ClickHouse)

### Takeaway
The most mature "new" tooling for small ISPs is open source. LibreQoS does eBPF/XDP plus CAKE shaping with passive per-subscriber TCP RTT/retransmits. Akvorado collects flows into ClickHouse. accel-ppp, now owned by VyOS, and VPP-based BNGs such as OSvBNG provide BRAS. gNMI exists on big-vendor OLTs (Nokia Lightspan) but is rare on the budget OLTs small ISPs actually run.

### Cited Findings
- LibreQoS: CAKE/fq_codel shaping with eBPF and XDP. It passively measures TCP RTT, retransmits, flows and throughput per subscriber, AP, OLT, site and backhaul, with no SNMP needed — [GitHub LibreQoS](https://github.com/LibreQoE/LibreQoS); [LibreQoS Insight](https://libreqos.com/insight). LibreQoS 2.0 released in late March 2026 — [abit.ee](https://abit.ee/en/soft/libreqos-20-qos-traffic-management-bufferbloat-cake-ebpf-open-source-isp-network-en). Insight (successor to LTS) supports multi-shaper networks with RTT, retransmits, ASN stats, CAKE stats and geo endpoints — [LibreQoS v1.5 news](https://libreqos.com/news/libreqos-v1-5-rc-1-libreqos-insight)
- Preseem is the commercial equivalent: a passive QoE platform for regional ISPs that also publishes an annual ISP Network Report — [Preseem](https://preseem.com/); [2025 report PR](https://www.prweb.com/releases/preseem-releases-2025-fixed-wireless-and-fiber-isp-network-report-302319642.html)
- VyOS Networks acquired Accel-PPP Inc. (Feb 2025) and now leads development of the open-source PPPoE/IPoE/L2TP server — [VyOS blog](https://blog.vyos.io/press-releases/vyos-networks-announces-acquisition-of-accel-ppp-to-broaden-open-source-networking-capabilities)
- OSvBNG is an open-source BNG on VPP + FRR + DPDK. Glutec offers a Go BNG control plane for VPP + Kea DHCP — [GitHub topic ipoe](https://github.com/topics/ipoe); [Glutec GitHub](https://github.com/glutechnologies); an earlier how-to is [zstas vBNG from VPP](https://zstas.github.io/jekyll/update/2020/01/25/vpp.html)
- Akvorado collects NetFlow/IPFIX/sFlow, enriches with SNMP interface names, ASN and geo, and stores in ClickHouse via Kafka. It handles ~100k flows/s on 64 GB RAM / 24 vCPU, is AGPLv3, and ships a docker-compose quickstart. Version 2.0 came out in 2025 — [GitHub akvorado](https://github.com/akvorado/akvorado); [Akvorado 2.0 blog](https://vincent.bernat.ch/en/blog/2025-akvorado-2.0); [APNIC blog Apr 2026](https://blog.apnic.net/2026/04/09/setting-up-akvorado-a-netflow-analyser-for-your-ipv6-first-network/). It can be combined with NetBox for context — [rezar.dev](https://rezar.dev.br/blog/seeing-inside-the-network-context-aware-observability-with-akvorado-and-netbox/)
- Nokia Lightspan OLTs use model-driven NETCONF/YANG plus streaming telemetry. Nokia open-sourced the gNMIc client — [callmc (reseller)](https://callmc.com/nokia-lightspan-olt-fiber-access-solutions/); [Nokia gNMIc blog](https://www.nokia.com/blog/streaming-telemetry-with-open-source-gnmic/). OpenNMS supports OpenConfig telemetry ingestion — [OpenNMS docs](https://docs.opennms.com/meridian/2025/reference/telemetryd/protocols/openconfig.html)

### Inferences
- Opportunity: correlate LibreQoS/eBPF per-subscriber RTT and retransmits with OLT ONT optical data and billing, then run an LLM on top that answers "why is subscriber X slow?". The pieces exist separately; nothing ties them together for small ISPs.
- BMP (BGP Monitoring Protocol) and per-subscriber QoE inside accel-ppp were not found in productized form for small ISPs.

### Gaps
- No evidence collected on gNMI support in budget OLTs (BDCOM, C-Data, VSOL), on BMP collectors (e.g. OpenBMP/pmacct), or on TSDB comparisons (VictoriaMetrics etc.). Not researched within budget.

## 3. Digital twins, topology discovery, config validation, change management

### Takeaway
Free building blocks exist and are mature for L3 (Batfish, ContainerLab, SuzieQ). They are used mainly by enterprise/DC teams. Automated L2 topology discovery for access ISPs (LLDP/FDB/ARP/option 82 to subscriber-port graph) did not surface as a productized offering in searches.

### Cited Findings
- Batfish models network behavior from configs (Cisco IOS/XE/XR, Junos, Arista EOS). It is strongest at L3 reachability and ACL analysis. Its research found 96 new bugs across 152 small/medium real networks and verifies hundreds-of-routers networks in under 5 minutes — [rConfig Batfish guide](https://www.rconfig.com/batfish); [Minesweeper paper](https://batfish.org/minesweeper/resources/Minesweeper.pdf); [Network to Code](https://networktocode.com/blog/batfish-fits-network-automation-plan/)
- A practical digital-twin stack: Batfish + ContainerLab + SuzieQ, all free and open source — [DEV Community](https://dev.to/firstpasslab/building-a-network-digital-twin-with-batfish-containerlab-and-suzieq-a-practical-guide-17ol); [firstpasslab 2026](https://firstpasslab.com/blog/2026-03-11-network-digital-twin-aiops-practical-guide/)
- Agentic AI + digital twin for change validation (Aether) — [arXiv 2604.18233](https://arxiv.org/html/2604.18233)

### Inferences
- Batfish has no MikroTik RouterOS parser in the listed vendors. Small ISPs running RouterOS therefore cannot use it directly, which is a gap (needs verification).
- An "access-network digital twin" would build a graph of OLT/port/ONT and switch/port/MAC/subscriber from FDB, LLDP and option 82, joined with billing. It would enable outage impact analysis ("who is affected by this splitter or switch down") and is an unproductized idea for small ISPs.

### Gaps
- No sources gathered on topology discovery tools (NetDisco, LibreNMS L2 maps), graph DBs for networks, or intent-based networking for small ISPs.

## 4. CPE side (TR-369/USP, prplOS/OpenWrt/RDK-B, Wi-Fi sensing)

### Takeaway
TR-369/USP is being deployed at large scale (Incognito: 5M devices at a North American FWA operator). A BBF survey says 85% of operators have implemented USP or plan to. Wi-Fi motion sensing has reached large-ISP consumer products (Comcast, Verizon), and 802.11bf was ratified in 2025. Small ISPs mostly lack an affordable USP controller plus sensing stack.

### Cited Findings
- Incognito announced the "world's largest" TR-369 USP deployment: over 5 million devices on a North American 5G FWA network (Feb 2025) — [BusinessWire](https://www.businesswire.com/news/home/20250212406642/en/Incognito-Software-Systems-Announces-Largest-TR-369-USP-Deployment-for-Connected-Home-Management)
- According to the BBF Connected Home Survey, 85% of operators have implemented USP or intend to. T-Mobile, AT&T, Orange and Vodafone are named as deployers — [Incognito press room](https://www.incognito.com/company/press-room/largest-tr369-usp-deployment) (secondary citation of the BBF survey)
- prpl LCM runs on prplOS, OpenWrt and RDK-B and connects to TR-369/TR-069. prpl HL-API is USP-based — [ETSI workshop 2024 slides](https://docbox.etsi.org/Workshop/2024/11_SNS4SNS/2_2_Rosu.pdf)
- MikroTik supports TR-369 USP management, as a third-party controller (MKController) describes — [mkcontroller.com](https://mkcontroller.com/blog/remote_access/mikrotik/tr_369_usp_modern_remote_management/)
- 802.11bf (Wi-Fi sensing) was ratified in 2025, and chipmakers are embedding it in Wi-Fi 7+ — [The Next Web](https://thenextweb.com/news/wi-fi-sensing-ieee-802-11-bf-analysis). Plume has offered sensing since 2020. Verizon Fios "Home Awareness" uses Origin Wireless, and Linksys has "Aware" — [same](https://thenextweb.com/news/wi-fi-sensing-ieee-802-11-bf-analysis); [Origin Wireless](https://www.originwirelessai.com/wifi-sensing/)
- Comcast launched WiFi Motion in 2025 and folded it into Xfinity Shield (Aug 2026) — [The Register](https://www.theregister.com/security/2026/08/19/comcast-gives-its-wi-fi-motion-detector-a-security-makeover/5289572)

### Inferences
- An open-source USP controller plus an OpenWrt/prplOS agent stack (obuspa exists) packaged for small ISPs is a likely gap. GenieACS (TR-069) remains the de facto small-ISP tool (not verified in this session).
- Wi-Fi sensing as a value-added service for small ISPs depends on CPE chipset support. It is likely available only through Plume or Origin licensing, so it is not a near-term DIY target.

### Gaps
- Not researched: Wi-Fi 7 CPE adoption at small ISPs, mesh analytics, speed-test-in-CPE (e.g. BBF TR-471/obudpst), RDK-B uptake outside large cable operators.

## 5. Fiber: DAS, OTDR automation, rogue ONT

### Takeaway
DAS on telecom fiber was standardized in 2025 (ITU-T G.681 for sensing coexisting with live DWDM traffic) and is used for dig-before-damage detection, but interrogators are expensive. Remote OTDR (EXFO, VIAVI) is mature and expensive. Rogue-ONT detection is built into OLTs (Calix AXOS etc.). Small ISPs with cheap OLTs rely on scripts (e.g. a GitHub toolkit).

### Cited Findings
- ITU-T SG15 approved Recommendation G.681 (Nov 2025) on sensing signals sharing live terrestrial DWDM fiber — [MapYourTech](https://mapyourtech.com/distributed-acoustic-sensing-on-fiber-principles-resolution-and-telecom-use-cases/) (secondary source; verify on itu.int)
- DAS distinguishes hand digging, mechanized excavation, directional drilling and vehicles (dig-before-damage) — [MapYourTech](https://mapyourtech.com/distributed-acoustic-sensing-on-fiber-principles-resolution-and-telecom-use-cases/). ML on DAS data reaches ~90% accuracy classifying walk/dig/drive over buried fiber — [NEC Labs DAS blog tag](https://www.nec-labs.com/blog/tag/distributed-acoustic-sensing/). A 2026 paper uses DAS to geolocate buried fiber routes — [arXiv 2604.10331](https://arxiv.org/pdf/2604.10331)
- Remote fiber test: EXFO RFTM and VIAVI ONMSi RFTS run 24/7 OTDR scanning with trend degradation, for P2P and PON — [EXFO RFTM](https://www.exfo.com/en/products/field-network-testing/remote-fiber-testing-monitoring/remote-fiber-testing-monitoring/); [VIAVI RFTM](https://www.viavisolutions.com/en-us/products/remote-fiber-test-and-monitoring). Splitters superimpose branch reflections, so OTDR past the splitter is hard. Combining OTDR with transceiver monitoring (OTM) is a cost-efficient approach — [IEEE 5970975](https://ieeexplore.ieee.org/document/5970975)
- Rogue ONT: OLTs detect continuous-mode ONUs during quiet windows and power them off or isolate them — [Calix AXOS docs](https://www.calix.com/content/dam/calix/mycalix-misc/lib/iae/axos/21x/mmtg/93502.htm); [FOA FTTH troubleshooting](https://www.thefoa.org/tech/ref/install/Troubleshooting_FTTH.html). An open-source "emergency toolkit" automates detection and isolation via OLT CLI — [GitHub devalaminbro/olt-rogue-onu-detection-isolation](https://github.com/devalaminbro/olt-rogue-onu-detection-isolation)

### Inferences
- Opportunity for small ISPs: "poor man's fiber monitoring". Use the DDM/Rx power of all ONTs on a PON port (already exposed by the OLT) to localize faults. If all ONTs behind one splitter drop simultaneously, the fault is upstream of that splitter. Combine this with GIS. It is cheaper than RTU-based OTDR and not productized for budget OLTs.
- DAS for small ISPs is likely out of reach (interrogator cost). A DAS-as-a-service model is speculative.

### Gaps
- No price points found for DAS interrogators or EXFO/VIAVI RTUs.

## 6. Other: SD-WAN, network APIs (CAMARA), payments, low-code (n8n), Telegram Mini Apps

### Takeaway
CAMARA/Open Gateway is substantial but mobile-centric (80% of mobile connections). Fixed-ISP relevance is emerging via CableLabs. n8n plus ISP billing APIs (Splynx) is an easy, cheap automation layer. Telegram Mini Apps as a subscriber self-service portal are technically trivial, and Russian dev shops quote ₽20k–80k+, but no ISP-specific product was found.

### Cited Findings
- CAMARA Fall 2025 meta-release: 60 APIs (10 stable, 27 updated, 23 new initial). 1,300+ contributors from 476 orgs — [TelecomTV](https://www.telecomtv.com/content/apis/camara-project-s-latest-drop-boasts-60-network-apis-53995/); [CAMARA Oct 2025](https://camaraproject.org/2025/10/07/camara-the-global-telco-api-alliance-issues-its-latest-meta-release-of-stable-network-apis-advancing-api-interoperability/). CableLabs contributed to the Fall '25 release (cable/fixed relevance) — [CableLabs](https://www.cablelabs.com/blog/camara-api-fall-25-meta-release)
- Open Gateway (1Q26): 81 operator groups, 292 networks, about 80% of mobile connections, 140 API instances commercially launched across 85 networks in 50 markets — [Open Gateway 1Q26 update PDF](https://camaraproject.org/wp-content/uploads/sites/12/2026/02/Open-Gateway-1Q26-Update.pdf)
- n8n is a visual, node-based workflow automation tool with JS/Python and AI-model nodes — [Wikipedia](https://en.wikipedia.org/wiki/N8n). The Splynx API exposes billing, networking and customer management for automation — [Pipedream n8n–Splynx](https://pipedream.com/apps/n8n-io/integrations/splynx); [Splynx billing automation 2025](https://splynx.com/blog/billing/fully-automated-isp-billing-in-2025-checklist-for-local-isps-and-wisps/)
- Telegram Mini Apps: a web app inside Telegram with one-click auth and phone number capture, free notifications, and CRM/billing integration. Usable as a "личный кабинет без приложения" (personal account without an app) — [lpmotor](https://lpmotor.ru/articles/telegram-mini-apps-vs-bots-vs-websites-2601); [textback](https://textback.ru/kak-ponyat-chto-vam-nuzhen-mini-app-v-telegram/). Dev pricing quoted from ₽20,000 — [aiorkestrator](https://aiorkestrator.ru/uslugi/mini-app/) — and from ₽80,000 in Moscow — [lead.media](https://lead.media/razrabotka-telegram-mini-apps/)

### Inferences
- **Clear unproductized idea:** a turnkey Telegram Mini App subscriber portal for small ISPs. It would cover balance and payment, a Wi-Fi/ONT status and "self-diagnose" button that calls the OLT/BRAS, outage notifications via the bot, and an AI support chat, with connectors to UserSide/LanBilling/Splynx/Hydra/billing APIs. No ISP-specific product appeared in searches.
- CAMARA has little direct relevance for small fixed ISPs today. It is a mobile operator and aggregator ecosystem.

### Gaps
- SD-WAN for small-ISP business customers and payment rails (SBP etc.) were not researched. ComNews/Russian-market adoption data was not found.
