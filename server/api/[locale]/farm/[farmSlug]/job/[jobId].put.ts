import { updateJob, getJobById } from '~~/server/db/job';
import { getFarmOwnerBySlug, getFarmProfileBySlug } from '~~/server/db/farm';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { jobFields } from '~/server/transformers/job';

export default defineEventHandler(async (event) => {
  const currentUser = event.context.currentUser;
  const { farmSlug, jobId, locale } = event.context.params as Record<
    string,
    string
  >;

  // Check if the current user is the owner of the farm
  // TODO: need to get rid fo extra request
  const farmOwner = await getFarmOwnerBySlug(farmSlug);
  if (!farmOwner || !currentUser || currentUser.id !== farmOwner.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Only the farm owner can update jobs.',
    });
  }

  // TODO: need to get rid fo extra request
  const farm = await getFarmProfileBySlug(farmSlug);

  // Get the existing job to ensure it exists and belongs to the current farm
  const existingJob = await getJobById(jobId, locale);
  if (existingJob?.farmId !== farm?.id) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job not found or does not belong to the specified farm.',
    });
  }

  // Get updated job data from the request body
  const rawData = await readBody(event);
  const updatedJobData = sanitizeDataForModel(rawData, jobFields);

  // Update the job posting
  const updatedJob = await updateJob(jobId, updatedJobData, locale);

  return {
    statusCode: 200,
    body: {
      message: 'Job updated successfully',
      job: updatedJob,
    },
  };
});
