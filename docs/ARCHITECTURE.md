# Платформа провайдера: как всё строить, чтобы работало сразу

Этот документ — инструкция по сборке единой платформы, на которой работают все модули из папки [`modules/`](modules/README.md), а также идеи из отчёта (`reports/`). Главное правило: **каждый модуль — не отдельная программа, а «приложение» на общем фундаменте**. Фундамент строится один раз, после чего новый модуль подключается за дни, а не месяцы.

---

## 1. Принципы

1. **Сначала читать, потом писать.** Первые месяцы платформа только читает данные из существующих систем (биллинг, RADIUS, OLT, Zabbix). Ничего не ломается, провайдеру не нужно ничего менять.
2. **Один граф «абонент ↔ сеть».** Все модули отвечают на вопросы через один и тот же граф: какой абонент, где живёт, через какое оборудование подключён, кто ещё на этом оборудовании.
3. **Всё — события.** Модули не вызывают друг друга напрямую. Они публикуют и слушают события в общей шине. Новый модуль можно добавить, не трогая старые.
4. **Адаптеры вместо переделок.** Под каждый биллинг, OLT, коммутатор — свой адаптер. Ядро не знает вендоров.
5. **Опасные действия — только с подтверждением.** Всё, что меняет сеть или деньги, проходит через журнал, права доступа и (для массовых действий) подтверждение человеком.
6. **Скучные надёжные технологии.** PostgreSQL, ClickHouse, NATS, Docker. Ничего экзотического.
7. **Запуск одной командой.** `docker compose up -d` поднимает всю платформу на одном сервере. Масштабирование — позже, когда понадобится.

---

## 2. Общая схема

```
                        ┌────────────────────────── Интерфейсы ──────────────────────────┐
                        │  Веб-панель (React) · Telegram Mini App абонента · Telegram-бот │
                        │  Мобильное приложение монтажника (PWA) · Публичная статус-стр.  │
                        └──────────────────────────────┬─────────────────────────────────┘
                                                       │ HTTPS / REST + WebSocket
                         ┌─────────────────────────────┴───────────────────────────┐
                         │                   API-шлюз (gateway)                     │
                         │        вход, JWT, роли (RBAC), журнал действий           │
                         └───┬──────────────┬──────────────┬──────────────┬────────┘
                             │              │              │              │
          ┌──────────────────┴──┐  ┌────────┴───────┐  ┌───┴──────────┐ ┌─┴──────────────┐
          │  СЕРВИСЫ ЯДРА       │  │ МОДУЛИ         │  │ ИИ-слой      │ │ Публичные API  │
          │  graph   (граф)     │  │ power-outages  │  │ llm-gateway  │ │ для партнёров  │
          │  geo     (адреса)   │  │ field-reports  │  │ mcp-server   │ │ (УК, застрой-  │
          │  tasks   (заявки)   │  │ quote          │  │ агенты       │ │ щики)          │
          │  notify  (рассылки) │  │ booking  ...   │  └──────────────┘ └────────────────┘
          │  files   (фото)     │  └────────┬───────┘
          │  auth    (доступ)   │           │
          └──────────┬──────────┘           │
                     │       ┌──────────────┴───────────────┐
                     └──────►│  Шина событий NATS JetStream │◄────────┐
                             └──────────────┬───────────────┘         │
                                            │                         │
       ┌────────────────────────────────────┴───────────┐   ┌─────────┴────────────┐
       │                 КОННЕКТОРЫ (адаптеры)            │   │ Хранилища            │
       │ billing-*: UTM5, LANBilling, ABillS, Userside,   │   │ PostgreSQL+PostGIS   │
       │   Hydra, свой биллинг, CSV                        │   │ ClickHouse           │
       │ radius: FreeRADIUS/accel-ppp (accounting, CoA)    │   │ Redis                │
       │ olt-*: BDCOM, C-Data, Huawei, ZTE, V-SOL (SNMP,   │   │ MinIO (S3)           │
       │   telnet/ssh, syslog, трапы)                      │   └──────────────────────┘
       │ switch: SNMP (LLDP, FDB, порты), syslog           │
       │ zabbix / librenms: API, вебхуки                   │
       │ acs: GenieACS (TR-069)                            │
       │ external: энергетики, погода, сайты конкурентов   │
       └────────────────────────────────────────────────────┘
```

