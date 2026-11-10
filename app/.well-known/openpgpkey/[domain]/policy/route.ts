/// WKD Policy endpoint — tells external PGP clients that this domain
/// supports Web Key Directory (RFC 7929 / draft-koch-openpgp-webkey-service).
///
/// GET /.well-known/openpgpkey/{domain}/policy
/// Returns 200 with empty body = "this domain serves WKD".

export async function GET() {
  return new Response(null, {
    status: 200,
    headers: { 'Content-Type': 'application/octet-stream' },
  });
}
