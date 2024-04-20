export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request) {
    const { searchParams: query } = new URL(request.url);

    if (!query.has('_path')) {
        return Response.json({
            error: 'missing `_path` query param',
        });
    }

    const lokiPath = query.get('_path');

    const forwardQuery = query;
    forwardQuery.delete('_path');

    const lokiUrl = `${process.env.LOKI_ENTRYPOINT}/loki/api/v1/${lokiPath}?${new URLSearchParams(forwardQuery)}`;

    try {
        const lokiResponse = await fetch(lokiUrl);

        const lokiData = await lokiResponse.json();

        return Response.json(lokiData);
    } catch (err) {
        console.log(err);

        return Response.json({
            error: err.message,
            url: lokiUrl,
            details: err,
        });
    }
}
