export type TipoCaminhao = 'pequeno' | 'medio' | 'grande';

export interface ItemCarga {
  celulares: number;
  geladeiras: number;
  freezers: number;
  cadeiras: number;
  luminarias: number;
  lavadoras: number;
}

export interface AlocacaoCaminhoes {
  pequenos: number;
  medios: number;
  grandes: number;
  total: number;
}

export interface ResultadoTrecho {
  origem: string;
  destino: string;
  distanciaKm: number;
  pesoKg: number;
  caminhoes: AlocacaoCaminhoes;
  custo: number;
}

export interface Transporte {
  id: string;
  dataCriacao: string;
  origem: string;
  parada: string;
  destino: string;
  carga: ItemCarga;
  descarga: ItemCarga;
  trecho1: ResultadoTrecho;
  trecho2: ResultadoTrecho;
  custoTotal: number;
  totalItens: number;
  totalVeiculos: number;
}

export interface ConsultaTrecho {
  cidade1: string;
  cidade2: string;
  tipoCaminhao: TipoCaminhao;
}

export interface ResultadoConsulta {
  distanciaKm: number;
  custoEstimado: number;
  tipoCaminhaoLabel: string;
}

export const PESOS_ITENS: Record<keyof ItemCarga, number> = {
  celulares:  0.5,
  geladeiras: 60,
  freezers:   100,
  cadeiras:   5,
  luminarias: 0.8,
  lavadoras:  120,
};

export const LABELS_ITENS: Record<keyof ItemCarga, string> = {
  celulares:  'Celulares',
  geladeiras: 'Geladeiras',
  freezers:   'Freezers',
  cadeiras:   'Cadeiras',
  luminarias: 'Luminárias',
  lavadoras:  'Lavadoras',
};

export const CAMINHOES_CONFIG: Record<TipoCaminhao, { label: string; capacidadeKg: number; precoPorKm: number }> = {
  pequeno: { label: 'Pequeno porte',  capacidadeKg: 1000,  precoPorKm: 4.87  },
  medio:   { label: 'Médio porte',    capacidadeKg: 4000,  precoPorKm: 11.92 },
  grande:  { label: 'Grande porte',   capacidadeKg: 10000, precoPorKm: 27.44 },
};
