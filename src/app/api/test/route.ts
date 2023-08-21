export async function GET(
  req: Request,
) {
  return new Response('Hello World GET!');
}

export async function POST(
  req: Request,
) {
  const body = await req.json();
  console.log(body);
  return new Response('Hello World POST!');
}

export async function PUT(
  req: Request,
) {
  return new Response('Hello World PUT!');
}

export async function DELETE(
  req: Request,
) {
  return new Response('Hello World DELETE!');
}
