/* eslint-disable eslint-comments/disable-enable-pair */
const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');

const {writeJson, ensureDir} = require('fs-extra');
const CACHE_DIR = path.resolve(process.cwd(), '.cache');
const {parse} = require('node-html-parser');

const save = async (path, contents) => {
  await ensureDir(CACHE_DIR);
  await writeJson(CACHE_DIR + path, contents);
};

(async () => {
  try {
    console.log('Start fetching and parsing data on Trustpilot...');
    const res = await fetch(
      'https://de.trustpilot.com/review/wirliebenhunter.de',
    ).then((r) => r.text());
    const root = parse(res);
    const script = root.querySelector('#__NEXT_DATA__').innerHTML;
    const bodyJSON = JSON.parse(script);
    await save(
      `/trustpilot.json`,
      bodyJSON?.props?.pageProps?.businessUnit || {},
    );
    console.log('✅ Done');
  } catch (error) {
    console.log(error);
  }
})();
