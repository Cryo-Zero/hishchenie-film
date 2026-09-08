# ХИЩЕНИЕ / THEFT — официальный сайт

Статический официальный сайт фильма «ХИЩЕНИЕ / THEFT».

## Project memory / быстрый вход

Future handoff и любой новый significant task начинаются с четырёх canonical документов:

1. **Current state** → [`docs/current/PROJECT-STATE.md`](docs/current/PROJECT-STATE.md) — **what is true now**.
2. **Decisions** → [`docs/current/DECISIONS.md`](docs/current/DECISIONS.md) — **why the project works this way**.
3. **Visual system** → [`docs/current/VISUAL-SYSTEM.md`](docs/current/VISUAL-SYSTEM.md) — **visual laws and composition rules that future changes must preserve**.
4. **Backlog** → [`docs/current/BACKLOG.md`](docs/current/BACKLOG.md) — **what we may revisit later; this is not authorization to implement**.

Перед visual/responsive работой `VISUAL-SYSTEM.md` является обязательным чтением.

После canonical memory при необходимости читать release/database/history:

- `docs/releases/revival/R6/` — release notes и QA для REVIVAL R6;
- `docs/database/supabase/REVIVAL-R6-APPLIED.md` — подтверждённое применённое состояние R6 backend;
- `docs/database/supabase/REVIVAL-R6_unique_aliases.sql` — source SQL, сам по себе не доказывающий применение migration;
- P20–P22 — отвергнутые historical redesigns в `archive/rejected-redesigns/`, не актуальный UI baseline.

## Рабочая структура

```text
/
├─ index.html                 # основной сайт / сцены-вкладки
├─ reviews.html               # отзывы зрителей
├─ admin/                     # существующая REVIVAL R1 админка
├─ assets/                    # изображения и видео фильма
├─ css/
│  └─ site.css                # активная визуальная система
├─ js/
│  ├─ site.js                 # навигация, архив, актёры, FAQ
│  ├─ public-response.js      # анонимные профили, оценки, отзывы
│  └─ admin.js                # существующая админка
├─ docs/                      # canonical memory, релизы, БД, admin notes
├─ archive/                   # исторический код, не используемый runtime
└─ tools/                     # служебные инструменты
```

## Принципы проекта

- RU / EN интерфейс.
- Анонимные отзывы без viewer email, телефона, пароля и соцсетей.
- Оценка 0–10; 7–10 считается положительной для «Свежести».
- Один отзыв на один анонимный профиль; свой отзыв можно изменять и удалять.
- Desktop-сцены и их world grid считаются утверждённым visual contract, но explicit creative direction может создавать локальные intentional exceptions.
- ARCHIVE / Materials исторически является deliberate exception и может выходить за общую опорную сетку.
- Ничего исторического не удаляется без отдельного решения: устаревшее хранится как history/archive.

## История и резерв

Документация релизов хранится в `docs/releases/`. Отвергнутые P20–P22 сохранены в `archive/rejected-redesigns/` и не являются источником текущих UI-требований.

Отдельный резервный репозиторий: `Cryo-Zero/hishchenie-film-v2`. Его существующий `main`, archives, snapshots и recovery history не должны destructively заменяться.

Exact production runtime mirror в reserve сейчас **NOT VERIFIED / не создан** из-за ограничения connector на перенос отсутствующего крупного binary blob трейлера. Не называть reserve exact mirror без фактического совпадения полного дерева.

Для project memory используется безопасная documentation copy в `snapshots/project-memory/current/`; это **project-memory safety copy**, а не runtime mirror.

## Supabase

Рабочий project: `xltwwvutqkpmtmlavngi`. В репозитории допустимы только публичные клиентские ключи; service-role и другие секреты запрещены. Подтверждения уже применённых backend-состояний хранятся в `docs/database/supabase/*-APPLIED.md`.
