import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import { mkdirSync } from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.resolve('docs/media/screenshots');
const PUBLIC_MEDIA_DIR = path.resolve('public/media');
const VIDEOS_DIR = path.resolve('docs/media/videos');

mkdirSync(SCREENSHOTS_DIR, { recursive: true });
mkdirSync(PUBLIC_MEDIA_DIR, { recursive: true });
mkdirSync(VIDEOS_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Starting Next.js server on port 3000...');
  const server = spawn('npx', ['next', 'start', '-p', '3000'], { stdio: 'inherit' });

  // Wait for server to start
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:3000');
      if (res.ok) {
        console.log('Server is ready!');
        break;
      }
    } catch {
      await sleep(400);
    }
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--ignore-gpu-blocklist',
      '--in-process-gpu',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: VIDEOS_DIR,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait for Canvas 3D scene to load
  await page.waitForSelector('canvas', { timeout: 90000 });
  await sleep(2000);

  const snap = async (name) => {
    const p1 = path.join(SCREENSHOTS_DIR, name);
    const p2 = path.join(PUBLIC_MEDIA_DIR, name);
    await page.screenshot({ path: p1, animations: 'disabled', timeout: 15000 });
    await page.screenshot({ path: p2, animations: 'disabled', timeout: 15000 });
    console.log(`Saved screenshot: ${name}`);
  };

  const openPanel = async (id) => {
    await page.evaluate((panelId) => {
      window.__UI_STORE__?.getState()?.openInteraction(panelId);
    }, id);
    await sleep(400);
  };

  const closePanel = async () => {
    await page.evaluate(() => {
      window.__UI_STORE__?.getState()?.openInteraction(null);
    });
    await sleep(300);
  };

  // 1. Hub World
  console.log('1. Hub World view');
  await snap('01-hub-world.png');

  // Player movement
  console.log('Walking player forward and jumping...');
  await page.keyboard.down('KeyW');
  await sleep(1200);
  await page.keyboard.press('Space');
  await sleep(500);
  await page.keyboard.up('KeyW');
  await sleep(400);

  // 2. Inspector (F3)
  console.log('2. Inspector overlay');
  await page.keyboard.press('F3');
  await sleep(600);
  await snap('02-inspector-f3.png');
  await page.keyboard.press('F3');
  await sleep(300);

  // 3. Collision Mission & Terminal
  console.log('3. Collision Mission & Terminal');
  await openPanel('collider-terminal');
  await snap('03-wall-collision-mission.png');
  const turnOnBtn = page.getByRole('button', { name: /Turn collider on/i });
  if (await turnOnBtn.isEnabled()) {
    await turnOnBtn.click();
    await sleep(300);
  }
  const turnOffBtn = page.getByRole('button', { name: /Turn collider off/i });
  if (await turnOffBtn.isEnabled()) {
    await turnOffBtn.click();
    await sleep(300);
  }
  await closePanel();

  // 4. Physics District
  console.log('4. Physics District');
  await openPanel('physics-panel');
  await snap('04-physics-district.png');
  await closePanel();

  // 5. Graphics / PBR Lab
  console.log('5. Graphics / PBR Lab');
  await openPanel('material-panel');
  await snap('05-graphics-pbr-lab.png');
  await closePanel();

  // 6. Performance Mine
  console.log('6. Performance Mine');
  await openPanel('perf-panel');
  await snap('06-performance-mine.png');
  const treeBtn = page.getByRole('button', { name: /10,000 trees/i });
  if (await treeBtn.isVisible()) {
    await treeBtn.click();
    await sleep(400);
  }
  await closePanel();

  // 7. Animation Studio
  console.log('7. Animation Studio');
  await openPanel('animation-panel');
  await snap('07-animation-studio.png');
  const jumpClip = page.getByRole('button', { name: /Jump/i });
  if (await jumpClip.isVisible()) {
    await jumpClip.click();
    await sleep(400);
  }
  await closePanel();

  // 8. AI Village
  console.log('8. AI Village');
  await openPanel('ai-panel');
  await snap('08-ai-village.png');
  const utilityBtn = page.getByRole('button', { name: /Utility AI/i });
  if (await utilityBtn.isVisible()) {
    await utilityBtn.click();
    await sleep(400);
  }
  await closePanel();

  // 9. Systems District (ECS)
  console.log('9. Systems District');
  await openPanel('systems-panel');
  await snap('09-systems-district.png');
  await closePanel();

  // 10. Multiplayer Arena
  console.log('10. Multiplayer Arena');
  await openPanel('multiplayer-panel');
  await snap('10-multiplayer-arena.png');
  await closePanel();

  // 11. Web Observatory
  console.log('11. Web Observatory');
  await openPanel('observatory-panel');
  await snap('11-web-observatory.png');
  await closePanel();

  // 12. Game Feel Lab
  console.log('12. Game Feel Lab');
  await openPanel('feel-panel');
  await snap('12-game-feel-lab.png');
  await closePanel();

  // 13. World Builder
  console.log('13. World Builder');
  await openPanel('worldbuilder-panel');
  await snap('13-world-builder.png');
  await closePanel();

  // 14. Learning Map
  console.log('14. Learning Map');
  await openPanel('learning-panel');
  await snap('14-learning-graph.png');
  await closePanel();

  // 15. AI Tutor
  console.log('15. AI Tutor');
  await openPanel('tutor-panel');
  await snap('15-ai-tutor.png');
  await closePanel();

  // 16. Pause & Accessibility Settings
  console.log('16. Pause Menu');
  await page.keyboard.press('Escape');
  await sleep(600);
  await snap('16-settings-accessibility.png');

  // Toggle child mode
  const childCheck = page.getByLabel(/Child mode/i);
  if (await childCheck.isVisible()) {
    await childCheck.check();
    await sleep(400);
  }
  await page.keyboard.press('Escape'); // resume
  await sleep(600);

  // 17. Child Mode Hub
  console.log('17. Child Mode Hub');
  await snap('17-child-mode.png');

  // Turn child mode back off
  await page.keyboard.press('Escape');
  await sleep(300);
  if (await childCheck.isVisible()) {
    await childCheck.uncheck();
    await sleep(300);
  }
  await page.keyboard.press('Escape');
  await sleep(500);

  console.log('Closing browser and finalizing video...');
  const video = page.video();
  await context.close();
  await browser.close();

  server.kill('SIGTERM');

  if (video) {
    const videoPath = await video.path();
    console.log(`Video recorded to: ${videoPath}`);

    const webmDest = path.join(VIDEOS_DIR, 'demo.webm');
    const mp4Dest = path.join(PUBLIC_MEDIA_DIR, 'demo.mp4');
    const mp4DocsDest = path.join(VIDEOS_DIR, 'demo.mp4');

    const cp = spawn('cp', [videoPath, webmDest]);
    await new Promise((r) => cp.on('close', r));

    console.log('Converting to MP4 via ffmpeg...');
    const ff = spawn('ffmpeg', [
      '-y',
      '-i',
      videoPath,
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '24',
      '-pix_fmt',
      'yuv420p',
      mp4Dest,
    ]);
    await new Promise((r) => ff.on('close', r));

    const cpMp4 = spawn('cp', [mp4Dest, mp4DocsDest]);
    await new Promise((r) => cpMp4.on('close', r));

    console.log(`MP4 generated at ${mp4Dest} and ${mp4DocsDest}`);
  }

  console.log('Demo capture complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
