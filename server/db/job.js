import {
  prepareLocalizedJsonUpdate,
  updateJsonFieldsWithTranslation,
  localizeField,
} from './utils';
import { prisma } from '.';

export const createJob = async (farmSlug, data, locale = 'en') => {
  try {
    // Prepare localized fields if applicable
    const localizedData = await prepareLocalizedJsonUpdate(locale, data, {});

    const newJob = await prisma.job.create({
      data: {
        ...localizedData,
        farm: {
          connect: {
            farmSlug,
          },
        },
      },
    });
    return newJob;
  } catch (error) {
    console.error('Error creating job:', error);
    throw new Error('Failed to create job');
  }
};

export const getJobById = async (jobId, locale = 'en') => {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });
    return job
      ? {
          ...job,
          title: localizeField(job.title, locale, ''),
          description: localizeField(job.description, locale, ''),
        }
      : null;
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    throw new Error('Failed to fetch job');
  }
};

export const updateJob = async (jobId, data, locale = 'en') => {
  try {
    // Update localized fields if applicable
    const updatedJob = await updateJsonFieldsWithTranslation(
      'job',
      ['title', 'description'],
      jobId,
      locale,
      data,
    );
    return updatedJob;
  } catch (error) {
    console.error('Error updating job:', error);
    throw new Error('Failed to update job');
  }
};

export const deleteJob = async (jobId) => {
  try {
    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    throw new Error('Failed to delete job');
  }
};

export const getJobsByFarmSlug = async (farmSlug, locale = 'en') => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        farm: {
          farmSlug,
        },
      },
    });
    const locJobs = jobs.map((job) => {
      return {
        ...job,
        title: localizeField(job.title, locale, ''),
        description: localizeField(job.description, locale, ''),
      };
    });
    return locJobs;
  } catch (error) {
    console.error('Error fetching jobs by farm slug:', error);
    throw new Error('Failed to fetch jobs by farm slug');
  }
};
export const getJobs = async (locale = 'en') => {
  try {
    const jobs = await prisma.job.findMany();
    const locJobs = jobs.map((job) => {
      return {
        ...job,
        title: localizeField(job.title, locale, ''),
        description: localizeField(job.description, locale, ''),
      };
    });
    return locJobs;
  } catch (error) {
    console.error('Error fetching jobs by farm slug:', error);
    throw new Error('Failed to fetch jobs by farm slug');
  }
};
