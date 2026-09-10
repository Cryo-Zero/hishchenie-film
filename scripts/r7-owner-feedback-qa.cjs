const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const base = 'http://127.0.0.1:4173';
const outDir = path.join(process.cwd(), 'r7-owner-qa');
const shotDir = path.join(outDir, 'screenshots');
fs.mkdirSync(shotDir, { recursive: true });

const report = { generated_at: new Date().toISOString(), checks: [], failures: [], screenshots: [] };
const add = (name, ok, detail = '') => {
  report.checks.push({ name, ok, detail });
  if (!ok) report.failures.push({ name, detail });
};
const shot = async (page, name) => {
  const file = path.join(shotDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false, animations: 'disabled' });
  report.screenshots.push(file.replace(process.cwd() + '/', ''));
};

async function contextFor(browser, width, height) {
  return browser.newContext({
    viewport: { width, height },
    isMobile: width <= 960 && height <= 1024,
    hasTouch: width <= 960
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    // Phone portrait: hero, menu, rating, archive, FAQ.
    {
      const context = await contextFor(browser, 390, 844);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${base}/index.html`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(700);

      const hero = await page.evaluate(() => {
        const poster = document.querySelector('.hero-poster-frame');
        const title = document.querySelector('.hero-copy-column h1');
        const actions = document.querySelector('.r7-mobile-hero-actions');
        const original = document.querySelector('.hero-copy-column > .hero-actions');
        return {
          posterTop: poster?.getBoundingClientRect().top,
          posterBottom: poster?.getBoundingClientRect().bottom,
          titleTop: title?.getBoundingClientRect().top,
          actionsTop: actions?.getBoundingClientRect().top,
          actionsDisplay: actions ? getComputedStyle(actions).display : null,
          originalDisplay: original ? getComputedStyle(original).display : null,
          overflow: document.documentElement.scrollWidth - innerWidth
        };
      });
      add('390 hero poster precedes title', hero.posterTop < hero.titleTop, JSON.stringify(hero));
      add('390 mobile actions directly follow poster', hero.actionsDisplay !== 'none' && hero.actionsTop >= hero.posterBottom - 30 && hero.actionsTop < hero.titleTop, JSON.stringify(hero));
      add('390 desktop hero actions hidden', hero.originalDisplay === 'none', JSON.stringify(hero));
      add('390 no horizontal overflow', hero.overflow <= 2, `overflow=${hero.overflow}`);
      await shot(page, '390-hero-owner-feedback');

      await page.locator('#menuToggle').click();
      const nav = await page.evaluate(() => {
        const links = [...document.querySelectorAll('#primaryNav a')];
        const home = document.querySelector('#primaryNav .r7-nav-home');
        const report = document.querySelector('#primaryNav .r7-nav-report');
        const faq = links.find(x => (x.getAttribute('href') || '').includes('#faq'));
        const rating = document.querySelector('.header-rating');
        const copy = document.querySelector('.header-rating-copy');
        const ring = document.querySelector('.header-rating-ring');
        return {
          homeVisible: home && getComputedStyle(home).display !== 'none',
          reportVisible: report && getComputedStyle(report).display !== 'none',
          reportAfterFaq: !!(faq && report && faq.nextElementSibling === report),
          footerReportHidden: getComputedStyle(document.querySelector('.footer-report')).display === 'none',
          ratingWidth: rating?.getBoundingClientRect().width,
          copyVisible: copy && getComputedStyle(copy).position === 'static' && copy.getBoundingClientRect().width > 1,
          copyLeftOfRing: copy && ring && copy.getBoundingClientRect().left < ring.getBoundingClientRect().left
        };
      });
      add('390 burger repeats home', nav.homeVisible, JSON.stringify(nav));
      add('390 report is after FAQ in burger', nav.reportVisible && nav.reportAfterFaq, JSON.stringify(nav));
      add('390 footer report moved away', nav.footerReportHidden, JSON.stringify(nav));
      add('390 numeric rating visible left of ring', nav.copyVisible && nav.copyLeftOfRing && nav.ratingWidth >= 70, JSON.stringify(nav));
      await shot(page, '390-header-menu-rating');
      await page.locator('#menuToggle').click();

      await page.locator('#materials').scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      const materials = await page.evaluate(() => {
        const shell = document.querySelector('#materials .archive-drawer-shell');
        const stage = document.querySelector('#archiveStage');
        const image = document.querySelector('#archiveMainImage');
        return {
          active: shell?.classList.contains('r7-materials-active'),
          shellVisible: shell && getComputedStyle(shell).visibility !== 'hidden',
          stageWidth: stage?.getBoundingClientRect().width,
          imageWidth: image?.getBoundingClientRect().width,
          stageHeight: stage?.getBoundingClientRect().height,
          natural: image ? [image.naturalWidth, image.naturalHeight] : null,
          aspect: stage ? getComputedStyle(stage).aspectRatio : null
        };
      });
      add('390 archive handle visible in Materials', materials.active && materials.shellVisible, JSON.stringify(materials));
      add('390 archive image uses mobile width', materials.stageWidth >= 330 && materials.imageWidth >= 330, JSON.stringify(materials));
      add('390 archive stage follows asset aspect', !!materials.aspect && materials.aspect !== 'auto', JSON.stringify(materials));
      await shot(page, '390-materials-owner-feedback');

      await page.locator('#trailer').scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      const archiveAway = await page.evaluate(() => {
        const shell = document.querySelector('#materials .archive-drawer-shell');
        return {
          active: shell?.classList.contains('r7-materials-active'),
          visibility: shell ? getComputedStyle(shell).visibility : null,
          opacity: shell ? getComputedStyle(shell).opacity : null
        };
      });
      add('390 archive handle hidden outside Materials', !archiveAway.active && archiveAway.visibility === 'hidden', JSON.stringify(archiveAway));

      await page.locator('#faq .faq-query-item').last().scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      const before = await page.evaluate(() => scrollY);
      await page.locator('#faq .faq-query-item').last().click();
      await page.waitForTimeout(70);
      const early = await page.evaluate(() => scrollY);
      await page.waitForTimeout(280);
      const middle = await page.evaluate(() => scrollY);
      await page.waitForTimeout(500);
      const final = await page.evaluate(() => scrollY);
      const faqMotion = await page.evaluate(() => {
        const log = document.querySelector('#faq .faq-response-log');
        const content = document.querySelector('#faq .faq-response-content p');
        return {
          open: document.querySelector('#faq')?.classList.contains('r7-response-open'),
          logDelay: log ? getComputedStyle(log).transitionDelay : null,
          contentDuration: content ? getComputedStyle(content).transitionDuration : null
        };
      });
      const total = Math.abs(final - before);
      const earlyPart = Math.abs(early - before);
      add('390 FAQ uses progressive smooth reposition', faqMotion.open && total > 20 && earlyPart < total * .75 && Math.abs(middle - before) < total + 40, JSON.stringify({ before, early, middle, final, faqMotion }));
      add('390 FAQ reveal slowed', /0\.42s|0\.56s/.test(faqMotion.contentDuration || '') && /0\.67s/.test(faqMotion.logDelay || ''), JSON.stringify(faqMotion));
      await shot(page, '390-faq-owner-feedback');

      add('390 page JS errors', errors.length === 0, errors.join(' | '));
      await context.close();
    }

    // Phone landscape: ensure poster/actions and archive remain mobile-aware.
    {
      const context = await contextFor(browser, 844, 390);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${base}/index.html`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(650);
      const state = await page.evaluate(() => {
        const poster = document.querySelector('.hero-poster-frame');
        const actions = document.querySelector('.r7-mobile-hero-actions');
        return {
          phoneLandscape: document.body.classList.contains('r7-phone-landscape'),
          posterVisible: poster && poster.getBoundingClientRect().width > 150,
          actionsVisible: actions && getComputedStyle(actions).display !== 'none',
          overflow: document.documentElement.scrollWidth - innerWidth
        };
      });
      add('844 landscape keeps dedicated phone mode', state.phoneLandscape, JSON.stringify(state));
      add('844 landscape poster and actions visible', state.posterVisible && state.actionsVisible, JSON.stringify(state));
      add('844 landscape no horizontal overflow', state.overflow <= 2, `overflow=${state.overflow}`);
      await shot(page, '844-hero-owner-feedback');
      add('844 page JS errors', errors.length === 0, errors.join(' | '));
      await context.close();
    }

    // Reviews portrait: sticky/fixed header, rating copy, larger text.
    {
      const context = await contextFor(browser, 390, 844);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${base}/reviews.html`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1200);
      await page.locator('#reviewsList').scrollIntoViewIfNeeded();
      await page.evaluate(() => scrollBy(0, 500));
      await page.waitForTimeout(120);
      const reviews = await page.evaluate(() => {
        const header = document.querySelector('.site-header');
        const card = document.querySelector('.review-card');
        const cardText = card?.querySelector('.review-card-text');
        const meta = card?.querySelector('.review-identity span');
        const sort = document.querySelector('.review-sort-button');
        const ratingCopy = document.querySelector('.header-rating-copy');
        return {
          headerTop: header?.getBoundingClientRect().top,
          headerPosition: header ? getComputedStyle(header).position : null,
          cardTextSize: cardText ? parseFloat(getComputedStyle(cardText).fontSize) : null,
          metaSize: meta ? parseFloat(getComputedStyle(meta).fontSize) : null,
          sortSize: sort ? parseFloat(getComputedStyle(sort).fontSize) : null,
          ratingCopyVisible: ratingCopy && ratingCopy.getBoundingClientRect().width > 1,
          overflow: document.documentElement.scrollWidth - innerWidth
        };
      });
      add('reviews 390 header remains fixed while feed scrolls', reviews.headerPosition === 'fixed' && Math.abs(reviews.headerTop) <= 1, JSON.stringify(reviews));
      add('reviews 390 numeric rating remains visible', reviews.ratingCopyVisible, JSON.stringify(reviews));
      add('reviews 390 enlarged review typography', (reviews.cardTextSize == null || reviews.cardTextSize >= 14) && (reviews.metaSize == null || reviews.metaSize >= 10) && reviews.sortSize >= 10, JSON.stringify(reviews));
      add('reviews 390 no horizontal overflow', reviews.overflow <= 2, `overflow=${reviews.overflow}`);
      await shot(page, '390-reviews-feed-owner-feedback');
      add('reviews 390 page JS errors', errors.length === 0, errors.join(' | '));
      await context.close();
    }

    // Desktop: REPORT after FAQ, HOME not duplicated, Archive local, text floor raised.
    {
      const context = await contextFor(browser, 1366, 768);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${base}/index.html`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(650);
      const desktopNav = await page.evaluate(() => {
        const nav = document.querySelector('#primaryNav');
        const home = nav?.querySelector('.r7-nav-home');
        const report = nav?.querySelector('.r7-nav-report');
        const faq = [...(nav?.querySelectorAll('a') || [])].find(x => (x.getAttribute('href') || '').includes('#faq'));
        return {
          homeDisplay: home ? getComputedStyle(home).display : null,
          reportDisplay: report ? getComputedStyle(report).display : null,
          afterFaq: !!(faq && report && faq.nextElementSibling === report),
          navSize: nav ? parseFloat(getComputedStyle(nav).fontSize) : null,
          sectionLabel: parseFloat(getComputedStyle(document.querySelector('.section-label')).fontSize),
          overflow: document.documentElement.scrollWidth - innerWidth
        };
      });
      add('desktop HOME duplicate hidden', desktopNav.homeDisplay === 'none', JSON.stringify(desktopNav));
      add('desktop REPORT visible after FAQ', desktopNav.reportDisplay !== 'none' && desktopNav.afterFaq, JSON.stringify(desktopNav));
      add('desktop microcopy floor raised', desktopNav.navSize >= 9 && desktopNav.sectionLabel >= 11, JSON.stringify(desktopNav));
      add('desktop no horizontal overflow', desktopNav.overflow <= 2, `overflow=${desktopNav.overflow}`);

      await page.locator('#about').scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const archiveHidden = await page.evaluate(() => {
        const shell = document.querySelector('#materials .archive-drawer-shell');
        return shell ? getComputedStyle(shell).visibility === 'hidden' && !shell.classList.contains('r7-materials-active') : false;
      });
      add('desktop archive hidden outside Materials', archiveHidden, String(archiveHidden));
      await page.locator('#materials').scrollIntoViewIfNeeded();
      await page.waitForTimeout(180);
      const archiveShown = await page.evaluate(() => {
        const shell = document.querySelector('#materials .archive-drawer-shell');
        return shell ? getComputedStyle(shell).visibility !== 'hidden' && shell.classList.contains('r7-materials-active') : false;
      });
      add('desktop archive visible in Materials', archiveShown, String(archiveShown));
      await shot(page, '1366-materials-owner-feedback');
      add('desktop page JS errors', errors.length === 0, errors.join(' | '));
      await context.close();
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
  const lines = [
    '# R7 owner-feedback browser QA', '',
    `Generated: ${report.generated_at}`, '',
    `Checks: ${report.checks.length}`,
    `Failures: ${report.failures.length}`, '',
    '## Failures',
    ...(report.failures.length ? report.failures.map(x => `- ${x.name}: ${x.detail}`) : ['- none']), '',
    '## Checks',
    ...report.checks.map(x => `- ${x.ok ? 'PASS' : 'FAIL'} — ${x.name}${x.detail ? ` — ${x.detail}` : ''}`), '',
    '## Screenshots', ...report.screenshots.map(x => `- ${x}`), ''
  ];
  fs.writeFileSync(path.join(outDir, 'REPORT.md'), lines.join('\n'));
  if (report.failures.length) process.exitCode = 2;
})();