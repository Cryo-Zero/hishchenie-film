(() => {
  'use strict';

  const video = document.getElementById('trailerVideo');
  const shell = document.getElementById('videoShell');
  if (!video || !shell || shell.querySelector('.r7-player-controls')) return;

  const controls = document.createElement('div');
  controls.className = 'r7-player-controls';
  controls.setAttribute('aria-label', 'Trailer controls');
  controls.innerHTML = `
    <div class="r7-player-progress-row">
      <input class="r7-player-range r7-player-progress" type="range" min="0" max="100" step="0.1" value="0" aria-label="Позиция воспроизведения">
    </div>
    <div class="r7-player-row">
      <div class="r7-player-left">
        <button class="r7-player-button r7-player-play" type="button" aria-label="Воспроизвести"><span class="r7-player-glyph r7-play-glyph" aria-hidden="true"></span></button>
        <span class="r7-player-time" aria-live="off">0:00 / 0:00</span>
        <button class="r7-player-button r7-player-mute" type="button" aria-label="Выключить звук"><span class="r7-player-glyph r7-volume-glyph" aria-hidden="true"></span></button>
        <input class="r7-player-range r7-player-volume" type="range" min="0" max="1" step="0.01" value="0.30" aria-label="Громкость">
      </div>
      <div class="r7-player-right">
        <button class="r7-player-button r7-player-pip" type="button" aria-label="Картинка в картинке"><span class="r7-player-glyph r7-pip-glyph" aria-hidden="true"></span></button>
        <button class="r7-player-button r7-player-fullscreen" type="button" aria-label="Полноэкранный режим"><span class="r7-player-glyph r7-fullscreen-glyph" aria-hidden="true"></span></button>
      </div>
    </div>`;
  video.insertAdjacentElement('afterend', controls);

  const play = controls.querySelector('.r7-player-play');
  const time = controls.querySelector('.r7-player-time');
  const mute = controls.querySelector('.r7-player-mute');
  const volume = controls.querySelector('.r7-player-volume');
  const progress = controls.querySelector('.r7-player-progress');
  const pip = controls.querySelector('.r7-player-pip');
  const fullscreen = controls.querySelector('.r7-player-fullscreen');
  const desktopQuery = matchMedia('(min-width: 821px) and (min-height: 561px), (min-width: 961px)');

  const fmt = seconds => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    const m = Math.floor(seconds / 60);
    return `${m}:${s}`;
  };

  const pipSupported = () => Boolean(
    (document.pictureInPictureEnabled && typeof video.requestPictureInPicture === 'function') ||
    (typeof video.webkitSupportsPresentationMode === 'function' && video.webkitSupportsPresentationMode('picture-in-picture') && typeof video.webkitSetPresentationMode === 'function')
  );
  const fullscreenSupported = () => Boolean(
    shell.requestFullscreen || shell.webkitRequestFullscreen || video.webkitEnterFullscreen
  );

  const syncPlay = () => {
    const playing = !video.paused && !video.ended;
    play.classList.toggle('is-playing', playing);
    play.setAttribute('aria-label', playing ? 'Пауза' : 'Воспроизвести');
    play.setAttribute('aria-pressed', String(playing));
  };
  const syncTime = () => {
    time.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
    progress.value = Number.isFinite(video.duration) && video.duration > 0 ? String(video.currentTime / video.duration * 100) : '0';
  };
  const syncVolume = () => {
    volume.value = String(video.volume);
    const muted = video.muted || video.volume === 0;
    mute.classList.toggle('is-muted', muted);
    mute.setAttribute('aria-label', muted ? 'Включить звук' : 'Выключить звук');
    mute.setAttribute('aria-pressed', String(muted));
  };
  const syncCapabilities = () => {
    pip.hidden = !pipSupported();
    fullscreen.hidden = !fullscreenSupported();
  };
  const syncMode = () => {
    const custom = desktopQuery.matches;
    shell.classList.toggle('r7-custom-player-ready', custom);
    controls.hidden = !custom;
    video.controls = !custom;
    if (custom) video.setAttribute('tabindex', '0');
    else video.removeAttribute('tabindex');
    syncCapabilities();
  };

  const togglePlay = async () => {
    try {
      if (video.paused || video.ended) await video.play();
      else video.pause();
    } catch (_) {}
    syncPlay();
  };
  const toggleMute = () => { video.muted = !video.muted; syncVolume(); };
  const enterFullscreen = async () => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) await exit.call(document);
        return;
      }
      if (shell.requestFullscreen) await shell.requestFullscreen();
      else if (shell.webkitRequestFullscreen) await shell.webkitRequestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    } catch (_) {}
  };
  const togglePip = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled && video.requestPictureInPicture) {
        await video.requestPictureInPicture();
      } else if (video.webkitSetPresentationMode && video.webkitSupportsPresentationMode?.('picture-in-picture')) {
        video.webkitSetPresentationMode(video.webkitPresentationMode === 'picture-in-picture' ? 'inline' : 'picture-in-picture');
      }
    } catch (_) {}
  };

  play.addEventListener('click', togglePlay);
  mute.addEventListener('click', toggleMute);
  volume.addEventListener('input', () => {
    video.volume = Math.max(0, Math.min(1, Number(volume.value)));
    if (video.volume > 0) video.muted = false;
    syncVolume();
  });
  progress.addEventListener('input', () => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    video.currentTime = video.duration * Number(progress.value) / 100;
    syncTime();
  });
  pip.addEventListener('click', togglePip);
  fullscreen.addEventListener('click', enterFullscreen);
  video.addEventListener('click', () => { if (desktopQuery.matches) togglePlay(); });
  video.addEventListener('keydown', event => {
    if (!desktopQuery.matches) return;
    if (event.key === ' ' || event.key.toLowerCase() === 'k') { event.preventDefault(); togglePlay(); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); video.currentTime = Math.max(0, video.currentTime - 5); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); video.currentTime = Math.min(Number.isFinite(video.duration) ? video.duration : video.currentTime + 5, video.currentTime + 5); }
    else if (event.key.toLowerCase() === 'm') { event.preventDefault(); toggleMute(); }
    else if (event.key.toLowerCase() === 'f' && !fullscreen.hidden) { event.preventDefault(); enterFullscreen(); }
    syncTime();
  });

  ['loadedmetadata','durationchange','timeupdate','seeked'].forEach(name => video.addEventListener(name, syncTime));
  ['play','pause','ended'].forEach(name => video.addEventListener(name, syncPlay));
  ['volumechange'].forEach(name => video.addEventListener(name, syncVolume));
  document.addEventListener('enterpictureinpicture', syncCapabilities);
  document.addEventListener('leavepictureinpicture', syncCapabilities);
  document.addEventListener('fullscreenchange', syncCapabilities);
  desktopQuery.addEventListener?.('change', syncMode);
  addEventListener('resize', syncMode, { passive: true });

  syncMode();
  syncPlay();
  syncTime();
  syncVolume();
})();

/* Owner-correction follow-up: capture sequential viewport before legacy bubble handlers mutate geometry. */
(() => {
  'use strict';
  const selector = '#cast .cast-list-item, #cast .r7-subject-back, #cast #dossierPrompt.r7-subject-return, #faq .faq-query-item, #faq .r7-query-back';
  const scheduleRestore = (x, y) => {
    const restore = () => {
      if (Math.abs(scrollX - x) > .5 || Math.abs(scrollY - y) > .5) scrollTo({ left: x, top: y, behavior: 'auto' });
    };
    requestAnimationFrame(() => requestAnimationFrame(restore));
    setTimeout(restore, 60);
    setTimeout(restore, 180);
  };
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest(selector)) return;
    const x = scrollX;
    const y = scrollY;
    scheduleRestore(x, y);
  }, true);
})();
