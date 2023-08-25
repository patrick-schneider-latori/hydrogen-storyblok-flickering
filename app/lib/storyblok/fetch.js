import {getStoryblokApi} from '@storyblok/react';

import {isStoryBlokPreview} from '~/lib/utils';

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

  let res;

  const config = {
    language:
      requestUrl.searchParams.get('_storyblok_lang') ||
      context?.storefront?.i18n?.language?.toLowerCase() ||
      'default',
  };

  if (isPreview) {
    config.resolve_links = 'url';
    config.version = 'draft';
    res = await getStoryblokApi().get(`cdn/stories/${slug}`, config);
    res = res?.data;
  } else {
    res = await context.storyblok.query(`cdn/stories/${slug}`, config);
  }

  return res;
};
