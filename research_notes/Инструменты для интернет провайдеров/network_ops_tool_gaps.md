# Network-side ISP tools: feature-and-gap matrix (monitoring, inventory/GIS, PON, CPE/ACS, QoE, flows, DDoS)

Research date: 2026-10-04. Scope: network-side tooling only (billing/CRM covered by other researchers). Note on source quality: several pricing figures come from aggregator sites (Capterra, TrustRadius, Vendr, costbench) or from competitors' blogs (Flowtriq on FastNetMon/Wanguard; NetSense on SmartOLT; MapItRight on IQGeo). These are flagged inline. libreqos.com and calix.com were blocked by the fetch proxy, so their pages were seen only as search snippets.

## Q1. Monitoring/NMS and flow analytics (Zabbix, LibreNMS, Observium, PRTG, Netdisco, Nagios, Prometheus/Grafana, Akvorado, ElastiFlow, ntopng, Kentik)

### Takeaway
Small ISPs can get open-source SNMP monitoring (LibreNMS, Zabbix) and flow analytics (Akvorado) for free. These tools are device- and interface-centric. They do not natively know which subscriber sits behind a port, ONU or AP. Flow analytics splits into two groups: free tools that need real engineering effort (Akvorado, which is beta-quality, has no SaaS, and needs a lot of hardware at scale) and commercial SaaS that is priced well above small-ISP budgets (Kentik from $2k/month).

