"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WindmillMark } from "@/components/ui/WindmillMark";
import { CEFR_LEVELS } from "@/lib/cefr";
import type { CEFRLevel } from "@/lib/types";
import type { MolenCompanyInfo } from "@/app/api/admin/molen/route";

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SCRIPT = "'Snell Roundhand', 'Segoe Script', 'Brush Script MT', cursive";

const C = {
  parchment:  "#F5EDD0",
  parchment2: "#EDE0BA",
  gold:       "#BF9838",
  darkBorder: "#1C2218",
  green:      "#1E2A1E",
  greenMid:   "#3A5232",
  greenInk:   "#4A6840",
  maroon:     "#6E1822",
  ink:        "#252820",
};

type Pronoun = "her" | "his" | "their";
type Tab = "certificate" | "contract";

interface Design {
  logoSize:            number;
  topMargin:           number;
  titleSize:           number;
  titleMargin:         number;
  dividerTopMargin:    number;
  dividerBottomMargin: number;
  nameSize:            number;
  nameMargin:          number;
  bodySize:            number;
  bodyMargin:          number;
  congratsSize:        number;
  congratsMargin:      number;
  cefrSize:            number;
  teacherSigSize:      number;
}

const DEFAULTS: Design = {
  logoSize:           220,
  topMargin:           30,
  titleSize:         2.25,
  titleMargin:         22,
  dividerTopMargin:    20,
  dividerBottomMargin:  4,
  nameSize:          2.15,
  nameMargin:          15,
  bodySize:          0.92,
  bodyMargin:          28,
  congratsSize:      1.28,
  congratsMargin:      12,
  cefrSize:          1.15,
  teacherSigSize:     1.3,
};

interface ContractUser {
  userId: string;
  name: string;
  cpf: string;
  address: string;
  city: string;
  state: string;
}

interface ContractForm {
  studentName:    string;
  studentCpf:     string;
  studentDob:     string;
  studentAddress: string;
  studentContact: string;
  modalidade:     "Presencial" | "Online";
  local:          string;
  qtdAulas:       string;
  duracao:        string;
  diasHorarios:   string;
  valor:          string;
  formaPgto:      string;
  vencimento:     string;
  comarca:        string;
  cidade:         string;
  dataContrato:   string;
}

const EMPTY_CONTRACT: ContractForm = {
  studentName: "", studentCpf: "", studentDob: "", studentAddress: "", studentContact: "",
  modalidade: "Presencial", local: "", qtdAulas: "", duracao: "", diasHorarios: "",
  valor: "", formaPgto: "", vencimento: "",
  comarca: "", cidade: "", dataContrato: todayISO(),
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function prettyDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(+d)) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function brDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(+d)) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

const CACHE_KEY = "molen-cert-design-cache";

