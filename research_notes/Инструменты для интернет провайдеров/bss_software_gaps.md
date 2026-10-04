# Business-side ISP software (billing / OSS-BSS / CRM / helpdesk / portals / field service / inventory / payments): feature and gap matrix

Method note: research done 2026-10-04 with web search only. Direct page fetches were blocked by the egress proxy for most vendor sites (splynx.com, sonar.software, hydra-billing.ru, carbonsoft.ru, vasexperts.ru, forum.nag.ru, businesswire.com, wiki.splynx.com). Because of that, many findings below come from search-result snippets of the cited pages, not from full reads. Treat individual numbers as "as indexed by search", and re-check them on the vendor page before quoting them as final. Vendor-authored comparison pages (e.g. Splynx "vs" pages) are biased.

## Q1. Product landscape: what each product does well, what it lacks, pricing model (feature-and-gap matrix)

### Takeaway
The CIS market is split three ways. Some products are licensed per subscriber count and run on the provider's own servers (LANBilling, UTM5/NetUP, Userside, Hydra). Others are free or open source (Ubilling/Stargazer, ABillS core). Carbon Billing is sold as a subscription. Global small-ISP products (Splynx, Visp, Sonar, Powercode, gaiia, Azotel, UISP CRM) are mostly cloud/SaaS and charge per subscriber per month. Only a few of them (gaiia, Rev.io, Sonar, Splynx) shipped visible AI features in 2025–2026.

### Cited Findings

**Matrix (Y = confirmed by source, ? = not confirmed / not found, N = source says absent)**

| Product | Region | Pricing model (as found) | Subscriber app / portal | Messenger bot | Installer / field app | Network integration (RADIUS etc.) | AI features 2023–26 |
|---|---|---|---|---|---|---|---|
| Splynx | Global (strong in WISP) | Per subscriber: from ~$0.55 down to ~$0.165 at 10,001+ subs; from ~$255/mo | Y (customer portal mobile app with tickets + WhatsApp chat) | WhatsApp (CommsApp) | Y (rebuilt Field Service app, Jan 2026) | Y (TR-069 ACS) | Y (Splynx AI: ticket grading) |
| Sonar | Global (US) | ? (quote) | ? | ? | ? | ? | Y (Sonar Retain: churn detection + agent coaching) |
| Visp | US WISP/fiber | $1.30/sub/mo (0–3k subs), $0.80 (8,001+), $500 onboarding, $250 minimum | Y (self-help portal) | ? | ? | Y (managed hosted RADIUS, hotspot) | ? |
| Powercode | US | Per subscriber, runs on your hardware, quote only | ? | ? | ? | ? | none found |
| Azotel | Global | Setup fee of several thousand dollars + monthly fee per 100 subs; quote-based | ? | ? | ? | ? | none found |
| gaiia | US/Canada | ? (quote); $40M Series B, May 2026 | Y (e-commerce/CRM) | ? | field service listed as investment area | network-agnostic | Y (AI agents/nodes using Claude, Gemini, OpenAI) |
| Rev.io | US (MSP/telecom) | ? (early-bird pricing on next-gen platform) | ? | ? | predictive scheduling/dispatch | ? | Y (ticket routing, anomaly detection, etc.) |
| UISP CRM (Ubiquiti) | Global WISP | free with UISP; payments through Ubiquiti Payment Gateway | ? | ? | ? | Y (Ubiquiti gear) | none found |
| Hydra (Гидра) | RU/global | ? (pricing page not readable); >50% of code ships with source; Hydra OMS is Apache-licensed | ? | ? | ? | Y (provisioning, pre-billing) | none found |
| LANBilling 2.0 | RU | 12-month licence by subscriber count: 118,800₽ (≤5k), 180,000₽ (≤10k), 280,000₽ (≤20k) | ? | ? | ? | ? | none found |
| NetUP UTM5 / Billing 5+ | RU | ? | ? | ? | ? | ? | none found; still releasing (5.5-033, Jul 2026) |
| Carbon Billing 5 | RU | Subscription; no upfront licence/implementation fee; licence price negotiated | Y (web cabinet with mobile layout); N (no native app: third-party Inetra app) | Telegram (notifications, balance) | ? | Y | none found |
| ABillS | UA/CIS | Open source core + paid modules (amounts not found) | Y (ABillS Lite, Android/iOS) | Telegram + Viber bots | ? | Y | none found |
| Ubilling (Stargazer) | UA | Free / open source | ? | ? | ? | Y (switch map) | none found |
| Userside (ERP) | UA/CIS/EU | One-off licence + 12 months updates: from €1,500; €6,890 package on EU site; 70,100 UAH (0–3,000 clients) | n/a (it is an ERP/inventory, not billing) | ? | Y ("Мои задания" installer app) | Y (infrastructure model; integrates with billings) | none found |

