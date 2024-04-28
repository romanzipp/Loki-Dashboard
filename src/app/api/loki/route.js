/*  eslint-disable no-console */

import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const headersList = headers();
    const { searchParams: query } = new URL(request.url);

    if (!headersList.has('X-Loki-Path')) {
        return Response.json({
            error: 'missing `X-Loki-Path` header',
        });
    }

    const lokiPath = headersList.get('X-Loki-Path');
    const lokiUrl = `${process.env.LOKI_ENTRYPOINT}/loki/api/v1/${lokiPath}?${new URLSearchParams(query)}`;

    let lokiBody = null;
    let lokiResponse = null;

    try {
        lokiResponse = await fetch(lokiUrl, {
            signal: AbortSignal.timeout((process.env.REQUEST_TIMEOUT || 10) * 1000),
        });

        lokiBody = await lokiResponse.text();
    } catch (err) {
        console.error(err);

        return Response.json({
            error: `fetch: ${err.message}`,
            url: lokiUrl,
            details: err,
        });
    }

    try {
        const lokiData = JSON.parse(lokiBody);

        return Response.json(lokiData);
    } catch (err) {
        console.error(err);
        console.error(lokiBody);

        return Response.json({
            error: `parse: ${err.message}`,
            url: lokiUrl,
            details: err,
        });
    }
}
