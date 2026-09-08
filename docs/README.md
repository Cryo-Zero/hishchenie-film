# Документация проекта

## Canonical project memory

Future handoff и новый ChatGPT-чат должны начинаться с этих трёх файлов:

- [`current/PROJECT-STATE.md`](current/PROJECT-STATE.md) — **PROJECT-STATE = what is true now**: production, backend, recovery, admin state и следующий этап.
- [`current/DECISIONS.md`](current/DECISIONS.md) — **DECISIONS = why the project works this way**: устойчивые архитектурные, визуальные, privacy и workflow решения.
- [`current/BACKLOG.md`](current/BACKLOG.md) — **BACKLOG = what we may revisit later, not authorization to implement**.

`BACKLOG.md` не является разрешением на разработку. Перед реализацией любой идеи требуется отдельное явное согласование.

## Backend / Supabase

- `database/supabase/*-APPLIED.md` — подтверждённые уже применённые backend-состояния.
- `database/supabase/REVIVAL-R1-APPLIED.md` — зафиксированное применённое состояние REVIVAL R1.
- `database/supabase/REVIVAL-R6-APPLIED.md` — зафиксированное применённое состояние REVIVAL R6.
- SQL-файлы в `database/supabase/` — исходники migrations и служебные материалы. Наличие SQL-файла **не доказывает**, что migration применена к production.
- `database/migrations/` — исторические migration notes.

## Releases

- `releases/p-series/` — история P14–P22, включая QA и UPDATE-документы.
- `releases/revival/` — история REVIVAL R1–R6; UPDATE и QA лежат рядом с соответствующим релизом.

Подробные release notes не дублируются в current-memory файлах: там остаются краткое canonical состояние/решения и ссылки на историю.

P20–P22 — отвергнутые большие redesigns. Они сохранены только как historical reference и не должны использоваться как актуальный UI baseline без нового явного решения.

## Archive and history

- `/archive/` — исторический код, snapshots, legacy tools и rejected implementations; не текущий runtime.
- `history/` — вспомогательные исторические документы; не текущие требования.

Исторические материалы не удаляются без отдельного решения.

## Admin

- `admin/` — setup/roadmap-документы существующей REVIVAL R1 admin-панели.
- Текущее фактическое admin-состояние и следующий шаг фиксируются в `current/PROJECT-STATE.md`; долговременная admin architecture — в `current/DECISIONS.md`.

## Documentation rule

Для нового релиза сохранять минимум `UPDATE` + `QA`; если требуется изменение БД — хранить source SQL/migration document и после реальной production-проверки отдельно фиксировать applied-state в `*-APPLIED.md`.

Значимые новые знания классифицировать как **STATE**, **DECISION** или **BACKLOG**. Если значимого delta нет, project-memory docs менять не нужно.
