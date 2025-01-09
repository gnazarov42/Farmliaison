import { createJob } from '~~/server/db/job';
import { getFarmOwnerBySlug } from '~~/server/db/farm';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { jobFields } from '~/server/transformers/job'; // Assume you have a similar transformer for job data

export default defineEventHandler(async (event) => {
  const currentUser = event.context.currentUser;
  const { farmSlug, locale } = event.context.params as Record<string, string>;

  try {
    // Check if the current user is the owner of the farm
    const farmOwner = await getFarmOwnerBySlug(farmSlug);
    if (!farmOwner || !currentUser || currentUser.id !== farmOwner.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Only the farm owner can create jobs.',
      });
    }

    // Get new job data from the request body
    const rawData = await readBody(event);
    const newJobData = sanitizeDataForModel(rawData, jobFields);

    // Create the new job posting
    const newJob = await createJob(farmSlug, newJobData, locale);

    return {
      statusCode: 200,
      body: {
        message: 'Job created successfully',
        job: newJob,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
