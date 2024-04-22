export const dynamic = 'force-dynamic';

export async function GET() {
    return Response.json({
        coloredRows: process.env.COLORED_ROWS,
        coloredRowsLevelThreshold: process.env.COLORED_ROWS_LEVEL_THRESHOLD,
        labelCharLimit: process.env.LABEL_CHAR_LIMIT,
    });
}
