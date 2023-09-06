import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {useStoryblokState, StoryblokComponent} from '@storyblok/react';
import {isStoryBlokPreview} from '~/lib/utils';
import {fetchStoryOnRoute} from '~/lib/storyblok';

export async function loader({request, params, context}) {
  try {
    const data = await fetchStoryOnRoute({request, params, context});
    if (data.story) {
      return json({
        story: data.story,
        isStoryBlokPreview: isStoryBlokPreview(request),
      });
    }
  } catch (error) {
    throw new Response(`${new URL(request.url).pathname} not found`, {
      status: 404,
    });
  }
}

export default function Page() {
  const data = useLoaderData();
  let story = useStoryblokState(data.story);
  return (
    <StoryblokComponent
      story={story}
      blok={story.content}
      preview={data.isStoryBlokPreview}
    />
  );
}
