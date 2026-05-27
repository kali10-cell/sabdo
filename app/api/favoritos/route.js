let favoritos = [];

export async function GET() {
  return Response.json(favoritos);
}

export async function POST(req) {
  const producto = await req.json();
  favoritos = [...favoritos, producto];
  return Response.json({ ok: true, favoritos });
}

