import { useState } from 'react';
import { Package, MapPin, Truck, CheckCircle2, AlertCircle, Trash2, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calcularTransporte } from '../../services/calculadora';
import { ItemCarga, LABELS_ITENS, PESOS_ITENS } from '../../types';
import { CIDADES } from '../../data/distancias';

type Step = 0 | 1 | 2;

const EMPTY_CARGA: ItemCarga = {
  celulares: 0, geladeiras: 0, freezers: 0,
  cadeiras: 0, luminarias: 0, lavadoras: 0,
};

interface Notification {
  type: 'success' | 'error';
  title: string;
  body: string;
}

function ItemRow({
  label, peso, value, onChange, max,
}: {
  label: string; peso: number; value: number;
  onChange: (v: number) => void; max?: number;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div className="flex-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className="ml-2 text-xs text-slate-400">{peso} kg/un</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-base transition-colors"
        >−</button>
        <input
          type="number"
          min={0}
          max={max}
          value={value}
          onChange={e => {
            const v = Math.max(0, parseInt(e.target.value) || 0);
            onChange(max !== undefined ? Math.min(v, max) : v);
          }}
          className="w-16 text-center input py-1"
        />
        <button
          type="button"
          onClick={() => onChange(max !== undefined ? Math.min(value + 1, max) : value + 1)}
          className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-base transition-colors"
        >+</button>
      </div>
      <div className="w-20 text-right text-xs text-slate-400 tabular-nums">
        {(value * peso).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg
      </div>
    </div>
  );
}

const STEP_TITLES = ['Carga', 'Rota', 'Descarga'];
const STEP_ICONS = [Package, MapPin, Truck];

export default function Transportes() {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState<Step>(0);
  const [carga, setCarga] = useState<ItemCarga>({ ...EMPTY_CARGA });
  const [descarga, setDescarga] = useState<ItemCarga>({ ...EMPTY_CARGA });
  const [origem, setOrigem] = useState('');
  const [parada, setParada] = useState('');
  const [destino, setDestino] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);

  const totalPeso = (Object.keys(PESOS_ITENS) as Array<keyof ItemCarga>)
    .reduce((acc, k) => acc + (carga[k] ?? 0) * PESOS_ITENS[k], 0);

  function updateCarga(key: keyof ItemCarga, val: number) {
    setCarga(prev => ({ ...prev, [key]: val }));
    setDescarga(prev => ({ ...prev, [key]: Math.min(prev[key], val) }));
  }

  function handleSubmit() {
    const result = calcularTransporte({ origem, parada, destino, carga, descarga });

    if (!result.ok) {
      const msgs: Record<string, string> = {
        CIDADE_INVALIDA: 'Uma ou mais cidades da rota são inválidas.',
        DESCARGA_EXCEDE_CARGA: 'A quantidade descarregada excede a carga inicial.',
        DISTANCIA_ZERO: 'A distância entre as cidades é zero.',
      };
      setNotification({ type: 'error', title: 'Erro no cadastro', body: msgs[result.erro] ?? 'Erro desconhecido.' });
      return;
    }

    dispatch({ type: 'ADD_TRANSPORTE', payload: result.transporte });
    const t = result.transporte;
    setNotification({
      type: 'success',
      title: 'Transporte cadastrado!',
      body: `${t.origem} → ${t.parada} → ${t.destino} · Custo total: R$ ${t.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} · ${t.totalItens} itens · ${t.totalVeiculos} veículos`,
    });

    // Reset
    setCarga({ ...EMPTY_CARGA });
    setDescarga({ ...EMPTY_CARGA });
    setOrigem(''); setParada(''); setDestino('');
    setStep(0);
  }

  function nextStep() {
    if (step === 0) {
      if (Object.values(carga).every(v => v === 0)) {
        setNotification({ type: 'error', title: 'Carga vazia', body: 'Adicione ao menos um item à carga.' });
        return;
      }
    }
    if (step === 1) {
      if (!origem || !parada || !destino) {
        setNotification({ type: 'error', title: 'Rota incompleta', body: 'Preencha todos os três campos de rota.' });
        return;
      }
      if (new Set([origem, parada, destino]).size < 3) {
        setNotification({ type: 'error', title: 'Cidades repetidas', body: 'Origem, parada e destino devem ser cidades diferentes.' });
        return;
      }
    }
    setNotification(null);
    setStep(s => (s + 1) as Step);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cadastrar Transporte</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Preencha os dados em 3 etapas para registrar um novo transporte.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {STEP_TITLES.map((title, i) => {
          const Icon = STEP_ICONS[i];
          const active = i === step;
          const done = i < step;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => i < step && setStep(i as Step)}
                className={`flex items-center gap-2 ${i < step ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  done   ? 'bg-brand-600 text-white' :
                  active ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900/50' :
                           'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  {title}
                </span>
              </button>
              {i < STEP_TITLES.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 rounded ${i < step ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 flex items-start gap-3 p-4 rounded-xl border ${
          notification.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
        }`}>
          {notification.type === 'success'
            ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
          <div>
            <p className="font-semibold">{notification.title}</p>
            <p className="text-sm mt-0.5">{notification.body}</p>
          </div>
        </div>
      )}

      {/* Step 0 — Carga */}
      {step === 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Itens a transportar
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
              Peso total: <strong className="text-slate-900 dark:text-white">{totalPeso.toLocaleString('pt-BR')} kg</strong>
            </span>
          </div>

          {(Object.keys(LABELS_ITENS) as Array<keyof ItemCarga>).map(key => (
            <ItemRow
              key={key}
              label={LABELS_ITENS[key]}
              peso={PESOS_ITENS[key]}
              value={carga[key]}
              onChange={v => updateCarga(key, v)}
            />
          ))}

          {/* Tabela de preços */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Tarifas por tipo de caminhão</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Pequeno',  cap: '≤ 1.000 kg',  preco: 'R$ 4,87/km'  },
                { label: 'Médio',    cap: '≤ 4.000 kg',  preco: 'R$ 11,92/km' },
                { label: 'Grande',   cap: '≤ 10.000 kg', preco: 'R$ 27,44/km' },
              ].map(c => (
                <div key={c.label} className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">{c.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.cap}</p>
                  <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-1">{c.preco}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="btn-primary" onClick={nextStep}>
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 1 — Rota */}
      {step === 1 && (
        <div className="card">
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Definir Rota
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Origem', val: origem, set: setOrigem, placeholder: 'Cidade de partida' },
              { label: 'Parada intermediária', val: parada, set: setParada, placeholder: 'Cidade de parada' },
              { label: 'Destino final', val: destino, set: setDestino, placeholder: 'Cidade de chegada' },
            ].map(({ label, val, set, placeholder }) => (
              <div key={label}>
                <label className="label">{label}</label>
                <select value={val} onChange={e => set(e.target.value)} className="input">
                  <option value="">{placeholder}</option>
                  {CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            ))}
          </div>

          {origem && parada && destino && (
            <div className="mt-4 p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-sm">
              <span className="font-semibold">{origem}</span>
              {' → '}
              <span className="font-semibold">{parada}</span>
              {' → '}
              <span className="font-semibold">{destino}</span>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(0)}>
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <button className="btn-primary" onClick={nextStep}>
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Descarga */}
      {step === 2 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Itens a descarregar em <span className="text-brand-600 dark:text-brand-400">{parada}</span>
            </h2>
          </div>

          {(Object.keys(LABELS_ITENS) as Array<keyof ItemCarga>).map(key => (
            <ItemRow
              key={key}
              label={LABELS_ITENS[key]}
              peso={PESOS_ITENS[key]}
              value={descarga[key]}
              max={carga[key]}
              onChange={v => setDescarga(prev => ({ ...prev, [key]: v }))}
            />
          ))}

          <div className="mt-6 flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <button className="btn-primary" onClick={handleSubmit}>
              <CheckCircle2 className="w-4 h-4" /> Cadastrar transporte
            </button>
          </div>
        </div>
      )}

      {/* ── Histórico ────────────────────────────────────── */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Histórico de Transportes
          </h2>
          {state.transportes.length > 0 && (
            <button
              className="btn-danger text-xs py-1.5 px-3"
              onClick={() => {
                if (confirm('Limpar todo o histórico?')) dispatch({ type: 'CLEAR_ALL' });
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Limpar tudo
            </button>
          )}
        </div>

        {state.transportes.length === 0 ? (
          <div className="card text-center py-12">
            <Truck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 dark:text-slate-500">Nenhum transporte cadastrado ainda.</p>
          </div>
        ) : (
          <div className="card p-0 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                  {['Data', 'Rota', 'Peso T1', 'Peso T2', 'Caminhões', 'Custo Total', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...state.transportes].reverse().map((t, i) => (
                  <tr key={t.id} className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-800/20'}`}>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(t.dataCriacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {t.origem} → {t.parada} → {t.destino}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 tabular-nums">
                      {t.trecho1.pesoKg.toLocaleString('pt-BR')} kg
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 tabular-nums">
                      {t.trecho2.pesoKg.toLocaleString('pt-BR')} kg
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 tabular-nums">
                      {t.totalVeiculos}
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
                      R$ {t.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_TRANSPORTE', payload: t.id })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
