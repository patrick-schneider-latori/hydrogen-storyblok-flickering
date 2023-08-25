// import {useMatches} from '@remix-run/react';
import {storyblokEditable, StoryblokComponent} from '@storyblok/react';
// import {useEffect} from 'react';
// import {DEFAULT_LOCALE, getStoryblokLocalizedTitle} from '~/lib/utils';

const Page = (props) => {
  // const [root] = useMatches();
  // const selectedLocale = root.data?.selectedLocale ?? DEFAULT_LOCALE;

  const {preview, blok, story} = props;
  const storyblokPreviewProps = preview ? storyblokEditable(blok) : {};
  const {
    _uid,
    component,
    page_title_alternative,
  } = blok || {};

  return (
    <div className={`blok-${component}`} {...storyblokPreviewProps} key={_uid}>{page_title_alternative}</div>
  );
};

export default Page;