---

## 3. Сервисы ядра (строятся первыми)

| Сервис | Что делает | Хранилище |
|---|---|---|
| **gateway** | Единая точка входа: авторизация (JWT), роли, лимиты запросов, журнал всех действий | PostgreSQL (`audit_log`) |
| **auth** | Пользователи, роли, двухфакторный вход, ключи API для партнёров | PostgreSQL |
| **graph** | Граф «абонент ↔ сеть»: абоненты, услуги, адреса, устройства, порты, связи; ответ на «кто зависит от чего» | PostgreSQL (таблицы узлов и рёбер) |
| **geo** | Адреса (нормализация по ФИАС/ГАР или OSM), координаты, полигоны районов, расстояния | PostgreSQL + PostGIS |
| **tasks** | Заявки, наряды, инциденты, статусы, SLA, исполнители | PostgreSQL |
| **notify** | Все рассылки: Telegram, SMS, e-mail, push, голос; шаблоны, тихие часы, лимиты | PostgreSQL + Redis (очереди) |
| **files** | Фото, документы, вложения; превью; ссылки с ограниченным сроком | MinIO |
| **telemetry** | Приём метрик и событий сети (сигналы ONU, статусы портов, сессии) | ClickHouse |
| **scheduler** | Периодические задачи (опросы, сверки, отчёты) | Redis |

### 3.1. Граф «абонент ↔ сеть»

Хранится в PostgreSQL как узлы и рёбра — без отдельной графовой БД, этого хватает до сотен тысяч абонентов.

```sql
-- Узлы графа: всё, что может быть в сети
CREATE TABLE graph_node (
  id           BIGSERIAL PRIMARY KEY,
  kind         TEXT NOT NULL,      -- subscriber, service, address, building, entrance,
                                   -- olt, pon_port, splitter, onu, switch, switch_port,
                                   -- router, uplink, node_site (узел связи), cable, pole
  external_ref TEXT,               -- id во внешней системе (биллинг, OLT, Userside)
  source       TEXT,               -- откуда узнали: billing, snmp, lldp, manual
  attrs        JSONB NOT NULL DEFAULT '{}',
  geom         geometry(Geometry, 4326),
  confidence   REAL NOT NULL DEFAULT 1.0,   -- насколько уверены в факте (0..1)
  seen_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (kind, external_ref)
);

-- Рёбра: кто к чему подключён / кто от кого зависит
CREATE TABLE graph_edge (
  id         BIGSERIAL PRIMARY KEY,
  from_id    BIGINT NOT NULL REFERENCES graph_node(id),
  to_id      BIGINT NOT NULL REFERENCES graph_node(id),
  kind       TEXT NOT NULL,        -- connected_to, located_at, served_by, powered_by, part_of
  source     TEXT,
  confidence REAL NOT NULL DEFAULT 1.0,
  seen_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (from_id, to_id, kind)
);
CREATE INDEX ON graph_edge (to_id, kind);
CREATE INDEX ON graph_node USING gist (geom);
```

Главный запрос платформы — **«кого заденет»** (все абоненты ниже узла):

```sql
WITH RECURSIVE downstream AS (
  SELECT id FROM graph_node WHERE id = :node_id
  UNION
  SELECT e.from_id FROM graph_edge e
  JOIN downstream d ON e.to_id = d.id
  WHERE e.kind IN ('connected_to', 'served_by')
)
SELECT n.* FROM graph_node n JOIN downstream d ON n.id = d.id
WHERE n.kind = 'subscriber';
```

Обратный запрос **«от чего зависит абонент»** — тот же рекурсивный обход в другую сторону. Его используют диагностика, ИИ-бот и расчёт аварий.

### 3.2. Шина событий

NATS JetStream. События — JSON с общим конвертом:

