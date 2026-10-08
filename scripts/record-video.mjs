import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import { mkdirSync } from 'fs';
import path from 'path';

const PUBLIC_MEDIA_DIR = path.resolve('public/media');
const VIDEOS_DIR = path.resolve('docs/media/videos');

mkdirSync(PUBLIC_MEDIA_DIR, { recursive: true });
mkdirSync(VIDEOS_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Starting Next.js server on port 3000...');
  const server = spawn('npx', ['next', 'start', '-p', '3000'], { stdio: 'inherit' });

  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:3000');
      if (res.ok) {
        console.log('Server is ready!');
        break;
      }
    } catch {
      await sleep(500);
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
    viewport: { width: 1024, height: 576 },
    recordVideo: {
      dir: VIDEOS_DIR,
      size: { width: 1024, height: 576 },
    },
  });

  const page = await context.newPage();
  console.log('Navigating to game world...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { timeout: 90000 });
  await sleep(2000);

  const openPanel = async (id, duration = 1200) => {
    await page.evaluate((panelId) => {
      window.__UI_STORE__?.getState()?.openInteraction(panelId);
    }, id);
    await sleep(duration);
  };

  const closePanel = async () => {
    await page.evaluate(() => {
      window.__UI_STORE__?.getState()?.openInteraction(null);
    });
    await sleep(400);
  };

  console.log('Video action: Player movement and jump');
  await page.keyboard.down('KeyW');
  await sleep(1500);
  await page.keyboard.press('Space');
  await sleep(600);
  await page.keyboard.up('KeyW');
  await sleep(500);

  console.log('Video action: Inspector F3');
  await page.keyboard.press('F3');
  await sleep(1200);
  await page.keyboard.press('F3');
  await sleep(400);

  console.log('Video action: Collider break/fix mission');
  await openPanel('collider-terminal', 1200);
  const onBtn = page.getByRole('button', { name: /Turn collider on/i });
  if (await onBtn.isEnabled()) await onBtn.click();
  await sleep(600);
  const offBtn = page.getByRole('button', { name: /Turn collider off/i });
  if (await offBtn.isEnabled()) await offBtn.click();
  await sleep(600);
  await closePanel();

  console.log('Video action: Physics District');
  await openPanel('physics-panel', 1500);
  await closePanel();

  console.log('Video action: Graphics PBR Lab');
  await openPanel('material-panel', 1500);
  await closePanel();

  console.log('Video action: Performance Mine');
  await openPanel('perf-panel', 800);
  const tree10k = page.getByRole('button', { name: /10,000 trees/i });
  if (await tree10k.isVisible()) await tree10k.click();
  await sleep(1200);
  await closePanel();

  console.log('Video action: Animation Studio');
  await openPanel('animation-panel', 800);
  const jumpBtn = page.getByRole('button', { name: /Jump/i });
  if (await jumpBtn.isVisible()) await jumpBtn.click();
  await sleep(1000);
  await closePanel();

  console.log('Video action: AI Village');
  await openPanel('ai-panel', 800);
  const utilBtn = page.getByRole('button', { name: /Utility AI/i });
  if (await utilBtn.isVisible()) await utilBtn.click();
  await sleep(1000);
  await closePanel();

  console.log('Video action: Systems District');
  await openPanel('systems-panel', 1400);
  await closePanel();

  console.log('Video action: Multiplayer Arena');
  await openPanel('multiplayer-panel', 1400);
  await closePanel();

  console.log('Video action: Web Observatory');
  await openPanel('observatory-panel', 1400);
  await closePanel();

  console.log('Video action: Game Feel');
  await openPanel('feel-panel', 1400);
  await closePanel();

  console.log('Video action: World Builder');
  await openPanel('worldbuilder-panel', 1400);
  await closePanel();

  console.log('Video action: Learning Map');
  await openPanel('learning-panel', 1400);
  await closePanel();

  console.log('Video action: AI Tutor');
  await openPanel('tutor-panel', 1400);
  await closePanel();

  console.log('Video action: Pause Menu & Child Mode');
  await page.keyboard.press('Escape');
  await sleep(1000);
  const childBox = page.getByLabel(/Child mode/i);
  if (await childBox.isVisible()) await childBox.check();
  await sleep(800);
  await page.keyboard.press('Escape');
  await sleep(1500);

  // Resume normal
  await page.keyboard.press('Escape');
  await sleep(500);
  if (await childBox.isVisible()) await childBox.uncheck();
  await sleep(500);
  await page.keyboard.press('Escape');
  await sleep(1000);

  console.log('Finalizing recording...');
  const video = page.video();
  await context.close();
  await browser.close();
  server.kill('SIGTERM');

  if (video) {
    const rawVideoPath = await video.path();
    console.log(`Raw video saved at: ${rawVideoPath}`);

    const webmDest = path.join(VIDEOS_DIR, 'demo.webm');
    const mp4PublicDest = path.join(PUBLIC_MEDIA_DIR, 'demo.mp4');
    const mp4DocsDest = path.join(VIDEOS_DIR, 'demo.mp4');

    const cpWebm = spawn('cp', [rawVideoPath, webmDest]);
    await new Promise((r) => cpWebm.on('close', r));

    console.log('Transcoding to MP4 H.264...');
    const ff = spawn('ffmpeg', [
      '-y',
      '-i',
      rawVideoPath,
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      '22',
      '-pix_fmt',
      'yuv420p',
      mp4PublicDest,
    ]);
    await new Promise((r) => ff.on('close', r));

    const cpMp4 = spawn('cp', [mp4PublicDest, mp4DocsDest]);
    await new Promise((r) => cpMp4.on('close', r));

    console.log(`MP4 successfully saved at:`);
    console.log(`- ${mp4PublicDest}`);
    console.log(`- ${mp4DocsDest}`);
  }

  console.log('Recording and encoding complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
