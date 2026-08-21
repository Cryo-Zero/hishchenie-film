(() => {
  'use strict';

  const SUPABASE_URL = 'https://xltwwvutqkpmtmlavngi.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_0hT3y-7p26Ngnq2zaPK-0w_5vtJX15k';

  let db = null;

  function createDbClient() {
    if (db) return db;
    if (!window.supabase?.createClient) return null;
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    });
    return db;
  }

  const I18N = {
    ru: {
      metaTitle: 'ХИЩЕНИЕ — THEFT | Официальный сайт фильма',
      metaDescription: 'Официальный сайт фильма «ХИЩЕНИЕ / THEFT» — антиутопической драмы о мире 2045 года.',
      navAria: 'Основная навигация',
      slogan: 'В системе нет безопасности',
      menu: 'Меню', systemActive: 'Система активна', publicAccess: 'Публичный доступ',
      heroPosterAlt: 'Официальная обложка фильма «Хищение»', heroVideoAria: 'Беззвучный фрагмент трейлера фильма «Хищение»',
      navAbout: 'О фильме', navMaterials: 'Материалы', navTrailer: 'Трейлер', navWatch: 'Где посмотреть', navCast: 'Актёры', navReviews: 'Отзывы', navContacts: 'Контакты',
      heroEyebrow: 'Фильм в разработке · 2045',
      heroCopy: 'В мире, где человек должен доказать свою пользу системе, взросление становится борьбой за право самому выбирать своё будущее.',
      heroTrailer: 'Смотреть трейлер', heroAbout: 'О фильме',
      aboutLabel: '01 / DOSSIER', aboutTitle: '2045 год.',
      story1: 'Население Земли превысило допустимый предел. Государство создаёт новую систему, в которой каждый человек должен доказать свою пользу обществу.',
      story2: 'Дети с раннего возраста попадают под особый контроль и распределяются по специальным секциям.',
      story3: 'Гор живёт со своим 75-летним дедушкой и пытается приспособиться к новому миру. История показывает взросление Гора, его дружбу с Марком и борьбу за собственное будущее в системе, где человеческая жизнь постепенно превращается в ресурс.',
      infoTitle: 'Название', infoGenre: 'Жанр', infoDirector: 'Режиссёр', infoStatus: 'Статус',
      genreValue: 'Антиутопия · Драма · Боевик · Приключения · Фантастика', statusValue: 'В разработке', directorName: 'Арман О. А.',
      materialsLabel: '02 / ARCHIVE', materialsTitle: 'Визуальные материалы',
      materialsNote: 'Материалы представлены в авторском виде. Текст внутри постеров может оставаться на русском языке.',
      trailerLabel: '03 / SIGNAL', trailerTitle: 'Трейлер', videoFallback: 'Ваш браузер не поддерживает воспроизведение видео.',
      trailerLanguageNote: 'Оригинальная звуковая дорожка трейлера — на русском. Английские субтитры можно добавить после согласования с автором.',
      watchLabel: '04 / ACCESS', watchTitle: 'Где посмотреть', soon: 'скоро',
      castLabel: '05 / SUBJECTS', castTitle: 'Актёрский состав',
      nameArman: 'Арман О.', nameBogdan: 'Богдан В.', nameLevon: 'Левон', nameYulia: 'Юля Ш.', nameArsen: 'Арсен О.', nameAlexander: 'Александр К.', nameBella: 'Белла А.',
      roleGor: 'Гор', roleAntagonist: 'Антагонист', roleMark: 'Марк', roleHost: 'Ведущая', roleMusician: 'Музыкант', roleGrandfather: 'Дедушка Гора', roleDetective: 'Детектив',
      reviewsLabel: '06 / PUBLIC RESPONSE', reviewsTitle: 'Отзывы зрителей', reviewsIntro: 'Оценки зрителей формируют «Свежесть» фильма. 7–10 баллов считаются положительной оценкой.',
      freshness: 'Свежесть', insufficient: 'Недостаточно оценок', freshnessHint: '7–10 = положительно',
      freshnessCold: 'Холодный приём', freshnessMixed: 'Смешанные отзывы', freshnessFresh: 'Свежий', freshnessVeryFresh: 'Очень свежий', freshnessChoice: 'Выбор зрителей',
      serviceChecking: 'Проверка канала', serviceOnline: 'Отзывы доступны', serviceOffline: 'Отзывы временно недоступны',
      average: 'Средняя оценка', ratings: 'оценок', ratingOne: 'оценка', ratingFew: 'оценки', ratingMany: 'оценок',
      yourProtocol: 'Ваш профиль', profileNote: 'Псевдоним и аватар создаются автоматически. Их можно менять сколько угодно.',
      rerollName: 'Другой псевдоним', rerollAvatar: 'Другой аватар',
      yourRating: 'Ваша оценка', ratingPrompt: 'Выберите от 0 до 10', ratingScaleAria: 'Оценка от 0 до 10',
      reviewLabel: 'Ваш отзыв', reviewOptional: 'необязательно', reviewPlaceholder: 'Расскажите о впечатлениях от фильма…',
      publish: 'Опубликовать', updateReview: 'Сохранить изменения', deleteReview: 'Удалить отзыв',
      privacy: 'Без email, телефона и пароля. Сайт хранит только технический идентификатор, псевдоним, аватар-настройку, оценку и текст отзыва. Профиль привязан к этому браузеру: после очистки данных доступ к редактированию старого отзыва может быть потерян.',
      latest: 'Новые', highest: 'С высокой оценкой', lowest: 'С низкой оценкой',
      reviewsEmpty: 'Пока нет отзывов. Ваша оценка может стать первой.', noText: 'Оценка без текстового отзыва.',
      edited: 'изменено', yourBadge: 'ваш отзыв',
      chooseRating: 'Сначала выберите оценку от 0 до 10.', saving: 'Сохраняем…', saved: 'Отзыв опубликован.', updated: 'Изменения сохранены.', deleted: 'Отзыв удалён.',
      authError: 'Не удалось создать анонимный профиль. Попробуйте ещё раз.', loadError: 'Не удалось загрузить отзывы.', saveError: 'Не удалось сохранить отзыв. Попробуйте ещё раз.', deleteError: 'Не удалось удалить отзыв.', profileError: 'Не удалось обновить профиль.',
      confirmDelete: 'Удалить ваш отзыв? Это действие нельзя отменить.',
      galleryAlt01: 'Обложка фильма «Хищение»', galleryAlt02: 'Постер фильма «Хищение» — пианино', galleryAlt03: 'Постер фильма «Хищение» — дедушка и ребёнок', galleryAlt04: 'Постер фильма «Хищение» — человек в капюшоне', galleryAlt05: 'Постер фильма «Хищение»', galleryAlt06: 'Постер фильма «Хищение» — герой в разрушенном городе', galleryAlt07: 'Постер фильма «Хищение» — ведущая', galleryAlt08: 'Постер фильма «Хищение» — город', galleryAlt09: 'Постер фильма «Хищение» — Гор', galleryAlt10: 'Кадры из фильма «Хищение»', galleryAlt11: 'Визуальный материал фильма «Хищение»',
      contactsLabel: '07 / CONTACT', contactsTitle: 'Контакты',
      footer: 'Официальный сайт фильма · фильм находится в разработке',
      close: 'Закрыть', previousImage: 'Предыдущее изображение', nextImage: 'Следующее изображение', openImage: 'Открыть выбранное изображение', galleryAria: 'Галерея материалов фильма', lightboxAria: 'Просмотр изображения',
      langButton: 'EN',
      scoreWords: ['Критически', 'Очень слабо', 'Очень слабо', 'Слабо', 'Ниже среднего', 'Средне', 'Неплохо', 'Хорошо', 'Очень хорошо', 'Отлично', 'Выдающееся']
    },
    en: {
      metaTitle: 'THEFT — ХИЩЕНИЕ | Official Film Website',
      metaDescription: 'Official website of THEFT / ХИЩЕНИЕ — a dystopian drama set in 2045.',
      navAria: 'Main navigation',
      slogan: 'There is no safety in the system',
      menu: 'Menu', systemActive: 'System active', publicAccess: 'Public access',
      heroPosterAlt: 'Official poster for THEFT / ХИЩЕНИЕ', heroVideoAria: 'Muted trailer excerpt from THEFT / ХИЩЕНИЕ',
      navAbout: 'About', navMaterials: 'Materials', navTrailer: 'Trailer', navWatch: 'Watch', navCast: 'Cast', navReviews: 'Reviews', navContacts: 'Contacts',
      heroEyebrow: 'Film in development · 2045',
      heroCopy: 'In a world where every person must prove their value to the system, growing up becomes a struggle for the right to choose your own future.',
      heroTrailer: 'Watch trailer', heroAbout: 'About the film',
      aboutLabel: '01 / DOSSIER', aboutTitle: 'The year is 2045.',
      story1: 'Earth’s population has exceeded the permitted limit. The state creates a new system in which every person must prove their value to society.',
      story2: 'From an early age, children are placed under special control and assigned to designated sections.',
      story3: 'Gor lives with his 75-year-old grandfather and tries to adapt to the new world. The story follows Gor growing up, his friendship with Mark, and his struggle for a future of his own in a system where human life is gradually reduced to a resource.',
      infoTitle: 'Title', infoGenre: 'Genre', infoDirector: 'Director', infoStatus: 'Status',
      genreValue: 'Dystopia · Drama · Action · Adventure · Science Fiction', statusValue: 'In development', directorName: 'Arman O. A.',
      materialsLabel: '02 / ARCHIVE', materialsTitle: 'Visual materials',
      materialsNote: 'Promotional materials are shown in their original artwork; text embedded in posters may remain in Russian.',
      trailerLabel: '03 / SIGNAL', trailerTitle: 'Trailer', videoFallback: 'Your browser does not support video playback.',
      trailerLanguageNote: 'The original trailer audio is in Russian. English subtitles can be added after approval with the filmmaker.',
      watchLabel: '04 / ACCESS', watchTitle: 'Where to watch', soon: 'coming soon',
      castLabel: '05 / SUBJECTS', castTitle: 'Cast',
      nameArman: 'Arman O.', nameBogdan: 'Bogdan V.', nameLevon: 'Levon', nameYulia: 'Yulia Sh.', nameArsen: 'Arsen O.', nameAlexander: 'Aleksandr K.', nameBella: 'Bella A.',
      roleGor: 'Gor', roleAntagonist: 'Antagonist', roleMark: 'Mark', roleHost: 'News anchor', roleMusician: 'Musician', roleGrandfather: "Gor's grandfather", roleDetective: 'Detective',
      reviewsLabel: '06 / PUBLIC RESPONSE', reviewsTitle: 'Audience reviews', reviewsIntro: 'Audience scores form the film’s “Freshness” rating. Scores from 7 to 10 count as positive.',
      freshness: 'Freshness', insufficient: 'Not enough ratings', freshnessHint: '7–10 = positive',
      freshnessCold: 'Cold reception', freshnessMixed: 'Mixed response', freshnessFresh: 'Fresh', freshnessVeryFresh: 'Very fresh', freshnessChoice: 'Audience choice',
      serviceChecking: 'Checking channel', serviceOnline: 'Reviews online', serviceOffline: 'Reviews temporarily unavailable',
      average: 'Average score', ratings: 'ratings', ratingOne: 'rating', ratingFew: 'ratings', ratingMany: 'ratings',
      yourProtocol: 'Your profile', profileNote: 'Your alias and avatar are generated automatically. You can reroll them at any time.',
      rerollName: 'New alias', rerollAvatar: 'New avatar',
      yourRating: 'Your score', ratingPrompt: 'Choose from 0 to 10', ratingScaleAria: 'Score from 0 to 10',
      reviewLabel: 'Your review', reviewOptional: 'optional', reviewPlaceholder: 'Tell us what you thought about the film…',
      publish: 'Publish', updateReview: 'Save changes', deleteReview: 'Delete review',
      privacy: 'No email, phone number or password. The site stores only a technical identifier, alias, avatar settings, score and review text. The profile is tied to this browser; clearing browser data may remove access to editing the old review.',
      latest: 'Newest', highest: 'Highest score', lowest: 'Lowest score',
      reviewsEmpty: 'No reviews yet. Your score can be the first.', noText: 'Rating without a written review.',
      edited: 'edited', yourBadge: 'your review',
      chooseRating: 'Choose a score from 0 to 10 first.', saving: 'Saving…', saved: 'Review published.', updated: 'Changes saved.', deleted: 'Review deleted.',
      authError: 'Could not create an anonymous profile. Please try again.', loadError: 'Could not load reviews.', saveError: 'Could not save the review. Please try again.', deleteError: 'Could not delete the review.', profileError: 'Could not update the profile.',
      confirmDelete: 'Delete your review? This cannot be undone.',
      galleryAlt01: 'THEFT film cover', galleryAlt02: 'THEFT poster — piano scene', galleryAlt03: 'THEFT poster — grandfather and child', galleryAlt04: 'THEFT poster — hooded figure', galleryAlt05: 'THEFT film poster', galleryAlt06: 'THEFT poster — protagonist in a ruined city', galleryAlt07: 'THEFT poster — news anchor', galleryAlt08: 'THEFT poster — city', galleryAlt09: 'THEFT poster — Gor', galleryAlt10: 'Frames from THEFT', galleryAlt11: 'THEFT visual material',
      contactsLabel: '07 / CONTACT', contactsTitle: 'Contacts',
      footer: 'Official film website · the film is in development',
      close: 'Close', previousImage: 'Previous image', nextImage: 'Next image', openImage: 'Open selected image', galleryAria: 'Film materials gallery', lightboxAria: 'Image viewer',
      langButton: 'RU',
      scoreWords: ['Critical', 'Very poor', 'Very poor', 'Poor', 'Below average', 'Average', 'Fair', 'Good', 'Very good', 'Excellent', 'Outstanding']
    }
  };

  const NAME_DATA = {
    ru: {
      adjectives: ['Тихий','Холодный','Скрытый','Ночной','Серый','Чёрный','Белый','Забытый','Последний','Ложный','Немой','Дальний','Северный','Пустой','Сломанный','Закрытый','Стёртый','Неизвестный','Спящий','Бледный','Красный','Глухой','Теневой','Случайный','Одинокий','Свободный','Нулевой','Запретный','Ускользающий','Потерянный','Внутренний','Чужой','Старый','Новый','Дежурный','Безымянный','Секретный','Резервный','Выживший','Невидимый','Пограничный','Дальний','Незримый','Затерянный','Остывший','Непринятый','Случайный','Третий','Седьмой','Внешний','Зашифрованный','Закатный','Безмолвный','Брошенный','Неподтверждённый','Переходный','Одиночный','Стерильный','Выключенный','Наблюдаемый'],
      nouns: ['Свидетель','Контур','Сигнал','Кадр','След','Голос','Наблюдатель','Пассажир','Архив','Импульс','Сектор','Протокол','Эфир','Шум','Свет','Маркер','Экран','Код','Профиль','Вектор','Предел','Рубеж','Коридор','Объект','Канал','Узел','Пульс','Фрагмент','Отголосок','Проводник','Беглец','Архивист','Оператор','Куратор','Индекс','Регистр','Резерв','Сканер','Странник','Хранитель','Маяк','Порог','Отбор','Слой','Ключ','Терминал','Переход','Носитель','Дубликат','Эхо','Блок','Модуль','Поток','Сводка','Вход','Выход','Разрыв','Патруль','Режим','Снимок'],
      roles: ['Наблюдатель','Архивист','Оператор','Свидетель','Куратор','Проводник','Гражданин','Участник','Регистратор','Инспектор','Смотритель','Посредник','Диспетчер','Хранитель','Сканер','Следователь','Пассажир','Беглец','Кандидат','Резидент','Дежурный','Координатор','Контролёр','Сборщик','Носитель','Аналитик','Стажёр','Патрульный','Проверяющий','Посетитель'],
      worlds: ['Сектор','Архив','Протокол','Контур','Система','Секция','Регистр','Канал','Узел','Индекс','Запись','Маркер','Сигнал','Профиль','Предел','Шлюз','Резерв','Эфир','Периметр','Коридор','Терминал','Модуль','Контроль','Отбор','Поток','Линия','Досье','Порог','Сводка','Режим'],
      images: ['Тени','Света','Шума','Памяти','Севера','Пепла','Эфира','Сна','Пустоты','Голоса','Дождя','Кадра','Сигнала','Леса','Рубежа','Ночи','Стекла','Бетона','Пульса','Следа','Тишины','Предела','Города','Холода','Сбоя','Записи','Перехода','Пыли','Эха','Окна'],
      phrases: ['Тот, Кто Ждёт','Лицо Без Архива','Голос Из Сектора','Человек Из Записи','Тень За Экраном','Свидетель Без Номера','Тот, Кто Помнит','Последний В Очереди','За Пределом Секции','Вне Зоны Контроля','Не Внесён В Реестр','Человек Без Индекса','Сигнал Не Принят','Запись Не Найдена','За Закрытой Дверью','До Следующего Сигнала','Из Другого Сектора','Без Права На Архив','Тот, Кто Остался','Никем Не Учтён','Вне Списка','До Конца Сеанса','Тот Самый Шум','Пока Система Спит','Неизвестный В Кадре','За Линией Отбора','Без Метки','Внутри Периметра','После Сигнала','До Нулевого Часа']
    },
    en: {
      adjectives: ['Silent','Cold','Hidden','Night','Grey','Black','White','Forgotten','Last','False','Mute','Distant','Northern','Empty','Broken','Sealed','Erased','Unknown','Sleeping','Pale','Red','Deaf','Shadow','Random','Lone','Free','Zero','Forbidden','Fading','Lost','Inner','Foreign','Old','New','On-Duty','Nameless','Secret','Reserve','Surviving','Invisible','Border','Remote','Unseen','Stranded','Cooling','Rejected','Third','Seventh','Outer','Encoded','Twilight','Wordless','Abandoned','Unconfirmed','Transit','Single','Sterile','Offline','Observed'],
      nouns: ['Witness','Contour','Signal','Frame','Trace','Voice','Observer','Passenger','Archive','Pulse','Sector','Protocol','Broadcast','Noise','Light','Marker','Screen','Code','Profile','Vector','Limit','Frontier','Corridor','Subject','Channel','Node','Heartbeat','Fragment','Echo','Guide','Runaway','Archivist','Operator','Curator','Index','Register','Reserve','Scanner','Wanderer','Keeper','Beacon','Threshold','Selection','Layer','Key','Terminal','Transit','Carrier','Duplicate','Block','Module','Stream','Briefing','Entry','Exit','Rift','Patrol','Mode','Snapshot'],
      roles: ['Observer','Archivist','Operator','Witness','Curator','Guide','Citizen','Participant','Registrar','Inspector','Keeper','Mediator','Dispatcher','Custodian','Scanner','Investigator','Passenger','Runaway','Candidate','Resident','Watchkeeper','Coordinator','Controller','Collector','Carrier','Analyst','Trainee','Patrol','Verifier','Visitor'],
      worlds: ['Sector','Archive','Protocol','Contour','System','Section','Register','Channel','Node','Index','Record','Marker','Signal','Profile','Limit','Gateway','Reserve','Broadcast','Perimeter','Corridor','Terminal','Module','Control','Selection','Stream','Line','Dossier','Threshold','Briefing','Mode'],
      images: ['of Shadow','of Light','of Noise','of Memory','of the North','of Ash','of Static','of Sleep','of the Void','of Voices','of Rain','of the Frame','of Signal','of the Forest','of the Edge','of Night','of Glass','of Concrete','of Pulse','of Traces','of Silence','of the Limit','of the City','of Cold','of Failure','of the Record','of Transit','of Dust','of Echoes','of the Window'],
      phrases: ['The One Who Waits','Face Without an Archive','Voice from the Sector','Person from the Record','Shadow Behind the Screen','Witness Without a Number','The One Who Remembers','Last in the Line','Beyond the Section','Outside Control','Not in the Register','Person Without an Index','Signal Not Received','Record Not Found','Behind the Sealed Door','Until the Next Signal','From Another Sector','No Archive Access','The One Who Stayed','Unaccounted For','Outside the List','Until the Session Ends','That Certain Noise','While the System Sleeps','Unknown in Frame','Beyond Selection','Without a Marker','Inside the Perimeter','After the Signal','Before Zero Hour']
    }
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const safeStorage = {
    get(key) { try { return window.localStorage?.getItem(key) ?? null; } catch { return null; } },
    set(key, value) { try { window.localStorage?.setItem(key, value); } catch {} }
  };
  const initialLanguage = safeStorage.get('theft_lang') || (navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en');
  const t = key => I18N[state.lang]?.[key] ?? I18N.ru[key] ?? key;

  const state = {
    lang: initialLanguage,
    user: null,
    profile: null,
    ownReview: null,
    selectedRating: null,
    sort: 'new',
    pendingProfile: null,
    busy: false,
    serviceState: 'checking',
    lastFreshness: null
  };

  function randomInt(max) {
    if (window.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function randomSeed() {
    return randomInt(2147483647);
  }

  function pick(array) {
    return array[randomInt(array.length)];
  }

  function generateAlias(lang = state.lang) {
    const d = NAME_DATA[lang] || NAME_DATA.ru;
    const num2 = () => String(randomInt(99) + 1).padStart(2, '0');
    const num3 = () => String(randomInt(999) + 1).padStart(3, '0');
    const build = () => {
      switch (randomInt(10)) {
        case 0: return `${pick(d.adjectives)} ${pick(d.nouns)}`;
        case 1: return `${pick(d.roles)} // ${num2()}`;
        case 2: return `${pick(d.worlds)} ${pick(d.images)}`;
        case 3: return pick(d.phrases);
        case 4: return `${pick(d.adjectives)} ${pick(d.roles)}`;
        case 5: return `${pick(d.worlds)}-${num3()}`;
        case 6: return `${pick(d.nouns)} // ${num3()}`;
        case 7: return lang === 'ru' ? `Запись ${num2()}-${num2()}` : `Record ${num2()}-${num2()}`;
        case 8: return `${pick(d.roles)} / ${pick(d.worlds)}`;
        default: return `${pick(d.worlds)}:${num3()}`;
      }
    };
    for (let i = 0; i < 8; i += 1) {
      const alias = build().replace(/\s+/g, ' ').trim();
      if (alias.length >= 2 && alias.length <= 40) return alias;
    }
    return `${pick(d.nouns)} ${num3()}`.slice(0, 40);
  }

  function createPendingProfile() {
    return {
      display_name: generateAlias(state.lang),
      avatar_seed: randomSeed(),
      avatar_style: randomInt(3) + 1
    };
  }

  function escapeAttr(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }

  function avatarSvg(seed, style = 1, size = 72) {
    const n = Math.abs(Number(seed) || 1);
    const accents = ['#9bc4c7','#74999b','#b5cdcf','#708b8d','#a96e69','#8aa8a7','#6f8789','#a3b8b9'];
    const accent = accents[n % accents.length];
    const accent2 = accents[(n * 7 + 3) % accents.length];
    const code = String(n % 1000).padStart(3, '0');
    const flip = n % 2 ? 1 : -1;
    const dx = 1 + (n % 5);
    const headX = 32 + ((n >> 3) % 5) - 2;
    const headY = 23 + ((n >> 5) % 3) - 1;
    const scanY = 16 + (n % 29);
    const ring = 14 + (n % 7);
    const glyphs = ['+','×','//','○','□','△'];
    const glyph = glyphs[(n >> 4) % glyphs.length];
    const bars = Array.from({ length: 7 }, (_, i) => {
      const y = 8 + i * 8;
      const width = 18 + ((n >> (i % 8)) % 39);
      return `<path d="M4 ${y} H${Math.min(60, 4 + width)}" opacity="${0.025 + (i % 3) * 0.018}"/>`;
    }).join('');

    let art = '';
    if (Number(style) === 2) {
      art = `
        <circle cx="32" cy="32" r="${ring}" fill="none" stroke="${accent}" stroke-width="1" opacity=".58"/>
        <circle cx="32" cy="32" r="${Math.max(7, ring-8)}" fill="none" stroke="${accent2}" stroke-width="1" opacity=".32"/>
        <path d="M32 6V17M32 47V58M6 32H17M47 32H58" stroke="${accent}" opacity=".58"/>
        <path d="M12 ${scanY}H52" stroke="${accent2}" opacity=".32"/>
        <text x="32" y="35" text-anchor="middle" fill="${accent}" font-size="9" font-family="monospace" font-weight="700">${code}</text>
        <text x="50" y="14" text-anchor="middle" fill="${accent2}" font-size="7" font-family="monospace" opacity=".7">${glyph}</text>`;
    } else if (Number(style) === 3) {
      art = `
        <g transform="translate(${flip * dx} 0)" opacity=".2" fill="${accent2}">
          <circle cx="${headX}" cy="${headY}" r="10"/><path d="M15 56c2-14 10-21 17-21s15 7 17 21z"/>
        </g>
        <circle cx="${headX}" cy="${headY}" r="10" fill="#111719" stroke="${accent}" stroke-width="1"/>
        <path d="M15 56c2-14 10-21 17-21s15 7 17 21z" fill="#111719" stroke="${accent}" stroke-width="1"/>
        <rect x="7" y="${scanY}" width="${22 + n%28}" height="2" fill="${accent}" opacity=".55"/>
        <rect x="${18+n%12}" y="${Math.min(52,scanY+9)}" width="${20+n%22}" height="2" fill="${accent2}" opacity=".35"/>
        <text x="9" y="54" fill="${accent}" font-size="6" font-family="monospace" opacity=".6">${code}</text>`;
    } else {
      const hood = 17 + (n % 4);
      art = `
        <circle cx="${headX}" cy="${headY}" r="9" fill="#0d1314" stroke="${accent}" stroke-width="1" opacity=".96"/>
        <path d="M${hood} 56c2-15 9-22 15-22 9 0 16 7 18 22z" fill="#0e1415" stroke="${accent}" stroke-width="1"/>
        <path d="M${headX-11} ${headY-1}c4-10 18-10 22 0-4-4-7-6-11-6-4 0-8 2-11 6z" fill="${accent}" opacity=".12"/>
        <path d="M10 ${scanY}H54" stroke="${accent2}" opacity=".32"/>
        <path d="M14 51h36" stroke="${accent2}" opacity=".2"/>
        <text x="50" y="13" fill="${accent}" font-size="7" font-family="monospace" opacity=".65">${glyph}</text>`;
    }

    return `<svg class="avatar-svg" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="9" fill="#080c0d"/>
      <g stroke="${accent}" fill="none">${bars}</g>
      <rect x=".5" y=".5" width="63" height="63" rx="8.5" fill="none" stroke="${accent}" opacity=".3"/>
      ${art}
      <path d="M5 8h9M5 8v9M59 56h-9M59 56v-9" stroke="${accent}" opacity=".42"/>
    </svg>`;
  }

  function pluralRatings(count) {
    if (state.lang === 'en') return count === 1 ? t('ratingOne') : t('ratingMany');
    const n = Math.abs(count) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return t('ratingMany');
    if (n1 > 1 && n1 < 5) return t('ratingFew');
    if (n1 === 1) return t('ratingOne');
    return t('ratingMany');
  }

  function freshnessCategory(value) {
    if (value == null) return t('insufficient');
    if (value < 40) return t('freshnessCold');
    if (value < 60) return t('freshnessMixed');
    if (value < 80) return t('freshnessFresh');
    if (value < 90) return t('freshnessVeryFresh');
    return t('freshnessChoice');
  }

  function setServiceState(next) {
    state.serviceState = next;
    const badge = $('#reviewServiceBadge');
    if (!badge) return;
    badge.classList.remove('is-checking','is-online','is-offline');
    badge.classList.add(`is-${next}`);
    const label = $('span', badge);
    if (label) label.textContent = next === 'online' ? t('serviceOnline') : next === 'offline' ? t('serviceOffline') : t('serviceChecking');
  }

  function animateFreshness(value) {
    const el = $('#freshnessValue');
    if (!el) return;
    if (value == null) { el.textContent = '—'; return; }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const from = Number.isFinite(state.lastFreshness) ? state.lastFreshness : 0;
    if (reduced || from === value) { el.textContent = `${value}%`; return; }
    const start = performance.now();
    const duration = 650;
    const tick = now => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(from + (value - from) * eased)}%`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function applyTranslations() {
    document.documentElement.lang = state.lang;
    document.title = t('metaTitle');
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('metaDescription'));

    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (I18N[state.lang]?.[key] !== undefined) el.textContent = t(key);
    });
    $$('[data-i18n-placeholder]').forEach(el => el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)));
    $$('[data-i18n-alt]').forEach(el => el.setAttribute('alt', t(el.dataset.i18nAlt))); 
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));

    const langButton = $('#langToggle');
    if (langButton) {
      langButton.textContent = t('langButton');
      langButton.setAttribute('aria-label', state.lang === 'ru' ? 'Switch to English' : 'Переключить на русский');
      langButton.title = state.lang === 'ru' ? 'English' : 'Русский';
    }

    $$('.platform').forEach(el => {
      const name = state.lang === 'en' ? el.dataset.platformEn : el.dataset.platformRu;
      if (name) el.textContent = `${name} · ${t('soon')}`;
    });

    updateRatingLabel();
    updateComposerUI();
    setServiceState(state.serviceState);
    const freshState = $('#freshnessState');
    if (freshState) freshState.textContent = freshnessCategory(state.lastFreshness);
    refreshStats();
    loadReviews(state.sort);
  }

  function setLanguage(lang) {
    if (!I18N[lang]) return;
    state.lang = lang;
    safeStorage.set('theft_lang', lang);
    if (!state.user && state.pendingProfile) state.pendingProfile.display_name = generateAlias(lang);
    applyTranslations();
    renderProfilePreview();
  }

  function setStatus(message, kind = '') {
    const el = $('#reviewStatus');
    if (!el) return;
    el.textContent = message || '';
    el.className = `review-status${kind ? ` ${kind}` : ''}`;
  }

  function renderProfilePreview() {
    const p = state.profile || state.pendingProfile || (state.pendingProfile = createPendingProfile());
    const avatar = $('#profileAvatar');
    const name = $('#profileName');
    if (avatar) avatar.innerHTML = avatarSvg(p.avatar_seed, p.avatar_style, 76);
    if (name) name.textContent = p.display_name;
  }

  async function ensureUserAndProfile() {
    if (!db) throw new Error('Supabase client unavailable');

    if (!state.user) {
      const { data, error } = await db.auth.signInAnonymously();
      if (error) throw error;
      state.user = data.user;
    }

    if (!state.profile) {
      const { data: existing, error: readError } = await db
        .from('profiles')
        .select('id,display_name,avatar_seed,avatar_style')
        .eq('id', state.user.id)
        .maybeSingle();
      if (readError) throw readError;

      if (existing) {
        state.profile = existing;
      } else {
        const p = state.pendingProfile || createPendingProfile();
        const { data: created, error: insertError } = await db
          .from('profiles')
          .insert({
            id: state.user.id,
            display_name: p.display_name,
            avatar_seed: p.avatar_seed,
            avatar_style: p.avatar_style
          })
          .select('id,display_name,avatar_seed,avatar_style')
          .single();
        if (insertError) throw insertError;
        state.profile = created;
      }
    }

    setServiceState('online');
    renderProfilePreview();
    return state.profile;
  }

  async function loadExistingSession() {
    if (!db) return;
    const { data } = await db.auth.getSession();
    state.user = data.session?.user || null;
    if (!state.user) return;

    const [{ data: profile }, { data: review }] = await Promise.all([
      db.from('profiles').select('id,display_name,avatar_seed,avatar_style').eq('id', state.user.id).maybeSingle(),
      db.from('reviews').select('id,user_id,rating,review_text,created_at,updated_at').eq('user_id', state.user.id).maybeSingle()
    ]);

    if (profile) state.profile = profile;
    if (review) {
      state.ownReview = review;
      state.selectedRating = review.rating;
      const textarea = $('#reviewText');
      if (textarea) textarea.value = review.review_text || '';
    }
    renderProfilePreview();
    updateComposerUI();
    updateRatingLabel();
    updateCounter();
  }

  function updateComposerUI() {
    const submit = $('#submitReview');
    const del = $('#deleteReview');
    if (submit) submit.textContent = state.ownReview ? t('updateReview') : t('publish');
    if (del) del.hidden = !state.ownReview;
    renderProfilePreview();
  }

  function updateRatingLabel() {
    $$('.rating-button').forEach(button => {
      button.classList.toggle('selected', Number(button.dataset.rating) === state.selectedRating);
      button.setAttribute('aria-pressed', Number(button.dataset.rating) === state.selectedRating ? 'true' : 'false');
    });
    const value = $('#selectedRatingValue');
    const word = $('#selectedRatingWord');
    if (!value || !word) return;
    if (state.selectedRating === null) {
      value.textContent = '— / 10';
      word.textContent = t('ratingPrompt');
    } else {
      value.textContent = `${state.selectedRating} / 10`;
      word.textContent = t('scoreWords')[state.selectedRating];
    }
  }

  async function rerollName() {
    const newName = generateAlias(state.lang);
    if (!state.user) {
      state.pendingProfile = state.pendingProfile || createPendingProfile();
      state.pendingProfile.display_name = newName;
      renderProfilePreview();
      return;
    }
    try {
      await ensureUserAndProfile();
      const { error } = await db.from('profiles').update({ display_name: newName }).eq('id', state.user.id);
      if (error) throw error;
      state.profile.display_name = newName;
      renderProfilePreview();
      loadReviews(state.sort);
    } catch (error) {
      console.error(error);
      setStatus(t('profileError'), 'error');
    }
  }

  async function rerollAvatar() {
    const patch = { avatar_seed: randomSeed(), avatar_style: randomInt(3) + 1 };
    if (!state.user) {
      state.pendingProfile = state.pendingProfile || createPendingProfile();
      Object.assign(state.pendingProfile, patch);
      renderProfilePreview();
      return;
    }
    try {
      await ensureUserAndProfile();
      const { error } = await db.from('profiles').update(patch).eq('id', state.user.id);
      if (error) throw error;
      Object.assign(state.profile, patch);
      renderProfilePreview();
      loadReviews(state.sort);
    } catch (error) {
      console.error(error);
      setStatus(t('profileError'), 'error');
    }
  }

  function updateCounter() {
    const textarea = $('#reviewText');
    const counter = $('#reviewCounter');
    if (textarea && counter) counter.textContent = `${textarea.value.length} / 2000`;
  }

  async function selectRating(value) {
    state.selectedRating = Number(value);
    updateRatingLabel();
    setStatus('');
    try {
      await ensureUserAndProfile();
    } catch (error) {
      console.error(error);
      setStatus(t('authError'), 'error');
    }
  }

  async function submitReview() {
    if (state.busy) return;
    if (state.selectedRating === null) {
      setStatus(t('chooseRating'), 'error');
      return;
    }

    state.busy = true;
    const submit = $('#submitReview');
    if (submit) submit.disabled = true;
    setStatus(t('saving'));

    try {
      await ensureUserAndProfile();
      const text = ($('#reviewText')?.value || '').trim();
      const payload = {
        user_id: state.user.id,
        rating: state.selectedRating,
        review_text: text
      };
      const wasExisting = Boolean(state.ownReview);
      const { data, error } = await db
        .from('reviews')
        .upsert(payload, { onConflict: 'user_id' })
        .select('id,user_id,rating,review_text,created_at,updated_at')
        .single();
      if (error) throw error;
      state.ownReview = data;
      updateComposerUI();
      setStatus(wasExisting ? t('updated') : t('saved'), 'success');
      await Promise.all([refreshStats(), loadReviews(state.sort)]);
    } catch (error) {
      console.error(error);
      setStatus(t('saveError'), 'error');
    } finally {
      state.busy = false;
      if (submit) submit.disabled = false;
    }
  }

  async function deleteReview() {
    if (!state.ownReview || !state.user || state.busy) return;
    if (!window.confirm(t('confirmDelete'))) return;
    state.busy = true;
    try {
      const { error } = await db.from('reviews').delete().eq('user_id', state.user.id);
      if (error) throw error;
      state.ownReview = null;
      state.selectedRating = null;
      const textarea = $('#reviewText');
      if (textarea) textarea.value = '';
      updateCounter();
      updateComposerUI();
      updateRatingLabel();
      setStatus(t('deleted'), 'success');
      await Promise.all([refreshStats(), loadReviews(state.sort)]);
    } catch (error) {
      console.error(error);
      setStatus(t('deleteError'), 'error');
    } finally {
      state.busy = false;
    }
  }

  async function refreshStats() {
    if (!db) { setServiceState('offline'); return; }
    try {
      const { data, error } = await db.from('review_stats').select('total_ratings,average_rating,positive_ratings,freshness').single();
      if (error) throw error;
      setServiceState('online');
      const total = Number(data?.total_ratings || 0);
      const avg = data?.average_rating == null ? '—' : Number(data.average_rating).toFixed(1);
      const freshness = data?.freshness == null ? null : Number(data.freshness);

      const freshState = $('#freshnessState');
      const ring = $('#freshnessRing');
      const avgEl = $('#averageRating');
      const countEl = $('#ratingsCount');

      animateFreshness(freshness);
      if (freshState) freshState.textContent = freshnessCategory(freshness);
      if (ring) {
        if (freshness == null) ring.style.setProperty('--freshness', 0);
        else requestAnimationFrame(() => ring.style.setProperty('--freshness', freshness));
        ring.classList.toggle('is-pending', freshness === null);
      }
      if (avgEl) avgEl.textContent = avg;
      if (countEl) countEl.textContent = `${total} ${pluralRatings(total)}`;
      state.lastFreshness = freshness;
    } catch (error) {
      console.error(error);
      setServiceState('offline');
    }
  }

  function formatDate(value) {
    if (!value) return '';
    const locale = state.lang === 'ru' ? 'ru-RU' : 'en-US';
    return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
  }

  async function loadReviews(sort = state.sort) {
    if (!db) return;
    state.sort = sort;
    $$('.review-sort-button').forEach(btn => btn.classList.toggle('active', btn.dataset.sort === sort));
    const list = $('#reviewsList');
    if (!list) return;

    try {
      let query = db.from('reviews').select('id,user_id,rating,review_text,created_at,updated_at').limit(40);
      if (sort === 'high') query = query.order('rating', { ascending: false }).order('created_at', { ascending: false });
      else if (sort === 'low') query = query.order('rating', { ascending: true }).order('created_at', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data: reviews, error } = await query;
      if (error) throw error;
      setServiceState('online');
      if (!reviews?.length) {
        list.replaceChildren(Object.assign(document.createElement('div'), { className: 'reviews-empty', textContent: t('reviewsEmpty') }));
        return;
      }

      const ids = [...new Set(reviews.map(r => r.user_id))];
      const { data: profiles, error: profileError } = await db
        .from('profiles')
        .select('id,display_name,avatar_seed,avatar_style')
        .in('id', ids);
      if (profileError) throw profileError;
      const profileMap = new Map((profiles || []).map(p => [p.id, p]));

      const fragment = document.createDocumentFragment();
      reviews.forEach(review => {
        const p = profileMap.get(review.user_id) || { display_name: state.lang === 'ru' ? 'Неизвестный профиль' : 'Unknown profile', avatar_seed: 1, avatar_style: 2 };
        const card = document.createElement('article');
        card.className = 'review-card';
        if (state.user?.id === review.user_id) card.classList.add('is-own');

        const top = document.createElement('div');
        top.className = 'review-card-top';
        const identity = document.createElement('div');
        identity.className = 'review-identity';
        const avatar = document.createElement('div');
        avatar.className = 'review-avatar';
        avatar.innerHTML = avatarSvg(p.avatar_seed, p.avatar_style, 54);
        const identityText = document.createElement('div');
        const name = document.createElement('strong');
        name.textContent = p.display_name;
        const date = document.createElement('span');
        date.textContent = formatDate(review.created_at);
        if (state.user?.id === review.user_id) {
          const badge = document.createElement('em');
          badge.className = 'own-badge';
          badge.textContent = t('yourBadge');
          identityText.append(name, badge, date);
        } else {
          identityText.append(name, date);
        }
        identity.append(avatar, identityText);

        const score = document.createElement('div');
        score.className = `review-score${review.rating >= 7 ? ' positive' : ''}`;
        score.innerHTML = `<strong>${Number(review.rating)}</strong><span>/10</span>`;
        top.append(identity, score);

        const body = document.createElement('p');
        body.className = 'review-card-text';
        body.textContent = review.review_text?.trim() || t('noText');
        if (!review.review_text?.trim()) body.classList.add('muted-text');

        const edited = new Date(review.updated_at).getTime() - new Date(review.created_at).getTime() > 5000;
        card.append(top, body);
        if (edited) {
          const editMark = document.createElement('small');
          editMark.className = 'review-edited';
          editMark.textContent = t('edited');
          card.append(editMark);
        }
        fragment.append(card);
      });
      list.replaceChildren(fragment);
    } catch (error) {
      console.error(error);
      setServiceState('offline');
      list.replaceChildren(Object.assign(document.createElement('div'), { className: 'reviews-empty', textContent: t('loadError') }));
    }
  }

  function bindEvents() {
    $('#langToggle')?.addEventListener('click', () => setLanguage(state.lang === 'ru' ? 'en' : 'ru'));
    $('#rerollName')?.addEventListener('click', rerollName);
    $('#rerollAvatar')?.addEventListener('click', rerollAvatar);
    $('#submitReview')?.addEventListener('click', submitReview);
    $('#deleteReview')?.addEventListener('click', deleteReview);
    $('#reviewText')?.addEventListener('input', updateCounter);
    $$('.rating-button').forEach(button => button.addEventListener('click', () => selectRating(button.dataset.rating)));
    $$('.review-sort-button').forEach(button => button.addEventListener('click', () => loadReviews(button.dataset.sort)));
  }

  let dataLayerStarted = false;

  async function bootDataLayer() {
    if (dataLayerStarted || !createDbClient()) return;
    dataLayerStarted = true;
    setServiceState('checking');
    await Promise.allSettled([loadExistingSession(), refreshStats(), loadReviews(state.sort)]);
  }

  async function init() {
    state.pendingProfile = createPendingProfile();
    bindEvents();
    applyTranslations();
    updateCounter();
    renderProfilePreview();

    if (createDbClient()) await bootDataLayer();
    else setServiceState('checking');
  }

  window.addEventListener('theft:supabase-ready', () => bootDataLayer());
  window.addEventListener('theft:supabase-failed', () => {
    if (!db) {
      setServiceState('offline');
      setStatus(t('loadError'), 'error');
    }
  });
  window.addEventListener('online', () => {
    if (db) { dataLayerStarted = false; bootDataLayer(); }
  });
  window.addEventListener('offline', () => setServiceState('offline'));

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
