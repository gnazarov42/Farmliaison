import { getActivities } from '~~/server/db/activity';

export default defineEventHandler(async (event) => {
  const { locale } = event.context.params as Record<string, string>;

  const activities = await getActivities(locale);
  return {
    activities,
  };
});