```json
{
  "id": "01J9Z6K3...",               // ULID, уникальный
  "type": "onu.dying_gasp",          // тип события
  "time": "2026-10-04T21:13:05Z",
  "source": "olt-bdcom",             // кто опубликовал
  "subject": {"kind": "onu", "id": 48211},
  "data": { ... },                   // полезная нагрузка
  "trace_id": "..."                  // для поиска цепочки событий
}
```

Имена потоков (subjects) — `платформа.домен.событие`:

| Поток | Примеры событий |
|---|---|
| `net.>` | `net.onu.dying_gasp`, `net.onu.los`, `net.port.down`, `net.device.unreachable` |
| `sub.>` | `sub.created`, `sub.offline`, `sub.online`, `sub.moved`, `sub.terminated` |
| `bill.>` | `bill.payment.received`, `bill.blocked`, `bill.tariff.changed` |
| `inc.>` | `inc.opened`, `inc.updated`, `inc.resolved` |
| `task.>` | `task.created`, `task.assigned`, `task.done` |
| `ext.>` | `ext.power.planned`, `ext.weather.alert`, `ext.competitor.price` |
| `notify.>` | `notify.request`, `notify.sent`, `notify.failed` |

Правила:
- каждое событие обрабатывается **идемпотентно** (повторная доставка не должна ничего ломать — проверка по `id`);
- события хранятся 30 дней (можно «проиграть заново» после ошибки);
- схемы событий лежат в репозитории `schemas/events/*.json` и проверяются в тестах.

### 3.3. Коннекторы

Каждый коннектор — отдельный контейнер с одним интерфейсом:

```python
class Connector(Protocol):
    name: str
    def discover(self) -> Iterable[GraphFact]: ...        # что есть (узлы, связи)
    def poll(self) -> Iterable[Metric | Event]: ...       # метрики и состояния
    def listen(self) -> Iterator[Event]: ...              # трапы, syslog, вебхуки
    def act(self, action: Action) -> ActionResult: ...    # действия (только если разрешено)
```

- `discover` пишет факты в граф (через `graph` API), с указанием источника и уверенности.
- `poll` и `listen` пишут метрики в ClickHouse и события в шину.
- `act` по умолчанию **выключен**. Включается отдельно для каждого коннектора и каждого типа действия.

Порядок поддержки (от самых частых в СНГ): CSV-импорт → ABillS / LANBilling / UTM5 / Userside → FreeRADIUS / accel-ppp → BDCOM / C-Data → Huawei / ZTE → Zabbix → GenieACS.

---

## 4. Технологии

| Слой | Выбор | Почему |
|---|---|---|
| Сервисы и модули | **Python 3.12 + FastAPI** | Быстро писать, много библиотек для SNMP (`pysnmp`), SSH (`netmiko`, `scrapli`), ML, геоданных |
| Ядро денег (если делаем свой биллинг) | **Go** | Надёжность и скорость для финансового журнала |
| Основная БД | **PostgreSQL 16 + PostGIS** | Транзакции, геоданные, JSONB, рекурсивные запросы |
| Метрики и логи | **ClickHouse** | Миллиарды строк, быстрые отчёты |
| События | **NATS JetStream** | Простой, лёгкий, надёжный |
| Кэш, очереди задач | **Redis** | Стандарт |
| Файлы | **MinIO** (S3) | Фото монтажа, документы |
| Веб-панель | **React + TypeScript + Vite**, карта **MapLibre** | Современно, без платных карт |
| Абонент | **Telegram Mini App** + веб-кабинет | Абоненту не нужно ставить приложение |
| Монтажник | **PWA** (работает офлайн) | Без публикации в сторах |
| ИИ | **llm-gateway** (Claude или локальная модель) + **MCP-сервер** поверх API | ИИ работает через те же права и журнал, что и люди |
| Мониторинг платформы | Prometheus + Grafana + Loki | Видно, что сама платформа здорова |
| Запуск | **Docker Compose** (один сервер) → Kubernetes (если вырастет) | Работает сразу |

---

## 5. Структура репозитория

