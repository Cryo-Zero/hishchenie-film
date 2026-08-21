(() => {
  'use strict';

  const SUPABASE_URL = 'https://xltwwvutqkpmtmlavngi.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_0hT3y-7p26Ngnq2zaPK-0w_5vtJX15k';
  const PROJECT_REF = 'xltwwvutqkpmtmlavngi';
  const SESSION_KEY = `theft-${PROJECT_REF}-auth-v4`;
  const AUTH_LOCK_NAME = `theft-${PROJECT_REF}-auth-lock-v4`;
  const CLIENT_REVISION = 'P15-signal-ui';
  const REQUEST_TIMEOUT = 18000;
  const AUTH_TIMEOUT = 30000;
  const WRITE_TIMEOUT = 30000;
  const I18N = {
    ru: {
      metaTitle: 'ХИЩЕНИЕ — THEFT | Официальный сайт фильма',
      metaDescription: 'Официальный сайт фильма «ХИЩЕНИЕ / THEFT» — антиутопической драмы о мире 2045 года.',
      reviewsMetaTitle: 'Отзывы — ХИЩЕНИЕ / THEFT', reviewsMetaDescription: 'Отзывы зрителей и оценка фильма «ХИЩЕНИЕ / THEFT». Анонимный профиль без email, телефона и пароля.',
      navAria: 'Основная навигация',
      slogan: 'В системе нет безопасности',
      menu: 'Меню', systemActive: 'Система активна', publicAccess: 'Публичный доступ',
      heroPosterAlt: 'Официальная обложка фильма «Хищение»', heroVideoAria: 'Беззвучный фрагмент трейлера фильма «Хищение»',
      navAbout: 'О фильме', navMaterials: 'Материалы', navTrailer: 'Трейлер', navWatch: 'Где посмотреть', navCast: 'Актёры', navReviews: 'Отзывы', navFaq: 'FAQ', navContacts: 'Контакты',
      watchIntro: 'Площадки появятся здесь после подтверждения релиза. Пока раздел работает как публичная точка доступа к проекту.',
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
      signalKicker: 'Текущий сигнал', signalStatusLabel: 'Статус', signalStatusValue: 'В разработке', signalYearLabel: 'Год', signalTrailerLabel: 'Трейлер', signalTrailerValue: 'В сети', signalAccessLabel: 'Публичный доступ', signalAccessValue: 'Активен', signalStable: 'SIGNAL // STABLE',
      castLabel: '05 / SUBJECTS', castTitle: 'Актёрский состав',
      castListAria: 'Список актёров', dossierHeader: 'SUBJECT DOSSIER // PUBLIC', dossierClose: 'Закрыть досье',
      dossierRoleLabel: 'Роль', dossierStatusLabel: 'Статус', dossierAccessLabel: 'Доступ', dossierRefLabel: 'Системная запись',
      dossierAwaiting: 'ВЫБЕРИТЕ СУБЪЕКТ // ОЖИДАНИЕ', dossierLoaded: 'ФАЙЛ ЗАГРУЖЕН // ВЫБЕРИТЕ ДРУГОЙ СУБЪЕКТ',
      nameArman: 'Арман О.', nameBogdan: 'Богдан В.', nameLevon: 'Левон', nameYulia: 'Юля Ш.', nameArsen: 'Арсен О.', nameAlexander: 'Александр К.', nameBella: 'Белла А.',
      roleGor: 'Гор', roleAntagonist: 'Антагонист', roleMark: 'Марк', roleHost: 'Ведущая', roleMusician: 'Музыкант', roleGrandfather: 'Дедушка Гора', roleDetective: 'Детектив',
      reviewsLabel: 'R / PUBLIC RESPONSE', reviewsTitle: 'Отзывы зрителей', reviewsIntro: 'Оценки зрителей формируют «Свежесть» фильма. 7–10 баллов считаются положительной оценкой.',
      freshness: 'Свежесть', insufficient: 'Недостаточно оценок', freshnessHint: '7–10 = положительно',
      freshnessCold: 'Холодный приём', freshnessMixed: 'Смешанные отзывы', freshnessFresh: 'Свежий', freshnessVeryFresh: 'Очень свежий', freshnessChoice: 'Выбор зрителей',
      serviceChecking: 'Проверка канала', serviceOnline: 'Отзывы доступны', serviceOffline: 'Отзывы временно недоступны',
      average: 'Средняя оценка', ratings: 'оценок', ratingOne: 'оценка', ratingFew: 'оценки', ratingMany: 'оценок',
      yourProtocol: 'Ваш профиль', profileNote: 'Псевдоним и аватар создаются автоматически. Их можно менять сколько угодно.',
      rerollName: 'Другой псевдоним', rerollAvatar: 'Другой аватар',
      yourRating: 'Ваша оценка', ratingPrompt: 'Выберите от 0 до 10', ratingScaleAria: 'Оценка от 0 до 10',
      reviewLabel: 'Ваш отзыв', reviewOptional: 'необязательно', reviewPlaceholder: 'Расскажите о впечатлениях от фильма…',
      publish: 'Опубликовать', updateReview: 'Сохранить изменения', deleteReview: 'Удалить отзыв',
      privacy: 'Без email, телефона и пароля. Сайт хранит только технический идентификатор, псевдоним, аватар-настройку, оценку и текст отзыва, а также ваши реакции и ответы, если вы ими пользуетесь. Профиль привязан к этому браузеру: после очистки данных доступ к редактированию старого отзыва может быть потерян.',
      latest: 'Новые', highest: 'С высокой оценкой', lowest: 'С низкой оценкой',
      reviewsEmpty: 'Пока нет отзывов. Ваша оценка может стать первой.', noText: 'Оценка без текстового отзыва.',
      edited: 'изменено', yourBadge: 'ваш отзыв',
      chooseRating: 'Сначала выберите оценку от 0 до 10.', saving: 'Сохраняем…', saved: 'Отзыв опубликован.', updated: 'Изменения сохранены.', deleted: 'Отзыв удалён.',
      authError: 'Не удалось создать анонимный профиль. Попробуйте ещё раз.', loadError: 'Не удалось загрузить отзывы.', saveError: 'Не удалось сохранить отзыв. Попробуйте ещё раз.', deleteError: 'Не удалось удалить отзыв.', profileError: 'Не удалось обновить профиль.',
      confirmDelete: 'Удалить ваш отзыв? Это действие нельзя отменить.',
      oldSort: 'Старые', popular: 'Популярные', withOfficialResponse: 'С ответом команды', allReviews: 'Все отзывы', useful: 'Полезно', replies: 'Ответы', reply: 'Ответить', replyPlaceholder: 'Короткий ответ на отзыв…', replySave: 'Отправить', replyDelete: 'Удалить ответ', replyEmpty: 'Ответов пока нет.', replySaved: 'Ответ сохранён.', replyError: 'Не удалось сохранить ответ.', pinned: 'закреплено', official: 'КОМАНДА ФИЛЬМА · OFFICIAL',
      audienceSignal: 'Сигнал аудитории', audienceSignalCopy: 'Оценка зрителей доступна сразу — полный раздел отзывов открыт отдельно.', openReviews: 'Открыть отзывы',
      audiencePulse: 'Пульс аудитории', audiencePulseAria: 'Пульс аудитории и статистика оценок', pulseSamples: 'Сигналов', pulseAverage: 'Средняя',
      pulsePositive: 'Положительных', pulseState: 'Канал', pulseLive: 'LIVE', pulseFoot: 'PUBLIC RESPONSE // LIVE SIGNAL',
      faqLabel: '06 / FAQ', faqTitle: 'Часто задаваемые вопросы', faqIntro: 'Короткие ответы о фильме и этом публичном архиве. Факты о релизе обновляются только после подтверждения командой.',
      faqQ1: 'Когда выйдет фильм?', faqA1: 'Точная дата релиза пока не объявлена. Фильм находится в разработке; подтверждённая дата появится на этом сайте.',
      faqQ2: 'Где можно будет посмотреть «Хищение»?', faqA2: 'Площадки появятся в разделе «Где посмотреть» после подтверждения релиза. Сейчас они помечены как ожидающие.',
      faqQ3: 'На каком языке трейлер?', faqA3: 'Оригинальная звуковая дорожка трейлера — на русском. Текст внутри авторских постеров также может оставаться на русском.',
      faqQ4: 'Будут ли английские субтитры?', faqA4: 'Возможность английских субтитров предусмотрена, но публиковать обещание до согласования с автором мы не будем.',
      faqQ5: 'Как оставить отзыв?', faqA5: 'Откройте отдельную вкладку «Отзывы», выберите оценку от 0 до 10 и при желании добавьте текст. Email, телефон и обычная регистрация не нужны.',
      signalLog1: 'Трейлер доступен', signalLog2: 'Публичный архив открыт', signalLog3: 'Релиз ожидает подтверждения', signalNow: 'СЕЙЧАС', signalPending: 'PENDING',
      galleryAlt01: 'Обложка фильма «Хищение»', galleryAlt02: 'Постер фильма «Хищение» — пианино', galleryAlt03: 'Постер фильма «Хищение» — дедушка и ребёнок', galleryAlt04: 'Постер фильма «Хищение» — человек в капюшоне', galleryAlt05: 'Постер фильма «Хищение»', galleryAlt06: 'Постер фильма «Хищение» — герой в разрушенном городе', galleryAlt07: 'Постер фильма «Хищение» — ведущая', galleryAlt08: 'Постер фильма «Хищение» — город', galleryAlt09: 'Постер фильма «Хищение» — Гор', galleryAlt10: 'Кадры из фильма «Хищение»', galleryAlt11: 'Визуальный материал фильма «Хищение»',
      contactsLabel: '07 / CONTACT', contactsTitle: 'Контакты',
      contactSignal: 'CONTACT SIGNAL // AUTHOR', contactOpen: 'CHANNEL // OPEN ↗',
      securityTeaser: 'SYS // SECURITY: PRESENT', securityTitle: 'На сайте есть безопасность',
      securityText: 'Без email, телефона и пароля. Сайт хранит только технический идентификатор, псевдоним, аватар-настройку, оценку и текст отзыва, а также ваши реакции и ответы, если вы ими пользуетесь. Профиль привязан к этому браузеру: после очистки данных доступ к редактированию старого отзыва может быть потерян.',
      securityClose: 'Скрыть',
      footer: 'Официальный сайт фильма · фильм находится в разработке',
      close: 'Закрыть', previousImage: 'Предыдущее изображение', nextImage: 'Следующее изображение', openImage: 'Открыть выбранное изображение', galleryAria: 'Галерея материалов фильма', lightboxAria: 'Просмотр изображения',
      langButton: 'EN',
      scoreWords: ['Критически', 'Очень слабо', 'Очень слабо', 'Слабо', 'Ниже среднего', 'Средне', 'Неплохо', 'Хорошо', 'Очень хорошо', 'Отлично', 'Выдающееся']
    },
    en: {
      metaTitle: 'THEFT — ХИЩЕНИЕ | Official Film Website',
      metaDescription: 'Official website of THEFT / ХИЩЕНИЕ — a dystopian drama set in 2045.',
      reviewsMetaTitle: 'Reviews — THEFT / ХИЩЕНИЕ', reviewsMetaDescription: 'Audience reviews and ratings for THEFT / ХИЩЕНИЕ. Anonymous profile with no email, phone number or password.',
      navAria: 'Main navigation',
      slogan: 'There is no safety in the system',
      menu: 'Menu', systemActive: 'System active', publicAccess: 'Public access',
      heroPosterAlt: 'Official poster for THEFT / ХИЩЕНИЕ', heroVideoAria: 'Muted trailer excerpt from THEFT / ХИЩЕНИЕ',
      navAbout: 'About', navMaterials: 'Materials', navTrailer: 'Trailer', navWatch: 'Watch', navCast: 'Cast', navReviews: 'Reviews', navFaq: 'FAQ', navContacts: 'Contacts',
      watchIntro: 'Platforms will appear here once the release is confirmed. For now, this section serves as a public access point to the project.',
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
      signalKicker: 'Current signal', signalStatusLabel: 'Status', signalStatusValue: 'In development', signalYearLabel: 'Year', signalTrailerLabel: 'Trailer', signalTrailerValue: 'Online', signalAccessLabel: 'Public access', signalAccessValue: 'Active', signalStable: 'SIGNAL // STABLE',
      castLabel: '05 / SUBJECTS', castTitle: 'Cast',
      castListAria: 'Cast list', dossierHeader: 'SUBJECT DOSSIER // PUBLIC', dossierClose: 'Close dossier',
      dossierRoleLabel: 'Role', dossierStatusLabel: 'Status', dossierAccessLabel: 'Access', dossierRefLabel: 'System record',
      dossierAwaiting: 'SELECT SUBJECT // AWAITING INPUT', dossierLoaded: 'FILE LOADED // SELECT ANOTHER SUBJECT',
      nameArman: 'Arman O.', nameBogdan: 'Bogdan V.', nameLevon: 'Levon', nameYulia: 'Yulia Sh.', nameArsen: 'Arsen O.', nameAlexander: 'Aleksandr K.', nameBella: 'Bella A.',
      roleGor: 'Gor', roleAntagonist: 'Antagonist', roleMark: 'Mark', roleHost: 'News anchor', roleMusician: 'Musician', roleGrandfather: "Gor's grandfather", roleDetective: 'Detective',
      reviewsLabel: 'R / PUBLIC RESPONSE', reviewsTitle: 'Audience reviews', reviewsIntro: 'Audience scores form the film’s “Freshness” rating. Scores from 7 to 10 count as positive.',
      freshness: 'Freshness', insufficient: 'Not enough ratings', freshnessHint: '7–10 = positive',
      freshnessCold: 'Cold reception', freshnessMixed: 'Mixed response', freshnessFresh: 'Fresh', freshnessVeryFresh: 'Very fresh', freshnessChoice: 'Audience choice',
      serviceChecking: 'Checking channel', serviceOnline: 'Reviews online', serviceOffline: 'Reviews temporarily unavailable',
      average: 'Average score', ratings: 'ratings', ratingOne: 'rating', ratingFew: 'ratings', ratingMany: 'ratings',
      yourProtocol: 'Your profile', profileNote: 'Your alias and avatar are generated automatically. You can reroll them at any time.',
      rerollName: 'New alias', rerollAvatar: 'New avatar',
      yourRating: 'Your score', ratingPrompt: 'Choose from 0 to 10', ratingScaleAria: 'Score from 0 to 10',
      reviewLabel: 'Your review', reviewOptional: 'optional', reviewPlaceholder: 'Tell us what you thought about the film…',
      publish: 'Publish', updateReview: 'Save changes', deleteReview: 'Delete review',
      privacy: 'No email, phone number or password. The site stores only a technical identifier, alias, avatar settings, score and review text, plus your reactions and replies if you use them. The profile is tied to this browser; clearing browser data may remove access to editing the old review.',
      latest: 'Newest', highest: 'Highest score', lowest: 'Lowest score',
      reviewsEmpty: 'No reviews yet. Your score can be the first.', noText: 'Rating without a written review.',
      edited: 'edited', yourBadge: 'your review',
      chooseRating: 'Choose a score from 0 to 10 first.', saving: 'Saving…', saved: 'Review published.', updated: 'Changes saved.', deleted: 'Review deleted.',
      authError: 'Could not create an anonymous profile. Please try again.', loadError: 'Could not load reviews.', saveError: 'Could not save the review. Please try again.', deleteError: 'Could not delete the review.', profileError: 'Could not update the profile.',
      confirmDelete: 'Delete your review? This cannot be undone.',
      oldSort: 'Oldest', popular: 'Most liked', withOfficialResponse: 'Team replied', allReviews: 'All reviews', useful: 'Useful', replies: 'Replies', reply: 'Reply', replyPlaceholder: 'Write a short reply…', replySave: 'Send', replyDelete: 'Delete reply', replyEmpty: 'No replies yet.', replySaved: 'Reply saved.', replyError: 'Could not save the reply.', pinned: 'pinned', official: 'FILM TEAM · OFFICIAL',
      audienceSignal: 'Audience signal', audienceSignalCopy: 'The audience score is visible early; the full community feed lives on a dedicated reviews page.', openReviews: 'Open reviews',
      audiencePulse: 'Audience pulse', audiencePulseAria: 'Audience pulse and rating statistics', pulseSamples: 'Signals', pulseAverage: 'Average',
      pulsePositive: 'Positive', pulseState: 'Channel', pulseLive: 'LIVE', pulseFoot: 'PUBLIC RESPONSE // LIVE SIGNAL',
      faqLabel: '06 / FAQ', faqTitle: 'Frequently asked questions', faqIntro: 'Short answers about the film and this public archive. Release facts are updated only after confirmation by the film team.',
      faqQ1: 'When will the film be released?', faqA1: 'The exact release date has not been announced. The film is in development; a confirmed date will appear on this website.',
      faqQ2: 'Where will THEFT be available?', faqA2: 'Platforms will appear in the Watch section after the release is confirmed. For now they are marked as pending.',
      faqQ3: 'What language is the trailer in?', faqA3: 'The trailer uses its original Russian audio. Text embedded in the original poster artwork may also remain in Russian.',
      faqQ4: 'Will there be English subtitles?', faqA4: 'English subtitles are technically planned for, but we will not promise them publicly until they are confirmed with the author.',
      faqQ5: 'How do I leave a review?', faqA5: 'Open the dedicated Reviews tab, choose a score from 0 to 10 and optionally add text. No email, phone number or conventional registration is required.',
      signalLog1: 'Trailer online', signalLog2: 'Public archive open', signalLog3: 'Release awaiting confirmation', signalNow: 'NOW', signalPending: 'PENDING',
      galleryAlt01: 'THEFT film cover', galleryAlt02: 'THEFT poster — piano scene', galleryAlt03: 'THEFT poster — grandfather and child', galleryAlt04: 'THEFT poster — hooded figure', galleryAlt05: 'THEFT film poster', galleryAlt06: 'THEFT poster — protagonist in a ruined city', galleryAlt07: 'THEFT poster — news anchor', galleryAlt08: 'THEFT poster — city', galleryAlt09: 'THEFT poster — Gor', galleryAlt10: 'Frames from THEFT', galleryAlt11: 'THEFT visual material',
      contactsLabel: '07 / CONTACT', contactsTitle: 'Contacts',
      contactSignal: 'CONTACT SIGNAL // AUTHOR', contactOpen: 'CHANNEL // OPEN ↗',
      securityTeaser: 'SYS // SECURITY: PRESENT', securityTitle: 'There is safety on this site',
      securityText: 'No email, phone number or password. The site stores only a technical identifier, alias, avatar settings, score and review text, plus your reactions and replies if you use them. The profile is tied to this browser; clearing browser data may remove access to editing the old review.',
      securityClose: 'Hide',
      footer: 'Official film website · the film is in development',
      close: 'Close', previousImage: 'Previous image', nextImage: 'Next image', openImage: 'Open selected image', galleryAria: 'Film materials gallery', lightboxAria: 'Image viewer',
      langButton: 'RU',
      scoreWords: ['Critical', 'Very poor', 'Very poor', 'Poor', 'Below average', 'Average', 'Fair', 'Good', 'Very good', 'Excellent', 'Outstanding']
    }
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const safeStorage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} },
    del(key) { try { localStorage.removeItem(key); } catch {} }
  };

  const initialLanguage = safeStorage.get('theft_lang') || (navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en');
  const state = {
    lang: I18N[initialLanguage] ? initialLanguage : 'ru',
    session: null,
    user: null,
    profile: null,
    pendingProfile: null,
    ownReview: null,
    ownLikes: new Set(),
    ownReplies: new Map(),
    selectedRating: null,
    sort: 'new',
    filter: 'all',
    serviceState: 'checking',
    lastStats: { total_ratings:0, average_rating:null, positive_ratings:0, freshness:null },
    reviews: [],
    busy: false,
    feedSeq: 0,
    openReplies: new Set()
  };
  const t = key => I18N[state.lang]?.[key] ?? I18N.ru[key] ?? key;

  // Canonical alias parts are aligned RU/EN. We store only a compact alias_code
  // plus one number and render the language locally — no AI/translation API needed.
  const ALIAS = {
    adjectives: [
      ['Тихий','Silent'],['Холодный','Cold'],['Скрытый','Hidden'],['Ночной','Night'],['Серый','Grey'],['Забытый','Forgotten'],['Последний','Last'],['Немой','Mute'],['Северный','Northern'],['Пустой','Empty'],['Сломанный','Broken'],['Стёртый','Erased'],['Неизвестный','Unknown'],['Спящий','Sleeping'],['Бледный','Pale'],['Теневой','Shadow'],['Свободный','Free'],['Нулевой','Zero'],['Запретный','Forbidden'],['Потерянный','Lost'],['Безымянный','Nameless'],['Резервный','Reserve'],['Невидимый','Invisible'],['Пограничный','Border'],['Зашифрованный','Encoded'],['Безмолвный','Wordless'],['Брошенный','Abandoned'],['Неподтверждённый','Unconfirmed'],['Переходный','Transit'],['Наблюдаемый','Observed']
    ],
    nouns: [
      ['Свидетель','Witness'],['Контур','Contour'],['Сигнал','Signal'],['Кадр','Frame'],['След','Trace'],['Голос','Voice'],['Наблюдатель','Observer'],['Архив','Archive'],['Импульс','Pulse'],['Сектор','Sector'],['Протокол','Protocol'],['Шум','Noise'],['Маркер','Marker'],['Экран','Screen'],['Код','Code'],['Вектор','Vector'],['Рубеж','Frontier'],['Коридор','Corridor'],['Объект','Subject'],['Канал','Channel'],['Узел','Node'],['Фрагмент','Fragment'],['Проводник','Guide'],['Архивист','Archivist'],['Оператор','Operator'],['Куратор','Curator'],['Регистр','Register'],['Сканер','Scanner'],['Странник','Wanderer'],['Хранитель','Keeper'],['Маяк','Beacon'],['Порог','Threshold'],['Отбор','Selection'],['Ключ','Key'],['Терминал','Terminal'],['Поток','Stream'],['Сводка','Briefing'],['Вход','Entry'],['Выход','Exit'],['Разрыв','Rift']
    ],
    roles: [
      ['Наблюдатель','Observer'],['Архивист','Archivist'],['Оператор','Operator'],['Свидетель','Witness'],['Куратор','Curator'],['Проводник','Guide'],['Гражданин','Citizen'],['Регистратор','Registrar'],['Инспектор','Inspector'],['Диспетчер','Dispatcher'],['Хранитель','Keeper'],['Сканер','Scanner'],['Следователь','Investigator'],['Пассажир','Passenger'],['Беглец','Runaway'],['Кандидат','Candidate'],['Резидент','Resident'],['Координатор','Coordinator'],['Контролёр','Controller'],['Аналитик','Analyst']
    ],
    worlds: [
      ['Сектор','Sector'],['Архив','Archive'],['Протокол','Protocol'],['Контур','Contour'],['Система','System'],['Секция','Section'],['Регистр','Register'],['Канал','Channel'],['Узел','Node'],['Индекс','Index'],['Запись','Record'],['Маркер','Marker'],['Сигнал','Signal'],['Профиль','Profile'],['Предел','Limit'],['Шлюз','Gateway'],['Резерв','Reserve'],['Эфир','Broadcast'],['Периметр','Perimeter'],['Коридор','Corridor']
    ],
    images: [
      ['Тени','of Shadow'],['Света','of Light'],['Шума','of Noise'],['Памяти','of Memory'],['Севера','of the North'],['Пепла','of Ash'],['Эфира','of Static'],['Сна','of Sleep'],['Пустоты','of the Void'],['Голоса','of Voices'],['Дождя','of Rain'],['Кадра','of the Frame'],['Сигнала','of Signal'],['Ночи','of Night'],['Стекла','of Glass'],['Бетона','of Concrete'],['Пульса','of Pulse'],['Следа','of Traces'],['Тишины','of Silence'],['Города','of the City']
    ],
    phrases: [
      ['Тот, Кто Ждёт','The One Who Waits'],['Лицо Без Архива','Face Without an Archive'],['Голос Из Сектора','Voice from the Sector'],['Человек Из Записи','Person from the Record'],['Тень За Экраном','Shadow Behind the Screen'],['Свидетель Без Номера','Witness Without a Number'],['Тот, Кто Помнит','The One Who Remembers'],['Последний В Очереди','Last in the Line'],['За Пределом Секции','Beyond the Section'],['Вне Зоны Контроля','Outside Control'],['Не Внесён В Реестр','Not in the Register'],['Сигнал Не Принят','Signal Not Received'],['Запись Не Найдена','Record Not Found'],['За Закрытой Дверью','Behind the Sealed Door'],['Из Другого Сектора','From Another Sector'],['Тот, Кто Остался','The One Who Stayed'],['Никем Не Учтён','Unaccounted For'],['Вне Списка','Outside the List'],['Пока Система Спит','While the System Sleeps'],['Неизвестный В Кадре','Unknown in Frame']
    ]
  };

  class ApiError extends Error {
    constructor(message, status = 0, code = 'API_ERROR', payload = null) {
      super(message); this.name = 'ApiError'; this.status = status; this.code = code; this.payload = payload;
    }
  }

  const diag = window.__THEFT_DIAG__ = window.__THEFT_DIAG__ || { revision: CLIENT_REVISION, events: [] };
  function trace(code, detail = '') {
    diag.events.push({ t: Date.now(), code, detail: String(detail).slice(0,180) });
    if (diag.events.length > 40) diag.events.shift();
  }

  function randomInt(max) {
    if (crypto?.getRandomValues) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % max; }
    return Math.floor(Math.random() * max);
  }
  const randomSeed = () => randomInt(2147483647);
  const pair = (group, i, lang = state.lang) => (ALIAS[group]?.[i]?.[lang === 'ru' ? 0 : 1] || 'Unknown');

  function renderAlias(profile, lang = state.lang) {
    if (!profile) return '—';
    if (profile.is_official || profile.alias_code === 'official_team') return lang === 'ru' ? 'Команда фильма' : 'Film Team';
    const code = String(profile.alias_code || '');
    const n = Number(profile.alias_number ?? 0);
    let m;
    if ((m = code.match(/^an_(\d+)_(\d+)$/))) return `${pair('adjectives',+m[1],lang)} ${pair('nouns',+m[2],lang)}`;
    if ((m = code.match(/^role_(\d+)$/))) return `${pair('roles',+m[1],lang)} // ${String(n).padStart(2,'0')}`;
    if ((m = code.match(/^wi_(\d+)_(\d+)$/))) return `${pair('worlds',+m[1],lang)} ${pair('images',+m[2],lang)}`;
    if ((m = code.match(/^phrase_(\d+)$/))) return pair('phrases',+m[1],lang);
    if ((m = code.match(/^ar_(\d+)_(\d+)$/))) return `${pair('adjectives',+m[1],lang)} ${pair('roles',+m[2],lang)}`;
    if ((m = code.match(/^world_(\d+)$/))) return `${pair('worlds',+m[1],lang)}-${String(n).padStart(3,'0')}`;
    if ((m = code.match(/^noun_(\d+)$/))) return `${pair('nouns',+m[1],lang)} // ${String(n).padStart(3,'0')}`;
    if (code === 'record') return lang === 'ru' ? `Запись ${String(Math.floor(n/100)).padStart(2,'0')}-${String(n%100).padStart(2,'0')}` : `Record ${String(Math.floor(n/100)).padStart(2,'0')}-${String(n%100).padStart(2,'0')}`;
    if ((m = code.match(/^rw_(\d+)_(\d+)$/))) return `${pair('roles',+m[1],lang)} / ${pair('worlds',+m[2],lang)}`;
    return profile.display_name || (lang === 'ru' ? 'Неизвестный профиль' : 'Unknown profile');
  }

  function generateAliasProfile() {
    const type = randomInt(9);
    let alias_code, alias_number = randomInt(1000);
    if (type === 0) alias_code = `an_${randomInt(ALIAS.adjectives.length)}_${randomInt(ALIAS.nouns.length)}`;
    else if (type === 1) alias_code = `role_${randomInt(ALIAS.roles.length)}`;
    else if (type === 2) alias_code = `wi_${randomInt(ALIAS.worlds.length)}_${randomInt(ALIAS.images.length)}`;
    else if (type === 3) alias_code = `phrase_${randomInt(ALIAS.phrases.length)}`;
    else if (type === 4) alias_code = `ar_${randomInt(ALIAS.adjectives.length)}_${randomInt(ALIAS.roles.length)}`;
    else if (type === 5) alias_code = `world_${randomInt(ALIAS.worlds.length)}`;
    else if (type === 6) alias_code = `noun_${randomInt(ALIAS.nouns.length)}`;
    else if (type === 7) { alias_code = 'record'; alias_number = randomInt(1000); }
    else alias_code = `rw_${randomInt(ALIAS.roles.length)}_${randomInt(ALIAS.worlds.length)}`;
    const p = { alias_code, alias_number, display_name:'', avatar_seed:randomSeed(), avatar_style:randomInt(6)+1, is_official:false };
    p.display_name = renderAlias(p, state.lang).slice(0,40);
    return p;
  }

  function avatarSvg(seed, style = 1, size = 72) {
    const n = Math.abs(Number(seed) || 1);
    const s = Math.max(1, Math.min(6, Number(style) || 1));
    // P14 uses six locally hosted cinematic portraits. The seed still changes
    // the crop/scan treatment, so rerolls feel varied without external avatar
    // services, user uploads or additional personal data.
    const file = `assets/images/avatars/subject-${String(s).padStart(2,'0')}.webp`;
    const shiftX = ((n % 9) - 4) * 0.32;
    const shiftY = (((Math.floor(n / 11)) % 7) - 3) * 0.24;
    const scale = 1.01 + (n % 5) * 0.008;
    const scan = 18 + (n % 58);
    return `<span class="avatar-image-wrap" style="width:${size}px;height:${size}px;--avatar-x:${shiftX}px;--avatar-y:${shiftY}px;--avatar-scale:${scale};--avatar-scan:${scan}%"><img class="avatar-image" src="${file}" alt="" loading="lazy" decoding="async"><i aria-hidden="true"></i></span>`;
  }


  function normalizeSession(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const s = raw.session?.access_token ? raw.session : raw;
    if (!s.access_token || !s.refresh_token) return null;
    if (!s.expires_at && s.expires_in) s.expires_at = Math.floor(Date.now()/1000)+Number(s.expires_in);
    return s;
  }
  function loadSession() {
    if (state.session?.access_token) return state.session;
    const raw=safeStorage.get(SESSION_KEY); if(!raw) return null;
    try { state.session=normalizeSession(JSON.parse(raw)); return state.session; } catch { return null; }
  }
  function storeSession(s) { state.session=normalizeSession(s); if(state.session) safeStorage.set(SESSION_KEY,JSON.stringify(state.session)); return state.session; }
  function jwtExp(token){ try{const p=token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');return Number(JSON.parse(atob(p+'='.repeat((4-p.length%4)%4))).exp||0);}catch{return 0;} }
  function sessionFresh(s){ const exp=Number(s?.expires_at||jwtExp(s?.access_token||'')||0); return !!s?.access_token && (!exp || exp>Math.floor(Date.now()/1000)+90); }

  let authPromise=null, refreshPromise=null, identityPromise=null;
  const FALLBACK_LOCK_KEY=`${SESSION_KEY}-lease`;
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function withAuthLock(fn) {
    if(navigator.locks?.request) return navigator.locks.request(AUTH_LOCK_NAME,fn);
    // Cross-tab fallback for browsers without Web Locks. It is a short lease,
    // re-checked after writing, so a stale/closed tab cannot block Auth forever.
    const token=`${Date.now()}-${randomInt(1_000_000)}`, deadline=Date.now()+6000;
    while(Date.now()<deadline){
      let lease=null;try{lease=JSON.parse(safeStorage.get(FALLBACK_LOCK_KEY)||'null')}catch{}
      if(!lease||Number(lease.expires||0)<Date.now()){
        safeStorage.set(FALLBACK_LOCK_KEY,JSON.stringify({token,expires:Date.now()+5000}));
        let mine=null;try{mine=JSON.parse(safeStorage.get(FALLBACK_LOCK_KEY)||'null')}catch{}
        if(mine?.token===token){
          try{return await fn();}
          finally{let current=null;try{current=JSON.parse(safeStorage.get(FALLBACK_LOCK_KEY)||'null')}catch{}if(current?.token===token)safeStorage.del(FALLBACK_LOCK_KEY);}
        }
      }
      await sleep(45+randomInt(70));
    }
    return fn();
  }

  async function fetchJson(url, options={}, timeout=REQUEST_TIMEOUT, label='HTTP') {
    const ctl=new AbortController(), started=performance.now(); const timer=setTimeout(()=>ctl.abort(),timeout);
    trace(`${label}:START`,new URL(url).pathname);
    try {
      const res=await fetch(url,{...options,signal:ctl.signal,cache:'no-store',credentials:'omit',mode:'cors'});
      if(res.status===204){ trace(`${label}:OK`,`${res.status} ${Math.round(performance.now()-started)}ms`); return null; }
      const text=await res.text(); let data=null;
      if(text){ try{data=JSON.parse(text);}catch{data=text;} }
      if(!res.ok){ const msg=data?.message||data?.msg||data?.error_description||data?.error||`HTTP ${res.status}`; throw new ApiError(String(msg),res.status,`${label}_${res.status}`,data); }
      trace(`${label}:OK`,`${res.status} ${Math.round(performance.now()-started)}ms`); return data;
    } catch(err) {
      if(err?.name==='AbortError') err=new ApiError('Request timed out',408,`${label}_TIMEOUT`);
      trace(`${label}:FAIL`,err.code||err.message); throw err;
    } finally { clearTimeout(timer); }
  }

  function authHeaders(token, body=false) { const h={apikey:SUPABASE_KEY,Accept:'application/json'}; if(token) h.Authorization=`Bearer ${token}`; if(body) h['Content-Type']='application/json'; return h; }

  async function signInAnonymous() {
    if(authPromise) return authPromise;
    authPromise=withAuthLock(async()=>{
      const existing=loadSession(); if(existing&&sessionFresh(existing)) return existing;
      const data=await fetchJson(`${SUPABASE_URL}/auth/v1/signup`,{method:'POST',headers:authHeaders(null,true),body:JSON.stringify({data:{}})},AUTH_TIMEOUT,'AUTH_SIGNUP');
      const s=storeSession(data); if(!s?.user?.id) throw new ApiError('Anonymous session missing',0,'AUTH_NO_SESSION'); state.user=s.user; return s;
    });
    try{return await authPromise;}finally{authPromise=null;}
  }

  async function refreshSession(s) {
    if(refreshPromise) return refreshPromise;
    refreshPromise=withAuthLock(async()=>{
      const current=loadSession()||s;
      if(current!==s && sessionFresh(current)) return current;
      const data=await fetchJson(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:authHeaders(null,true),body:JSON.stringify({refresh_token:current.refresh_token})},AUTH_TIMEOUT,'AUTH_REFRESH');
      const fresh=storeSession(data); if(!fresh?.access_token) throw new ApiError('Refresh failed',0,'AUTH_REFRESH_EMPTY'); state.user=fresh.user||state.user; return fresh;
    });
    try{return await refreshPromise;}finally{refreshPromise=null;}
  }

  async function getSession(create=false) {
    let s=loadSession();
    if(s&&sessionFresh(s)){state.user=s.user||state.user;return s;}
    if(s?.refresh_token){
      try{return await refreshSession(s);}
      catch(err){
        // A definitively rejected refresh token cannot recover. Clear only on an
        // explicit Auth rejection; timeouts/offline errors keep the identity so
        // a temporary VPN/network problem never silently replaces the profile.
        if(create && (err.status===400 || err.status===401)){
          safeStorage.del(SESSION_KEY);state.session=null;state.user=null;
          return signInAnonymous();
        }
        throw new ApiError(err.message,err.status||0,'SESSION_REFRESH_FAILED',err.payload);
      }
    }
    return create ? signInAnonymous() : null;
  }

  async function rpcGet(name, params={}, authenticated=false) {
    const s=authenticated?await getSession(true):null;
    const q=new URLSearchParams(); Object.entries(params).forEach(([k,v])=>{if(v!==undefined&&v!==null)q.set(k,String(v));});
    return fetchJson(`${SUPABASE_URL}/rest/v1/rpc/${name}${q.size?'?'+q:''}`,{method:'GET',headers:authHeaders(s?.access_token,false)},authenticated?WRITE_TIMEOUT:REQUEST_TIMEOUT,`RPC_${name}`);
  }
  async function rpcPost(name, body={}, authenticated=true) {
    let s=authenticated?await getSession(true):null;
    const send=token=>fetchJson(`${SUPABASE_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:authHeaders(token,true),body:JSON.stringify(body)},WRITE_TIMEOUT,`RPC_${name}`);
    try{return await send(s?.access_token);}catch(err){
      if(!authenticated||err.status!==401||!s?.refresh_token) throw err;
      s=await refreshSession(s); return send(s.access_token);
    }
  }

  function setServiceState(next, detail='') {
    state.serviceState=next;
    const badge=$('#reviewServiceBadge'); if(!badge) return;
    badge.classList.remove('is-checking','is-online','is-offline'); badge.classList.add(`is-${next}`);
    const span=$('span',badge); if(span){ const base=next==='online'?t('serviceOnline'):next==='offline'?t('serviceOffline'):t('serviceChecking'); span.textContent=`${base} · P15`; span.title=detail||CLIENT_REVISION; }
  }

  function pluralRatings(count) {
    if(state.lang==='en') return count===1?t('ratingOne'):t('ratingMany');
    const n=Math.abs(count)%100,n1=n%10; if(n>10&&n<20)return t('ratingMany'); if(n1>1&&n1<5)return t('ratingFew'); if(n1===1)return t('ratingOne'); return t('ratingMany');
  }
  function freshnessCategory(v){ if(v==null)return t('insufficient'); if(v<40)return t('freshnessCold'); if(v<60)return t('freshnessMixed'); if(v<80)return t('freshnessFresh'); if(v<90)return t('freshnessVeryFresh'); return t('freshnessChoice'); }

  function updateStatsUI(data) {
    const total=Number(data?.total_ratings||0);
    const avgNumber=data?.average_rating==null?null:Number(data.average_rating);
    const avg=avgNumber==null?'—':avgNumber.toFixed(1);
    const positive=Number(data?.positive_ratings||0);
    const freshness=data?.freshness==null?null:Number(data.freshness);
    const positivePct=total?Math.round(positive*100/total):null;
    state.lastStats={total_ratings:total,average_rating:avgNumber,positive_ratings:positive,freshness};

    $$('[data-stat="average"]').forEach(el=>el.textContent=avg);
    $$('[data-stat="header-average"]').forEach(el=>el.textContent=avg);
    $$('[data-stat="count"]').forEach(el=>el.textContent=`${total} ${pluralRatings(total)}`);
    $$('[data-stat="freshness"]').forEach(el=>el.textContent=freshness==null?'—':`${freshness}%`);
    $$('[data-stat="freshness-label"]').forEach(el=>el.textContent=freshnessCategory(freshness));
    $$('[data-stat="pulse-samples"]').forEach(el=>el.textContent=String(total));
    $$('[data-stat="pulse-average"]').forEach(el=>el.textContent=avg);
    $$('[data-stat="pulse-positive"]').forEach(el=>el.textContent=positivePct==null?'—':`${positivePct}%`);

    $$('[data-header-rating]').forEach(el=>{
      const pct=avgNumber==null?0:Math.max(0,Math.min(100,avgNumber*10));
      el.style.setProperty('--score-pct',`${pct}%`);
      const label=avgNumber==null
        ? (state.lang==='ru'?'Рейтинг зрителей: недостаточно данных':'Audience rating: not enough data')
        : (state.lang==='ru'?`Рейтинг зрителей: ${avg} из 10`:`Audience rating: ${avg} out of 10`);
      el.setAttribute('aria-label',label);
      el.title=label;
    });

    const pulseLevel=avgNumber==null?0.18:Math.max(.18,Math.min(1,avgNumber/10));
    const pulsePattern=[.18,.34,.62,.28,.78,.42,.92,.36,.66,.24,.84,.48,.72,.31,.96,.39,.69,.26,.81,.45,.9,.33,.58,.22];
    $$('[data-pulse-wave] span').forEach((el,i)=>{
      const factor=pulsePattern[i%pulsePattern.length];
      el.style.setProperty('--bar-height',`${Math.round(10+factor*pulseLevel*88)}%`);
    });

    const ring=$('#freshnessRing'); if(ring){ring.style.setProperty('--freshness',freshness??0);ring.classList.toggle('is-pending',freshness==null);}
    const fv=$('#freshnessValue'); if(fv)fv.textContent=freshness==null?'—':`${freshness}%`;
    const fs=$('#freshnessState'); if(fs)fs.textContent=freshnessCategory(freshness);
    const ar=$('#averageRating'); if(ar)ar.textContent=avg;
    const rc=$('#ratingsCount'); if(rc)rc.textContent=`${total} ${pluralRatings(total)}`;
  }

  async function refreshStats(){ try{const data=await rpcGet('get_public_stats_v2');updateStatsUI(data||{});setServiceState('online');}catch(err){console.error('[P15/stats]',err);setServiceState('offline',err.code);}}

  function applyTranslations(){
    document.documentElement.lang=state.lang;
    const communityPage=document.body?.classList.contains('community-page');
    document.title=t(communityPage?'reviewsMetaTitle':'metaTitle');
    const md=$('meta[name="description"]'); if(md)md.content=t(communityPage?'reviewsMetaDescription':'metaDescription');
    $$('[data-i18n]').forEach(el=>{const v=t(el.dataset.i18n); if(v!=null)el.textContent=v;});
    $$('[data-i18n-placeholder]').forEach(el=>el.setAttribute('placeholder',t(el.dataset.i18nPlaceholder)));
    $$('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
    $$('[data-i18n-alt]').forEach(el=>el.setAttribute('alt',t(el.dataset.i18nAlt)));
    $$('[data-platform-ru]').forEach(el=>{const name=state.lang==='ru'?el.dataset.platformRu:el.dataset.platformEn;el.textContent=`${name} · ${t('soon')}`;});
    const toggle=$('#langToggle'); if(toggle)toggle.textContent=t('langButton');
    updateStatsUI(state.lastStats);
    renderProfile();
    if($('#reviewsList')) renderReviews(state.reviews);
    const rating=state.selectedRating; if(rating!=null) updateRatingLabel();
    dispatchEvent(new CustomEvent('theft:language',{detail:{lang:state.lang}}));
  }
  function setLanguage(lang){if(!I18N[lang])return;state.lang=lang;safeStorage.set('theft_lang',lang);if(!state.profile&&state.pendingProfile)state.pendingProfile.display_name=renderAlias(state.pendingProfile,lang).slice(0,40);applyTranslations();}

  function profileForWrite() {
    const p={...(state.profile||state.pendingProfile||generateAliasProfile())};
    p.display_name=renderAlias(p,state.lang).slice(0,40); return p;
  }
  function renderProfile(){ const p=state.profile||state.pendingProfile||(state.pendingProfile=generateAliasProfile()); const av=$('#profileAvatar'),name=$('#profileName'); if(av)av.innerHTML=avatarSvg(p.avatar_seed,p.avatar_style,76); if(name)name.textContent=renderAlias(p,state.lang); }

  async function ensureIdentityProfile(){
    if(state.profile?.id)return state.profile;
    if(identityPromise)return identityPromise;
    identityPromise=(async()=>{
      const s=await getSession(true); state.user=s.user;
      const p=profileForWrite();
      const saved=await rpcPost('update_my_profile_v4',{p_display_name:p.display_name,p_alias_code:p.alias_code,p_alias_number:p.alias_number,p_avatar_seed:p.avatar_seed,p_avatar_style:p.avatar_style});
      state.profile=saved;state.pendingProfile=null;renderProfile();return saved;
    })();
    try{return await identityPromise;}finally{identityPromise=null;}
  }

  async function restoreOwnState(){
    const s=await getSession(false); if(!s?.user?.id)return; state.user=s.user;
    const data=await rpcGet('get_my_community_state_v2',{},true);
    state.profile=data?.profile||null;state.ownReview=data?.review||null;state.ownLikes=new Set(data?.likes||[]);state.ownReplies=new Map((data?.replies||[]).map(r=>[r.review_id,r]));
    if(state.profile&&!state.profile.alias_code){
      const source=String(state.profile.id||state.user?.id||'legacy');let h=2166136261;for(const ch of source){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}
      state.profile.alias_code=`an_${h%ALIAS.adjectives.length}_${Math.floor(h/31)%ALIAS.nouns.length}`;state.profile.alias_number=h%1000;state.profile.display_name=renderAlias(state.profile,state.lang).slice(0,40);
    }
    if(state.profile)state.pendingProfile=null;
    if(state.ownReview){state.selectedRating=Number(state.ownReview.rating);const ta=$('#reviewText');if(ta)ta.value=state.ownReview.review_text||'';}
    renderProfile();updateRatingLabel();updateCounter();updateComposerUI();
  }

  let profileMutation=false;
  async function rerollName(){
    if(state.busy||profileMutation)return;
    const fresh=generateAliasProfile(), base=state.profile||state.pendingProfile||generateAliasProfile();
    const p={...base,alias_code:fresh.alias_code,alias_number:fresh.alias_number};p.display_name=renderAlias(p,state.lang).slice(0,40);
    if(!state.user&&!loadSession()){state.pendingProfile=p;renderProfile();return;}
    profileMutation=true;setProfileBusy(true);
    try{await getSession(true);const saved=await rpcPost('update_my_profile_v4',{p_display_name:p.display_name,p_alias_code:p.alias_code,p_alias_number:p.alias_number,p_avatar_seed:p.avatar_seed,p_avatar_style:p.avatar_style});state.profile=saved;state.pendingProfile=null;renderProfile();}
    catch(err){console.error('[P14/profile/name]',err);setStatus(`${t('profileError')} [${err.code||'PROFILE'}]`,'error');}
    finally{profileMutation=false;setProfileBusy(false);}
  }
  async function rerollAvatar(){
    if(state.busy||profileMutation)return;
    const base={...(state.profile||state.pendingProfile||generateAliasProfile())};base.avatar_seed=randomSeed();base.avatar_style=randomInt(6)+1;base.display_name=renderAlias(base,state.lang).slice(0,40);
    if(!state.user&&!loadSession()){state.pendingProfile=base;renderProfile();return;}
    profileMutation=true;setProfileBusy(true);
    try{await getSession(true);const saved=await rpcPost('update_my_profile_v4',{p_display_name:base.display_name,p_alias_code:base.alias_code,p_alias_number:base.alias_number,p_avatar_seed:base.avatar_seed,p_avatar_style:base.avatar_style});state.profile=saved;state.pendingProfile=null;renderProfile();}
    catch(err){console.error('[P14/profile/avatar]',err);setStatus(`${t('profileError')} [${err.code||'PROFILE'}]`,'error');}
    finally{profileMutation=false;setProfileBusy(false);}
  }

  function setProfileBusy(on){['#rerollName','#rerollAvatar'].forEach(s=>{const e=$(s);if(e)e.disabled=on;});}
  function setComposerBusy(on){$$('.rating-button').forEach(b=>b.disabled=on);const ta=$('#reviewText');if(ta)ta.disabled=on;const sb=$('#submitReview');if(sb)sb.disabled=on;const db=$('#deleteReview');if(db)db.disabled=on;setProfileBusy(on);}
  function setStatus(msg,kind=''){const e=$('#reviewStatus');if(!e)return;e.textContent=msg||'';e.className=`review-status${kind?' '+kind:''}`;}
  function updateCounter(){const ta=$('#reviewText'),c=$('#reviewCounter');if(ta&&c)c.textContent=`${ta.value.length} / 2000`;}
  function updateRatingLabel(){const v=$('#selectedRatingValue'),w=$('#selectedRatingWord');if(state.selectedRating==null){if(v)v.textContent='— / 10';if(w)w.textContent=t('ratingPrompt');return;}if(v)v.textContent=`${state.selectedRating} / 10`;if(w)w.textContent=t('scoreWords')[state.selectedRating]||'';$$('.rating-button').forEach(b=>{const active=Number(b.dataset.rating)===state.selectedRating;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
  function selectRating(v){if(state.busy)return;state.selectedRating=Number(v);updateRatingLabel();}
  function updateComposerUI(){const b=$('#submitReview'),d=$('#deleteReview');if(b)b.textContent=state.ownReview?t('updateReview'):t('publish');if(d)d.hidden=!state.ownReview;}

  function applyLocalReviewStats(previousReview,newReview){
    const s=state.lastStats||{};
    let total=Number(s.total_ratings||0);
    let avg=s.average_rating==null?0:Number(s.average_rating);
    let positive=Number(s.positive_ratings||0);
    let sum=avg*total;
    if(previousReview){
      const oldRating=Number(previousReview.rating);
      sum-=oldRating;
      if(oldRating>=7)positive=Math.max(0,positive-1);
    }else total+=1;
    const newRating=Number(newReview.rating);
    sum+=newRating;
    if(newRating>=7)positive+=1;
    const average=total?sum/total:null;
    const freshness=total<5?null:Math.round(positive*100/total);
    updateStatsUI({total_ratings:total,average_rating:average,positive_ratings:positive,freshness});
  }

  async function submitReview(){
    if(state.busy||profileMutation)return;
    if(state.selectedRating==null){setStatus(t('chooseRating'),'error');return;}
    const rating=Number(state.selectedRating), text=($('#reviewText')?.value||'').trim(), p=profileForWrite();
    const previousReview=state.ownReview?{...state.ownReview}:null;
    const existed=!!previousReview;
    state.busy=true;setComposerBusy(true);setStatus(t('saving'));
    const submitButton=$('#submitReview'); if(submitButton)submitButton.classList.add('is-saving');
    let unlocked=false;
    try{
      const s=await getSession(true);state.user=s.user;
      const data=await rpcPost('submit_my_review_v4',{p_rating:rating,p_review_text:text,p_display_name:p.display_name,p_alias_code:p.alias_code,p_alias_number:p.alias_number,p_avatar_seed:p.avatar_seed,p_avatar_style:p.avatar_style});
      state.profile=data.profile;state.pendingProfile=null;state.ownReview=data.review;state.selectedRating=Number(data.review.rating);
      renderProfile();updateComposerUI();updateRatingLabel();applyLocalReviewStats(previousReview,data.review);
      setStatus(existed?t('updated'):t('saved'),'success');
      // The write is complete. Do not make the user wait for two reconciliation GETs.
      state.busy=false;setComposerBusy(false);unlocked=true;if(submitButton)submitButton.classList.remove('is-saving');
      Promise.allSettled([refreshStats(),loadReviews(state.sort,state.filter)]).catch(()=>{});
    }catch(err){console.error('[P15/review/save]',err,diag.events);setStatus(`${t('saveError')} [${err.code||'SAVE'}]`,'error');setServiceState('offline',err.code);}
    finally{if(!unlocked){state.busy=false;setComposerBusy(false);if(submitButton)submitButton.classList.remove('is-saving');}}
  }

  async function deleteReview(){
    if(!state.ownReview||state.busy)return;
    if(!confirm(t('confirmDelete')))return;
    const previous={...state.ownReview};
    state.busy=true;setComposerBusy(true);
    try{
      await rpcPost('delete_my_review_v4',{});
      const s=state.lastStats||{}, total=Math.max(0,Number(s.total_ratings||0)-1);
      const oldRating=Number(previous.rating), oldAvg=Number(s.average_rating||0), oldPositive=Number(s.positive_ratings||0);
      const sum=Math.max(0,oldAvg*Number(s.total_ratings||0)-oldRating);
      const positive=Math.max(0,oldPositive-(oldRating>=7?1:0));
      updateStatsUI({total_ratings:total,average_rating:total?sum/total:null,positive_ratings:positive,freshness:total<5?null:Math.round(positive*100/total)});
      state.ownReview=null;state.selectedRating=null;
      const ta=$('#reviewText');if(ta)ta.value='';
      updateCounter();updateRatingLabel();updateComposerUI();setStatus(t('deleted'),'success');
      state.busy=false;setComposerBusy(false);
      Promise.allSettled([refreshStats(),loadReviews(state.sort,state.filter)]).catch(()=>{});
    }catch(err){setStatus(`${t('deleteError')} [${err.code||'DELETE'}]`,'error');state.busy=false;setComposerBusy(false);}
  }

  function formatDate(v){if(!v)return'';return new Intl.DateTimeFormat(state.lang==='ru'?'ru-RU':'en-US',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(v));}

  async function loadReviews(sort=state.sort,filter=state.filter){
    if(!$('#reviewsList'))return;
    const seq=++state.feedSeq;state.sort=sort;state.filter=filter;$$('.review-sort-button').forEach(b=>b.classList.toggle('active',b.dataset.sort===sort));$$('.review-filter-button').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
    try{const rows=await rpcGet('get_public_reviews_v3',{p_sort:sort,p_filter:filter,p_limit:40,p_offset:0});if(seq!==state.feedSeq)return;state.reviews=Array.isArray(rows)?rows:[];renderReviews(state.reviews);setServiceState('online');}
    catch(err){if(seq!==state.feedSeq)return;console.error('[P14/feed]',err);setServiceState('offline',err.code);const l=$('#reviewsList');if(l)l.replaceChildren(Object.assign(document.createElement('div'),{className:'reviews-empty',textContent:t('loadError')}));}
  }

  function renderReviews(rows){
    const list=$('#reviewsList');if(!list)return;
    if(!rows.length){list.replaceChildren(Object.assign(document.createElement('div'),{className:'reviews-empty',textContent:t('reviewsEmpty')}));return;}
    const frag=document.createDocumentFragment();rows.forEach(r=>frag.append(renderReviewCard(r)));list.replaceChildren(frag);
    state.openReplies.forEach(id=>{const c=list.querySelector(`[data-review-id="${CSS.escape(id)}"] .review-replies`);if(c)loadReplies(id,c);});
  }

  function renderReviewCard(r){
    const card=document.createElement('article');card.className='review-card';card.dataset.reviewId=r.id;if(state.ownReview?.id===r.id)card.classList.add('is-own');if(r.is_pinned)card.classList.add('is-pinned');
    const top=document.createElement('div');top.className='review-card-top';const identity=document.createElement('div');identity.className='review-identity';const av=document.createElement('div');av.className='review-avatar';av.innerHTML=avatarSvg(r.avatar_seed,r.avatar_style,54);const txt=document.createElement('div');const name=document.createElement('strong');name.textContent=renderAlias(r,state.lang);txt.append(name);
    if(r.is_official){const badge=document.createElement('em');badge.className='official-badge';badge.textContent=t('official');txt.append(badge);}if(state.ownReview?.id===r.id){const own=document.createElement('em');own.className='own-badge';own.textContent=t('yourBadge');txt.append(own);}const date=document.createElement('span');date.textContent=formatDate(r.created_at);txt.append(date);identity.append(av,txt);
    const score=document.createElement('div');score.className=`review-score${Number(r.rating)>=7?' positive':''}`;score.innerHTML=`<strong>${Number(r.rating)}</strong><span>/10</span>`;top.append(identity,score);
    const body=document.createElement('p');body.className='review-card-text';body.textContent=r.review_text?.trim()||t('noText');if(!r.review_text?.trim())body.classList.add('muted-text');card.append(top,body);
    if(new Date(r.updated_at)-new Date(r.created_at)>5000){const e=document.createElement('small');e.className='review-edited';e.textContent=t('edited');card.append(e);}
    const actions=document.createElement('div');actions.className='review-actions';const like=document.createElement('button');like.type='button';like.className=`review-action-button${state.ownLikes.has(r.id)?' is-active':''}`;like.innerHTML=`♡ <span>${Number(r.like_count||0)}</span> · ${t('useful')}`;like.addEventListener('click',()=>toggleLike(r.id,like));
    const replies=document.createElement('button');replies.type='button';replies.className='review-action-button';replies.textContent=`${t('replies')} · ${Number(r.reply_count||0)}`;const panel=document.createElement('div');panel.className='review-replies';panel.hidden=true;replies.addEventListener('click',()=>{panel.hidden=!panel.hidden;if(!panel.hidden){state.openReplies.add(r.id);loadReplies(r.id,panel);}else state.openReplies.delete(r.id);});actions.append(like,replies);card.append(actions,panel);return card;
  }

  const interactionBusy=new Set();
  async function toggleLike(reviewId,button){if(interactionBusy.has(`like:${reviewId}`))return;interactionBusy.add(`like:${reviewId}`);button.disabled=true;try{await ensureIdentityProfile();const data=await rpcPost('toggle_review_like_v1',{p_review_id:reviewId});data.liked?state.ownLikes.add(reviewId):state.ownLikes.delete(reviewId);const r=state.reviews.find(x=>x.id===reviewId);if(r)r.like_count=Number(data.like_count||0);renderReviews(state.reviews);}catch(err){console.error('[P14/like]',err);}finally{interactionBusy.delete(`like:${reviewId}`);button.disabled=false;}}

  async function loadReplies(reviewId,panel){
    if(interactionBusy.has(`replies:${reviewId}`))return;interactionBusy.add(`replies:${reviewId}`);panel.hidden=false;panel.textContent=t('serviceChecking');
    try{const rows=await rpcGet('get_public_replies_v1',{p_review_id:reviewId});renderReplies(reviewId,Array.isArray(rows)?rows:[],panel);}catch(err){panel.textContent=t('loadError');}finally{interactionBusy.delete(`replies:${reviewId}`);}
  }
  function renderReplies(reviewId,rows,panel){
    panel.replaceChildren();if(!rows.length){const empty=document.createElement('div');empty.className='reviews-empty';empty.textContent=t('replyEmpty');panel.append(empty);}rows.forEach(r=>{const d=document.createElement('div');d.className='review-reply';const h=document.createElement('div');h.className='reply-head';const n=document.createElement('strong');n.textContent=renderAlias(r,state.lang);h.append(n);if(r.is_official){const b=document.createElement('em');b.className='official-badge';b.textContent=t('official');h.append(b);}const time=document.createElement('time');time.textContent=formatDate(r.created_at);h.append(time);const p=document.createElement('p');p.textContent=r.reply_text;d.append(h,p);const own=state.ownReplies.get(reviewId);if(own?.id===r.id){const del=document.createElement('button');del.type='button';del.className='review-action-button';del.textContent=t('replyDelete');del.addEventListener('click',()=>deleteReply(reviewId,r.id,panel));d.append(del);}panel.append(d);});
    const composer=document.createElement('div');composer.className='reply-composer';const ta=document.createElement('textarea');ta.maxLength=1200;ta.placeholder=t('replyPlaceholder');const own=state.ownReplies.get(reviewId);if(own)ta.value=own.reply_text||'';const b=document.createElement('button');b.type='button';b.className='review-action-button';b.textContent=t('replySave');b.addEventListener('click',()=>saveReply(reviewId,ta,b,panel));composer.append(ta,b);panel.append(composer);
  }
  async function saveReply(reviewId,ta,button,panel){const text=ta.value.trim();if(!text)return;if(interactionBusy.has(`replywrite:${reviewId}`))return;interactionBusy.add(`replywrite:${reviewId}`);button.disabled=true;try{await ensureIdentityProfile();const data=await rpcPost('save_review_reply_v1',{p_review_id:reviewId,p_text:text});state.ownReplies.set(reviewId,data);const r=state.reviews.find(x=>x.id===reviewId);if(r)r.reply_count=Math.max(Number(r.reply_count||0),1);await loadReplies(reviewId,panel);}catch(err){console.error('[P14/reply]',err);button.textContent=t('replyError');}finally{interactionBusy.delete(`replywrite:${reviewId}`);button.disabled=false;}}
  async function deleteReply(reviewId,replyId,panel){if(interactionBusy.has(`replydel:${reviewId}`))return;interactionBusy.add(`replydel:${reviewId}`);try{await rpcPost('delete_review_reply_v1',{p_reply_id:replyId});state.ownReplies.delete(reviewId);const r=state.reviews.find(x=>x.id===reviewId);if(r)r.reply_count=Math.max(0,Number(r.reply_count||0)-1);await loadReplies(reviewId,panel);}finally{interactionBusy.delete(`replydel:${reviewId}`);}}

  function bindEvents(){
    $('#langToggle')?.addEventListener('click',()=>setLanguage(state.lang==='ru'?'en':'ru'));
    $('#rerollName')?.addEventListener('click',rerollName);$('#rerollAvatar')?.addEventListener('click',rerollAvatar);$('#submitReview')?.addEventListener('click',submitReview);$('#deleteReview')?.addEventListener('click',deleteReview);$('#reviewText')?.addEventListener('input',updateCounter);
    $$('.rating-button').forEach(b=>b.addEventListener('click',()=>selectRating(b.dataset.rating)));$$('.review-sort-button').forEach(b=>b.addEventListener('click',()=>loadReviews(b.dataset.sort,state.filter)));$$('.review-filter-button').forEach(b=>b.addEventListener('click',()=>loadReviews(state.sort,b.dataset.filter)));
    $('#securityToggle')?.addEventListener('click',()=>{const p=$('#securityPanel'),b=$('#securityToggle');if(!p||!b)return;const open=p.hidden;p.hidden=!open;b.setAttribute('aria-expanded',String(open));});
  }

  async function boot(){
    state.pendingProfile=generateAliasProfile();bindEvents();applyTranslations();renderProfile();updateCounter();updateComposerUI();setServiceState('checking');
    await Promise.allSettled([refreshStats(),loadReviews(state.sort)]);
    try{await restoreOwnState();if($('#reviewsList'))await loadReviews(state.sort);setServiceState('online');}catch(err){console.warn('[P14/session restore]',err.code||err.message);}
  }

  addEventListener('storage',e=>{if(e.key===SESSION_KEY){state.session=null;loadSession();}});
  addEventListener('online',()=>{refreshStats();if($('#reviewsList'))loadReviews(state.sort);});addEventListener('offline',()=>setServiceState('offline','BROWSER_OFFLINE'));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
