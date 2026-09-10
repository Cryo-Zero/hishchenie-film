# Документация проекта

## Canonical project memory

Future handoff, новый ChatGPT-чат и любой значимый project task должны начинаться с этих пяти файлов:

- [`current/PROJECT-STATE.md`](current/PROJECT-STATE.md) — **PROJECT-STATE = what is true now**: production, backend, recovery, admin state и следующий этап.
- [`current/DECISIONS.md`](current/DECISIONS.md) — **DECISIONS = why the project works this way**: устойчивые architectural/privacy/workflow решения и причины.
- [`current/VISUAL-SYSTEM.md`](current/VISUAL-SYSTEM.md) — **VISUAL-SYSTEM = active visual laws and composition rules that future changes must preserve**.
- [`current/ROADMAP.md`](current/ROADMAP.md) — **ROADMAP = multi-workstream plan**: цели, текущий статус, принятые/отклонённые направления, идеи, next actions и links to history/evidence.
- [`current/BACKLOG.md`](current/BACKLOG.md) — **BACKLOG = what we may revisit later, not authorization to implement**.

Перед visual/responsive изменениями `current/VISUAL-SYSTEM.md` является обязательным чтением. Перед выбором следующего значимого workstream читать `current/ROADMAP.md`.

`ROADMAP.md` и `BACKLOG.md` сами по себе не являются blanket-разрешением на разработку. Перед реализацией существенного изменения требуется текущее явное согласование в соответствии с governance из `DECISIONS.md`.

## Classification rule

Значимая project memory классифицируется отдельно:

- **PROJECT-STATE** — what is true now;
- **DECISIONS** — accepted long-term rules/reasons;
- **VISUAL-SYSTEM** — active visual/composition laws;
- **ROADMAP** — known workstreams, goals/status, accepted/rejected directions, history references and intended next sequence;
- **BACKLOG** — ideas that may be revisited, not approval;
- **history/releases/archive** — past state, experiments and recovery context.

Completed workstream planning не удаляется только потому, что задача закончена. В `ROADMAP.md` сохраняется короткая история/статус, а подробности остаются в release/history/admin/database документах. Большой устаревший planning context можно переносить в `docs/history/` со ссылкой из ROADMAP, но не уничтожать без отдельного решения.

Bridge prompts могут содержать важные safety/verification/architectural/visual/planning lessons, но их не нужно копировать целиком. В canonical memory переносится только долговременно полезный смысл; temporary debugging noise, повторения и disproven assumptions не сохраняются.

## Backend / Supabase

- `database/supabase/*-APPLIED.md` — подтверждённые уже применённые backend-состояния.
- `database/supabase/REVIVAL-R1-APPLIED.md` — зафиксированное применённое состояние REVIVAL R1.
- `database/supabase/REVIVAL-R6-APPLIED.md` — зафиксированное применённое состояние REVIVAL R6.
- SQL-файлы в `database/supabase/` — исходники migrations и служебные материалы. Наличие SQL-файла **не доказывает**, что migration применена к production.
- `database/migrations/` — historical migration notes.

Production DB contents и credentials не должны копироваться в public GitHub. Разрешены schema/migrations/RLS/RPC/applied-state/recovery docs и безопасные aggregate/anonymized fixtures. Реальные data backups должны храниться отдельно и защищённо.

## Releases

- `releases/p-series/` — история P14–P22, включая QA и UPDATE-документы.
- `releases/revival/` — история REVIVAL R1–R6; UPDATE и QA лежат рядом с соответствующим релизом.

Подробные release notes не дублируются в current-memory файлах: там остаются краткое canonical состояние/решения/roadmap-status и ссылки на историю.

P20–P22 — rejected large redesigns. Они сохранены только как historical reference и не должны использоваться как актуальный UI baseline без нового явного решения.

## Archive and history

- `/archive/` — исторический код, snapshots, legacy tools и rejected implementations; не текущий runtime.
- `history/` — вспомогательные исторические документы; не текущие требования.

Исторические материалы не удаляются без отдельного решения.

## Admin

- `admin/` — setup/roadmap-документы существующей REVIVAL R1 admin-панели.
- Текущее factual admin-состояние фиксируется в `current/PROJECT-STATE.md`.
- Долговременная admin architecture/security — в `current/DECISIONS.md`.
- Общая линия admin workstream, включая завершённое, принятое, отклонённое и возможные следующие шаги — в `current/ROADMAP.md`.
- Исторические admin notes не становятся текущим ТЗ автоматически; их роль — evidence/history.

## Reserve / recovery documentation

Reserve repo `Cryo-Zero/hishchenie-film-v2` хранит отдельную recovery/history линию. Его `main` и старые snapshots не переписываются ради синхронизации.

Exact runtime mirror сейчас **NOT VERIFIED / не создан**. Для canonical memory используется `snapshots/project-memory/current/` как project-memory safety copy. Эта копия должна содержать пять canonical current-memory файлов и проверяться после meaningful updates. Она не является заявлением о совпадении полного production tree.

## Verification integrity

Backup, mirror, migration, deployment, check или другая операция считаются успешными только после фактической проверки claimed result. Если инструмент не позволяет доказать результат, статус должен быть **NOT VERIFIED** с конкретной причиной.

## Documentation rule

Для нового релиза сохранять минимум `UPDATE` + `QA`; если требуется изменение БД — хранить source SQL/migration document и после реальной production-проверки отдельно фиксировать applied-state в `*-APPLIED.md`.

После значимого workstream/task проверять, изменились ли PROJECT-STATE / DECISIONS / VISUAL-SYSTEM / ROADMAP / BACKLOG, и обновлять только те файлы, где появился реальный долговременный delta.

Canonical documentation itself is protected project memory: не удалять и не менять смысл существующих правил/решений без явного owner approval; без отдельного согласования допустимы только совместимые additive/clarifying updates согласно `current/DECISIONS.md`.
