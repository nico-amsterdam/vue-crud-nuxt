import {
    defineEventHandler,
    getRequestHeaders,
    setResponseHeaders,
    createError
} from 'h3';

// Reject cross-origin requests to protect from CSRF, XSSI, and other bugs.
// see https://web.dev/articles/fetch-metadata
export function allowRequest(path: string, method: string, secFetchSite: string | undefined, secFetchMode: string | undefined, secFetchDest: string | undefined): boolean {

    // Allow requests from browsers which don't send Fetch Metadata
    if (!secFetchSite) {
        // crawler or old browser
        return true
    }

    // Allow application and browser-initiated requests.
    // Do not trust subdomains (same-site).
    if (['same-origin', 'none'].includes(secFetchSite)) {
        return true
    }

    // Allow simple top-level navigations except <object> and <embed>
    if (secFetchMode === 'navigate' && method === 'GET' &&
        !['object', 'embed'].includes(secFetchDest || '')) {
        return true
    }

    // Exempt paths/endpoints meant to be served cross-origin
    if (['/health', '/favicon.ico'].includes(path) || path.startsWith('/image/')) {
        return true
    }

    console.log('deny access because sec-fetch-site=' + secFetchSite + ' and sec-fetch-mode=' + secFetchMode + ' with set-fetch-dest=' + secFetchDest)

    // Reject all other requests that are cross-site and not navigational
    return false
}


export default defineEventHandler((event) => {
    const headers = getRequestHeaders(event);

    // Extract browser-provided security headers
    const secFetchSite = headers['sec-fetch-site'];
    const secFetchMode = headers['sec-fetch-mode'];
    const secFetchDest = headers['sec-fetch-dest'];

    // Debug logging (disable in production)
    // console.log({ secFetchSite, secFetchMode, secFetchDest });

    // CSRF protection: block cross-site requests
    if (
        !allowRequest(event.path, event.method, secFetchSite, secFetchMode, secFetchDest)
    ) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Cross-site requests are not allowed'
        });
    }

    // // Apply strong security headers to every response
    // setResponseHeaders(event, {
    //     // 'Content-Security-Policy': wait for PR https://github.com/nuxt/nuxt/pull/32242
    //     'X-Frame-Options': 'DENY',
    //     'X-Content-Type-Options': 'nosniff',
    //     'Referrer-Policy': 'strict-origin-when-cross-origin',
    //     'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    // });
});