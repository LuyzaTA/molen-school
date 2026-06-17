import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { getAccount } from "@/lib/server/store";
import { kvGet, kvSet } from "@/lib/server/blobKV";

export const runtime = "nodejs";

export interface MolenCompanyInfo {
  // Empresa
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  regimeTributario: string;
  dataFundacao: string;
  objetoSocial: string;
  // Endereço
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  // Contato
  telefone: string;
  email: string;
  website: string;
  // Responsável legal
  responsavelNome: string;
  responsavelCpf: string;
  // Dados bancários
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: string;
  chavePix: string;
}

const STORAGE_KEY = "company/info";

async function guard() {
  const session = await getSession();
  if (!session) return null;
  const account = await getAccount(session.sub);
  if (!account?.isAdmin) return null;
  return account;
}

export async function GET() {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const info = await kvGet<MolenCompanyInfo>(STORAGE_KEY);
  return NextResponse.json({ info: info ?? null });
}

export async function PUT(req: NextRequest) {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Partial<MolenCompanyInfo>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.razaoSocial?.trim()) {
    return NextResponse.json({ error: "Razão Social é obrigatória." }, { status: 400 });
  }
  await kvSet(STORAGE_KEY, body);
  return NextResponse.json({ ok: true });
}
