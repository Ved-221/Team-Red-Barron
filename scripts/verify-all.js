const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { diffImages } = require('./diff');

const routes = ['home', 'about', 'team', 'gallery', 'sponsors', 'contact'];
const routePaths = {
  home: '/',
  about: '/about',
  team: '/team',
  gallery: '/gallery',
  sponsors: '/sponsors',
  contact: '/contact'
};

const desktopViewports = ['1440', '1920'];
const mobileViewports = [360, 390, 430, 768];

async function verify() {
  console.log('============================================');
  console.log('PART 1: DESKTOP PIXEL REGRESSION DIFF');
  console.log('============================================');

  let totalDiffPixels = 0;
  const diffResults = [];

  const diffDir = path.join(__dirname, '..', 'qa', 'desktop-diff');
  if (!fs.existsSync(diffDir)) {
    fs.mkdirSync(diffDir, { recursive: true });
  }

  for (const vp of desktopViewports) {
    for (const r of routes) {
      const fileBefore = path.join(__dirname, '..', 'qa', 'desktop-before', `${r}-${vp}.png`);
      const fileAfter = path.join(__dirname, '..', 'qa', 'desktop-after', `${r}-${vp}.png`);
      const fileDiff = path.join(diffDir, `diff-${r}-${vp}.png`);

      if (!fs.existsSync(fileBefore) || !fs.existsSync(fileAfter)) {
        console.log(`[SKIP] Missing file for ${r}-${vp}`);
        continue;
      }

      const res = diffImages(fileBefore, fileAfter, fileDiff);
      diffResults.push({ route: r, viewport: vp, ...res });
      if (res.diffPixels > 0) {
        totalDiffPixels += res.diffPixels;
      }

      console.log(`[${vp}px] ${r.padEnd(10)}: match=${res.match ? 'YES' : 'NO'} | diffPixels=${res.diffPixels} | diff%=${res.diffPercentage || 0}%`);
    }
  }

  console.log('\n============================================');
  console.log('PART 2: MOBILE HORIZONTAL OVERFLOW CHECK');
  console.log('============================================');

  const browser = await chromium.launch({ headless: true });
  const overflowIssues = [];

  for (const w of mobileViewports) {
    console.log(`\n--- Viewport ${w}px ---`);
    const context = await browser.newContext({
      viewport: { width: w, height: 800 },
      deviceScaleFactor: 1
    });

    await context.addInitScript(() => {
      try { sessionStorage.setItem('trbIntroPlayed', 'true'); } catch (e) {}
    });

    const page = await context.newPage();

    for (const r of routes) {
      const port = process.env.PORT || 3000;
      const url = `http://localhost:${port}${routePaths[r]}`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      const check = await page.evaluate((vw) => {
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        const hasOverflow = scrollWidth > clientWidth;

        return {
          scrollWidth,
          clientWidth,
          hasOverflow
        };
      }, w);

      const status = check.hasOverflow ? 'OVERFLOW DETECTED' : 'CLEAN (No overflow)';
      console.log(`  ${r.padEnd(10)} [${w}px]: scrollWidth=${check.scrollWidth}, clientWidth=${check.clientWidth} -> ${status}`);

      if (check.hasOverflow) {
        overflowIssues.push({ route: r, width: w, ...check });
      }
    }

    await context.close();
  }

  await browser.close();

  console.log('\n============================================');
  console.log('FINAL SUMMARY');
  console.log('============================================');
  console.log(`Total Desktop Diff Pixels: ${totalDiffPixels}`);
  console.log(`Total Mobile Overflow Issues: ${overflowIssues.length}`);

  return { totalDiffPixels, overflowIssues, diffResults };
}

verify().catch(console.error);

