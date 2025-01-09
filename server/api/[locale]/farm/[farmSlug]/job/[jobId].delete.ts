import { deleteJob, getJobById } from '~~/server/db/job';
import { getFarmOwnerBySlug } from '~~/server/db/farm';

export default defineEventHandler(async (event) => {
  const currentUser = event.context.currentUser;
  const { farmSlug, jobId } = event.context.params as Record<string, string>;

  // Check if the current user is the owner of the farm
  const farmOwner = await getFarmOwnerBySlug(farmSlug);
  if (!farmOwner || !currentUser || currentUser.id !== farmOwner.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Only the farm owner can delete jobs.',
    });
  }

  // Get the existing job to ensure it exists and belongs to the current farm
  const existingJob = await getJobById(jobId);
  if (!existingJob || existingJob.farmSlug !== farmSlug) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job not found or does not belong to the specified farm.',
    });
  }

  // Delete the job posting
  await deleteJob(jobId);

  return {
    statusCode: 200,
    body: {
      message: 'Job deleted successfully',
    },
  };
});
