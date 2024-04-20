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

    try {
        const lokiResponse = await fetch(lokiUrl);

        const lokiData = await lokiResponse.json();

        return Response.json(lokiData);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);

        return Response.json({
            error: err.message,
            url: lokiUrl,
            details: err,
        });
    }
}
