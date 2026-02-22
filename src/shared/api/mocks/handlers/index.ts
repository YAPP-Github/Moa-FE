import { retrospectiveHandlers } from './retrospective';
import { teamHandlers } from './team';

export const handlers = [...teamHandlers, ...retrospectiveHandlers];
