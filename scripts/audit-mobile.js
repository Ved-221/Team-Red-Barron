const { chromium } = require('playwright');

const routes = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Team', path: '/team' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Sponsors', path: '/sponsors' },
  { name: 'Contact', path: '/contact' }
];

async function audit() {
  const browser = await chromium.launch({ headless: true });
  const viewports = [390, 360];

  for (const w of viewports) {
    console.log(`\n=== AUDITING VIEWPORT ${w}px ===`);
    const context = await browser.newContext({
      viewport: { width: w, height: 800 }
    });

    await context.addInitScript(() => {
      try { sessionStorage.setItem('trbIntroPlayed', 'true'); } catch (e) {}
    });

    const page = await context.newPage();

    for (const r of routes) {
      await page.goto(`http://localhost:3001${r.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const overflowData = await page.evaluate((vw) => {
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        const hasHorizontalScroll = scrollWidth > clientWidth;

        // Find elements wider than viewport or overflowing
        const overflowingElements = [];
        const allEls = document.querySelectorAll('*');
        for (const el of allEls) {
          const rect = el.getBoundingClientRect();
          if (rect.width > vw + 1 || rect.right > vw + 1) {
            // Check if it's visible
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
              const tag = el.tagName.toLowerCase();
              const cls = typeof el.className === 'string' ? el.className.slice(0, 80) : '';
              overflowingElements.push({
                tag,
                cls,
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              });
            }
          }
        }

        return {
          hasHorizontalScroll,
          scrollWidth,
          clientWidth,
          overflowCount: overflowingElements.length,
          sample: overflowingElements.slice(0, 5)
        };
      }, w);

      console.log(`[${r.name}] scrollWidth: ${overflowData.scrollWidth} (client: ${overflowData.clientWidth}) | Overflow: ${overflowData.hasHorizontalScroll ? 'YES' : 'NO'} (${overflowData.overflowCount} elements)`);
      if (overflowData.sample.length > 0) {
        overflowData.sample.forEach(s => {
          console.log(`   - <${s.tag}> w:${s.width}px right:${s.right}px | cls: "${s.cls}"`);
        });
      }
    }

    await context.close();
  }

  await browser.close();
}

audit().catch(console.error);

