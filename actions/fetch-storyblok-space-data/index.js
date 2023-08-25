/* eslint-disable eslint-comments/disable-enable-pair */

require('dotenv').config();
const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');

const {writeJson, ensureDir} = require('fs-extra');
const CACHE_DIR = path.resolve(process.cwd(), '.cache');
const {PRIVATE_STORYBLOK_CONTENT_PREVIEW_ACCESS_TOKEN} = process.env;

const save = async (path, contents) => {
  await ensureDir(CACHE_DIR);
  await writeJson(CACHE_DIR + path, contents);
};

const cacheInvalidation = async () => {
  console.log('Fetching current space data from Storyblok...');
  const res = await fetch(
    `https://api.storyblok.com/v1/cdn/spaces/me?token=${PRIVATE_STORYBLOK_CONTENT_PREVIEW_ACCESS_TOKEN}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  ).then((r) => r.json());
  console.log('✅ Done');
  return res?.space || {};
};

(async () => {
  try {
    const data = await cacheInvalidation();
    await save(`/space.json`, data);

    console.log('🙌 New cache version ready');
  } catch (error) {
    console.log(error);
  }
})();
