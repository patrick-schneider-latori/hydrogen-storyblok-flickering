import {ContentTypeComponents} from './content-type';
import {NestedComponents} from './nested';

export * from './content-type';
export * from './nested';

export const StoryBlokComponents = {
  ...ContentTypeComponents,
  ...NestedComponents,
};
