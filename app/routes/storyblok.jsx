export async function loader() {
  return new Response(
    `
      <!DOCTYPE html>
      <html>
          <head>
              <title>Storyblok Admin</title>
              <link rel="icon" href="https://app.storyblok.com/favicon.ico"/>
          </head>
          <body>
              <div id="app"></div>
              <script type="text/javascript">
                  STORYBLOK_PREVIEW_URL = 'http://localhost:5560/'
              </script>
              <script src="https://app.storyblok.com/f/app-latest.js" type="text/javascript"></script>
          </body>
      </html>
    `,
    {
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    },
  );
}
