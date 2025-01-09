import { getJobsByFarmSlug } from '~~/server/db/job';

export default defineEventHandler(async (event) => {
  const { farmSlug, locale } = event.context.params as Record<string, string>;

  try {
    const jobs = await getJobsByFarmSlug(farmSlug, locale);

    if (!jobs || jobs.length === 0) {
      return {
        statusCode: 404,
        body: {
          message: 'No jobs found for the specified farm.',
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        jobs,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        error: {
          message: 'Internal Server Error',
        },
      },
    };
  }
});
