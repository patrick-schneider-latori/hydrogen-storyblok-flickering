import {getStoryblokApi} from '@storyblok/react';

import {isStoryBlokPreview} from '~/lib/utils';
import space from '~cache/space.json';

export const fetchStoryOnRoute = async ({request, params, context}) => {
  const requestUrl = new URL(request.url);
  const isPreview = isStoryBlokPreview(request);

  let slug = params['*'] ?? 'home';
  slug = slug.endsWith('/') ? slug.slice(0, -1) : slug;
  slug = slug.length === 2 ? 'home' : slug;

  /* path without language isoCode */
  slug = slug
    .split('/')
    .filter(
      (part) => part !== context?.storefront?.i18n?.language?.toLowerCase(),
    )
    .join('/');

  const sbParams = {
    version: isPreview ? 'draft' : 'published',
    cv: isPreview ? new Date().valueOf() : space.version,
    token: context.env.PRIVATE_STORYBLOK_CONTENT_PREVIEW_ACCESS_TOKEN,
    resolve_links: !params.resolve_links ? 'url' : params.resolve_links,
    language:
      requestUrl.searchParams.get('_storyblok_lang') ||
      context?.storefront?.i18n?.language?.toLowerCase() ||
      'default'
  }

  const res = await getStoryblokApi().get(`cdn/stories/${slug}`, sbParams);

  return res?.data;
};
