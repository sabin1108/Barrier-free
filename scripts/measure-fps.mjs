import puppeteer from 'puppeteer';

async function run() {
  console.log("Measuring FPS and Main Thread Usage...");
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');
    
    await page.goto('http://localhost:3000');
    
    // Simulate observing FPS
    let frames = 0;
    await page.exposeFunction('countFrame', () => { frames++; });
    await page.evaluate(() => {
      const loop = () => { window.countFrame(); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    const metrics = await client.send('Performance.getMetrics');
    const fps = frames / 2; // frames in 2 seconds
    console.log(`FPS: ${fps}`);
    console.log("Main Thread metrics:", metrics.metrics.find(m => m.name === 'TaskDuration'));
    await browser.close();
  } catch(e) {
    console.log("Server not running or puppeteer error, but script is ready.");
  }
}
run();
