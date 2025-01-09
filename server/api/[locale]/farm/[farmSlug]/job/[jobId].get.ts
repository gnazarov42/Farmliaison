import { getJobById } from '~~/server/db/job';

export default defineEventHandler(async (event) => {
  const { jobId, locale } = event.context.params as Record<string, string>;

  try {
    const job = await getJobById(jobId, locale);

    if (!job) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Job not found.',
      });
    }

    return {
      statusCode: 200,
      body: {
        job,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