```
isp-platform/
├── README.md
├── docker-compose.yml            # вся платформа одной командой
├── .env.example                  # все настройки с комментариями
├── Makefile                      # make up / make test / make seed / make migrate
├── schemas/
│   ├── events/                   # JSON Schema всех событий
│   └── api/                      # OpenAPI всех сервисов
├── core/
│   ├── gateway/
│   ├── auth/
│   ├── graph/
│   ├── geo/
│   ├── tasks/
│   ├── notify/
│   ├── files/
│   └── telemetry/
├── connectors/
│   ├── billing_csv/
│   ├── billing_abills/
│   ├── billing_lanbilling/
│   ├── billing_utm5/
│   ├── userside/
│   ├── radius/
│   ├── olt_bdcom/
│   ├── olt_cdata/
│   ├── olt_huawei/
│   ├── switch_snmp/
│   ├── zabbix/
│   └── external/                 # энергетики, погода, сайты
├── modules/                      # прикладные модули (см. docs/modules)
│   ├── power_outages/
│   ├── field_reports/
│   ├── theft_detector/
│   ├── quote/
│   └── ...
├── ai/
│   ├── llm_gateway/
│   └── mcp_server/
├── web/                          # React-панель
├── tma/                          # Telegram Mini App
├── bot/                          # Telegram-бот
├── field_app/                    # PWA монтажника
├── libs/
│   └── platform_sdk/             # общая библиотека: события, граф, авторизация, логи
├── migrations/                   # миграции БД (Alembic)
├── seed/                         # демо-данные: город, 2 OLT, 500 абонентов
├── simulator/                    # симулятор сети для тестов и демо
└── tests/
    ├── unit/
    ├── contract/                 # проверка схем событий и API
    └── e2e/                      # сценарии целиком на симуляторе
```

### 5.1. Общая библиотека `platform_sdk`

Чтобы каждый модуль писался быстро и одинаково, всё общее — в SDK:

```python
from platform_sdk import Module, on_event, graph, notify, tasks

app = Module("power_outages")

@on_event("ext.power.planned")
async def handle_planned_outage(evt):
    buildings = await graph.find_buildings(evt.data["addresses"])
    subs = await graph.subscribers_in(buildings)
    await notify.send(subs, template="power_planned", data=evt.data)
    await app.suppress_alerts(buildings, evt.data["start"], evt.data["end"])
```

SDK даёт: подключение к шине, к графу, к уведомлениям и заявкам; авторизацию между сервисами; логи с `trace_id`; метрики Prometheus; проверку схем событий; тестовые заглушки.

---

## 6. Запуск «одной командой»

### 6.1. Требования к серверу

| Размер провайдера | CPU | RAM | Диск |
|---|---|---|---|
| до 5 000 абонентов | 4 ядра | 16 ГБ | 200 ГБ SSD |
| до 30 000 | 8 ядер | 32 ГБ | 500 ГБ SSD |
| до 100 000 | 16 ядер | 64 ГБ | 1–2 ТБ NVMe (ClickHouse на отдельном диске) |

ОС: Ubuntu 24.04 LTS или Debian 12, Docker 27+, Docker Compose v2.

### 6.2. `docker-compose.yml` (основа)

