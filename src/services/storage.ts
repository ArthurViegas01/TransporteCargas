import { Transporte } from '../types';

const STORAGE_KEY = 'dely:transportes';

export function salvarTransporte(t: Transporte): void {
  const lista = listarTransportes();
  lista.push(t);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

export function listarTransportes(): Transporte[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Transporte[];
  } catch {
    return [];
  }
}

export function removerTransporte(id: string): void {
  const lista = listarTransportes().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

export function limparTransportes(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportarCSV(transportes: Transporte[]): void {
  const cabecalho = [
    'ID', 'Data', 'Origem', 'Parada', 'Destino',
    'Peso Trecho 1 (kg)', 'Distância Trecho 1 (km)', 'Custo Trecho 1 (R$)',
    'Peso Trecho 2 (kg)', 'Distância Trecho 2 (km)', 'Custo Trecho 2 (R$)',
    'Custo Total (R$)', 'Total Itens', 'Total Veículos',
  ];

  const linhas = transportes.map(t => [
    t.id,
    new Date(t.dataCriacao).toLocaleDateString('pt-BR'),
    t.origem, t.parada, t.destino,
    t.trecho1.pesoKg.toFixed(2),
    t.trecho1.distanciaKm,
    t.trecho1.custo.toFixed(2),
    t.trecho2.pesoKg.toFixed(2),
    t.trecho2.distanciaKm,
    t.trecho2.custo.toFixed(2),
    t.custoTotal.toFixed(2),
    t.totalItens,
    t.totalVeiculos,
  ]);

  const csv = [cabecalho, ...linhas]
    .map(row => row.map(v => `"${v}"`).join(';'))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dely-transportes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
