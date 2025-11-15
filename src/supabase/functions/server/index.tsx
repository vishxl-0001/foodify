// Minimal server - app runs client-side only
Deno.serve(() => new Response(JSON.stringify({ status: 'ok' }), {
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
}));
