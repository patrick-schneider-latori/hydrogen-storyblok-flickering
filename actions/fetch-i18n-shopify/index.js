/* eslint-disable eslint-comments/disable-enable-pair */

require('dotenv').config();
const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');

const {writeJson, ensureDir} = require('fs-extra');
const SRC_DIR = path.resolve(process.cwd(), 'app');
const I18N_DIR = path.resolve(SRC_DIR, 'i18n');
const {PUBLIC_STORE_DOMAIN, PRIVATE_SHOPIFY_ADMIN_API_TOKEN} = process.env;
const API_VERSION = '2023-01';
const THEME_ID = 150724510037;

const save = async (path, contents) => {
  await ensureDir(I18N_DIR);
  await writeJson(I18N_DIR + path, contents);
};

const getLanguageList = async () => {
  const res = await fetch(
    `https://${PUBLIC_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': PRIVATE_SHOPIFY_ADMIN_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          shopLocales {
            locale
            primary
            published
          }
        }`,
      }),
    },
  ).then((r) => r.json());

  return res?.data?.shopLocales || [];
};

const i18nFetchAndSaveFile = async ({locale, primary, published}) => {
  if (!published) return;

  const assetKey = `locales/${locale}${primary ? '.default' : ''}.json`;
  try {
    console.log(`Start fetching ${assetKey} from Shopify theme folder...`);
    const SHOPIFY_ADMIN_API_URL = new URL(
      `https://${PUBLIC_STORE_DOMAIN}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json`,
    );
    SHOPIFY_ADMIN_API_URL.searchParams.set('asset[key]', assetKey);
    let i18nFile = await fetch(SHOPIFY_ADMIN_API_URL, {
      headers: {
        'X-Shopify-Access-Token': PRIVATE_SHOPIFY_ADMIN_API_TOKEN,
      },
    });
    if (i18nFile.status === 404) {
      console.log(
        `❌ File not found. Restarting fetching ${locale} ${
          primary ? 'without' : 'with'
        } .default naming again...`,
      );
      return await i18nFetchAndSaveFile({
        locale,
        primary: !primary,
        published,
      });
    }
    i18nFile = await i18nFile.json();
    const jsonValue = JSON.parse(i18nFile?.asset?.value || {});
    console.log('✅ Done');
    return {
      locale,
      keys: jsonValue,
    };
  } catch (error) {
    console.log(error);
  }
};

const fetchPetFilters = async ({locale}) => {
  const assetKey = `assets/pet_filters_${locale}.json`;
  try {
    const SHOPIFY_ADMIN_API_URL = new URL(
      `https://${PUBLIC_STORE_DOMAIN}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json`,
    );
    SHOPIFY_ADMIN_API_URL.searchParams.set('asset[key]', assetKey);
    let i18nFile = await fetch(SHOPIFY_ADMIN_API_URL, {
      headers: {
        'X-Shopify-Access-Token': PRIVATE_SHOPIFY_ADMIN_API_TOKEN,
      },
    });
    if (i18nFile.status === 404) {
      console.log(`❌ File not found. ` + assetKey);
      return {
        locale,
        keys: {},
      };
    }
    i18nFile = await i18nFile.json();
    const jsonValue = JSON.parse(i18nFile?.asset?.value || {});
    console.log('✅ Done');
    return {
      locale,
      keys: jsonValue,
    };
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  const languageList = await getLanguageList();
  await save(`/languages.json`, languageList);
  const localesArr = await Promise.all(
    languageList.map(async (language) => await i18nFetchAndSaveFile(language)),
  );
  const locales = {};
  localesArr
    .filter((o) => o)
    .forEach(({locale, keys}) => {
      locales[locale] = keys;
    });

  await save(`/locales.json`, locales);
  console.log(`Start fetching pet filters from Shopify theme folder...`);

  const filtersArr = await Promise.all(
    languageList.map(async (language) => await fetchPetFilters(language)),
  );
  const filters = {};
  filtersArr
    .filter((o) => o)
    .forEach(({locale, keys}) => {
      filters[locale] = keys;
    });

  await save(`/pet_filters.json`, filters);
  console.log('🙌 i18n translations ready');
})();
