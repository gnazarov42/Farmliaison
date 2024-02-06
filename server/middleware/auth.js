import UrlPattern from 'url-pattern';
import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {
  const endpoints = [
    '/api/auth/user',
    '/api/user/tweets',
    '/api/user/:id',
    '/api/tweets',
    '/api/tweets/:id',
    '/api/:locale/farm/:id',
  ];

  const isHandledByThisMiddleware = endpoints.some((endopoint) => {
    const pattern = new UrlPattern(endopoint);

    return pattern.match(event.node.req.url);
  });

  if (!isHandledByThisMiddleware) {
    return;
  }

  const session = await getServerSession(event);

  if (!session) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      }),
    );
  }

  try {
    event.context.currentUser = session ? session?.user : null;
  } catch (error) {
    console.log('🚀 ~ file: auth.js:38 ~ defineEventHandler ~ error:', error);
  }
});
