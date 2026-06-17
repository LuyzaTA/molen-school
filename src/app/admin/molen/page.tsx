"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { MolenCompanyInfo } from "@/app/api/admin/molen/route";

// ── Formatters ────────────────────────────────────────────────────────────────
function fCNPJ(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}
function fCEP(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}
function fPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
function fCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const BR_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO",
  "MA","MT","MS","MG","PA","PB","PR","PE","PI",
  "RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const REGIMES = [
  "Simples Nacional",
  "MEI — Microempreendedor Individual",
  "Lucro Presumido",
  "Lucro Real",
];

const EMPTY: MolenCompanyInfo = {
  razaoSocial: "", nomeFantasia: "", cnpj: "", inscricaoEstadual: "Isento",
  inscricaoMunicipal: "", regimeTributario: "Simples Nacional",
  dataFundacao: "", objetoSocial: "",
  logradouro: "", numero: "", complemento: "", bairro: "",
  cidade: "", estado: "SP", cep: "",
  telefone: "", email: "", website: "",
  responsavelNome: "", responsavelCpf: "",
  banco: "", agencia: "", conta: "", tipoConta: "Corrente", chavePix: "",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminMolenPage() {
  const [form, setForm] = useState<MolenCompanyInfo>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/molen", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (d.info) setForm((f) => ({ ...f, ...d.info })); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof MolenCompanyInfo>(k: K, v: MolenCompanyInfo[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSave() {
    setBusy(true);
    setStatus("idle");
    setError(null);
    try {
      const res = await fetch("/api/admin/molen", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error ?? "Erro ao salvar."); setStatus("error"); }
      else setStatus("saved");
    } catch {
      setError("Erro de rede. Tente novamente.");
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="py-12 text-center text-ink-muted animate-pulse">Carregando…</p>;
  }

  return (
    <div className="mx-auto max-w-content space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Molen — Dados da Empresa</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Informações da microempresa. Serão usadas na geração de contratos e documentos oficiais.
        </p>
      </div>

      {/* ── Empresa ── */}
      <Section title="Empresa" icon="🏢">
        <Grid>
          <Field label="Razão Social *" span={2}>
            <input className="input-field" value={form.razaoSocial} onChange={(e) => set("razaoSocial", e.target.value)} placeholder="Molen English Classes ME" />
          </Field>
          <Field label="Nome Fantasia" span={2}>
            <input className="input-field" value={form.nomeFantasia} onChange={(e) => set("nomeFantasia", e.target.value)} placeholder="Molen English Classes" />
          </Field>
          <Field label="CNPJ">
            <input className="input-field" inputMode="numeric" placeholder="00.000.000/0001-00"
              value={form.cnpj} onChange={(e) => set("cnpj", fCNPJ(e.target.value))} />
          </Field>
          <Field label="Regime Tributário">
            <select className="input-field" value={form.regimeTributario} onChange={(e) => set("regimeTributario", e.target.value)}>
              {REGIMES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Inscrição Estadual">
            <input className="input-field" value={form.inscricaoEstadual} onChange={(e) => set("inscricaoEstadual", e.target.value)} placeholder="Isento" />
          </Field>
          <Field label="Inscrição Municipal">
            <input className="input-field" value={form.inscricaoMunicipal} onChange={(e) => set("inscricaoMunicipal", e.target.value)} />
          </Field>
          <Field label="Data de Fundação">
            <input className="input-field" type="date" value={form.dataFundacao} onChange={(e) => set("dataFundacao", e.target.value)} />
          </Field>
          <Field label="Objeto Social" span={2}>
            <textarea className="input-field resize-none" rows={3}
              placeholder="Prestação de serviços de ensino de língua inglesa…"
              value={form.objetoSocial} onChange={(e) => set("objetoSocial", e.target.value)} />
          </Field>
        </Grid>
      </Section>

      {/* ── Endereço ── */}
      <Section title="Endereço" icon="📍">
        <Grid>
          <Field label="Logradouro" span={2}>
            <input className="input-field" value={form.logradouro} onChange={(e) => set("logradouro", e.target.value)} placeholder="Rua / Avenida" />
          </Field>
          <Field label="Número">
            <input className="input-field" value={form.numero} onChange={(e) => set("numero", e.target.value)} placeholder="123" />
          </Field>
          <Field label="Complemento">
            <input className="input-field" value={form.complemento} onChange={(e) => set("complemento", e.target.value)} placeholder="Apto / Sala" />
          </Field>
          <Field label="Bairro">
            <input className="input-field" value={form.bairro} onChange={(e) => set("bairro", e.target.value)} />
          </Field>
          <Field label="CEP">
            <input className="input-field" inputMode="numeric" placeholder="00000-000"
              value={form.cep} onChange={(e) => set("cep", fCEP(e.target.value))} />
          </Field>
          <Field label="Cidade">
            <input className="input-field" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
          </Field>
          <Field label="Estado">
            <select className="input-field" value={form.estado} onChange={(e) => set("estado", e.target.value)}>
              {BR_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </Grid>
      </Section>

      {/* ── Contato ── */}
      <Section title="Contato" icon="📞">
        <Grid>
          <Field label="Telefone">
            <input className="input-field" inputMode="numeric" placeholder="(11) 9 0000-0000"
              value={form.telefone} onChange={(e) => set("telefone", fPhone(e.target.value))} />
          </Field>
          <Field label="E-mail">
            <input className="input-field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="contato@molen.com.br" />
          </Field>
          <Field label="Website" span={2}>
            <input className="input-field" type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://molen-school.vercel.app" />
          </Field>
        </Grid>
      </Section>

      {/* ── Responsável Legal ── */}
      <Section title="Responsável Legal" icon="👤">
        <Grid>
          <Field label="Nome completo" span={2}>
            <input className="input-field" value={form.responsavelNome} onChange={(e) => set("responsavelNome", e.target.value)} placeholder="Nome do sócio-administrador" />
          </Field>
          <Field label="CPF">
            <input className="input-field" inputMode="numeric" placeholder="000.000.000-00"
              value={form.responsavelCpf} onChange={(e) => set("responsavelCpf", fCPF(e.target.value))} />
          </Field>
        </Grid>
      </Section>

      {/* ── Dados Bancários ── */}
      <Section title="Dados Bancários" icon="🏦">
        <Grid>
          <Field label="Banco" span={2}>
            <input className="input-field" value={form.banco} onChange={(e) => set("banco", e.target.value)} placeholder="Ex: Nubank, Itaú, Bradesco…" />
          </Field>
          <Field label="Agência">
            <input className="input-field" value={form.agencia} onChange={(e) => set("agencia", e.target.value)} placeholder="0000" />
          </Field>
          <Field label="Conta">
            <input className="input-field" value={form.conta} onChange={(e) => set("conta", e.target.value)} placeholder="00000-0" />
          </Field>
          <Field label="Tipo de Conta">
            <select className="input-field" value={form.tipoConta} onChange={(e) => set("tipoConta", e.target.value)}>
              <option>Corrente</option>
              <option>Poupança</option>
              <option>Pagamento</option>
            </select>
          </Field>
          <Field label="Chave PIX">
            <input className="input-field" value={form.chavePix} onChange={(e) => set("chavePix", e.target.value)} placeholder="CPF, e-mail, telefone ou chave aleatória" />
          </Field>
        </Grid>
      </Section>

      {/* ── Actions ── */}
      {error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}
      {status === "saved" && (
        <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">✓ Dados salvos com sucesso.</p>
      )}

      <div className="flex justify-end pb-10">
        <Button size="lg" disabled={busy} onClick={onSave}>
          {busy ? "Salvando…" : "Salvar dados"}
        </Button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <Card className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
        <span aria-hidden>{icon}</span> {title}
      </h2>
      {children}
    </Card>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, span, children }: { label: string; span?: number; children: React.ReactNode }) {
  return (
    <label className={span === 2 ? "sm:col-span-2 block" : "block"}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