**Splynx**
- Per-subscriber pricing from $0.55 down to $0.165/subscriber at 10,001+; listings also say "from $0.5". — [Capterra](https://www.capterra.com/p/220185/Splynx/); [GetApp pricing](https://www.getapp.com/finance-accounting-software/a/splynx/pricing/)
- Pricing "starts at $255 per month", aimed at SMB ISPs. — [SourceForge](https://sourceforge.net/software/product/Splynx/)
- CommsApp: a mobile app for support agents that pulls in tickets and WhatsApp conversations. — [Splynx blog: CommsApp](https://splynx.com/blog/customer-service/splynx-commsapp/)
- Customer Portal mobile app has a Tickets tab; subscribers can chat with an agent over WhatsApp. TR-069 ACS is used for self-care. — [Splynx blog: self-service](https://splynx.com/blog/customer-service/shift-towards-user-self-care-leveraging-splynx-customer-portal-tr-069-acs/)
- Field Service App rebuilt and released around 2026-01-05 (tasks, documentation, navigation, equipment handling). — [Splynx blog: Field Service app](https://splynx.com/blog/business-automation/splynx-field-service-new-mobile-app/); [Google Play](https://play.google.com/store/apps/details?id=com.splynx.scheduling2)
- Splynx AI add-on: automated grading of support tickets/feedback with neural networks. — [Splynx wiki: AI](https://wiki.splynx.com/addons_modules/ai) (snippet only)
- Feature-request board shows unmet demand, e.g. "customer onboarding in technicians app". — [features.splynx.com](https://features.splynx.com/p/customer-onboarding-in-technicians-app)

**Sonar**
- Capterra: 3.5/5 from 4 reviews. Complaints:
  - "some days we can't even process payments"
  - ~7% of credit-card transactions failing
  - releases that feel untested ("we do their beta testing")
  - a data migration that "took months to correct"
  - French-language support promised but missing
  - Praise: phone support. — [Capterra Sonar](https://www.capterra.com/p/181997/Sonar-billing-engine/)
- Q1 2025: account archives and DataConnect (data access). — [Sonar blog Q1 2025](https://sonar.software/blog/from-streamlining-to-scaling-whats-new-in-sonar-q1-2025)
- Sonar Retain (with QueSee): AI that analyses every customer call, flags at-risk subscribers and coaches agents in real time. — [Sonar blog: Retain](https://sonar.software/blog/new-feature-sonar-retain-powered-by-quesee)
- Q2 2025 shipped list and Q3 roadmap published. Details could not be fetched. — [Sonar blog Q2 2025](https://sonar.software/blog/what-we-shipped-in-q2-and-what-were-doing-next)

**Visp**
- $1.30/sub/mo for 0–3,000 subs; $0.80 for 8,001+; $500 setup (credited after 30 days); $250 minimum (covers the first 192 subs). Includes a self-help portal, managed hosted RADIUS, hotspot and "100% uptime guarantee". — [Visp](https://visp.net/); [Visp ISP billing](https://visp.net/isp-billing-software/)
- Public changelog exists. — [Visp changelog](https://visp.net/changelog/)

**Powercode / Azotel**
- Powercode: per subscriber, runs on customer-owned hardware, prices not public. Supports postpaid, true prepaid, usage-based and VoIP/CDR billing. — [Powercode](https://powercode.com/); [Splynx vs Powercode (vendor-biased)](https://splynx.com/compare/powercode-vs-splynx/)
- Azotel: setup fee of several thousand dollars plus a recurring fee per 100 subscribers; quote-based. Historically over $10k for self-hosted. — [ISPbox: Azotel alternative (competitor-authored)](https://ispbox.net/alternatives/azotel); [MTIN Consulting](https://www.mtin.net/blog/tag/azotel-2/)

**gaiia**
- Cloud OSS/BSS: e-commerce, CRM, billing, workforce ops and provisioning in one system. — [gaiia.com](https://gaiia.com/)
- $40M Series B led by JMI Equity (May 2026). Money goes to AI agents, field service, productized migrations and customer success. — [BusinessWire](https://www.businesswire.com/news/home/20260512467690/en/gaiia-Raises-$40-Million-Series-B-Led-by-JMI-Equity-to-Modernize-the-Operating-System-for-Communications-Service-Providers); [BetaKit](https://betakit.com/telecom-software-startup-gaiia-secures-40-million-usd-series-b-round/)
- Positions itself as "AI-native system of action". It has embedded AI nodes (Claude, Gemini, OpenAI) for building agents for incident response, scheduling and fulfillment. Claims "10M+ workflows" processed (vendor claim). — [gaiia Series B page](https://gaiia.com/b); [TAMradar](https://www.tamradar.com/funding-rounds/gaiia-series-b-40m)

**Rev.io**
- Next-gen platform made generally available in September 2025: PSA, telecom billing, payments, RMM. AI is used for ticket routing, predictive scheduling, automated dispatch, anomaly detection and analytics. It claims "80% fewer manual tasks, 30% retention boost" (vendor marketing, not verified). — [Rev.io news](https://www.rev.io/company-news/revio-ai-powered-psa-billing-rmm-payments-launch); [PRNewswire](https://www.prnewswire.com/news-releases/revio-rolls-out-next-gen-platform-with-early-bird-pricing-and-powerful-new-features-302500929.html)
- Focus is MSP/telecom rather than small fixed ISPs. — [rev.io](https://www.rev.io/)

**UISP CRM**
- Has a CRM billing module, Ubiquiti Payment Gateway, prepaid/reactivation, an API and cloud hosting. — [UISP Payment Gateway](https://help.uisp.com/hc/en-us/articles/22590998395543-UISP-CRM-Ubiquiti-Payment-Gateway); [UISP CRM API](https://help.uisp.com/hc/en-us/articles/22590956856087-UISP-CRM-API-Usage)
- Community bug report: autopayments stop processing after a plan or bill change (versions 1.3.11–1.4.3). — [community.ui.com](https://community.ui.com/questions/14822dbc-9178-45e9-ac1e-7a2cf975e43e)

**Hydra (Гидра)**
- OSS/BSS with built-in billing, provisioning, pre-billing, CRM and helpdesk. Aimed at mid/large operators with convergent services. — [hydra-billing.ru](https://hydra-billing.ru/)
- More than 50% of the system ships with source code; Hydra OMS community edition is under the Apache licence. — [Cyclowiki](https://cyclowiki.org/wiki/Hydra_Billing); [hydra-billing.com](https://hydra-billing.com/)

**LANBilling**
- 12-month (time-limited) licence priced by subscriber count:
  - 118,800₽ for ≤5,000 subscribers — [BestHard](https://besthard.ru/litsenziya-na-po-asr-lanbilling-20-do-5-000/)
  - 180,000₽ for ≤10,000 — [SoftMap](https://softmap.ru/network-solutions/lanbilling-base/element-litsenziya-na-po-asr-lanbilling-2-0-do-10-000/)
  - 280,000₽ for ≤20,000 — [SoftMap](https://softmap.ru/network-solutions/lanbilling-base/element-litsenziya-na-po-asr-lanbilling-2-0-do-20-000/)
  - Modules priced separately — [LANBilling module prices](https://www.lanbilling.ru/prices/modules/)
- Certified convergent billing (one account, many services); runs on FreeBSD, CentOS or Debian. — [Syssoft](https://www.syssoft.ru/Network-Solutions/LANBilling-Base/)

**NetUP UTM5 / Billing 5+**
- The UTM 5.0 line reached end of life; replaced by UTM 5+. — [NetUP EoS notice](https://www.netup.ru/ru/news/year2020/utm50eos); [UTM5+ announcement](https://www.netup.ru/ru/news/year2019/utm5plus)
- Still releasing: 5.5-030 (Jan 2025), 5.5-031 (Nov 2025), 5.5-032 (Mar 2026), 5.5-033 (Jul 2026). — [NetUP changelog](https://www.netup.ru/ru/utm5/change)

**Carbon Billing 5**
- No upfront licence or implementation fee; subscription; licence price is negotiated. — [Carbon pricing](https://www.carbonsoft.ru/carbon-billing-5-price/)
- No native mobile app. It uses a web cabinet with a mobile layout; a native app is available from the third party Inetra. — [Carbon docs: mobile app](https://docs.carbonsoft.ru/pages/viewpage.action?pageId=187138125)
- Telegram notifications and balance/tariff queries. — [Carbon docs: personal cabinet](https://docs.carbonsoft.ru/pages/viewpage.action?pageId=49087183)
- Ready-made migrations from UTM, LANBilling and Hydra. — [carbonsoft.ru](https://www.carbonsoft.ru/products/carbon_billing/)
- Release cadence continues (5.71). — [Release 5.71](https://www.carbonsoft.ru/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7-carbon-billing-5-71/)

**ABillS**
- ABillS Lite: free subscriber app for Android and iOS. — [ABillS wiki: Lite](http://abills.net.ua/wiki/pages/viewpage.action?pageId=35815586)
- Telegram and Viber bots for balance and services. — [ABillS wiki: Telegram bot](http://abills.net.ua/wiki/display/AB/Telegram+Bot)
- Migration from MikBill, Nodeny, Stargazer and Trafpro; integration with Userside and Ubilling. — [ABillS wiki: migration](http://abills.net.ua/wiki/pages/viewpage.action?pageId=2523144); [ABillS news (Telegram)](https://t.me/s/abills_news/79)

**Ubilling / Stargazer**
- Free open-source billing (Ukraine) with an equipment/user map and auto-update. — [ubilling.net.ua](https://ubilling.net.ua/); [Ubilling switch map](https://wiki.ubilling.net.ua/doku.php?id=switchmap)

**Userside**
- An ERP for infrastructure: a multi-level model of sites, networks and equipment. It is an inventory/OSS layer that sits on top of a billing system. — [userside.eu](https://www.userside.eu/en/)
- Licence from €1,500. €6,890 package with 12 months of updates (EU site). 70,100 UAH for 0–3,000 clients (Ukraine). — [miisoft review](https://miisoft.com.ua/ru/product/userside/); [Diia business](https://business.diia.gov.ua/it-market/userside)
- Installer app "Мои задания": tasks by date, overdue tasks, task creation, nearby nodes/splice closures on a map. — [Google Play](https://play.google.com/store/apps/details?hl=en_US&id=ru.intronex.mytask); [taskusers.com](https://taskusers.com/about_us)
- Wiki documents integrations with LANBilling and Ubilling. — [Userside wiki LANBilling](https://wiki.userside.eu/LANBilling); [Userside wiki Ubilling](https://wiki.userside.eu/UBilling)

### Inferences
- In the CIS a typical small ISP runs a "billing + Userside" pair: LANBilling/UTM/ABillS/Ubilling/Carbon for billing, Userside for inventory, maps and installers. This means two vendors, two UIs and integration glue. Global SaaS (Splynx, Visp, gaiia) bundles all of this.
- Cheapest options: free Ubilling/ABillS core in the CIS; Splynx and Visp at about $0.2–1.3 per sub per month globally.

### Gaps
- Not researched or not verified, because fetches were blocked or there were no results:
  - Mikbill, Nodeny, StargazerBilling specifics
  - Bitrix24-based ISP CRMs and 1C integrations
  - WHMCS- and Odoo-based ISP stacks
  - Sonar and Powercode published price lists
  - Hydra price list
- Whether UISP CRM is actively developed in 2026 (no deprecation notice found).

## Q2. Which products offer: self-service apps, Telegram/WhatsApp bots, auto-diagnostics, integrated network data, GIS, installer apps, inventory, APIs, churn analytics, AI

### Takeaway
Self-service portals and basic messenger bots are common: ABillS and Carbon have Telegram, Splynx has WhatsApp. Installer apps exist in Userside and Splynx. AI churn prediction is rare (Sonar Retain). Agentic AI is only explicit in gaiia (and Rev.io, which is MSP-oriented). No CIS product with an AI feature was found.

### Cited Findings
- Splynx combines TR-069 ACS with the customer portal so subscribers can fix CPE issues themselves. This is the closest thing to auto-diagnostics found. — [Splynx blog](https://splynx.com/blog/customer-service/shift-towards-user-self-care-leveraging-splynx-customer-portal-tr-069-acs/)
- Messenger bots: Telegram + Viber (ABillS), Telegram (Carbon), WhatsApp (Splynx). — [ABillS](http://abills.net.ua/wiki/display/AB/Telegram+Bot); [Carbon docs](https://docs.carbonsoft.ru/pages/viewpage.action?pageId=49087183); [Splynx CommsApp](https://splynx.com/blog/customer-service/splynx-commsapp/)
- GIS/maps:
  - Userside installer app shows nodes/closures on a map — [Google Play](https://play.google.com/store/apps/details?hl=en_US&id=ru.intronex.mytask)
  - Ubilling has an equipment map — [Ubilling wiki](https://wiki.ubilling.net.ua/doku.php?id=switchmap)
- Churn analytics: Sonar Retain (call analysis, at-risk flags). — [Sonar](https://sonar.software/blog/new-feature-sonar-retain-powered-by-quesee)
- AI agents: gaiia (LLM nodes for incident response, scheduling, fulfillment). — [gaiia](https://gaiia.com/b)
- Rev.io AI: anomaly detection and predictive dispatch. — [Rev.io](https://www.rev.io/company-news/revio-ai-powered-psa-billing-rmm-payments-launch)
- APIs:
  - UISP CRM API — [UISP](https://help.uisp.com/hc/en-us/articles/22590956856087-UISP-CRM-API-Usage)
  - Sonar DataConnect — [Sonar](https://sonar.software/blog/from-streamlining-to-scaling-whats-new-in-sonar-q1-2025)
  - Userside integration APIs — [Userside wiki](https://wiki.userside.eu/UBilling)

### Inferences
- "Auto-diagnostics" means: the subscriber says "no internet", and the system checks RADIUS session, ONU optical levels, switch port and payment status, then answers. None of the cited products advertise this end to end. The data exists across billing (RADIUS) and Userside/OLT systems, but no one ties it together in a bot.

### Gaps
- No confirmation found for:
  - OLT/ONU signal-level integration in any billing portal
  - churn-prediction ML in CIS products
  - native webhooks in LANBilling, UTM5 or Hydra

## Q3. Recurring user complaints

### Takeaway
Documented complaints centre on:
- payment-processing reliability and buggy releases (Sonar)
- painful migrations (Sonar, which in turn drives vendors to sell "productized migrations")
- autopay bugs (UISP CRM)
- high licence and setup costs (Azotel; LANBilling's yearly licence)

### Cited Findings
- Sonar: payment failures (~7% of card transactions), untested releases, a months-long migration fix, a missing language. — [Capterra](https://www.capterra.com/p/181997/Sonar-billing-engine/)
- UISP CRM: autopay breaks after a plan change. — [Ubiquiti community](https://community.ui.com/questions/14822dbc-9178-45e9-ac1e-7a2cf975e43e)
- Azotel: setup in the thousands of dollars, historically over $10k (competitor source). — [ISPbox](https://ispbox.net/alternatives/azotel)
- LANBilling licences expire after 12 months, so it is effectively a recurring cost. — [Syssoft](https://www.syssoft.ru/Network-Solutions/LANBilling-Base/)
- gaiia funds "productized migrations", which implies migration pain is a market-wide barrier. — [BetaKit](https://betakit.com/telecom-software-startup-gaiia-secures-40-million-usd-series-b-round/)
- NetUP ended the UTM 5.0 line, forcing upgrades. — [NetUP](https://www.netup.ru/ru/news/year2020/utm50eos)

### Inferences
- Common CIS complaints include an old UI, Perl/PHP legacy stacks and vendor lock-in. They are likely, but no citations could be retrieved because forum.nag.ru and habr were not fetchable.

### Gaps
- No sourced evidence was collected on:
  - RU sanctions and payment issues (foreign gateways, Stripe/PayPal unavailability, СБП adoption in billing)
  - reddit r/wisp sentiment
  - G2 review text for Splynx and Powercode

## Q4. AI/automation features 2023–2026 and features missing market-wide

### Takeaway
AI so far shows up as narrow add-ons: ticket grading (Splynx), call-based churn and coaching (Sonar), LLM workflow nodes (gaiia), routing/dispatch/anomaly detection (Rev.io). No product found offers an end-to-end AI support agent that diagnoses a subscriber's line from network data. No CIS billing system advertises AI at all.

### Cited Findings
- Splynx AI ticket grading — [Splynx wiki](https://wiki.splynx.com/addons_modules/ai)
- Sonar Retain (2025) — [Sonar](https://sonar.software/blog/new-feature-sonar-retain-powered-by-quesee)
- gaiia AI agents and LLM nodes (2025–26) — [gaiia](https://gaiia.com/b)
- Rev.io AI platform (September 2025) — [Rev.io](https://www.rev.io/company-news/revio-ai-powered-psa-billing-rmm-payments-launch)

### Inferences: features missing across the market (candidate opportunities)
1. An AI first-line support bot (Telegram/WhatsApp/web) that checks billing balance, RADIUS session, ONU/port status and outages before opening a ticket.
2. Churn prediction from network signals as well as call recordings: degraded optical levels, repeated disconnects, payment lateness. Sonar only uses calls.
3. A single subscriber 360° view across CIS billing and Userside without custom glue.
4. Installer app with AI help: photo-based checks of installation quality, auto-reconciling equipment/ТМЦ write-offs to tickets, offline maps.
5. Migration tooling as a product. Migrations are a known pain (Sonar complaints, gaiia investment).
6. RU-specific: modern UI, SaaS, local payment rails (СБП, ЮKassa) and 1C export in one product. This needs verification; it was not sourced in this session.

### Gaps
- AI features for Powercode, Visp, Azotel, UISP, Hydra, Userside and Carbon were not found. This may mean they don't exist, or that the search could not see them (vendor pages were blocked).
