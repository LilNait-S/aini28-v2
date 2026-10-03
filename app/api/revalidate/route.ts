import { NextResponse } from "next/server";
export function POST() {
  return NextResponse.json(
    {
      message:
        "Este webhook fue retirado. El catálogo se consulta directamente desde Plush.",
    },
    { status: 410 },
  );
}
