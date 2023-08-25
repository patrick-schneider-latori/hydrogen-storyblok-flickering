import {CacheLong, createWithCache} from '@shopify/hydrogen';

import space from '~cache/space.json';

function createClient(query, params, preview, config) {
  const STORYBLOK_STORIES_FETCH_URL = new URL(
    'https://api.storyblok.com/v2/' + query,
  );

  STORYBLOK_STORIES_FETCH_URL.searchParams.set(
    'token',
    config.PRIVATE_STORYBLOK_CONTENT_PREVIEW_ACCESS_TOKEN,
  );
  STORYBLOK_STORIES_FETCH_URL.searchParams.set(
    'version',
    preview ? 'draft' : 'published',
  );
  STORYBLOK_STORIES_FETCH_URL.searchParams.set(
    'cv',
    preview ? new Date().valueOf() : space.version,
  );
  STORYBLOK_STORIES_FETCH_URL.searchParams.set(
    'resolve_links',
    !params.resolve_links ? 'url' : params.resolve_links,
  );
  STORYBLOK_STORIES_FETCH_URL.searchParams.set(
    'language',
    !params.language
      ? config.i18n.language.toLowerCase()
      : params.language.toLowerCase(),
  );

  for (let prop in params) {
    STORYBLOK_STORIES_FETCH_URL.searchParams.set(prop, params[prop]);
  }

  return fetch(STORYBLOK_STORIES_FETCH_URL);
}

/**
 * Create Storyblok provider with API client.
 */
export function createStoryblokClient(options) {
  const {cacheStoryblok, waitUntil, preview, config} = options || {};

  const withCache = createWithCache({
    cacheStoryblok,
    waitUntil,
  });

  const storyblok = {
    client: createClient,
    async query(query, params, cache = CacheLong()) {
      // Hash query and make it unique based on parameters
      const queryHash = await hashQuery(query, params);
      return withCache(queryHash, cache, async () => {
        try {
          const response = await storyblok.client(
            query,
            params,
            preview,
            config,
          );

          let total, perPage;

          if (!response.ok)
            throw new Error('Something went wrong. Skipping cache.');

          if (response.headers.get('total')) {
            total = response.headers.get('total');
          }

          if (response.headers.get('per-page')) {
            perPage = response.headers.get('per-page');
          }

          return response.json().then((res) => {
            if (total) {
              res.total = parseInt(total);
            }
            if (perPage) {
              res.perPage = parseInt(perPage);
            }
            return res;
          });
        } catch (error) {
          return {
            error,
          };
        }
      });
    },
  };

  return storyblok;
}

/**
 * Create an SHA-256 hash as a hex string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 */
export async function sha256(message) {
  // encode as UTF-8
  const messageBuffer = await new TextEncoder().encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
  // convert bytes to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash query and its parameters for use as cache key
 * NOTE: Oxygen deployment will break if the cache key is long or contains `\n`
 * @todo performance improvement?
 */
function hashQuery(query, params) {
  let hash = query;

  if (params != null) {
    hash += JSON.stringify(params);
  }

  return sha256(hash);
}
