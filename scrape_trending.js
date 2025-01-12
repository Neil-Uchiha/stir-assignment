let webdriver = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');
require('dotenv').config();
let proxy = require('selenium-webdriver/proxy');
let opts = new chrome.Options();
let { By, until } = require('selenium-webdriver');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
// const publicIp = require('public-ip');

async function getPublicIP() {
  return new Promise((resolve, reject) => {
      https.get('https://api.ipify.org?format=json', (resp) => {
          let data = '';
          
          resp.on('data', (chunk) => {
              data += chunk;
          });
          
          resp.on('end', () => {
              try {
                  const ip = JSON.parse(data).ip;
                  resolve(ip);
              } catch (err) {
                  reject(err);
              }
          });
      }).on('error', (err) => {
          reject(err);
      });
  });
}
async function getTrends() {
  //Comment the below 4 lines (36-39, might be different if u use any prettify extension) to execute the script locally in non headless mode.
  opts.addArguments('--headless');
  opts.addArguments('--disable-gpu');
  opts.addArguments('--no-sandbox');
  opts.addArguments('--disable-dev-shm-usage');
  //Comment the below line if you dont want to use proxy ip service
  opts.setProxy(proxy.manual({http: `${process.env.PROXY_URL}`}));
  let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(opts)
    .build();

  try {
    await driver.get('https://x.com/i/flow/login');
    let username = await driver.wait(until.elementLocated(By.css('input[autocomplete="username"]')), 20000);
    await username.sendKeys(`${process.env.ACC_USERNAME}`);
    await username.sendKeys('\uE007'); 

    let password = await driver.wait(until.elementLocated(By.css('input[name="password"]')), 10000);
    await password.sendKeys(`${process.env.ACC_PASS}`);
    await password.sendKeys('\uE007'); 

    await driver.sleep(5000);
    const trends = [];
    const trendElements = await driver.findElements(By.css('[data-testid="trend"]'));
    
    for (let element of trendElements) {
      const trendText = await element.findElement(By.css('.r-b88u0q')).getText();
      trends.push(trendText);
      if (trends.length >= 5) break;
    }

    // const ip = await publicIp.v4();
    const ip = await getPublicIP();
    const record = {
      _id: uuidv4(),
      nameoftrend1: trends[0] || '',
      nameoftrend2: trends[1] || '',
      nameoftrend3: trends[2] || '',
      nameoftrend4: trends[3] || '',
      nameoftrend5: trends[4] || '',  //X.com homepage is showing only 4 trending topics on my end so 5th one will be blank
      timestamp: new Date(),
      ip_address: ip
    };
    console.log(record);

    await storeInMongoDB(record);
    return record;
  } finally {
    await driver.quit();
  }
};
async function storeInMongoDB(record) {
  const uri = `${process.env.MONGOURL}`;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db("twitter_trends");
    const collection = database.collection("trends");
    await collection.insertOne(record);
  } finally {
    await client.close();
  }
}

module.exports = { getTrends };