```yaml
services:
  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: isp
      POSTGRES_USER: isp
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: [pg_data:/var/lib/postgresql/data]
    healthcheck: {test: ["CMD", "pg_isready", "-U", "isp"], interval: 5s}

  clickhouse:
    image: clickhouse/clickhouse-server:24.8
    volumes: [ch_data:/var/lib/clickhouse]
    ulimits: {nofile: {soft: 262144, hard: 262144}}

  nats:
    image: nats:2.10
    command: ["-js", "-sd", "/data"]
    volumes: [nats_data:/data]

  redis:
    image: redis:7

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    volumes: [minio_data:/data]

  migrate:                         # применяет миграции и завершается
    build: ./migrations
    depends_on: {postgres: {condition: service_healthy}}

  gateway:   {build: ./core/gateway,   depends_on: [migrate], ports: ["443:8443"]}
  graph:     {build: ./core/graph,     depends_on: [migrate, nats]}
  geo:       {build: ./core/geo,       depends_on: [migrate]}
  tasks:     {build: ./core/tasks,     depends_on: [migrate, nats]}
  notify:    {build: ./core/notify,    depends_on: [migrate, nats, redis]}
  files:     {build: ./core/files,     depends_on: [minio]}
  telemetry: {build: ./core/telemetry, depends_on: [clickhouse, nats]}
  web:       {build: ./web,            depends_on: [gateway]}

  # Коннекторы и модули включаются профилями:
  conn-billing-abills: {build: ./connectors/billing_abills, profiles: ["abills"]}
  conn-olt-bdcom:      {build: ./connectors/olt_bdcom,      profiles: ["bdcom"]}
  mod-power-outages:   {build: ./modules/power_outages,     profiles: ["power"]}
  # ...

  simulator:           {build: ./simulator, profiles: ["demo"]}

volumes: {pg_data: {}, ch_data: {}, nats_data: {}, minio_data: {}}
```

### 6.3. Шаги запуска

```bash
git clone <репозиторий> isp-platform && cd isp-platform
cp .env.example .env            # заполнить пароли и адреса систем
make up                         # = docker compose up -d
make seed                       # (по желанию) демо-город для проверки
open https://<сервер>/          # вход: admin / пароль из .env
```

Включить нужные коннекторы и модули — указать профили в `.env`:

```
COMPOSE_PROFILES=abills,bdcom,power,field,quote
```

### 6.4. «Работает сразу»: демо-режим

`COMPOSE_PROFILES=demo` запускает **симулятор**: виртуальный город на 500 абонентов, 2 OLT, 10 коммутаторов, биллинг с балансами. Симулятор генерирует аварии, dying gasp, отключения света, платежи. Это нужно для трёх вещей:
1. провайдер видит, как всё работает, **до** подключения своей сети;
2. разработчики проверяют модули без доступа к реальной сети;
3. e2e-тесты гоняются на симуляторе в CI.

---

## 7. Порядок строительства

Строим так, чтобы **после каждого этапа уже была польза**.

| Этап | Срок* | Что строим | Польза сразу после этапа |
|---|---|---|---|
| **0. Скелет** | 1–2 недели | Репозиторий, docker-compose, `platform_sdk`, gateway+auth, миграции, CI, симулятор | Платформа запускается, есть вход и журнал |
| **1. Граф и данные** | 3–4 недели | `graph`, `geo`, коннекторы CSV/биллинг/RADIUS/OLT (только чтение), `telemetry` | Карта абонентов и оборудования; поиск «кого заденет» |
| **2. Связь с людьми** | 2–3 недели | `notify`, `tasks`, `files`, Telegram-бот, веб-панель | Рассылки об авариях, заявки, фото |
| **3. Быстрые модули** | 3–4 недели | Плановые отключения электричества, реестр критичных абонентов, народный контроль, окно плановых работ | Меньше звонков, меньше ложных алертов |
| **4. Деньги и продажи** | 4–6 недель | Мгновенный расчёт стоимости подключения, онлайн-запись на монтаж, конструктор тарифа, учёт стоимости аварий | Больше подключений, видно цену аварий |
| **5. Склад и подрядчики** | 3–4 недели | Восстановление б/у оборудования, контроль подрядчиков, энергоучёт узлов, SLA аплинков | Экономия на оборудовании и подрядчиках |
| **6. Безопасность и рост** | 4–6 недель | Детектор краж кабеля, работа с застройщиками, «тайный покупатель», детектор перепродажи | Защита сети, новые районы |
| **7. ИИ-слой** | 4–6 недель | `llm-gateway`, `mcp-server`, ИИ-агенты поверх всех модулей | ИИ работает с теми же данными и правами |

\* Сроки — для команды 2–3 разработчика с ИИ-помощником.

---

## 8. Безопасность

