import { defineEventHandler, readBody, createError } from 'h3';
import https from 'https';
import html2md from 'html-to-md';
import { generateFarmDescription } from '~/server/utils/ai';

export default defineEventHandler(async (event) => {
  try {
    const { locale } = event.context.params as Record<string, string>;
    const { description, url } = await readBody(event);

    let pageContent = '';
    if (url) {
      try {
        pageContent = await new Promise((resolve, reject) => {
          const req = https.request(
            url,
            { headers: { 'User-Agent': 'Mozilla/5.0' } },
            (res) => {
              let data = '';
              res.on('data', (chunk) => {
                data += chunk;
              });
              res.on('end', () => {
                resolve(data);
              });
            }
          );

          req.on('error', (e) => {
            reject(e);
          });

          req.end();
        });

        // Convert HTML to Markdown
        pageContent = html2md(
          pageContent,
          {
            ignoreTags: [
              'style',
              'head',
              '!doctype',
              'form',
              'svg',
              'noscript',
              'script',
              'meta',
              'img',
              'select',
              'footer-widgets'
            ],
            skipTags: [
              'div',
              'html',
              'body',
              'nav',
              'section',
              'footer',
              'main',
              'aside',
              'article',
              'header',
            ],
            emptyTags: [],
            aliasTags: {
              figure: 'p',
              dl: 'p',
              dd: 'p',
              dt: 'p',
              figcaption: 'p',
            },
            renderCustomTags: true,
          },
          true
        );
        pageContent = pageContent.replace(/\[([^\]]+)\]\((?!mailto:)[^)]+\)/g, '$1');

        // console.log('Converted Markdown content:', pageContent); // Log the converted Markdown content
      } catch (fetchError) {
        console.error('Error fetching page content:', fetchError);
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch page content.' });
      }
    }

    const farmDescription = await generateFarmDescription(description, pageContent, locale);

    return {
      statusCode: 200,
      ...farmDescription,
    };
  } catch (error) {
    console.error('Error occurred:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Performance Error',
      data: { message: 'Failed to process the request.' },
    });
  }
});
