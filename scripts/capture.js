const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const routes = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'team', path: '/team' },
  { name: 'gallery', path: '/gallery' },
  { name: 'sponsors', path: '/sponsors' },
  { name: 'contact', path: '/contact' }
];

const desktopViewports = [
  { width: 1440, height: 900, dir: 'qa/desktop-before', suffix: '1440' },
  { width: 1920, height: 1080, dir: 'qa/desktop-before', suffix: '1920' }
];

const mobileViewports = [
  { width: 390, height: 844, dir: 'qa/mobile-before', suffix: '390' },
  { width: 360, height: 800, dir: 'qa/mobile-before', suffix: '360' }
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const allViewports = [...desktopViewports, ...mobileViewports];

  for (const vp of allViewports) {
    const outDir = path.join(__dirname, '..', vp.dir);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
  }

  for (const vp of allViewports) {
    console.log(`\nCapturing viewport ${vp.width}x${vp.height} (${vp.dir})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });

    // Mark intro played in sessionStorage
    await context.addInitScript(() => {
      try {
        sessionStorage.setItem('trbIntroPlayed', 'true');
      } catch (e) {}
    });

    const page = await context.newPage();

    for (const r of routes) {
      const url = `http://localhost:3001${r.path}`;
      process.stdout.write(`  Capturing ${r.name} (${url})... `);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        // Wait for loader to disappear and animations
        await page.waitForTimeout(2200);

        // Slowly scroll down to trigger any IntersectionObservers / Framer Motion
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                window.scrollTo(0, 0);
                setTimeout(resolve, 300);
              }
            }, 50);
          });
        });

        await page.waitForTimeout(1000);

        const filename = `${r.name}-${vp.suffix}.png`;
        const filepath = path.join(__dirname, '..', vp.dir, filename);
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`Saved ${filename}`);
      } catch (err) {
        console.error(`FAILED: ${err.message}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('\nBaseline capture completed successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});

