'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface Deputado {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  email?: string;
}

interface GastoPorCategoria {
  tipo: string;
  valor: number;
  quantidade: number;
  percentual: number;
}

interface ComparisonData {
  deputado: Deputado;
  totalGeral: number;
  categorias: GastoPorCategoria[];
  estadoMedia: number | null;
}

interface DeputadoListItem {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
}

const availableYears = [2023, 2024, 2025];
const availableMonths = [
  { value: 0, label: 'Todos os meses' },
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

async function fetchComparisonData(
  deputadoId: number,
  year: number,
  month: number,
): Promise<ComparisonData | null> {
  if (!deputadoId) return null;

  const queryMonth = month > 0 ? `&month=${month}` : '';

  const deputadoRes = await fetch(`${API_URL}/deputado/${deputadoId}`);
  if (!deputadoRes.ok) {
    return null;
  }

  const deputado = await deputadoRes.json();

  const statsRes = await fetch(
    `${API_URL}/estatisticas/deputado/${deputadoId}/gastos?year=${year}${queryMonth}`,
  );

  if (!statsRes.ok) {
    return null;
  }

  const stats = await statsRes.json();
  let estadoMedia: number | null = null;

  if (deputado?.siglaUf) {
    const estadoRes = await fetch(
      `${API_URL}/estatisticas/estado/${deputado.siglaUf}/media-gastos?year=${year}${queryMonth}`,
    );
    if (estadoRes.ok) {
      const estadoData = await estadoRes.json();
      estadoMedia =
        typeof estadoData?.mediaGeral === 'number'
          ? estadoData.mediaGeral
          : null;
    }
  }

  return {
    deputado,
    totalGeral: stats?.totalGeral || 0,
    categorias: stats?.gastosPorCategoria || [],
    estadoMedia,
  };
}

async function fetchDeputadosLista(): Promise<DeputadoListItem[]> {
  const res = await fetch(`${API_URL}/deputado/list?page=1&limit=0`);
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return (data?.data || []).filter(
    (d: DeputadoListItem & { siglaPartido: string }) => d.siglaPartido !== 'ABC',
  );
}

interface SelectorProps {
  deputados: DeputadoListItem[];
  onSelect: (id: number) => void;
  onClose: () => void;
}

function DeputadoSelector({ deputados, onSelect, onClose }: SelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return deputados;
    return deputados.filter((dep) =>
      dep.nome.toLowerCase().includes(search.toLowerCase()),
    );
  }, [deputados, search]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">
            Selecionar deputado
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-4 border-b border-gray-800">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              Nenhum deputado encontrado.
            </p>
          ) : (
            <ul className="divide-y divide-gray-800">
              {filtered.map((dep) => (
                <li
                  key={dep.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-800/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-700">
                      {dep.urlFoto ? (
                        <Image
                          src={dep.urlFoto}
                          alt={dep.nome}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
                          👤
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{dep.nome}</p>
                      <p className="text-sm text-gray-400">
                        {dep.siglaPartido} • {dep.siglaUf}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelect(dep.id);
                      onClose();
                    }}
                    className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    Selecionar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

interface ComparisonColumnProps {
  data: ComparisonData | null;
  placeholder?: string;
  onSelectClick?: () => void;
}

function ComparisonColumn({ data, placeholder, onSelectClick }: ComparisonColumnProps) {
  if (!data) {
    return (
      <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[500px]">
        <p className="text-gray-400 mb-4">{placeholder}</p>
        {onSelectClick && (
          <button
            onClick={onSelectClick}
            className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Selecionar deputado
          </button>
        )}
      </div>
    );
  }

  const comparison =
    data.estadoMedia !== null
      ? (() => {
          const diff = data.totalGeral - data.estadoMedia!;
          const tolerance = Math.max(data.estadoMedia! * 0.02, 100);
          if (diff > tolerance) {
            return {
              direction: 'up' as const,
              label: 'Acima da média estadual',
              color: 'text-red-400',
              diffDisplay: formatCurrency(diff),
            };
          }
          if (diff < -tolerance) {
            return {
              direction: 'down' as const,
              label: 'Abaixo da média estadual',
              color: 'text-green-400',
              diffDisplay: formatCurrency(Math.abs(diff)),
            };
          }
          return {
            direction: 'equal' as const,
            label: 'Na média estadual',
            color: 'text-yellow-400',
            diffDisplay: formatCurrency(Math.abs(diff)),
          };
        })()
      : null;

  const sortedCategorias = [...data.categorias].sort((a, b) =>
    a.tipo.localeCompare(b.tipo, 'pt-BR', { sensitivity: 'base' }),
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500">
          {data.deputado.urlFoto ? (
            <Image
              src={data.deputado.urlFoto}
              alt={data.deputado.nome}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-3xl text-gray-400">
              👤
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-yellow-500 mt-4">
          {data.deputado.nome}
        </h2>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <span className="px-2 py-1 bg-yellow-500 text-black font-semibold rounded">
            {data.deputado.siglaPartido}
          </span>
          <span className="px-2 py-1 bg-gray-800 border border-gray-700 text-gray-200 rounded">
            {data.deputado.siglaUf}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg p-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wide">
          Total de Gastos
        </p>
        <p className="text-3xl font-bold mt-2">
          {formatCurrency(data.totalGeral)}
        </p>
        {comparison && (
          <div className="mt-4 flex flex-col items-center gap-1">
            <div
              className={`flex items-center gap-2 text-xs font-semibold ${comparison.color}`}
            >
              <span className="inline-flex items-center justify-center rounded-full bg-black/20 p-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {comparison.direction === 'up' && (
                    <path d="M10 4l4.5 4.5h-3v7h-3v-7h-3L10 4z" />
                  )}
                  {comparison.direction === 'down' && (
                    <path d="M10 16l-4.5-4.5h3v-7h3v7h3L10 16z" />
                  )}
                  {comparison.direction === 'equal' && (
                    <path d="M5 9h10v2H5z" />
                  )}
                </svg>
              </span>
              <span>{comparison.label}</span>
            </div>
            <p className="text-xs text-gray-900 font-medium">
              Diferença de {comparison.diffDisplay} em relação à média do estado
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Gastos por categoria
        </h3>
        {sortedCategorias.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Nenhuma despesa encontrada para este período.
          </p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {sortedCategorias.map((cat) => (
              <div
                key={cat.tipo}
                className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-3"
              >
                <div>
                  <p className="text-white font-medium text-sm">{cat.tipo}</p>
                  <p className="text-gray-400 text-xs">
                    {cat.quantidade} despesa
                    {cat.quantidade !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-500 font-semibold text-sm">
                    {formatCurrency(cat.valor)}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {cat.percentual.toFixed(1)}% do total
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const initialPrimary = Number(searchParams.get('primary')) || null;
  const initialSecondary = Number(searchParams.get('secondary')) || null;

  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(0);
  const [primaryId, setPrimaryId] = useState<number | null>(initialPrimary);
  const [secondaryId, setSecondaryId] = useState<number | null>(
    initialSecondary,
  );
  const [primaryData, setPrimaryData] = useState<ComparisonData | null>(null);
  const [secondaryData, setSecondaryData] = useState<ComparisonData | null>(
    null,
  );
  const [deputados, setDeputados] = useState<DeputadoListItem[]>([]);
  const [loadingPrimary, setLoadingPrimary] = useState(false);
  const [loadingSecondary, setLoadingSecondary] = useState(false);
  const [showSelector, setShowSelector] = useState<null | 'primary' | 'secondary'>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeputadosLista()
      .then(setDeputados)
      .catch(() => setError('Erro ao carregar lista de deputados.'));
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!primaryId) {
        setPrimaryData(null);
        return;
      }
      setLoadingPrimary(true);
      const data = await fetchComparisonData(primaryId, year, month);
      setPrimaryData(data);
      setLoadingPrimary(false);
    };
    load();
  }, [primaryId, year, month]);

  useEffect(() => {
    const load = async () => {
      if (!secondaryId) {
        setSecondaryData(null);
        return;
      }
      setLoadingSecondary(true);
      const data = await fetchComparisonData(secondaryId, year, month);
      setSecondaryData(data);
      setLoadingSecondary(false);
    };
    load();
  }, [secondaryId, year, month]);

  const selectedMonthLabel =
    month > 0 ? `${MONTH_LABELS[month - 1]} de ${year}` : `Ano de ${year}`;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500">
              Comparar deputados
            </h1>
            <p className="text-gray-400 mt-1">
              Compare gastos totais e por categoria entre dois parlamentares.
            </p>
          </div>
          <Link
            href="/deputados"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-yellow-500 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Voltar para lista
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-sm font-medium">
              Filtrar por ano:
            </span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors cursor-pointer"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-sm font-medium">
              Filtrar por mês:
            </span>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-gray-400 text-sm">
            Período selecionado: <span className="text-yellow-500">{selectedMonthLabel}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Deputado 1
              </h2>
              <button
                onClick={() => setShowSelector('primary')}
                className="px-3 py-1.5 bg-gray-800 text-yellow-500 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Trocar
              </button>
            </div>
            {loadingPrimary ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm">
                    Carregando dados do deputado...
                  </p>
                </div>
              </div>
            ) : (
              <ComparisonColumn
                data={primaryData}
                placeholder="Selecione um deputado para iniciar a comparação."
                onSelectClick={() => setShowSelector('primary')}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Deputado 2
              </h2>
              <button
                onClick={() => setShowSelector('secondary')}
                className="px-3 py-1.5 bg-gray-800 text-yellow-500 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                {secondaryId ? 'Trocar' : 'Selecionar'}
              </button>
            </div>
            {loadingSecondary ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm">
                    Carregando dados do deputado...
                  </p>
                </div>
              </div>
            ) : (
              <ComparisonColumn
                data={secondaryData}
                placeholder="Selecione um deputado para comparar."
                onSelectClick={() => setShowSelector('secondary')}
              />
            )}
          </div>
        </div>
      </div>

      {showSelector && (
        <DeputadoSelector
          deputados={deputados}
          onSelect={(id) => {
            if (showSelector === 'primary') {
              setPrimaryId(id);
            } else {
              setSecondaryId(id);
            }
          }}
          onClose={() => setShowSelector(null)}
        />
      )}
    </div>
  );
}

