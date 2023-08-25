import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {useStoryblokState, StoryblokComponent} from '@storyblok/react';
import {isStoryBlokPreview} from '~/lib/utils';
import {fetchStoryOnRoute} from '~/lib/storyblok';

export async function loader({request, params, context}) {
  let story;

  try {
    const data = await fetchStoryOnRoute({request, params, context});

    if (data.story) {
      story = data.story;
    }

    if (story) {
      return json({
        story,
        isStoryBlokPreview: isStoryBlokPreview(request),
      });
    }
  } catch (error) {
    story = null;
  }


  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function Page() {
  const data = useLoaderData();
  data.story = useStoryblokState(data?.story);
  if (data?.story) {
    return (
      <StoryblokComponent
        story={data.story}
        blok={data.story.content}
        preview={data.isStoryBlokPreview}
      />
    );
  } else {
    return <></>;
  }
}
