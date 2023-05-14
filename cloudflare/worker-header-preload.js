addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
  
async function handleRequest(request) {
    let response = await fetch(request); // get the response, body is in a stream

    const contentType = response.headers.get("Content-Type");

    if (contentType.startsWith('text/html')){
        // append new preload links 
        // it could be hard coded with sitewide links, but BigCommerce has dynamically created URLs!
        // https://developers.cloudflare.com/workers/learning/playground/
        // In the playground you need to select a real URL and switch to the testing tab to see the altered headers

        // have to copy it to change it
        response = new Response(response.body, response);

        response.headers.append('Link', '</css/style.css>; rel="preload"; as="style"; nopush'); // nopush to disable the push feature
    }

    return response;
}
  