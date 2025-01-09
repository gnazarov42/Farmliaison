import { getLanguages } from '~~/server/db/language';

export default defineEventHandler(async () => {
  const languages = await getLanguages();
  return {
    languages,
  };
});