- **Сеть:** платформа ставится во внутреннюю сеть провайдера; наружу открыт только gateway (HTTPS) и статус-страница. Доступ к оборудованию — через отдельную management-VLAN.
- **Учётные данные к оборудованию** — в зашифрованном хранилище (sops/age или HashiCorp Vault), никогда в коде и в логах. Для чтения — отдельные учётки «только чтение» (SNMP v3, read-only пользователи).
- **Роли:** админ, руководитель, NOC-инженер, оператор поддержки, кассир, монтажник, подрядчик, партнёр (УК, застройщик), ИИ-агент. У ИИ-агента — минимальные права и обязательный журнал.
- **Персональные данные (152-ФЗ):** паспортные данные — в отдельной таблице с шифрованием, доступ по роли и с записью в журнал; в аналитике (ClickHouse) — только обезличенные идентификаторы.
- **Опасные действия** (сброс портов, массовые рассылки, изменение денег) — двухэтапное подтверждение и лимиты.
- **Резервные копии:** PostgreSQL — `pgBackRest` каждые сутки + WAL; ClickHouse — снимки; MinIO — репликация. Еженедельная **автоматическая проверка восстановления** на отдельном стенде.
- **Обновления:** образы с фиксированными версиями, проверка уязвимостей (Trivy) в CI.

---

## 9. Качество и тестирование

| Уровень | Что проверяем | Когда |
|---|---|---|
| Unit | Правила и алгоритмы модулей (расчёт цены, выбор окна работ, детекторы) | Каждый коммит |
| Контрактные | Схемы событий и API не сломаны | Каждый коммит |
| Интеграционные | Коннекторы на записанных ответах реального оборудования (снимки SNMP/CLI) | Каждый коммит |
| E2E | Сценарии целиком на симуляторе: «отключили свет → абоненты получили сообщение → алерты подавлены» | Перед выпуском |
| Нагрузочные | 100 000 абонентов, 10 000 событий/с | Раз в месяц |

Каждый модуль в `docs/modules/` содержит раздел «Как проверить» — эти сценарии и становятся e2e-тестами.

---

## 10. Эксплуатация платформы

- **Наблюдаемость:** у каждого сервиса `/health` и `/metrics`; дашборд Grafana «Здоровье платформы»: задержка событий, ошибки коннекторов, очередь уведомлений, свежесть данных графа.
- **Свежесть данных** — отдельная метрика: если коннектор OLT не присылал данные 15 минут, это алерт — иначе модули работают по устаревшей картине.
- **Логи** — в Loki, с `trace_id` от события до действия.
- **Обновление** — `make update`: скачивает новые образы, применяет миграции, перезапускает сервисы по одному.
- **Откат** — `make rollback VERSION=x.y.z`.

---

## 11. Как добавить новый модуль (шаблон)

1. Скопировать `modules/_template/` в `modules/<имя>/`.
2. Описать события, которые модуль слушает и публикует, в `schemas/events/`.
3. Описать таблицы в `migrations/` (префикс таблиц — имя модуля).
4. Реализовать обработчики через `platform_sdk`.
5. Добавить экраны в `web/` (и при необходимости в `tma/`, `bot/`, `field_app/`).
6. Добавить права в `auth` (какие роли что видят и могут).
7. Написать e2e-сценарий на симуляторе.
8. Добавить сервис в `docker-compose.yml` с профилем.

Если модуль следует этому шаблону, он **работает сразу** после `make up` с нужным профилем.

---

## 12. Что нужно от провайдера для подключения

| Что | Зачем | Минимум |
|---|---|---|
| Выгрузка или доступ к БД биллинга (только чтение) | Абоненты, адреса, тарифы, балансы | CSV раз в сутки |
| RADIUS accounting | Кто онлайн, сессии | Копия accounting на платформу |
| SNMP v2c/v3 read-only к OLT и коммутаторам | Устройства, порты, ONU, сигналы | Список IP и community |
| Syslog/трапы с OLT | Dying gasp, LOS, падения портов | Направить на IP платформы |
| Zabbix API (если есть) | Уже настроенный мониторинг | Токен только на чтение |
| Telegram-бот (токен) | Уведомления абонентам и сотрудникам | Создать в @BotFather |
| SMS-шлюз (по желанию) | Тем, у кого нет Telegram | Любой с HTTP API |
