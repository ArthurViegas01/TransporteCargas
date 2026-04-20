import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Truck, BarChart3, MapPin, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { CIDADES, getDistancia } from '../../data/distancias';
import { CAMINHOES_CONFIG } from '../../types';

type TipoCaminhao = 'pequeno' | 'medio' | 'grande';

interface ResultadoBusca {
  ok: boolean;
  distancia?: number;
  custo?: number;
  tipoCaminhaoLabel?: string;
  mensagem?: string;
}

const features = [
  {
    icon: Truck,
    title: 'Cálculo inteligente de frota',
    desc: 'Algoritmo que determina automaticamente a quantidade ideal de caminhões para cada carga.',
  },
  {
    icon: MapPin,
    title: '24 capitais brasileiras',
    desc: 'Cobertura completa com dados rodoviários reais do DNIT para todas as capitais do Brasil.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard analítico',
    desc: 'Visualize custos, rotas e estatísticas dos seus transportes com gráficos interativos.',
  },
];

export default function Home() {
  const [cidade1, setCidade1] = useState('');
  const [cidade2, setCidade2] = useState('');
  const [tipoCaminhao, setTipoCaminhao] = useState<TipoCaminhao>('pequeno');
  const [resultado, setResultado] = useState<ResultadoBusca | null>(null);
  const [search, setSearch] = useState('');

  function consultar() {
    if (!cidade1 || !cidade2) {
      setResultado({ ok: false, mensagem: 'Selecione as duas cidades.' });
      return;
    }
    if (cidade1 === cidade2) {
      setResultado({ ok: false, mensagem: 'Selecione cidades diferentes.' });
      return;
    }
    const dist = getDistancia(cidade1, cidade2);
    if (dist === null) {
      setResultado({ ok: false, mensagem: 'Cidades não encontradas na base de dados.' });
      return;
    }
    const config = CAMINHOES_CONFIG[tipoCaminhao];
    const custo = dist * config.precoPorKm;
    setResultado({
      ok: true,
      distancia: dist,
      custo,
      tipoCaminhaoLabel: config.label,
    });
  }

  const cidadesFiltradas = CIDADES.filter(c =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-medium mb-6">
          <Truck className="w-4 h-4" />
          Sistema de Transporte de Cargas
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight">
          Calcule rotas e custos de{' '}
          <span className="text-brand-600 dark:text-brand-400">transporte</span>
          <br className="hidden sm:block" /> com precisão
        </h1>

        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Gerencie fretes entre as capitais do Brasil, calcule a frota necessária e
          acompanhe todos os seus transportes em um dashboard analítico.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/transportes" className="btn-primary text-base px-6 py-3">
            Cadastrar transporte
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/dashboard" className="btn-secondary text-base px-6 py-3">
            Ver dashboard
            <BarChart3 className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="grid sm:grid-cols-3 gap-6 mb-20">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
              <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        ))}
      </section>

      {/* ── Calculadora de Trecho ────────────────────────── */}
      <section className="mb-20">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
              <Search className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Calculadora de Trecho</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Consulte o custo estimado entre duas capitais</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label">Cidade de origem</label>
              <select
                value={cidade1}
                onChange={e => { setCidade1(e.target.value); setResultado(null); }}
                className="input"
              >
                <option value="">Selecione...</option>
                {CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Cidade de destino</label>
              <select
                value={cidade2}
                onChange={e => { setCidade2(e.target.value); setResultado(null); }}
                className="input"
              >
                <option value="">Selecione...</option>
                {CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Tipo de caminhão</label>
              <select
                value={tipoCaminhao}
                onChange={e => { setTipoCaminhao(e.target.value as TipoCaminhao); setResultado(null); }}
                className="input"
              >
                {(Object.entries(CAMINHOES_CONFIG) as [TipoCaminhao, typeof CAMINHOES_CONFIG[TipoCaminhao]][]).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} — R$ {v.precoPorKm.toFixed(2)}/km
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={consultar} className="btn-primary">
            <Search className="w-4 h-4" />
            Consultar preço
          </button>

          {resultado && (
            <div className={`mt-4 flex items-start gap-3 p-4 rounded-xl border ${
              resultado.ok
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}>
              {resultado.ok
                ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              <div>
                {resultado.ok ? (
                  <>
                    <p className="font-semibold">
                      {cidade1} → {cidade2}
                    </p>
                    <p className="text-sm mt-0.5">
                      Distância: <strong>{resultado.distancia?.toLocaleString('pt-BR')} km</strong>
                      {' · '}Tipo: <strong>{resultado.tipoCaminhaoLabel}</strong>
                    </p>
                    <p className="text-xl font-bold mt-1">
                      R$ {resultado.custo?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </>
                ) : (
                  <p className="font-medium">{resultado.mensagem}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Tabela de Distâncias ─────────────────────────── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tabela de Distâncias</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Dados DNIT — distâncias rodoviárias em km</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar cidades..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9 w-64"
            />
          </div>
        </div>

        <div className="card p-0 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="sticky left-0 bg-slate-50 dark:bg-slate-800/80 px-3 py-2.5 text-left text-slate-600 dark:text-slate-400 font-semibold min-w-[140px]">
                  Origem \ Destino
                </th>
                {cidadesFiltradas.map(c => (
                  <th key={c} className="px-2 py-2.5 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                    {c.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cidadesFiltradas.map((origem, i) => (
                <tr key={origem} className={i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/30'}>
                  <td className="sticky left-0 bg-inherit px-3 py-2 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap border-r border-slate-100 dark:border-slate-700">
                    {origem}
                  </td>
                  {cidadesFiltradas.map(destino => {
                    const dist = getDistancia(origem, destino);
                    return (
                      <td key={destino} className={`px-2 py-2 text-center tabular-nums ${
                        origem === destino
                          ? 'text-slate-300 dark:text-slate-600'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {dist === 0 ? '—' : dist?.toLocaleString('pt-BR')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