export default function AdminCertificatesPage() {
  const [tab, setTab] = useState<Tab>("certificate");

  // Certificate state
  const [name, setName]       = useState("");
  const [level, setLevel]     = useState<CEFRLevel>("A1");
  const [date, setDate]       = useState(todayISO());
  const [teacher, setTeacher] = useState("Luyza Alexandre");
  const [pronoun, setPronoun] = useState<Pronoun>("her");
  const [design, setDesign]   = useState<Design>(() => {
    try {
      const cached = typeof window !== "undefined" && localStorage.getItem(CACHE_KEY);
      return cached ? { ...DEFAULTS, ...JSON.parse(cached) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });
  const [logoImg,    setLogoImg]    = useState<string | null>(null);
  const [sealImg,    setSealImg]    = useState<string | null>(null);
  const [cefrImg,    setCefrImg]    = useState<string | null>(null);
  const [showLayout, setShowLayout] = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [saving,     setSaving]     = useState(false);

  // Contract state
  const [molenInfo,     setMolenInfo]     = useState<MolenCompanyInfo | null>(null);
  const [contractUsers, setContractUsers] = useState<ContractUser[]>([]);
  const [userSearch,    setUserSearch]    = useState("");
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [contractForm,  setContractForm]  = useState<ContractForm>(EMPTY_CONTRACT);
  const searchRef = useRef<HTMLDivElement>(null);

  function onImgUpload(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setter(reader.result as string);
      reader.readAsDataURL(file);
      e.target.value = "";
    };
  }

  const levelName = CEFR_LEVELS.find((l) => l.level === level)?.name ?? "";

  useEffect(() => {
    fetch("/api/admin/cert-design")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.design) {
          const merged = { ...DEFAULTS, ...data.design };
          setDesign(merged);
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(merged)); } catch {}
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (tab !== "contract") return;
    if (!molenInfo) {
      fetch("/api/admin/molen")
        .then((r) => r.json())
        .then((d) => { if (d.info) setMolenInfo(d.info); })
        .catch(() => {});
    }
    if (contractUsers.length === 0) {
      fetch("/api/admin/contract-users")
        .then((r) => r.json())
        .then((d) => { if (d.users) setContractUsers(d.users); })
        .catch(() => {});
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject print CSS into <head> so browsers reliably apply it
  useEffect(() => {
    const id = "molen-print-style";
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    if (tab === "certificate") {
      el.textContent = `
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body * { visibility: hidden !important; }
          #certificate, #certificate * { visibility: visible !important; }
          #certificate {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            aspect-ratio: unset !important;
            margin: 0 !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      `;
    } else {
      el.textContent = `
        @media print {
          @page { size: A4 portrait; margin: 1.5cm; }
          body * { visibility: hidden !important; }
          #contract-doc, #contract-doc * { visibility: visible !important; }
          #contract-doc {
            position: static !important;
            width: 100% !important;
            max-width: none !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      `;
    }
    return () => { document.getElementById(id)?.remove(); };
  }, [tab]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function saveConfig() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cert-design", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design }),
      });
      if (res.ok) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(design));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {}
    setSaving(false);
  }

  function setD<K extends keyof Design>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setDesign((d) => ({ ...d, [key]: Number(e.target.value) }));
  }

  function selectUser(u: ContractUser) {
    const addr = [u.address, u.city, u.state].filter(Boolean).join(", ");
    setContractForm((f) => ({ ...f, studentName: u.name, studentCpf: u.cpf, studentAddress: addr }));
    setUserSearch(u.name);
    setShowDropdown(false);
  }

  const setC = <K extends keyof ContractForm>(k: K, v: ContractForm[K]) =>
    setContractForm((f) => ({ ...f, [k]: v }));

  const filteredUsers = userSearch.length > 1
    ? contractUsers.filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase())).slice(0, 8)
    : [];

  const molenAddress = molenInfo
    ? [
        molenInfo.logradouro,
        molenInfo.numero,
        molenInfo.complemento,
        molenInfo.bairro,
        molenInfo.cidade,
        molenInfo.estado,
      ].filter(Boolean).join(", ")
    : "";

  return (
    <div className="mx-auto max-w-wide space-y-6">
        <header className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Administration</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Contracts and Certificates</h1>
          <p className="mt-2 text-[15px] text-ink-muted">
            Fill in the details then download as PDF.
          </p>
        </header>

        {/* Tab toggle */}
        <div className="flex rounded-lg border border-border w-fit overflow-hidden text-sm font-medium">
          {(["contract", "certificate"] as const).map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "px-5 py-2 transition-colors",
                i > 0 ? "border-l border-border" : "",
                tab === t ? "bg-accent text-white" : "bg-surface text-ink-muted hover:text-ink",
              ].join(" ")}
            >
              {t === "contract" ? "Contract" : "Certificate"}
            </button>
          ))}
        </div>

        {tab === "certificate" ? (
          <>
            {/* Content fields */}
            <Card className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-ink">Student name</span>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria Eduarda Silva" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">CEFR level</span>
                <select className="input-field" value={level} onChange={(e) => setLevel(e.target.value as CEFRLevel)}>
                  {CEFR_LEVELS.map((l) => (
                    <option key={l.level} value={l.level}>{l.level} &middot; {l.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Date</span>
                <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Teacher</span>
                <input className="input-field" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Pronoun</span>
                <select className="input-field" value={pronoun} onChange={(e) => setPronoun(e.target.value as Pronoun)}>
                  <option value="her">her</option>
                  <option value="his">his</option>
                  <option value="their">their</option>
                </select>
              </label>
              <div className="sm:col-span-2 space-y-2">
                <p className="text-sm font-semibold text-ink">Images (optional)</p>
                <div className="flex flex-wrap gap-6">
                  <ImgUpload label="School logo" value={logoImg} onChange={onImgUpload(setLogoImg)} onClear={() => setLogoImg(null)} />
                  <ImgUpload label="Seal / medallion" value={sealImg} onChange={onImgUpload(setSealImg)} onClear={() => setSealImg(null)} />
                  <ImgUpload label="CEFR badge" value={cefrImg} onChange={onImgUpload(setCefrImg)} onClear={() => setCefrImg(null)} />
                </div>
              </div>
              <div className="sm:col-span-2 flex flex-wrap gap-3 items-center">
                <Button onClick={() => window.print()} disabled={!name.trim()}>Download PDF</Button>
                <button
                  type="button"
                  onClick={() => setShowLayout((v) => !v)}
                  className="text-sm font-medium text-accent underline underline-offset-2"
                >
                  {showLayout ? "Hide layout editor" : "Edit layout & sizes"}
                </button>
                {showLayout && (
                  <>
                    <button
                      type="button"
                      onClick={saveConfig}
                      disabled={saving}
                      className="text-sm font-medium text-accent underline underline-offset-2 disabled:opacity-50"
                    >
                      {saved ? "Saved ✓" : saving ? "Saving…" : "Save configuration"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDesign(DEFAULTS)}
                      className="text-sm text-ink-muted underline underline-offset-2"
                    >
                      Reset to defaults
                    </button>
                  </>
                )}
              </div>
              <p className="sm:col-span-2 text-xs text-ink-subtle -mt-1">
                Opens the print dialog &mdash; choose &ldquo;Save as PDF&rdquo;, landscape, no margins.
              </p>
            </Card>

            {/* Layout editor */}
            {showLayout && (
              <Card className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Layout editor</p>
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  <p className="sm:col-span-2 text-xs font-semibold text-ink-muted uppercase tracking-wider">Font sizes</p>
                  <SliderRow label="Logo size" value={design.logoSize} min={36} max={300} step={2} unit="px" onChange={setD("logoSize")} />
                  <SliderRow label="Title" value={design.titleSize} min={1.4} max={3.5} step={0.05} unit="rem" onChange={setD("titleSize")} />
                  <SliderRow label="Student name" value={design.nameSize} min={1.6} max={4.5} step={0.05} unit="rem" onChange={setD("nameSize")} />
                  <SliderRow label="Body text" value={design.bodySize} min={0.6} max={1.3} step={0.02} unit="rem" onChange={setD("bodySize")} />
                  <SliderRow label="Congratulations" value={design.congratsSize} min={0.8} max={2} step={0.02} unit="rem" onChange={setD("congratsSize")} />
                  <SliderRow label="CEFR level (A1…)" value={design.cefrSize} min={0.9} max={2.5} step={0.05} unit="rem" onChange={setD("cefrSize")} />
                  <SliderRow label="Teacher signature" value={design.teacherSigSize} min={1} max={2.5} step={0.05} unit="rem" onChange={setD("teacherSigSize")} />
                  <p className="sm:col-span-2 text-xs font-semibold text-ink-muted uppercase tracking-wider pt-2">Spacing (px)</p>
                  <SliderRow label="Top margin (logo)" value={design.topMargin} min={4} max={80} step={1} unit="px" onChange={setD("topMargin")} />
                  <SliderRow label="Logo → Title" value={design.titleMargin} min={4} max={80} step={1} unit="px" onChange={setD("titleMargin")} />
                  <SliderRow label="Divider top" value={design.dividerTopMargin} min={4} max={60} step={1} unit="px" onChange={setD("dividerTopMargin")} />
                  <SliderRow label="Divider bottom" value={design.dividerBottomMargin} min={4} max={60} step={1} unit="px" onChange={setD("dividerBottomMargin")} />
                  <SliderRow label="Label → Name" value={design.nameMargin} min={4} max={60} step={1} unit="px" onChange={setD("nameMargin")} />
                  <SliderRow label="Name → Body" value={design.bodyMargin} min={4} max={60} step={1} unit="px" onChange={setD("bodyMargin")} />
                  <SliderRow label="Body → Congratulations" value={design.congratsMargin} min={4} max={60} step={1} unit="px" onChange={setD("congratsMargin")} />
                </div>
              </Card>
            )}

            {/* Live preview */}
            <div className="overflow-x-auto">
              <Certificate
                name={name}
                level={level}
                levelName={levelName}
                date={date}
                teacher={teacher}
                pronoun={pronoun}
                design={design}
                logoImg={logoImg}
                sealImg={sealImg}
                cefrImg={cefrImg}
              />
            </div>
          </>
        ) : (
          /* Contract tab */
          <>
            {/* Student search */}
            <Card className="space-y-3">
              <p className="text-sm font-semibold text-ink">Student</p>
              <div className="relative max-w-sm" ref={searchRef}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">Search student</span>
                  <input
                    className="input-field"
                    value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Type name to search…"
                    autoComplete="off"
                  />
                </label>
                {showDropdown && filteredUsers.length > 0 && (
                  <ul className="absolute z-50 top-full mt-1 w-full rounded-lg border border-border bg-surface shadow-lg overflow-hidden">
                    {filteredUsers.map((u) => (
                      <li key={u.userId}>
                        <button
                          type="button"
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-surface-alt transition-colors"
                          onMouseDown={() => selectUser(u)}
                        >
                          <span className="font-medium text-ink">{u.name}</span>
                          <span className="ml-2 text-xs text-ink-muted">{u.cpf}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>

            {/* Contract fields */}
            <Card className="grid gap-4 sm:grid-cols-2">
              <p className="sm:col-span-2 text-xs font-semibold uppercase tracking-wider text-accent">Contratante / Aluno(a)</p>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-ink">Nome</span>
                <input className="input-field" value={contractForm.studentName} onChange={(e) => setC("studentName", e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">CPF</span>
                <input className="input-field" value={contractForm.studentCpf} onChange={(e) => setC("studentCpf", e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Data de nascimento</span>
                <input type="date" className="input-field" value={contractForm.studentDob} onChange={(e) => setC("studentDob", e.target.value)} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-ink">Endere&ccedil;o</span>
                <input className="input-field" value={contractForm.studentAddress} onChange={(e) => setC("studentAddress", e.target.value)} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-ink">Telefone / E-mail</span>
                <input className="input-field" value={contractForm.studentContact} onChange={(e) => setC("studentContact", e.target.value)} placeholder="(11) 9 0000-0000 / aluno@email.com" />
              </label>

              <p className="sm:col-span-2 text-xs font-semibold uppercase tracking-wider text-accent pt-2">Cl&aacute;usula 2 &mdash; Aulas</p>
              <div className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-ink">Modalidade</span>
                <div className="flex gap-5">
                  {(["Presencial", "Online"] as const).map((m) => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="modalidade" value={m} checked={contractForm.modalidade === m} onChange={() => setC("modalidade", m)} className="accent-accent" />
                      <span className="text-sm text-ink">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-ink">Local / plataforma</span>
                <input className="input-field" value={contractForm.local} onChange={(e) => setC("local", e.target.value)} placeholder="Google Meet, Zoom, endere&ccedil;o f&iacute;sico&hellip;" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Quantidade de aulas</span>
                <input className="input-field" value={contractForm.qtdAulas} onChange={(e) => setC("qtdAulas", e.target.value)} placeholder="8 aulas/m&ecirc;s" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Dura&ccedil;&atilde;o</span>
                <input className="input-field" value={contractForm.duracao} onChange={(e) => setC("duracao", e.target.value)} placeholder="60 minutos" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-ink">Dias e hor&aacute;rios</span>
                <input className="input-field" value={contractForm.diasHorarios} onChange={(e) => setC("diasHorarios", e.target.value)} placeholder="Ter&ccedil;as e quintas, 19h&ndash;20h" />
              </label>

              <p className="sm:col-span-2 text-xs font-semibold uppercase tracking-wider text-accent pt-2">Cl&aacute;usula 3 &mdash; Valor e Pagamento</p>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Valor (R$)</span>
                <input className="input-field" value={contractForm.valor} onChange={(e) => setC("valor", e.target.value)} placeholder="300,00" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Forma de pagamento</span>
                <input className="input-field" value={contractForm.formaPgto} onChange={(e) => setC("formaPgto", e.target.value)} placeholder="PIX, transfer&ecirc;ncia, boleto&hellip;" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-ink">Vencimento</span>
                <input className="input-field" value={contractForm.vencimento} onChange={(e) => setC("vencimento", e.target.value)} placeholder="Todo dia 5" />
              </label>

              <p className="sm:col-span-2 text-xs font-semibold uppercase tracking-wider text-accent pt-2">Cl&aacute;usula 8 &mdash; Foro e Assinatura</p>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Comarca</span>
                <input className="input-field" value={contractForm.comarca} onChange={(e) => setC("comarca", e.target.value)} placeholder="S&atilde;o Paulo" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Cidade</span>
                <input className="input-field" value={contractForm.cidade} onChange={(e) => setC("cidade", e.target.value)} placeholder="S&atilde;o Paulo" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Data</span>
                <input type="date" className="input-field" value={contractForm.dataContrato} onChange={(e) => setC("dataContrato", e.target.value)} />
              </label>

              <div className="sm:col-span-2 flex gap-3 pt-2">
                <Button onClick={() => window.print()} disabled={!contractForm.studentName.trim()}>
                  Download PDF
                </Button>
              </div>
              <p className="sm:col-span-2 text-xs text-ink-subtle -mt-1">
                Opens the print dialog &mdash; choose &ldquo;Save as PDF&rdquo;, portrait, margins: Normal (1.5 cm).
              </p>
            </Card>

            {/* Contract preview */}
            <ContractDoc form={contractForm} molenInfo={molenInfo} molenAddress={molenAddress} />
          </>
        )}
      </div>
  );
}

// ── Slider row ────────────────────────────────────────────────────────────────
function SliderRow({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number;
  step: number; unit: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-sm tabular-nums text-ink-muted">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} className="w-full accent-accent" />
    </label>
  );
}

// ── Certificate component ─────────────────────────────────────────────────────
interface CertProps {
  name: string; level: string; levelName: string;
  date: string; teacher: string; pronoun: Pronoun;
  design: Design;
  logoImg: string | null;
  sealImg: string | null;
  cefrImg: string | null;
}

function Certificate({ name, level, levelName, date, teacher, pronoun, design: d, logoImg, sealImg, cefrImg }: CertProps) {
  return (
    <div
      id="certificate"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        aspectRatio: "1.414 / 1",
        background: `linear-gradient(150deg, ${C.parchment} 0%, ${C.parchment2} 55%, ${C.parchment} 100%)`,
        color: C.ink,
        fontFamily: SERIF,
        boxSizing: "border-box",
        border: `10px solid ${C.darkBorder}`,
      }}
    >
      <div style={{ position: "absolute", inset: "2%", border: `4px solid ${C.gold}` }} />
      <div style={{ position: "absolute", inset: "4%", border: `1.5px solid ${C.green}` }} />
      <Flourishes />
      <div style={{ position: "absolute", inset: "5.5%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", overflow: "hidden" }}>
        <div style={{ marginTop: d.topMargin }}>
          {logoImg
            ? <img src={logoImg} alt="Logo" style={{ height: d.logoSize, width: "auto", objectFit: "contain" }} />
            : /* eslint-disable-next-line @next/next/no-img-element */
              <img src="/molen-brand.png" alt="Molen English Classes" style={{ height: d.logoSize, width: "auto", mixBlendMode: "multiply" }} />
          }
        </div>
        <h2 style={{ fontFamily: SERIF, fontWeight: 700, color: C.maroon, fontSize: `${d.titleSize}rem`, margin: `${d.titleMargin}px 0 0` }}>
          Certificate of Achievement
        </h2>
        <Divider topMargin={d.dividerTopMargin} bottomMargin={d.dividerBottomMargin} />
        <p style={{ letterSpacing: "0.22em", fontSize: "0.7rem", color: C.ink, margin: 0, fontWeight: 500 }}>
          THIS CERTIFICATE IS PROUDLY PRESENTED TO
        </p>
        <div style={{ fontFamily: SCRIPT, fontSize: `${d.nameSize}rem`, color: C.green, lineHeight: 1.15, marginTop: d.nameMargin, padding: "0 32px 6px", borderBottom: `1px solid ${C.gold}`, minWidth: "55%" }}>
          {name.trim() || "Student Name"}
        </div>
        <p style={{ maxWidth: "72%", fontSize: `${d.bodySize}rem`, color: C.ink, margin: `${d.bodyMargin}px 0 0`, lineHeight: 1.6 }}>
          for {pronoun} outstanding dedication, active participation and excellent performance in English studies.
        </p>
        <p style={{ fontFamily: SCRIPT, fontSize: `${d.congratsSize}rem`, color: C.greenInk, margin: `${d.congratsMargin}px 0 0` }}>
          Congratulations on your achievement!
        </p>
        <div style={{ marginTop: "auto", width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center", minWidth: "28%" }}>
            <DashLabel>CEFR LEVEL</DashLabel>
            {cefrImg
              ? <img src={cefrImg} alt="CEFR" style={{ height: d.cefrSize * 28, maxWidth: 80, objectFit: "contain", margin: "3px auto", display: "block" }} />
              : <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: `${d.cefrSize}rem`, color: C.greenInk, lineHeight: 1, margin: "3px 0" }}>{level}</div>
            }
            <div style={{ borderBottom: `1px solid ${C.gold}`, paddingBottom: 5, marginBottom: 6 }}>
              <DashLabel>{levelName.toUpperCase()}</DashLabel>
            </div>
            <div style={{ fontFamily: SCRIPT, fontSize: "0.95rem", color: C.ink }}>{prettyDate(date)}</div>
            <div style={{ letterSpacing: "0.2em", fontSize: "0.62rem", color: C.ink, borderTop: `1px solid ${C.gold}`, paddingTop: 4, marginTop: 3, fontWeight: 500 }}>DATE</div>
          </div>
          {sealImg
            ? <img src={sealImg} alt="Seal" style={{ width: 100, height: 120, objectFit: "contain", flexShrink: 0 }} />
            : <Seal />
          }
          <div style={{ textAlign: "center", minWidth: "28%" }}>
            <div style={{ fontFamily: SCRIPT, fontSize: `${d.teacherSigSize}rem`, color: C.ink, lineHeight: 1.2 }}>{teacher || " "}</div>
            <div style={{ borderTop: `1px solid ${C.gold}`, marginTop: 8, paddingTop: 6, letterSpacing: "0.2em", fontSize: "0.62rem", color: C.ink, fontWeight: 600 }}>TEACHER</div>
            <div style={{ fontSize: "0.82rem", color: C.ink, marginTop: 3 }}>{teacher}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Contract document ─────────────────────────────────────────────────────────
function Blank({ value, minWidth = 160 }: { value: string; minWidth?: number }) {
  return (
    <span style={{ display: "inline-block", minWidth, borderBottom: `1px solid ${C.gold}`, paddingBottom: 1, verticalAlign: "bottom" }}>
      {value || " "}
    </span>
  );
}

interface ContractDocProps {
  form: ContractForm;
  molenInfo: MolenCompanyInfo | null;
  molenAddress: string;
}

function ContractDoc({ form, molenInfo, molenAddress }: ContractDocProps) {
  const sh: React.CSSProperties = { fontWeight: 700, fontSize: 13, marginTop: 20, marginBottom: 2, color: C.ink };
  const ch: React.CSSProperties = { fontWeight: 700, fontSize: 13, marginTop: 18, marginBottom: 3, color: C.ink };
  const p: React.CSSProperties  = { margin: "2px 0", color: C.ink };

  return (
    <div
      id="contract-doc"
      style={{
        position: "relative",
        maxWidth: 740,
        margin: "0 auto",
        background: `linear-gradient(150deg, ${C.parchment} 0%, ${C.parchment2} 55%, ${C.parchment} 100%)`,
        border: `10px solid ${C.darkBorder}`,
        WebkitPrintColorAdjust: "exact",
      }}
    >
      {/* Gold inner border */}
      <div style={{ position: "absolute", inset: 13, border: `4px solid ${C.gold}`, pointerEvents: "none" }} />
      {/* Green inner border */}
      <div style={{ position: "absolute", inset: 27, border: `1.5px solid ${C.green}`, pointerEvents: "none" }} />
      {/* Corner flourishes */}
      <ContractCorner pos="tl" />
      <ContractCorner pos="tr" />
      <ContractCorner pos="bl" />
      <ContractCorner pos="br" />

      {/* Content */}
      <div style={{ position: "relative", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13, lineHeight: "1.75", color: C.ink, padding: "44px 60px 52px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/molen-brand.png"
              alt="Molen English Classes"
              style={{ height: 220, width: "auto", mixBlendMode: "multiply" }}
            />
          </div>
          <div style={{ marginTop: 14, fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.6, color: C.ink }}>
            Contrato de Presta&ccedil;&atilde;o de Servi&ccedil;os Educacionais
            <br />
            Aulas de Ingl&ecirc;s
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginTop: 14 }}>
            <span style={{ width: 80, height: 1.5, background: C.gold, display: "inline-block" }} />
            <svg width="18" height="11" viewBox="0 0 22 14" aria-hidden>
              <circle cx="11" cy="7" r="3.5" fill={C.gold} />
              <circle cx="3.5" cy="7" r="2" fill={C.gold} />
              <circle cx="18.5" cy="7" r="2" fill={C.gold} />
              <line x1="5.5" y1="7" x2="7.5" y2="7" stroke={C.gold} strokeWidth="1" />
              <line x1="14.5" y1="7" x2="16.5" y2="7" stroke={C.gold} strokeWidth="1" />
            </svg>
            <span style={{ width: 80, height: 1.5, background: C.gold, display: "inline-block" }} />
          </div>
        </div>

        <p style={p}>Pelo presente instrumento particular, de um lado:</p>

        <p style={sh}>CONTRATADA: <Blank value={molenInfo?.razaoSocial ?? molenInfo?.nomeFantasia ?? ""} minWidth={220} /></p>
        <p style={p}>Microempresa inscrita no CNPJ n&ordm; <Blank value={molenInfo?.cnpj ?? ""} minWidth={190} /></p>
        <p style={p}>Endere&ccedil;o: <Blank value={molenAddress} minWidth={240} /></p>
        <p style={p}>Representante: <Blank value={molenInfo?.responsavelNome ?? ""} minWidth={200} /></p>

        <p style={{ ...sh, marginTop: 18 }}>CONTRATANTE / ALUNO(A) OU RESPONS&Aacute;VEL LEGAL:</p>
        <p style={p}>Nome: <Blank value={form.studentName} minWidth={220} /></p>
        <p style={p}>CPF: <Blank value={form.studentCpf} minWidth={150} /></p>
        <p style={p}>Data de nascimento: <Blank value={brDate(form.studentDob)} minWidth={130} /></p>
        <p style={p}>Endere&ccedil;o: <Blank value={form.studentAddress} minWidth={240} /></p>
        <p style={p}>Telefone/E-mail: <Blank value={form.studentContact} minWidth={210} /></p>

        <p style={ch}>CL&Aacute;USULA 1&ordf; &ndash; DO OBJETO</p>
        <p style={p}>O presente contrato tem como objeto a presta&ccedil;&atilde;o de servi&ccedil;os de ensino de l&iacute;ngua inglesa, incluindo aulas, acompanhamento pedag&oacute;gico, materiais e atividades relacionadas ao aprendizado do idioma.</p>

        <p style={ch}>CL&Aacute;USULA 2&ordf; &ndash; DAS AULAS</p>
        <p style={p}>
          Modalidade:{" "}
          ({form.modalidade === "Presencial" ? "X" : " "}) Presencial
          {"   "}
          ({form.modalidade === "Online" ? "X" : " "}) Online
        </p>
        <p style={p}>Local/plataforma: <Blank value={form.local} minWidth={210} /></p>
        <p style={p}>Quantidade de aulas: <Blank value={form.qtdAulas} minWidth={170} /></p>
        <p style={p}>Dura&ccedil;&atilde;o: <Blank value={form.duracao} minWidth={170} /></p>
        <p style={p}>Dias e hor&aacute;rios: <Blank value={form.diasHorarios} minWidth={190} /></p>

        <p style={ch}>CL&Aacute;USULA 3&ordf; &ndash; DO VALOR E PAGAMENTO</p>
        <p style={p}>Valor: R$ <Blank value={form.valor} minWidth={130} /></p>
        <p style={p}>Forma de pagamento: <Blank value={form.formaPgto} minWidth={190} /></p>
        <p style={p}>Vencimento: <Blank value={form.vencimento} minWidth={170} /></p>

        <p style={ch}>CL&Aacute;USULA 4&ordf; &ndash; CANCELAMENTO E REMARCA&Ccedil;&Atilde;O</p>
        <p style={p}>Cancelamentos ou solicita&ccedil;&otilde;es de remarca&ccedil;&atilde;o dever&atilde;o respeitar o prazo informado pela CONTRATADA. Aus&ecirc;ncias sem aviso pr&eacute;vio poder&atilde;o resultar na perda da aula.</p>

        <p style={ch}>CL&Aacute;USULA 5&ordf; &ndash; MATERIAIS DID&Aacute;TICOS</p>
        <p style={p}>Os materiais fornecidos destinam-se exclusivamente ao aluno contratado, sendo proibida sua reprodu&ccedil;&atilde;o ou distribui&ccedil;&atilde;o sem autoriza&ccedil;&atilde;o.</p>

        <p style={ch}>CL&Aacute;USULA 6&ordf; &ndash; PROTE&Ccedil;&Atilde;O DE DADOS</p>
        <p style={p}>As partes comprometem-se a tratar dados pessoais conforme a Lei Geral de Prote&ccedil;&atilde;o de Dados (LGPD), utilizando-os exclusivamente para fins relacionados ao servi&ccedil;o contratado.</p>

        <p style={ch}>CL&Aacute;USULA 7&ordf; &ndash; RESCIS&Atilde;O</p>
        <p style={p}>O contrato poder&aacute; ser encerrado mediante comunica&ccedil;&atilde;o entre as partes, observadas obriga&ccedil;&otilde;es financeiras pendentes.</p>

        <p style={ch}>CL&Aacute;USULA 8&ordf; &ndash; FORO</p>
        <p style={p}>Fica eleito o foro da comarca de <Blank value={form.comarca} minWidth={190} /> para quest&otilde;es decorrentes deste contrato.</p>
        <div style={{ marginTop: 10 }}>
          <p style={p}>Cidade: <Blank value={form.cidade} minWidth={190} /></p>
          <p style={p}>Data: <Blank value={brDate(form.dataContrato)} minWidth={110} /></p>
        </div>

        {/* Signatures */}
        <div style={{ marginTop: 52, display: "flex", justifyContent: "space-between", gap: 40 }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ borderTop: `1px solid ${C.gold}`, paddingTop: 10, fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: C.ink }}>
              CONTRATADA
            </div>
            {molenInfo?.responsavelNome && (
              <div style={{ marginTop: 4, fontSize: 12, color: C.greenInk }}>{molenInfo.responsavelNome}</div>
            )}
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ borderTop: `1px solid ${C.gold}`, paddingTop: 10, fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: C.ink }}>
              CONTRATANTE
            </div>
            {form.studentName && (
              <div style={{ marginTop: 4, fontSize: 12, color: C.greenInk }}>{form.studentName}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContractCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base: React.CSSProperties = { position: "absolute", width: 80, height: 80, zIndex: 2 };
  const place: React.CSSProperties =
    pos === "tl" ? { top: 10, left: 10 }
    : pos === "tr" ? { top: 10, right: 10, transform: "scaleX(-1)" }
    : pos === "bl" ? { bottom: 10, left: 10, transform: "scaleY(-1)" }
    : { bottom: 10, right: 10, transform: "scale(-1,-1)" };
  const g = C.gold;
  return (
    <svg viewBox="0 0 90 90" fill="none" style={{ ...base, ...place }} aria-hidden>
      <path d="M 6 82 C 6 40 40 6 82 6" stroke={g} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 14 82 C 14 50 50 14 82 14" stroke={g} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 82 6 C 75 3 67 9 70 18 C 72 24 81 21 79 15 C 78 10 73 11 74 16 C 74 19 77 20 78 18" stroke={g} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 6 82 C 3 75 9 67 18 70 C 24 72 21 81 15 79 C 10 78 11 73 16 74 C 19 74 20 77 18 78" stroke={g} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 26 66 C 38 54 54 38 66 26" stroke={g} strokeWidth="0.9" fill="none" opacity="0.5" />
      <circle cx="22" cy="22" r="3" fill={g} />
      <circle cx="82" cy="6" r="3.5" fill={g} />
      <circle cx="6" cy="82" r="3.5" fill={g} />
    </svg>
  );
}

// ── Certificate sub-components ────────────────────────────────────────────────
function DashLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
      <span style={{ height: 1, width: 18, background: C.gold, display: "inline-block" }} />
      <span style={{ letterSpacing: "0.15em", fontSize: "0.6rem", color: C.green, fontWeight: 700 }}>{children}</span>
      <span style={{ height: 1, width: 18, background: C.gold, display: "inline-block" }} />
    </div>
  );
}

function Divider({ topMargin, bottomMargin }: { topMargin: number; bottomMargin: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: `${topMargin}px 0 ${bottomMargin}px` }}>
      <span style={{ width: 90, height: 1.5, background: C.gold, display: "inline-block" }} />
      <svg width="20" height="12" viewBox="0 0 22 14" aria-hidden>
        <circle cx="11" cy="7" r="3.5" fill={C.gold} />
        <circle cx="3.5" cy="7" r="2" fill={C.gold} />
        <circle cx="18.5" cy="7" r="2" fill={C.gold} />
        <line x1="5.5" y1="7" x2="7.5" y2="7" stroke={C.gold} strokeWidth="1" />
        <line x1="14.5" y1="7" x2="16.5" y2="7" stroke={C.gold} strokeWidth="1" />
      </svg>
      <span style={{ width: 90, height: 1.5, background: C.gold, display: "inline-block" }} />
    </div>
  );
}

function Flourishes() {
  return (<><Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" /></>);
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base: React.CSSProperties = { position: "absolute", width: 90, height: 90 };
  const place: React.CSSProperties =
    pos === "tl" ? { top: "2.8%", left: "3.2%" }
    : pos === "tr" ? { top: "2.8%", right: "3.2%", transform: "scaleX(-1)" }
    : pos === "bl" ? { bottom: "2.8%", left: "3.2%", transform: "scaleY(-1)" }
    : { bottom: "2.8%", right: "3.2%", transform: "scale(-1,-1)" };
  const g = C.gold;
  return (
    <svg viewBox="0 0 90 90" fill="none" style={{ ...base, ...place }} aria-hidden>
      <path d="M 6 82 C 6 40 40 6 82 6" stroke={g} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 14 82 C 14 50 50 14 82 14" stroke={g} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 82 6 C 75 3 67 9 70 18 C 72 24 81 21 79 15 C 78 10 73 11 74 16 C 74 19 77 20 78 18" stroke={g} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 6 82 C 3 75 9 67 18 70 C 24 72 21 81 15 79 C 10 78 11 73 16 74 C 19 74 20 77 18 78" stroke={g} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 26 66 C 38 54 54 38 66 26" stroke={g} strokeWidth="0.9" fill="none" opacity="0.5" />
      <circle cx="22" cy="22" r="3" fill={g} />
      <circle cx="82" cy="6" r="3.5" fill={g} />
      <circle cx="6" cy="82" r="3.5" fill={g} />
    </svg>
  );
}

function ImgUpload({ label, value, onChange, onClear }: {
  label: string;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      {value ? (
        <div className="flex items-center gap-2">
          <img src={value} alt={label} className="h-10 max-w-[90px] object-contain rounded border border-border" />
          <button type="button" onClick={onClear} className="text-xs text-ink-muted underline hover:text-ink">Remove</button>
        </div>
      ) : (
        <label className="cursor-pointer inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M7 1v8M4 4l3-3 3 3M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Upload
          <input type="file" accept="image/*" className="sr-only" onChange={onChange} />
        </label>
      )}
    </div>
  );
}

function Seal() {
  const cx = 70, cy = 66;
  const GOLD = "#C8A020";
  const DG   = "#182816";
  const MG   = "#263828";
  const scR = 52, scr = 7, numSc = 20;
  const grR = 45;
  const wR  = 33, nLv = 10;
  const mkLeaves = (startDeg: number, endDeg: number) =>
    Array.from({ length: nLv }).map((_, i) => {
      const deg = startDeg + (i / (nLv - 1)) * (endDeg - startDeg);
      const rad = deg * Math.PI / 180;
      return { x: cx + Math.cos(rad) * wR, y: cy + Math.sin(rad) * wR, rot: deg + 90 };
    });
  const leftLeaves  = mkLeaves(95, 235);
  const rightLeaves = mkLeaves(85, -55);
  return (
    <svg width="100" height="120" viewBox="0 0 140 168" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M 48 114 L 70 114 L 70 162 L 57 145 L 44 162 Z" fill={DG}/>
      <path d="M 70 114 L 92 114 L 96 162 L 83 145 L 70 162 Z" fill={MG}/>
      {Array.from({ length: numSc }).map((_, i) => {
        const a = (i / numSc) * Math.PI * 2 - Math.PI / 2;
        return <circle key={i} cx={cx + Math.cos(a) * scR} cy={cy + Math.sin(a) * scR} r={scr} fill={GOLD}/>;
      })}
      <circle cx={cx} cy={cy} r={scR} fill={GOLD}/>
      <circle cx={cx} cy={cy} r={grR} fill={DG}/>
      <circle cx={cx} cy={cy} r={grR} fill="none" stroke={GOLD} strokeWidth="2.5"/>
      {leftLeaves.map((lf, i) => (
        <ellipse key={`l${i}`} cx={lf.x} cy={lf.y} rx="2.8" ry="7.5" fill={GOLD} transform={`rotate(${lf.rot},${lf.x},${lf.y})`} />
      ))}
      {rightLeaves.map((lf, i) => (
        <ellipse key={`r${i}`} cx={lf.x} cy={lf.y} rx="2.8" ry="7.5" fill={GOLD} transform={`rotate(${lf.rot},${lf.x},${lf.y})`} />
      ))}
      <polygon points={`${cx},${cy-24} ${cx+21},${cy-14} ${cx},${cy-4} ${cx-21},${cy-14}`} fill={GOLD}/>
      <path d={`M ${cx-17} ${cy-14} Q ${cx-17} ${cy-4} ${cx} ${cy-2} Q ${cx+17} ${cy-4} ${cx+17} ${cy-14}`} fill={GOLD}/>
      <circle cx={cx} cy={cy-24} r="2.2" fill={GOLD}/>
      <line x1={cx+21} y1={cy-14} x2={cx+21} y2={cy-5} stroke={GOLD} strokeWidth="2.2" strokeLinecap="round"/>
      <line x1={cx+21} y1={cy-5}  x2={cx+26} y2={cy+5}  stroke={GOLD} strokeWidth="2"   strokeLinecap="round"/>
      <circle cx={cx+26} cy={cy+7} r="2.5" fill={GOLD}/>
    </svg>
  );
}