### Cited Findings
- LibreNMS is an autodiscovering PHP/MySQL NMS forked from Observium. It is rated easier to use (9.5 vs 7.3), while Zabbix is rated more scalable (distributed proxies) and more customizable (templates, triggers, actions). Source is an aggregator comparison. — [StackShare](https://stackshare.io/stackups/librenms-vs-zabbix); [G2](https://www.g2.com/compare/librenms-vs-zabbix)
- PON monitoring in Zabbix depends on community templates. One example is a C-Data FD1304E-B1 (BDCOM-compatible) EPON template that does LLD of ONUs with customer name and status and collects Rx/Tx optical power, voltage and temperature. It was tested on Zabbix 7.4.5. — [GitHub fiast/FD1304E-B1-EPON-OLT](https://github.com/fiast/FD1304E-B1-EPON-OLT)
- In Russian and Ukrainian operator forums, OLT SNMP monitoring for BDCOM and similar boxes is a long-running do-it-yourself topic (multi-page threads, templates for each Zabbix version). — [local.com.ua «Мониторинг OLT по snmp»](https://local.com.ua/forum/topic/52452-%D0%BC%D0%BE%D0%BD%D0%B8%D1%82%D0%BE%D1%80%D0%B8%D0%BD%D0%B3-olt-%D0%BF%D0%BE-snmp/page/11/); [forum.nag.ru «Мониторинг bdcom 3310c»](https://forum.nag.ru/index.php?%2Ftopic%2F147577-monitoring-bdcom-3310c%2F=); [local.com.ua Zabbix template DLink/BDCOM](https://local.com.ua/forum/topic/88117-zabbix-tempate-%D0%BD%D0%B0-dlink-%D0%B8-bdcom/)
- Zabbix publishes official integrations for some PON vendors, for example Datacom and Furukawa. — [Zabbix Datacom](https://www.zabbix.com/integrations/datacom); [Zabbix Furukawa](https://www.zabbix.com/integrations/furukawa)
- Akvorado:
  - Origin and license: developed by the French ISP Free and licensed AGPLv3. — [Vincent Bernat blog](https://vincent.bernat.ch/en/blog/2022-akvorado-flow-collector); [GitHub akvorado](https://github.com/akvorado/akvorado)
  - What it does: ingests NetFlow/IPFIX and sFlow, enriches flows with SNMP interface names, GeoIP/ASN and custom classifiers, and stores them in ClickHouse.
  - Hardware: about 100k flows/s needs 64 GB RAM and 24 vCPU.
  - Maturity: the project describes itself as beta quality.
  - Recent tutorial: [APNIC blog 2026](https://blog.apnic.net/2026/04/09/setting-up-akvorado-a-netflow-analyser-for-your-ipv6-first-network/)
- Akvorado does not deduplicate sFlow natively, so traffic sampled by several exporters inflates the bps/pps totals. — [industrialmonitordirect knowledge base (secondary)](https://industrialmonitordirect.com/blogs/knowledgebase/akvorado-sflow-deduplication-workarounds-and-configuration)
- ElastiFlow's free Basic tier allows up to 4,000 flow records/s and SNMP on up to 25 devices. Paid tiers apply above that. — [ElastiFlow subscriptions](https://www.elastiflow.com/subscriptions); [ElastiFlow licensing docs](https://www.elastiflow.com/docs/config_ref/flowcoll/license/)
- Kentik:
  - Pricing: the Pro plan starts at $2,000/month billed annually. Premier is quote-only. — [Kentik plans](https://www.kentik.com/product/plans-pricing/)
  - Vendr reports an average contract of about $440k/yr. This is aggregator data and is probably skewed toward enterprise buyers. — [Vendr](https://www.vendr.com/buyer-guides/kentik)
  - Subscriber analytics: sold as a "Service Provider Analytics" add-on. — [Capterra](https://www.capterra.com/p/180073/Kentik/)
  - Traffic Costs: a feature that computes monthly transit, peering and IX spend from SNMP volumes plus contract models. — [Kentik blog](https://www.kentik.com/blog/introducing-kentik-traffic-costs-real-time-network-cost-intelligence/)

### Inferences
- A 4k flows/s free cap (ElastiFlow) is roughly the size of a small ISP of a few thousand subscribers. Above that, the operator has to choose between running Akvorado/ClickHouse itself and paying Kentik. That leaves a missing mid-market band of roughly $100–500/month.
- No monitoring tool examined maps "interface/ONU/AP → subscriber account" automatically. In Zabbix this is done by hand: the template pulls the ONU description field as the customer name. That is a strong signal of the subscriber-linking gap.
- Root-cause analysis in these tools is essentially threshold alarms with manual dependencies. No source showed topology-aware RCA across L1 fiber, PON, L2 and L3 for small-ISP tools.

### Gaps
- No primary 2025–26 sources were gathered on Observium, PRTG, Netdisco, Nagios, Prometheus/Grafana or ntopng (pricing, ISP-specific gaps). Reddit r/wisp and r/networking threads did not surface through search. Operator quotes on these tools are still missing.
- No source was found quantifying RCA and alarm-correlation capability in LibreNMS or Zabbix for ISP topologies.

## Q2. Inventory/IPAM/documentation and GIS/fiber plant (NetBox, Nautobot, phpIPAM, Userside, 3-GIS, VETRO, IQGeo, OSPInsight, QGIS)

### Takeaway
NetBox is the de facto source of truth, but automated discovery and drift reconciliation ("intended vs actual") is now an enterprise-only feature from NetBox Labs (NetBox Assurance), and the open-source Diode pipeline still has bugs. Fiber GIS is split by price: VETRO starts at about $1,000 per user per year, while 3-GIS and IQGeo are quote-only and aimed at Tier-1 carriers. In the CIS, Userside fills the ISP-specific "ERP with plant + subscribers" niche.

### Cited Findings
- NetBox Labs' discovery pipeline: the orb-agent discovers devices and sends them to Diode, which reconciles the data into NetBox changesets. Diode now supports branching, which adds change control to ingested data. — [NetBox Discovery docs](https://netboxlabs.com/docs/discovery/); [Diode branching blog](https://netboxlabs.com/blog/diode-now-supports-branching-change-control-for-data-ingestion/)
- NetBox Assurance compares discovered state against documented state and flags undocumented devices, config drift, missing infrastructure and data-quality issues. It is **not available in NetBox Community Edition**. — [NetBox Assurance docs](https://netboxlabs.com/docs/v1.13/assurance/); [NetBox Assurance blog](https://netboxlabs.com/blog/netbox-assurance-netbox-enterprise-automatically-detect-fix-operational-drift/)
- Open GitHub issues show the Diode reconciler (v2.1.0) not producing changesets or not processing queued ingestion logs. — [diode#564](https://github.com/netboxlabs/diode/issues/564); [diode#574](https://github.com/netboxlabs/diode/issues/574)
- Third-party commercial discovery feeds into NetBox exist: Slurp'it and IP Fabric. — [Slurp'it NetBox plugin](https://slurpit.io/netbox-plugin/); [IP Fabric NetBox integration](https://docs.ipfabric.io/7.5/integrations/netbox/)
- Userside:
  - Scope: ERP for ISPs, developed since 2007. It covers subscribers, billing integrations, equipment, warehouse, fiber infrastructure, staff and service requests. — [diia.gov.ua listing](https://business.diia.gov.ua/it-market/userside); [Userside wiki](https://wiki.userside.eu/USERSIDE.network)
  - Pricing: licences start from about €1,500. The minimum Ukrainian configuration (0–3,000 subscribers) plus 12 months of updates is 70,100 UAH. — [miisoft review](https://miisoft.com.ua/ru/product/userside/)
- VETRO FiberMap starts at about $1,000 per user per year (aggregator figure). — [Capterra](https://www.capterra.com/p/193245/VETRO-FiberMap/)
- 3-GIS and IQGeo are quote-only and aimed at Tier-1 carriers. This comes from a competitor comparison page and should be treated with caution. — [MapItRight vs IQGeo](https://mapitright.com/vs/iqgeo); [NewsGiga Q&A](https://newsgiga.com/blog/fiber-mapping-software-the-complete-qa-guide/)

### Inferences
- Linking passive plant (GIS: cable → splitter → port) to active inventory (NetBox: OLT port) and then to the subscriber (billing) usually takes three separate tools joined by custom scripts. Userside is the closest to integrating all three, but it is regional to the CIS and its UX and market are local.
- "Discovery plus reconciliation" is moving behind paywalls (NetBox Enterprise, IP Fabric), so small ISPs on NetBox Community have stale documentation.

### Gaps
- No 2025–26 sources were collected on Nautobot (SSoT and discovery apps), phpIPAM, OSPInsight or QGIS-based fiber plugins. Their pricing and gaps are unverified.
- No operator complaints about VETRO, 3-GIS or IQGeo were found.

## Q3. PON/GPON OLT management (SmartOLT, Calix, Adtran Mosaic, Huawei U2000/NCE, ZTE NetNumen, BDCOM/C-Data/V-SOL, open source)

### Takeaway
Multi-vendor OLT management for small ISPs is dominated by SmartOLT, which is cheap and flat-priced but focused on provisioning and weak on monitoring. Vendor EMSs are single-vendor and are being re-platformed (Huawei U2000 is end-of-life and replaced by iMaster NCE-FAN). Low-cost Chinese OLTs (BDCOM, C-Data, V-SOL) rely on community SNMP templates.

### Cited Findings
- SmartOLT pricing and features:
  - Price: about $25 per OLT per month, with unlimited ONUs. Annual plans are $300 per OLT per year. — [SmartOLT](https://www.smartolt.com/)
  - Included: a built-in TR-069/TR-098/TR-181 ACS at no extra cost. — [SmartOLT](https://www.smartolt.com/); [comparison blog (secondary)](https://industrialmonitordirect.com/blogs/knowledgebase/gpon-olt-management-systems-isp-tool-comparison-2024)
- SmartOLT is described as provisioning-focused with weak monitoring and observability, best paired with a separate NMS. This comes from a competitor (NetSense), so treat it as biased. — [NetSense vs SmartOLT](https://netsense-nms.com/compare/smartolt)
- Huawei U2000: R018 is the last version, and U2000 is end-of-life. Newer OLTs and ONTs need iMaster NCE-FAN (or NCE-FAN Lite). NCE-FAN adds telemetry, zero-touch provisioning (ZTP), ONT optical diagnostics and northbound REST APIs. — [Huawei U2000 life-cycle bulletins](https://support.huawei.com/enterprise/en/management-system/imanager-u2000-pid-15315/bulletins?type=life-cycle-notices); [gponsolution.com](https://gponsolution.com/huawei-ont-wifi-configure-by-imaster-nce-nms.html); [xponshop NCE troubleshooting](https://www.xponshop.com/blogs/all-blogs/huawei-olt-cannot-be-added-to-imaster-nce)
- ZTE's equivalent EMS for C300/C320 OLTs is NetNumen U31. — [accio listing (low quality)](https://www.accio.com/plp/netnumen-u31)
- For C-Data and BDCOM, the community uses Zabbix templates with ONU LLD and optical power metrics. — [GitHub fiast](https://github.com/fiast/FD1304E-B1-EPON-OLT); [forum.nag.ru](https://forum.nag.ru/index.php?%2Ftopic%2F147577-monitoring-bdcom-3310c%2F=)

### Inferences
- Gap: no affordable tool combines multi-vendor provisioning (SmartOLT), optical and time-series monitoring (Zabbix templates), plant topology (which splitter and which fiber) and subscriber mapping. Proactive detection of degraded optics per splitter or per tree, used to localize a cut to a splitter or segment, appears to require custom work.

### Gaps
- No sources were gathered on Adtran Mosaic pricing or features, Calix SMx/Cloud pricing, V-SOL's EMS, or open-source OLT controllers (for example ONF VOLTHA). These need follow-up.

## Q4. CPE management / ACS and in-home Wi-Fi (GenieACS, Axiros, Friendly Tech, Calix CommandIQ, Plume, Airties, TR-369/USP)

### Takeaway
The industry is moving to TR-369/USP for Wi-Fi telemetry and AI use cases, but the main open-source ACS (GenieACS) still supports only TR-069. Rich in-home Wi-Fi visibility is effectively sold as vertically integrated platforms (Plume/OpenSync, Calix GigaSpire + CommandIQ) with opaque, quote-only pricing and lock-in.

### Cited Findings
- GenieACS does not support TR-369/USP. It has been on the roadmap since about v1.2 with no timeline, and users note that vendors such as FRITZ!Box are moving to USP. — [GenieACS forum: TR-369 support](https://forum.genieacs.com/t/tr-369-usp-support/6326); [GenieACS supports TR-369?](https://forum.genieacs.com/t/genieacs-supports-tr-369/3150); [Support for USP](https://forum.genieacs.com/t/support-for-usp/808); [XMPP/TR-369 in v1.2.13](https://forum.genieacs.com/t/compatibility-inquiry-regarding-xmpp-and-tr-369-support-in-genieacs-v1-2-13/6785)
- Broadband Forum, October 2025: providers are overwhelmingly planning to move to USP to enable AI, Wi-Fi sensing and L4S, and USP is described as critical to providers' AI plans. Separately, a Connected Home Survey figure cited by secondary sources says 85% of operators have implemented USP or intend to. — [Broadband Forum news 2025-10-09](https://www.broadband-forum.org/news/2025-10-09-report-usp-critical-to-broadband-service-provider/)
- Market-size claims (USP management market of $4.2B in 2025; more than 50M USP devices from AVSystem and Axiros) come from a low-quality market-research site. They are unverified. — [dataintelo](https://dataintelo.com/report/broadband-forum-tr369-usp-management-market)
- Incognito announced what it called the largest TR-369 deployment. — [BBC Mag](https://bbcmag.com/incognito-software-systems-announces-largest-tr-369-usp-deployment/)
- TR-181 Device:2 has been extended with Wi-Fi Alliance Data Elements (thousands of Wi-Fi KPIs), and USP Bulk Data Collection is promoted for service intelligence. — [BBF Bulk Data webinar](https://www.broadband-forum.org/public/events/increasing-service-intelligence-through-usp-tr-369-bulk-data-collection-webinar/); [QA Cafe whitepaper](https://www.qacafe.com/resources/realizing-the-connected-home-with-usp-tr-369/)
- Plume:
  - Scope: HomePass and WorkPass are cloud-managed on Plume's OpenSync framework, described as proprietary in the search summary. — [Plume CSP platform](https://www.plume.com/platform/csp)
  - OpenSync Lite targets tier-2 and tier-3, low-ARPU operators and legacy CPE. — [Wi-Fi NOW](https://wifinowglobal.com/uncategorized/plume-launches-opensync-lite-to-add-cloud-based-home-wi-fi-management-and-analytics-on-less-capable-cpes/); [Plume announcement](https://discover.plume.com/opensync-lite-announcement.html)
  - Pricing: no public per-home price was found.
- Calix:
  - CommandIQ was extended to 160+ third-party gateways in November 2024. The press release could not be fetched. — [Calix PR (blocked)](https://www.calix.com/press-release/2024/11/calix-mobile-app-experience.html); [Nasdaq mirror](https://www.nasdaq.com/press-release/calix-extends-commandiq-mobile-app-experience-160-third-party-gateways-compatible)
  - Lock-in: analysts describe Calix's model as high switching cost, with the platform acting as "outsourced R&D" for small broadband service providers (BSPs). This is an investor-analysis source. — [KoalaGains moat analysis](https://koalagains.com/stocks/NYSE/CALX/business-and-moat)
- SmartOLT bundles a TR-069 ACS (TR-098/TR-181). — [SmartOLT](https://www.smartolt.com/)

### Inferences
- For small ISPs running mixed or cheap ONT and router fleets, in-home Wi-Fi visibility today means GenieACS TR-069 polling: coarse, poll-based and without USP streaming. The alternative is buying into a closed ecosystem. This leaves an open, affordable USP controller plus Wi-Fi analytics layer missing.

### Gaps
- Axiros, Friendly Tech and Airties pricing and gaps were not researched (no sources collected).
- Open-source USP controllers (for example OB-USP-Agent and the prpl/BBF reference stacks) were not examined.

## Q5. QoE/traffic shaping (Preseem, LibreQoS, Bequant, Paraqum, Sandvine)

### Takeaway
This is the most "subscriber-aware" category. Preseem and LibreQoS measure per-subscriber latency and retransmissions and tie them to topology (AP, site). LibreQoS undercuts Preseem on price by about 4x and won WISPA Product of the Year 2025. These tools remain inline middleboxes focused on WISP and FWA, not PON-plant-aware.

### Cited Findings
- Preseem charges from $0.60 per subscriber per month with a $200 monthly minimum. It is month-to-month and offers a 30-day trial. — [TrustRadius](https://www.trustradius.com/products/preseem/pricing)
- Preseem's feature set:
  - QoE measurements are tied to network topology for root cause.
  - AP and CPE radio diagnostics.
  - AP subscriber capacity.
  - Automatic AP Capacity Management, launched in 2023. — [Preseem features](https://preseem.com/features/); [AP Capacity Mgmt](https://preseem.com/2023/05/news-automatic-access-point-capacity-management/)
- LibreQoS tiers (search snippet, because the pricing page was blocked):
  - Open source: free for up to 1,000 mapped circuits, with topology-aware shaping.
  - Local: $0.15 per subscriber per month.
  - Insight: $0.30 per subscriber per month, adding history up to 1 year, ASN analysis and multi-shaper views. — [LibreQoS pricing](https://libreqos.com/pricing)
- LibreQoS won the 2025 WISPA Product of the Year. — [LibreQoS news](https://libreqos.io/2025/10/09/product-of-the-year-2025/)
- Paraqum Wi-Di is a DPI-based shaper:
  - Application classes: transactional, bulk, best-effort and scavenger.
  - Hierarchical shaping trees.
  - Active QoE measurement of latency and retransmissions.
  - "ACE" automatic congestion elimination. — [Paraqum Wi-Di](https://www.paraqum.com/products/wi-di/); [datasheet](https://www.paraqum.com/assets/Datasheets/Paraqum_Wi-Di_Datasheet.pdf)
- Bequant detects congestion and manages capacity to keep QoE constant. — [Bequant](https://www.bequant.com/)

### Inferences
- QoE tools measure the experience from TCP traffic, but they stop at the CPE. They cannot tell whether bad QoE comes from in-home Wi-Fi or from the access network unless they are fused with ACS/USP data. That fusion appears absent.

### Gaps
- Sandvine (AppLogic) has no public pricing, and the post-2023 restructuring status was not verified.
- Bequant pricing was not found.

## Q6. DDoS protection (FastNetMon, Wanguard, cloud scrubbing)

### Takeaway
Detection plus BGP blackhole or FlowSpec is affordable: about $100–150/month. Licensing models differ: FastNetMon is priced by bandwidth, Wanguard by component. The extra costs are dashboards, servers and scrubbing capacity. Most of the detailed comparison data comes from a competitor (Flowtriq), so treat it with caution.

### Cited Findings
- FastNetMon Advanced is about $115/month for 10G, $220/month for 40G and $350/month for 100G, plus a dedicated server. The LiveView dashboard is extra at about $70 per user per month, and support is limited to 1–3 tickets/month. Source: a competitor blog (Flowtriq), which is biased. — [Flowtriq comparison](https://flowtriq.com/blog/fastnetmon-vs-wanguard-vs-flowtriq); [SaaSworthy FastNetMon pricing](https://www.saasworthy.com/product/fastnetmon/pricing)
- Wanguard is about $595/yr for a Sensor and $995/yr for a Filter, with the DPDK engine at $1,410/yr. Source: also Flowtriq. — [Flowtriq Wanguard alternative](https://flowtriq.com/blog/wanguard-alternative-2026)

### Inferences
- For small ISPs the gap is not detection but mitigation capacity. Without scrubbing, blackholing completes the attack on the victim subscriber.

### Gaps
- Cloud scrubbing pricing for small ISPs (Cloudflare Magic Transit, Path, Voxility, DDoS-Guard and others) was not researched.
- FastNetMon Community edition limits were not verified from the primary source.

## Q7. Cross-market gaps (subscriber linkage, discovery/reconciliation, RCA, CX measurement, in-home Wi-Fi) and affordability

### Takeaway
Each category does one layer well. The missing product is a correlation layer that joins plant and GIS, active inventory, PON optics, flows and QoE, and CPE/Wi-Fi telemetry to the subscriber account, and that does topology-aware RCA ("which customers are affected and why") at a price small ISPs can pay. That price is roughly $0.1–0.5 per subscriber per month, the range LibreQoS and Preseem have set.

### Cited Findings
- Subscriber-to-network linkage is done manually or within one silo:
  - Zabbix PON templates use the ONU description as the customer name. — [GitHub fiast](https://github.com/fiast/FD1304E-B1-EPON-OLT)
  - Preseem links QoE to its own topology. — [Preseem features](https://preseem.com/features/)
  - Kentik sells subscriber analytics only as an add-on on top of a $24k+/yr base. — [Kentik plans](https://www.kentik.com/product/plans-pricing/)
- Automated discovery and reconciliation in the NetBox ecosystem is enterprise-only (Assurance) or third-party paid (IP Fabric, Slurp'it). The open Diode pipeline has open reconciler bugs. — [NetBox Assurance](https://netboxlabs.com/docs/v1.13/assurance/); [diode#564](https://github.com/netboxlabs/diode/issues/564)
- In-home Wi-Fi telemetry is moving to USP, but the open-source ACS lacks USP. — [GenieACS forum](https://forum.genieacs.com/t/tr-369-usp-support/6326); [BBF 2025](https://www.broadband-forum.org/news/2025-10-09-report-usp-critical-to-broadband-service-provider/)
- Price benchmarks:

| Tool | Price |
|---|---|
| SmartOLT | $25 per OLT per month |
| LibreQoS | $0.15–0.30 per subscriber per month |
| Preseem | $0.60 per subscriber per month, $200 minimum |
| FastNetMon | ~$115/month (10G) |
| VETRO | ~$1,000 per user per year |
| Userside | from ~€1,500 |
| Kentik | ≥$2,000/month |
| 3-GIS / IQGeo / Plume / Calix | quote-only |

Sources for the prices above are cited in Q2–Q6.

### Inferences
Feature-and-gap matrix (synthesized from the sources above):

| Category | Tools | Strong at | Lacks |
|---|---|---|---|
| NMS (open source) | LibreNMS, Zabbix | Free; autodiscovery (LibreNMS); scale and templating (Zabbix) | Subscriber mapping, plant awareness, topology RCA; PON support relies on community templates |
| Flows (open/free) | Akvorado, ElastiFlow Basic | Rich enrichment, ClickHouse speed (Akvorado) | Beta quality, heavy hardware, no SaaS, sFlow dedup (Akvorado); 4k fps cap (ElastiFlow) |
| Flows (SaaS) | Kentik | Peering and cost analytics, subscriber add-on | Price: ≥$24k/yr |
| Source of truth | NetBox CE | Data model, ecosystem | Discovery and drift detection are Enterprise-only; Diode bugs |
| ISP ERP (CIS) | Userside | Subscribers, plant, equipment and staff in one place | Regional; licence cost; does not replace NMS or QoE |
| Fiber GIS | VETRO; 3-GIS, IQGeo | Design and documentation | Per-seat or quote pricing; weak live link to OLT optics and subscriber status (inferred, not sourced) |
| OLT management | SmartOLT; vendor EMS | Cheap multi-vendor provisioning plus ACS (SmartOLT); deep single-vendor features (EMS) | Monitoring and observability (SmartOLT); vendor lock-in and EOL churn such as U2000 (EMS) |
| ACS | GenieACS | Free TR-069 | No USP; limited Wi-Fi analytics |
| Wi-Fi platforms | Plume, Calix | Deep in-home visibility | Closed, quote-only, high switching costs |
| QoE/shaping | LibreQoS, Preseem, Paraqum, Bequant | Per-subscriber latency, topology-tied RCA for WISP/FWA | No in-home or PON-optics fusion; inline box |
| DDoS | FastNetMon, Wanguard | Cheap detection plus BGP actions | Mitigation capacity; extras such as dashboards and servers |

- The opportunity is to aggregate rather than replace. A product could ingest from NetBox, SmartOLT/OLT SNMP, GenieACS/USP, LibreQoS/Preseem, Akvorado and billing, then compute a per-subscriber health score and blast-radius RCA.

### Gaps
- Direct operator quotes on what is missing were not captured. Reddit r/wisp and r/networking, NANOG/RIPE/ENOG talks and Habr posts did not surface in search, so "what operators say" rests mainly on GenieACS and nag.ru/local.com.ua forum activity rather than explicit complaint threads.
- No market-sizing data was found for "subscriber-aware NOC correlation" tools, and competitors in that niche were not identified.
