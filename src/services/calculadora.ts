import { ItemCarga, AlocacaoCaminhoes, ResultadoTrecho, Transporte, PESOS_ITENS } from '../types';
import { getDistancia } from '../data/distancias';

/** Calcula peso total de uma carga em kg. */
export function calcularPeso(carga: ItemCarga): number {
  return (Object.keys(PESOS_ITENS) as Array<keyof ItemCarga>).reduce(
    (acc, key) => acc + (carga[key] ?? 0) * PESOS_ITENS[key],
    0,
  );
}

/** Conta quantos itens no total existem em uma carga. */
export function totalItens(carga: ItemCarga): number {
  return Object.values(carga).reduce((acc, v) => acc + (v ?? 0), 0);
}

/**
 * Aloca caminhões para transportar um determinado peso.
 * Regras originais do sistema, mantidas com fidelidade:
 *  ≤ 1 000 kg  → 1 pequeno
 *  1 001–2 000 → 2 pequenos
 *  2 001–4 000 → 1 médio
 *  4 001–8 000 → 2 médios
 *  > 8 000     → 1 grande (10 000 kg por grande)
 */
export function alocarCaminhoes(pesoKg: number): AlocacaoCaminhoes {
  let peso = pesoKg;
  let pequenos = 0;
  let medios = 0;
  let grandes = 0;

  while (peso > 0) {
    if (peso <= 1000) {
      pequenos += 1;
      peso -= 1000;
    } else if (peso <= 2000) {
      pequenos += 2;
      peso -= 2000;
    } else if (peso <= 4000) {
      medios += 1;
      peso -= 4000;
    } else if (peso <= 8000) {
      medios += 2;
      peso -= 8000;
    } else {
      grandes += 1;
      peso -= 10000;
    }
  }

  return { pequenos, medios, grandes, total: pequenos + medios + grandes };
}

/** Custo de um trecho dado alocação de caminhões e distância. */
export function calcularCustoTrecho(caminhoes: AlocacaoCaminhoes, distanciaKm: number): number {
  return (
    caminhoes.pequenos * 4.87 * distanciaKm +
    caminhoes.medios   * 11.92 * distanciaKm +
    caminhoes.grandes  * 27.44 * distanciaKm
  );
}

export interface EntradaTransporte {
  id?: string;
  origem: string;
  parada: string;
  destino: string;
  carga: ItemCarga;
  descarga: ItemCarga;
}

export type ErroTransporte =
  | 'CIDADE_INVALIDA'
  | 'DESCARGA_EXCEDE_CARGA'
  | 'DISTANCIA_ZERO';

export type ResultadoCalculo =
  | { ok: true; transporte: Transporte }
  | { ok: false; erro: ErroTransporte; campo?: string };

/** Calcula um transporte completo, retornando sucesso ou erro tipado. */
export function calcularTransporte(entrada: EntradaTransporte): ResultadoCalculo {
  const { origem, parada, destino, carga, descarga } = entrada;

  // Validar cidades
  const dist1 = getDistancia(origem, parada);
  const dist2 = getDistancia(parada, destino);

  if (dist1 === null) return { ok: false, erro: 'CIDADE_INVALIDA', campo: 'origem/parada' };
  if (dist2 === null) return { ok: false, erro: 'CIDADE_INVALIDA', campo: 'parada/destino' };
  if (dist1 === 0 && origem !== parada) return { ok: false, erro: 'DISTANCIA_ZERO' };

  // Validar descarga não excede carga
  for (const key of Object.keys(carga) as Array<keyof ItemCarga>) {
    if ((descarga[key] ?? 0) > (carga[key] ?? 0)) {
      return { ok: false, erro: 'DESCARGA_EXCEDE_CARGA', campo: key };
    }
  }

  // Trecho 1: carga completa
  const peso1 = calcularPeso(carga);
  const caminhoes1 = alocarCaminhoes(peso1);
  const custo1 = calcularCustoTrecho(caminhoes1, dist1);

  // Trecho 2: carga após descarga
  const cargaRestante: ItemCarga = {
    celulares:  (carga.celulares  ?? 0) - (descarga.celulares  ?? 0),
    geladeiras: (carga.geladeiras ?? 0) - (descarga.geladeiras ?? 0),
    freezers:   (carga.freezers   ?? 0) - (descarga.freezers   ?? 0),
    cadeiras:   (carga.cadeiras   ?? 0) - (descarga.cadeiras   ?? 0),
    luminarias: (carga.luminarias ?? 0) - (descarga.luminarias ?? 0),
    lavadoras:  (carga.lavadoras  ?? 0) - (descarga.lavadoras  ?? 0),
  };
  const peso2 = calcularPeso(cargaRestante);
  const caminhoes2 = peso2 > 0 ? alocarCaminhoes(peso2) : { pequenos: 0, medios: 0, grandes: 0, total: 0 };
  const custo2 = calcularCustoTrecho(caminhoes2, dist2);

  const trecho1: ResultadoTrecho = {
    origem, destino: parada,
    distanciaKm: dist1,
    pesoKg: peso1,
    caminhoes: caminhoes1,
    custo: custo1,
  };

  const trecho2: ResultadoTrecho = {
    origem: parada, destino,
    distanciaKm: dist2,
    pesoKg: peso2,
    caminhoes: caminhoes2,
    custo: custo2,
  };

  const transporte: Transporte = {
    id: entrada.id ?? crypto.randomUUID(),
    dataCriacao: new Date().toISOString(),
    origem, parada, destino,
    carga, descarga,
    trecho1, trecho2,
    custoTotal: custo1 + custo2,
    totalItens: totalItens(carga),
    totalVeiculos: caminhoes1.total + caminhoes2.total,
  };

  return { ok: true, transporte };
}
