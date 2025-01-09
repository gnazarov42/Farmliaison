import { getSpecialties } from '~/server/db/specialty';

export default defineEventHandler(async (event) => {
  const { locale } = event.context.params as Record<string, string>;

  const specialties = await getSpecialties(locale);
  return {
    specialties,
  };
});
