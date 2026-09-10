const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targets = [
  ['390x844', 390, 844],
  ['844x390', 844, 390],
  ['430x932', 430, 932],
  ['932x430', 932, 430],
  ['768x1024', 768, 1024],
  ['1024x768', 1024, 768],
  ['1366x768', 1366, 768],
  ['1080x1920', 1080, 1920]
];

const report = { generated_at: new Date().toISOString(), checks: [], failures: [], screenshots: [] };
const add = (name, ok, detail = '') => {
  report.checks.push({ name, ok, detail });
  if (!ok) report.failures.push({ name, detail });
};

async function shot(page, name) {
  const file = path.join('r7-qa', 'screenshots', `${name}.png`);
  await page.screenshot({ path: file, fullPage: false, animations: 'disabled' });
  report.screenshots.push(file);
}

function touchContext(width, height) {
  return width <= 960 && height <= 1024;
}

function expectedSequential(width, height) {
  const touch = touchContext(width, height);
  return (width <= 820 && touch) || (touch && width > height && width <= 960 && height <= 560);
}

(async () => {
  fs.mkdirSync(path.join('r7-qa', 'screenshots'), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [label, width, height] of targets) {
      const touch = touchContext(width, height);
      const context = await browser.newContext({ viewport: { width, height }, isMobile: touch, hasTouch: touch });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', err => errors.push(String(err)));
      await page.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(550);

      const state = await page.evaluate(() => ({
        css: [...document.styleSheets].some(s => String(s.href || '').includes('responsive-r7.css')),
        landscapeCss: [...document.styleSheets].some(s => String(s.href || '').includes('responsive-r7-landscape.css')),
        js: !!document.querySelector('script[src*="responsive-r7.js"]'),
        overflow: document.documentElement.scrollWidth - innerWidth,
        sequential: document.body.classList.contains('r7-sequential-ui'),
        landscape: document.body.classList.contains('r7-phone-landscape')
      }));

      add(`index ${label} R7 assets`, state.css && state.landscapeCss && state.js, JSON.stringify(state));
      add(`index ${label} horizontal overflow`, state.overflow <= 2, `overflow=${state.overflow}`);
      add(`index ${label} page errors`, errors.length === 0, errors.join(' | '));
      add(`index ${label} sequential context`, state.sequential === expectedSequential(width, height), JSON.stringify(state));

      if (label === '390x844' || label === '844x390') {
        await shot(page, `index-${label}-hero`);

        const actor = page.locator('#cast .cast-list-item').first();
        await actor.scrollIntoViewIfNeeded();
        await actor.click();
        await page.waitForTimeout(260);
        const actorState = await page.evaluate(() => ({
          open: document.querySelector('#cast')?.classList.contains('r7-dossier-open'),
          listDisplay: getComputedStyle(document.querySelector('#cast .cast-list')).display,
          dossierDisplay: getComputedStyle(document.querySelector('#subjectDossier')).display,
          back: !!document.querySelector('#cast .r7-subject-back')
        }));
        add(`actors ${label} sequential open`, actorState.open && actorState.listDisplay === 'none' && actorState.dossierDisplay !== 'none' && actorState.back, JSON.stringify(actorState));
        await shot(page, `index-${label}-actors-dossier`);
        await page.locator('#cast .r7-subject-back').click();
        await page.waitForTimeout(150);

        const query = page.locator('#faq .faq-query-item').nth(2);
        await query.scrollIntoViewIfNeeded();
        await query.click();
        await page.waitForTimeout(260);
        const faqState = await page.evaluate(() => ({
          open: document.querySelector('#faq')?.classList.contains('r7-response-open'),
          listDisplay: getComputedStyle(document.querySelector('#faq .faq-query-list')).display,
          panelDisplay: getComputedStyle(document.querySelector('#faqResponsePanel')).display,
          back: !!document.querySelector('#faq .r7-query-back'),
          code: document.querySelector('#faqResponseCode')?.textContent || ''
        }));
        add(`faq ${label} sequential open`, faqState.open && faqState.listDisplay === 'none' && faqState.panelDisplay !== 'none' && faqState.back && /QUERY_03/.test(faqState.code), JSON.stringify(faqState));
        await shot(page, `index-${label}-faq-response`);
      }

      await context.close();
    }

    for (const [label, width, height] of targets) {
      const touch = touchContext(width, height);
      const compact = width <= 820 || (touch && width > height && width <= 960 && height <= 560);
      const context = await browser.newContext({ viewport: { width, height }, isMobile: touch, hasTouch: touch });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', err => errors.push(String(err)));
      await page.goto('http://127.0.0.1:4173/reviews.html', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(950);

      const state = await page.evaluate(() => {
        const rating = document.querySelector('.rating-scale');
        const sort = document.querySelector('.review-sort');
        const layout = document.querySelector('.community-layout');
        const textarea = document.querySelector('#reviewText');
        const columns = el => el ? getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length : 0;
        return {
          css: [...document.styleSheets].some(s => String(s.href || '').includes('responsive-r7.css')),
          landscapeCss: [...document.styleSheets].some(s => String(s.href || '').includes('responsive-r7-landscape.css')),
          js: !!document.querySelector('script[src*="responsive-r7.js"]'),
          overflow: document.documentElement.scrollWidth - innerWidth,
          layoutColumns: columns(layout),
          ratingColumns: columns(rating),
          sortColumns: columns(sort),
          textareaSize: textarea ? getComputedStyle(textarea).fontSize : null,
          landscape: document.body.classList.contains('r7-phone-landscape')
        };
      });

      add(`reviews ${label} R7 assets`, state.css && state.landscapeCss && state.js, JSON.stringify(state));
      add(`reviews ${label} horizontal overflow`, state.overflow <= 2, `overflow=${state.overflow}`);
      add(`reviews ${label} page errors`, errors.length === 0, errors.join(' | '));
      if (compact) {
        add(`reviews ${label} single-column workspace`, state.layoutColumns === 1, JSON.stringify(state));
        add(`reviews ${label} six-column rating`, state.ratingColumns === 6, JSON.stringify(state));
        add(`reviews ${label} three-column sort`, state.sortColumns === 3, JSON.stringify(state));
        add(`reviews ${label} textarea 16px`, state.textareaSize === '16px', JSON.stringify(state));
      }

      if (label === '390x844' || label === '844x390') {
        await shot(page, `reviews-${label}-top`);
        await page.locator('#reviewWorkspace').scrollIntoViewIfNeeded();
        await page.waitForTimeout(180);
        await shot(page, `reviews-${label}-workspace`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync('r7-qa/report.json', JSON.stringify(report, null, 2));
  const markdown = [
    '# REVIVAL R7 — browser QA',
    '',
    `Generated: ${report.generated_at}`,
    '',
    `Checks: ${report.checks.length}`,
    `Failures: ${report.failures.length}`,
    '',
    '## Failures',
    ...(report.failures.length ? report.failures.map(x => `- ${x.name}: ${x.detail}`) : ['- none']),
    '',
    '## Checks',
    ...report.checks.map(x => `- ${x.ok ? 'PASS' : 'FAIL'} — ${x.name}${x.detail ? ` — ${x.detail}` : ''}`),
    '',
    '## Screenshots',
    ...report.screenshots.map(x => `- ${x}`),
    ''
  ].join('\n');
  fs.writeFileSync('r7-qa/REPORT.md', markdown);
  if (report.failures.length) process.exitCode = 2;
})().catch(err => {
  fs.mkdirSync('r7-qa', { recursive: true });
  fs.writeFileSync('r7-qa/HARNESS-ERROR.txt', String(err?.stack || err));
  console.error(err);
  process.exit(3);
});
