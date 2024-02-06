import { getFarms } from '~~/server/db/farm';

export default defineEventHandler(async (event) => {
  // const { locale } = event.context.params as Record<string, string>;

  const farms = await getFarms();
  return {
    farms,
  };
});
