# Global Forum Pain Points of Small/Medium ISPs and WISPs (2020–2026)

> Method note (read first): the web-search tool refuses reddit.com outright ("domains not accessible to our user agent"), and the fetch proxy blocked full-page reads of preseem.com, fierce-network.com, calix.com, capterra.com, g2.com, seclists.org (NANOG archive), ripe86.ripe.net and community.librenms.org. So most findings below come from **search-result snippets** of those pages rather than full reads. Forum threads that were indexed (MikroTik forum, GenieACS forum, LibreNMS/Zabbix forums) are cited by URL. Vendor blogs (Preseem, Splynx, Sonar, NetBox Labs) are marked as vendor sources because they have a commercial interest in the problem they describe. Frequency is given as a rough qualitative signal (High/Med/Low), based on how often a theme showed up across independent sources, not on a count.

## Q1. What do practitioners complain about, by area (forums, mailing lists, trade press)?

### Takeaway
The pain points that came up most often and from the most independent sources were: (1) firmware/upgrade regressions on core gear (MikroTik RouterOS v7 BGP/PPPoE), (2) "slow internet" tickets that turn out to be in-home Wi-Fi, leading to wasted truck rolls, (3) billing/OSS migrations and pricing (Sonar 2.0, Splynx outages), (4) regulatory paperwork (FCC BDC, BEAD letter of credit, BEAD's treatment of unlicensed FWA), (5) labor shortages, (6) IPv4 cost and CGNAT side-effects, and (7) DDoS against small regional ISPs (especially Brazil). Outside the US, physical infrastructure threats dominate in Africa (power cuts, battery and generator theft, vandalism), and in the UK altnet sector the problem is low take-up and difficult consolidation.

### Cited Findings

**Network operations / firmware regressions (High)**
- MikroTik forum: operators reported that upgrading RouterOS v6 to v7.13 broke BGP. V6 and V7 "don't map perfectly, especially BGP". Known breakages: routing filters that don't explicitly "accept" a prefix stop working, and peers with update-source set to an interface name fail after the upgrade — [MikroTik forum: BGP routing problems after upgrade v6→v7.13](https://forum.mikrotik.com/t/bgp-routing-problems-after-upgrade-from-v6-to-v7-13/172122); [RouterOS v6 to v7 update broke my BGP peering](https://forum.mikrotik.com/t/routeros-v6-to-v7-update-broke-my-bgp-peering/154157); [OS upgrade issue v6→v7](https://forum.mikrotik.com/t/os-upgrade-issue-from-version-6-to-version-7/167216)
- PPPoE regressions in RouterOS 7.20.x (the subscriber-termination path for many WISPs/FTTH ISPs): after 7.20.2, PPPoE servers would not come up, with logs saying sessions were "already authenticated". Users running PPPoE on VLANs were told to avoid that version because of a confirmed bug. A PPPoE client also stopped working in v7.20 — [Problems with pppoes in 7.20.2](https://forum.mikrotik.com/t/problems-with-pppoes-in-version-7-20-2/265876); [v7.20 PPPoE client no longer working](https://forum.mikrotik.com/t/v7-20-pppoe-client-no-longer-working/265270); [v7.20.5 release thread](https://forum.mikrotik.com/t/v7-20-5-stable-is-released/266717)
- The vendor's own changelog confirms the regression: v7.20.6 notes "pppoe-server - fixed client disconnects when multiple servers with different service names are active (introduced in v7.20)" and fixes BGP VRF parameters that went missing from templates after upgrade — [v7.20.6 stable release](https://forum.mikrotik.com/t/v7-20-6-stable-is-released/266877)

**Monitoring noise / alert fatigue (Med)**
- A LibreNMS community thread is titled "I am fed up with the false alerts". Another asks how to alert on ports flapping up/down too much. Suggested fixes are SQL-override rules (for example, alert if a port changes state 4 times in 25 minutes) and delays of at least 2 polling periods on device-down alerts. Snippet-level only, because the page fetch was blocked — [LibreNMS: I am fed up with the false alerts](https://community.librenms.org/t/i-am-fed-up-with-the-false-alerts/20415); [LibreNMS: port flapping](https://community.librenms.org/t/alert-port-flapping-up-down-too-much/10380)
- Zabbix forum threads "False alarms every day" and "What to do about flapping alerts". Zabbix's own blog admits triggers are often too sensitive, and that dozens of flapping emails lead teams to "start ignoring all emailed alerts". Its remedy is hysteresis — [Zabbix forum: false alarms every day](https://www.zabbix.com/forum/zabbix-troubleshooting-and-problems/18449-false-alarms-every-day?t=17990); [Zabbix forum: flapping](https://www.zabbix.com/forum/zabbix-help/33701-what-to-do-about-flapping-alerts); [Zabbix blog: No more flapping](https://blog.zabbix.com/no-more-flapping-define-triggers-the-smart-way/1488/)

**Documentation / IPAM drift (Med; mostly vendor-framed)**
- The "fractured source of truth": monitoring says one thing, NetBox another, the device config a third, and "the Excel spreadsheet in someone's OneDrive claims to be authoritative". The source claims 60% of documentation projects fail and accuracy drops to 15–30% without automated sync. These are vendor-adjacent figures with no primary study cited, so treat them with caution — [Itential: Network Source of Truth platforms](https://www.itential.com/resource/guide/network-source-of-truth-platforms/); [Intelligent Visibility: Your network documentation might be fibbing](https://intelligentvisibility.com/blog/netbox-assurance-network-drift-detection)
- ISP-specific framing: for an ISP with multiple upstreams and hundreds of customer circuits, NetBox replaces the "circuit map" spreadsheet — [ayuda.la: NetBox as source of truth for ISPs (LatAm)](https://ayuda.la/en/blog/netbox-fuente-de-verdad-isp/)
- NetBox Labs now sells "Assurance" and "Discovery" add-ons specifically to detect drift between documented and live state. That suggests plain NetBox doesn't solve drift on its own — [NetBox Assurance](https://netboxlabs.com/products/netbox-assurance/); [NetBox Discovery](https://netboxlabs.com/products/netbox-discovery/)

**Billing / OSS / BSS (High)**
- Splynx review cons: frequent downtime (one reviewer reported 15 outages in a month), price not matching value, "adds new features instead of fixing core problems", unresolved billing issues, and poor bank-record integration. Support is generally praised — [Software Advice: Splynx reviews](https://www.softwareadvice.com/billing-and-provisioning/splynx-profile/); [G2: Splynx pros & cons](https://www.g2.com/products/splynx/reviews?qs=pros-and-cons); [Trustpilot: Splynx](https://www.trustpilot.com/review/www.splynx.com)
- Sonar: reviewers called migrating to Sonar 2.0 "a huge mistake". Data migration was "a major catastrophe that took months to correct", and one reviewer reported nearly 7% of credit-card transactions failing. Pricing is $1.25/subscriber/month with a $500/month floor. Source is a Capterra snippet; competitor comparison pages also push this narrative, so it is biased — [Capterra: Sonar reviews](https://www.capterra.com/p/181997/Sonar-billing-engine/); [Sonar pricing](https://sonar.software/pricing); [Splynx vs Sonar (competitor page)](https://splynx.com/compare/sonar-vs-splynx/)
- UK altnets: consolidation is slowing because "buyers cannot absorb what they acquire, with OSS/BSS as the bottleneck". Vendor source (COS Systems) — [COS Systems: Altnet consolidation integration problem](https://www.cossystems.com/knowledge-hub/news/altnet-consolidation-integration-problem/)

**CRM & support / "my internet is slow" (High)**
- In one consumer survey, subscribers blamed the ISP for streaming slowdowns 36% of the time and their own Wi-Fi 35.9% of the time. Telecom operators estimate 17–20% of all field dispatches are "no fault found". Tickets that should take 2 minutes take 10–15 minutes because agents jump between systems. Vendor source (Preseem), snippet only — [Preseem: How ISPs can reduce slow internet support tickets (Apr 2026)](https://preseem.com/2026/04/how-isps-can-reduce-slow-internet-support-tickets/)
- RouteThis (vendor) lists the questions support agents ask on home-network calls — [RouteThis blog](https://blog.routethis.com/questions-isp-support-agents-ask-on-home-network-calls/)

**Field service & installs (Med)**
- Truck-roll cost estimates: $150–$600 per roll, or $150–$300 fully loaded for fiber operators. One source says ~$1,000 including indirect costs, while noting "there is no verified industry benchmark". NFF estimates run from 17–20% to 20–40% of rolls. All figures are vendor estimates — [AEX: truck roll cost benchmarks for fiber](https://aexinc.com/blog/truck-roll-cost-benchmarks-fiber); [vsight: truck roll / avoidable dispatch](https://vsight.io/glossary/what-is-a-truck-roll/); [Smarty: truck roll costs](https://www.smarty.com/articles/truck-roll-costs)

**Fiber / PON (Med)**
- OLT vendor lock-in: Huawei OLTs are locked to Huawei ONUs by default. Nokia OLTs can reject third-party ONTs even after serial/MAC cloning by checking vendor ID, equipment ID and OMCI behavior. Third-party ONTs (ZTE, FiberHome, VSOL, C-DATA) often fail OMCI negotiation on Huawei OLTs — [Ascent Optics: PON module compatibility](https://ascentoptics.com/blog/pon-optical-module-compatibility); [ISPreview forum: replacing ISP ONT with GPON SFP](https://www.ispreview.co.uk/talk/threads/replace-isp-ont-onu-with-gpon-fibre-transceiver.40637/)
- Rogue ONTs (transmitting outside their time slot) take down every ONT on the same PON port, and the operator often does "not know why" — [ISE Magazine: Beware of Rogue ONTs](https://www.isemag.com/fttx-optical-networks/article/14267982/beware-of-rogue-onts); [Albedo Telecom white paper](https://www.albedotelecom.com/src/lib/WP-Rogue-ONT.pdf)

**CPE management / TR-069 (Med)**
- GenieACS forum: CPE TR-069 implementation bugs, e.g. ZTE F670L/F680 problems setting PeriodicInformTime. Some vendors won't allow inform intervals under 30s. Some devices (ZTE, Zyxel, AVM, ADB) need TR-069 enabled and the ACS URL set by hand — [GenieACS forum: TR-069 any brand CPE](https://forum.genieacs.com/t/tr-069-any-brand-cpe/1760/1); [GenieACS: LTE CPE firmware upgrade issue](https://forum.genieacs.com/t/lte-cpe-firmware-upgrade-issue/5294)
- Skills gap: an ISP posts "Where can I find a technician to install and configure a genieacs server for me? I'm an ISP" — [GenieACS forum](https://forum.genieacs.com/t/where-can-i-find-a-technician-to-install-and-configure-a-genieacs-server-for-me-im-an-isp/1168)

**Fixed wireless / spectrum (Med)**
- Unlicensed bands: "interference and congestion are commonplace", QoS is hard to guarantee on shared spectrum, and rules "can change at any time". In CBRS it is hard to get more than 80 MHz, and higher-power users could overwhelm low-power ones — [arXiv: Communications over unlicensed sub-8 GHz spectrum (2024)](https://arxiv.org/pdf/2412.11002)
- WISPA and rural ISPs urged the FCC to "keep its hands off CBRS". Separately, the CBRS transition could leave some WISP customers without service — [Light Reading](https://www.lightreading.com/5g/wispa-rural-isps-urge-fcc-to-keep-its-hands-off-cbrs); [Telecompetitor](https://www.telecompetitor.com/cbrs-transition-could-leave-some-wisp-customers-without-service/)

**Security / DDoS (High in Brazil)**
- In Feb 2026, Brazil saw 17,527 DDoS attacks in one week, about 99% of them against five small regional fiber ISPs. These ISPs run on thin margins and commodity routing hardware with "little to no dedicated DDoS mitigation" — [A10 Networks](https://www.a10networks.com/blog/attackers-hit-brazils-regional-isps-telcos-the-1-ddos-target-globally/)
- KrebsOnSecurity reported an anti-DDoS firm that was itself attacking Brazilian ISPs — [Krebs (Apr 2026)](https://krebsonsecurity.com/2026/04/anti-ddos-firm-heaped-attacks-on-brazilian-isps/)
- Context: Brazil has about 22,000 ISPs, and small providers (PPPs) held 57% of fixed broadband in Q2 2025 — [A10 Networks](https://www.a10networks.com/blog/attackers-hit-brazils-regional-isps-telcos-the-1-ddos-target-globally/); [SDxCentral LatAm](https://www.sdxcentral.com/analysis/fiber-surge-meets-fragmentation-the-latin-american-fixed-network-landscape/)

**CGNAT / IPv4 / IPv6 (Med)**
- IPv4 leases cost about $0.40–0.50/IP/month in 2026, and purchase about $30–40+/IP — [LARUS](https://larus.net/blog/current-ipv4-lease-rates-what-to-expect-2026/); [netElastic](https://netelastic.com/how-to-avoid-the-high-costs-of-ipv4-addresses/)
- RIPE 86 operator talk (Rinse Kloek, 2023): 464XLAT was cheaper than CGN. CGN brings operational costs such as IPv4 addresses being blacklisted (by Sony and others), the need to rotate addresses, and resolving customer problems — [RIPE86 slides](https://ripe86.ripe.net/presentations/67-RPE86-IPv6-deployment-journey.pdf_1.2.pdf)
- CGNAT customer complaints: strict/Type 3 NAT on consoles, no port forwarding, broken P2P/voice chat and self-hosting — [openportcheckers](https://openportcheckers.com/blog/why-port-forwarding-fails-with-cgnat); [AnandTech: The CGNAT spanner in the works](https://at-web1.www.anandtech.com/show/18692/the-ubiquiti-diaries-a-sitetosite-vpn-story/3); [NANOG CGNAT thread 2021](https://seclists.org/nanog/2021/Feb/571) (body not read; fetch blocked)
- Traditional CGNAT appliances are priced for large carriers, and small and emerging-market ISPs can't afford them (vendor claim) — [6WIND](https://www.6wind.com/ipv4-address-exhaustion-a-case-for-cgnat/)

**Regulatory: FCC BDC / BEAD / grants (High, US)**
- WISPs face significant BDC paperwork costs, and there is a shortage of certified PEs with RF expertise. The FCC renewed its waiver of the PE-certification requirement, which WISPA called a "big win for WISPs, especially small providers" — [Fierce Network](https://www.fierce-network.com/broadband/industry-groups-react-fcc-renews-waiver-broadband-data-rule); [WISPA BDC comments (Oct 2024)](https://host8.viethwebhosting.com/~wisp/docs/SeptOctWISPA_Comments_re_BDC_FNPRM_as_filed_10.7.24.pdf)
- The FCC acknowledged that the 30-day correction window burdens small providers with "limited staffing and monetary resources" — [FCC streamlining BDC](https://docs.fcc.gov/public/attachments/DOC-421212A1.pdf)
- The BEAD letter of credit was opposed by WISPA plus 50+ small ISPs because banks require fees plus cash collateral, which "makes less funding available for deployment". NTIA later issued a conditional programmatic waiver — [Light Reading](https://www.lightreading.com/broadband/push-against-bead-letter-of-credit-gets-more-isp-support); [Light Reading: coalition](https://www.lightreading.com/broadband/coalition-forms-against-bead-letter-of-credit-requirement); [Inside Towers](https://insidetowers.com/wispa-fights-provision-in-bead-funding/)
- BEAD treats areas served only by unlicensed fixed wireless as unserved. WISPA's CEO said the association couldn't get "a straight answer" from NTIA on why. Separately, WISPA says Kentucky regulators misread the BEAD rules — [Fierce Network](https://www.fierce-network.com/telecom/wispa-ceo-says-its-not-clear-why-bead-rules-deem-fwa-unreliable); [Broadband Breakfast](https://broadbandbreakfast.com/wispa-claims-kentucky-regulators-misinterpreted-bead-rules/)

**Staffing (High)**
- Smaller ISPs, municipals and co-ops struggle to hire contractors and technical staff. FBA/PCCA estimate that 58,000 new workers (28k construction, 30k technicians) are needed by 2032, while the existing workforce is retiring — [Fierce: Where are all the fiber technicians?](https://www.fierce-network.com/broadband/workforce-short-enthusiasm-where-are-all-fiber-technicians); [Pew (Nov 2025)](https://www.pew.org/en/about/news-room/opinion/2025/11/24/how-americas-plans-to-expand-broadband-could-be-hindered-by-workforce-shortage); [The CGO](https://www.thecgo.org/benchmark/labor-shortages-in-broadband-are-likely-to-slow-deployment/)

**Africa: power and physical security (High regionally)**
- South Africa: load shedding drains tower batteries, which need 12–18 hours to recharge against 6–12 hours of capacity. Telkom lost 7,841 batteries in a year. Vodacom loses over R120m a year to about 700 theft/vandalism incidents per month — [MyBroadband](https://mybroadband.co.za/news/telecoms/338500-battery-theft-epidemic-in-south-africa.html); [Connecting Africa](https://www.connectingafrica.com/connectivity/sa-towers-hit-by-power-cuts-theft-and-vandalism)
- Nigeria: vandalism rose from 2 to 5 incidents per day after May 2025 (445 cases in 88 days). 656 power assets were stolen in 2025. Right-of-way permits are slow — [Tech In Africa](https://www.techinafrica.com/telecom-vandalism-surges-in-nigeria-disrupting-essential-services-and-threatening-national-security/); [ThisDay (Jun 2026)](https://www.thisdaylive.com/2026/06/04/as-telecoms-operators-groan-under-severe-infrastructure-attack/)
- These figures are mostly from mobile operators, but the same power and theft issues apply to WISP towers.

**Europe: churn, take-up, consolidation (Med)**
- UK altnets: 19.7M premises passed, 3.5M connected (18% take-up vs ~38% for Openreach), with take-up ranging from 4% to about 50% by operator. The sector lost about £1.5bn in 2024 and carries about £9bn of debt. Commentators describe it as "moving from expansion to survival" and "entering its most dangerous phase yet" — [INCA State of the Altnets 2026](https://inca.coop/state-of-the-altnets-2026/); [Comms Business](https://www.commsbusiness.co.uk/content/news/altnet-sector-moving-from-expansion-to-survival); [Computer Weekly](https://www.computerweekly.com/news/366636114/UK-altnet-market-entering-its-most-dangerous-phase-yet)

### Inferences
- Many problems cut across areas. The same "slow internet" ticket involves support (Wi-Fi blame), field service (no-fault-found rolls) and tooling (agents switching between systems). That points to a gap in correlating data from billing/CRM, network monitoring and CPE.
- Small ISPs carry vendor-induced risk: firmware regressions (MikroTik), OLT/ONT lock-in (Huawei/Nokia) and billing-platform migrations (Sonar 2.0) all produce outages or months of cleanup that a small team absorbs directly.
- Regulatory work (BDC filings, BEAD) is a recurring labor cost for US WISPs with no revenue attached. That makes it a candidate for automation tooling.

### Gaps
- No Reddit content (r/wisp, r/ISP, r/networking, r/sysadmin) could be retrieved because the domain is blocked for the search agent. Practitioner quotes from Reddit are therefore missing and should be gathered by another method.
- No direct material was found on Powercode, Visp, Gaiia, Paraqum, PRTG, SmartOLT, Calix or Adtran Mosaic complaints (G2/Capterra pages blocked). WISPA/WISPTalk, DSLReports and podcasts (The ISP Show) were not reached.
- The full NANOG CGNAT thread could not be read.
- UISP-specific complaints (e.g., CRM feature stagnation) were not found. I couldn't confirm the widely rumored community view that UISP CRM has been deprioritized.

## Q2. What are the biggest time sinks in support?

### Takeaway
"Slow internet" tickets caused by in-home Wi-Fi, and dispatches that end in "no fault found", are the main time sinks the sources identify. Agents also lose time switching between disconnected systems. The quantitative evidence comes mostly from vendors.

### Cited Findings
- Subscribers blame their own Wi-Fi (35.9%) almost as often as the ISP (36%). 17–20% of dispatches are no-fault-found. Simple tickets stretch to 10–15 minutes because of system hopping. Vendor source (Preseem) — [Preseem Apr 2026](https://preseem.com/2026/04/how-isps-can-reduce-slow-internet-support-tickets/)
- NFF visits "usually take less than five minutes to diagnose and fix" and could be solved without going on site. Estimates run up to 20–40% NFF — [vsight](https://vsight.io/glossary/what-is-a-truck-roll/); [Smarty](https://www.smarty.com/articles/truck-roll-costs)
- Preseem markets a "single, topology-aware view" (QoE, plan enforcement, RF link, AP health) for support agents. This implies agents otherwise lack that combined view — [Preseem customer support](https://preseem.com/customer-support/)
- CGNAT-related tickets (gaming NAT type, port forwarding) and IP blacklisting add support load — [RIPE86 slides](https://ripe86.ripe.net/presentations/67-RPE86-IPv6-deployment-journey.pdf_1.2.pdf)

### Inferences
- Remote Wi-Fi diagnostics combined with a per-subscriber QoE timeline is the most consistently cited missing support capability.

### Gaps
- No independent (non-vendor) study gives the share of ISP tickets caused by in-home Wi-Fi. The 36%/35.9% figure comes from a consumer survey cited by a vendor, and its primary source was not identified.

## Q3. Recurring complaints about specific tools

### Takeaway
Concrete, sourced complaints exist for MikroTik RouterOS, Splynx, Sonar, LibreNMS/Zabbix (noise), NetBox (drift) and GenieACS (CPE interoperability). The other tools on the list remained unverified because the review sites and Reddit could not be reached.

### Cited Findings
- **MikroTik RouterOS v7**: BGP filter semantics changed and PPPoE server regressions in 7.20.x — [forum](https://forum.mikrotik.com/t/bgp-routing-problems-after-upgrade-from-v6-to-v7-13/172122); [forum](https://forum.mikrotik.com/t/problems-with-pppoes-in-version-7-20-2/265876)
- **Splynx**: outages (15 in a month according to one reviewer), value for money, new features over fixes, bank reconciliation — [Software Advice](https://www.softwareadvice.com/billing-and-provisioning/splynx-profile/)
- **Sonar**: painful 2.0 migration, card failure rate, per-subscriber pricing — [Capterra](https://www.capterra.com/p/181997/Sonar-billing-engine/)
- **LibreNMS / Zabbix**: false alerts and flapping need hand-tuned rules — [LibreNMS](https://community.librenms.org/t/i-am-fed-up-with-the-false-alerts/20415); [Zabbix forum](https://www.zabbix.com/forum/zabbix-troubleshooting-and-problems/18449-false-alarms-every-day?t=17990)
- **NetBox**: documentation diverges from the live network unless it is synced automatically — [Itential](https://www.itential.com/resource/guide/network-source-of-truth-platforms/)
- **GenieACS**: vendor TR-069 quirks; hard to find people who can deploy it — [GenieACS forum](https://forum.genieacs.com/t/tr-069-any-brand-cpe/1760/1); [GenieACS forum](https://forum.genieacs.com/t/where-can-i-find-a-technician-to-install-and-configure-a-genieacs-server-for-me-im-an-isp/1168)
- **OLT ecosystems (Huawei/Nokia)**: ONT lock-in — [Ascent Optics](https://ascentoptics.com/blog/pon-optical-module-compatibility)

### Inferences
- The pattern is that each tool solves one slice, and integration and consistency between tools is left to the ISP.

### Gaps
- Powercode, Visp, Gaiia, UISP, Preseem (user complaints), Paraqum, PRTG, SmartOLT, Calix and Adtran Mosaic: no verified practitioner complaints were collected.

## Q4. Data/insight ISPs say they wish they had

### Takeaway
The sources point to wanting per-subscriber, topology-aware visibility into quality of experience (QoE) that ties network events to customer tickets and in-home Wi-Fi state. They also want an accurate, automatically reconciled inventory/IPAM and maps that are ready to file with regulators. Much of this is inferred from what vendors sell rather than stated directly by operators.

### Cited Findings
- Tower, sector and subscriber-level QoE, and spotting trouble "before tickets come in" (vendor framing) — [Preseem fixed wireless](https://preseem.com/fixed-wireless/); [j2sw blog (WISP operator Justin Wilson)](https://blog.j2sw.com/netops/qoe-solutions-for-isps-enhancing-subscriber-experience-through-optimized-networks/)
- Drift detection between documented and live network — [NetBox Assurance](https://netboxlabs.com/products/netbox-assurance/)
- Location-level coverage data aligned to the FCC Fabric, so ISPs can file BDC and fabric challenges (missing locations, wrong addresses or coordinates) — [FCC BDC help: Fabric challenges](https://help.bdc.fcc.gov/hc/en-us/articles/8103890293275-Challenges-to-the-Broadband-Serviceable-Location-Fabric); [Sonar BDC guide](https://sonar.software/blog/a-guide-to-navigating-the-new-fcc-data-collection-filing)
- UK altnets: take-up and churn data. Altnets "severely underestimated customers' willingness and ease of churning" — [Computer Weekly](https://www.computerweekly.com/news/366596242/UK-fibre-forges-forward-but-further-altnet-consolidation-likely); [INCA](https://inca.coop/state-of-the-altnets-2026/)

### Inferences
- Churn prediction (which subscribers are at risk, based on QoE and ticket history) is implied as valuable, but I found no operator quote stating it directly.

### Gaps
- Direct operator statements ("I wish I could see X") from Reddit, WISPA talks or podcasts were not retrievable.
