import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { TrendingUp, Truck, Package, DollarSign, Download, Search, Trash2, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportarCSV } from '../../services/storage';
import { Transporte, LABELS_ITENS, ItemCarga } from '../../types';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

function StatCard({ icon: Icon, label, value, sub, color = 'brand' }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color?: string;
}) {
  const colorMap: Record<string, string> = {
    brand:   'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400',
    green:   'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    purple:  'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange:  'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  };
  return (
    <div className="stat-card">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 tabular-nums">{value}</p>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
    </div>
  );
}

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--tooltip-bg, #1e293b)',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f1f5f9',
  fontSize: '12px',
};

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const transportes = state.transportes;

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof Transporte>('dataCriacao');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // ── Stats ────────────────────────────────────────────────
  const totalCusto = transportes.reduce((s, t) => s + t.custoTotal, 0);
  const totalItens = transportes.reduce((s, t) => s + t.totalItens, 0);
  const totalVeiculos = transportes.reduce((s, t) => s + t.totalVeiculos, 0);
  const mediaCusto = transportes.length ? totalCusto / transportes.length : 0;

  // ── Custo por rota (top 8) ───────────────────────────────
  const porRota = useMemo(() => {
    const map: Record<string, number> = {};
    transportes.forEach(t => {
      const key = `${t.origem.split(' ')[0]}→${t.destino.split(' ')[0]}`;
      map[key] = (map[key] ?? 0) + t.custoTotal;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [transportes]);

  // ── Custo ao longo do tempo ──────────────────────────────
  const porDia = useMemo(() => {
    const map: Record<string, number> = {};
    transportes.forEach(t => {
      const dia = new Date(t.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      map[dia] = (map[dia] ?? 0) + t.custoTotal;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [transportes]);

  // ── Composição de carga ──────────────────────────────────
  const composicaoCarga = useMemo(() => {
    const totais: Record<keyof ItemCarga, number> = {
      celulares: 0, geladeiras: 0, freezers: 0,
      cadeiras: 0, luminarias: 0, lavadoras: 0,
    };
    transportes.forEach(t => {
      (Object.keys(totais) as Array<keyof ItemCarga>).forEach(k => {
        totais[k] += t.carga[k] ?? 0;
      });
    });
    return (Object.keys(totais) as Array<keyof ItemCarga>)
      .map(k => ({ name: LABELS_ITENS[k], value: totais[k] }))
      .filter(d => d.value > 0);
  }, [transportes]);

  // ── Tabela filtrada + ordenada ───────────────────────────
  const filtrados = useMemo(() => {
    let list = [...transportes];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.origem.toLowerCase().includes(q) ||
        t.destino.toLowerCase().includes(q) ||
        t.parada.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      const va = a[sortKey] as string | number;
      const vb = b[sortKey] as string | number;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [transportes, search, sortKey, sortDir]);

  function toggleSort(key: keyof Transporte) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ col }: { col: keyof Transporte }) {
    if (sortKey !== col) return <span className="text-slate-300 dark:text-slate-600">↕</span>;
    return <span className="text-brand-600 dark:text-brand-400">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  if (transportes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <BarChart3 className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Dashboard vazio</h2>
        <p className="text-slate-500 dark:text-slate-400">Cadastre transportes para visualizar as análises aqui.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Análise completa dos transportes cadastrados.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => exportarCSV(transportes)}
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* ── Stat Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Truck}
          label="Transportes"
          value={String(transportes.length)}
          sub="total cadastrados"
          color="brand"
        />
        <StatCard
          icon={DollarSign}
          label="Custo Total"
          value={`R$ ${(totalCusto / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1 })}k`}
          sub={`Média: R$ ${mediaCusto.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          color="green"
        />
        <StatCard
          icon={Package}
          label="Itens Transportados"
          value={totalItens.toLocaleString('pt-BR')}
          sub="em todos os transportes"
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Veículos Utilizados"
          value={String(totalVeiculos)}
          sub="somando todos os trechos"
          color="orange"
        />
      </div>

      {/* ── Charts row 1 ────────────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Custo por rota */}
        <div className="card lg:col-span-3">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Custo por Rota</h2>
          <p className="text-xs text-slate-400 mb-4">Top 8 rotas com maior custo acumulado (R$)</p>
          {porRota.length === 0 ? (
            <p className="text-slate-400 text-sm">Sem dados suficientes.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={porRota} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Custo']} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Composição de carga */}
        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Composição de Carga</h2>
          <p className="text-xs text-slate-400 mb-4">Itens transportados por categoria</p>
          {composicaoCarga.length === 0 ? (
            <p className="text-slate-400 text-sm">Sem dados suficientes.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={composicaoCarga}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {composicaoCarga.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Custo ao longo do tempo ──────────────────────── */}
      {porDia.length > 1 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Custo ao Longo do Tempo</h2>
          <p className="text-xs text-slate-400 mb-4">Custo acumulado por data de cadastro</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={porDia} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Custo']} />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Tabela detalhada ─────────────────────────────── */}
      <div className="card p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white">Detalhamento</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por cidade..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9 w-56 py-1.5"
            />
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                {([
                  ['dataCriacao', 'Data'],
                  ['origem', 'Origem'],
                  ['parada', 'Parada'],
                  ['destino', 'Destino'],
                  ['totalItens', 'Itens'],
                  ['totalVeiculos', 'Veículos'],
                  ['custoTotal', 'Custo'],
                ] as [keyof Transporte, string][]).map(([key, label]) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 whitespace-nowrap select-none"
                    onClick={() => toggleSort(key)}
                  >
                    {label} <SortIcon col={key} />
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtrados.map((t, i) => (
                <tr key={t.id} className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-800/20'}`}>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(t.dataCriacao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{t.origem}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{t.parada}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{t.destino}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 tabular-nums">{t.totalItens}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 tabular-nums">{t.totalVeiculos}</td>
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
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400 dark:text-slate-500">
                    Nenhum transporte encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
