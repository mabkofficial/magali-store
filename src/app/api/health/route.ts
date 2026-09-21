import { NextResponse } from "next/server";
import {
  getProductionEnvChecks,
  isProductionReady,
} from "@/lib/production-readiness";

export async function GET() {
  const checks = getProductionEnvChecks();

  return NextResponse.json({
    ok: isProductionReady(),
    checks: checks.map(({ id, label, ok, hint }) => ({ id, label, ok, hint })),
  });
}
