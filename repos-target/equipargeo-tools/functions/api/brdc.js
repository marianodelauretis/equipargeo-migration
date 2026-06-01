// Cloudflare Pages Function  ·  ruta pública: /api/brdc
// Baja el broadcast de navegación de BKG (sin CORS, del lado del servidor),
// lo descomprime al vuelo y lo devuelve como .rnx listo para usar.
//
// Uso desde el front:  /api/brdc?y=2026&doy=66&prod=BRDC00IGS
//
// Deploy: este archivo va en  functions/api/brdc.js  dentro del proyecto de
// Cloudflare Pages. La ruta /api/brdc queda disponible automáticamente.

const ALLOWED = new Set(['BRDC00IGS', 'BRDC00WRD']); // lista blanca anti-SSRF

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const y    = url.searchParams.get('y');
  const doy  = url.searchParams.get('doy');
  const prod = url.searchParams.get('prod') || 'BRDC00IGS';

  // --- validación estricta (evita que el proxy baje URLs arbitrarias) ---
  if (!/^\d{4}$/.test(y || '') || +y < 1990 || +y > 2100)
    return err('Año inválido.', 400);
  const d = parseInt(doy, 10);
  if (!(d >= 1 && d <= 366))
    return err('Día del año inválido (1–366).', 400);
  if (!ALLOWED.has(prod))
    return err('Producto no permitido.', 400);

  const Y = y;
  const D = String(d).padStart(3, '0');
  const fname = `${prod}_R_${Y}${D}0000_01D_MN.rnx.gz`;
  const src = `https://igs.bkg.bund.de/root_ftp/IGS/BRDC/${Y}/${D}/${fname}`;

  let upstream;
  try {
    upstream = await fetch(src, { cf: { cacheTtl: 86400, cacheEverything: true } });
  } catch (e) {
    return err('No se pudo contactar a BKG: ' + e.message, 502);
  }
  if (!upstream.ok)
    return err(
      `BKG devolvió ${upstream.status} para ${fname}. ` +
      (prod === 'BRDC00IGS'
        ? 'Si la medición es muy reciente, el producto IGS final puede no estar publicado aún: probá la versión casi-real.'
        : 'Ese día/producto puede no estar disponible.'),
      upstream.status === 404 ? 404 : 502
    );

  // descompresión gzip en streaming, del lado del servidor (sin CORS)
  const outName = fname.replace(/\.gz$/, '');
  const body = upstream.body.pipeThrough(new DecompressionStream('gzip'));

  return new Response(body, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${outName}"`,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

function err(msg, status) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
