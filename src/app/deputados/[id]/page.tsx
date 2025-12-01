'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Footer from '@/components/Footer';

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

interface GastoPorMes {
  ano: number;
  mes: number;
  total: number;
  quantidade: number;
  mesLabel: string;
}

interface Despesa {
  id_local: number;
  codDocumento: number;
  dataDocumento: string;
  tipoDespesa: string;
  nomeFornecedor: string;
  valorLiquido: number;
  valorDocumento: number;
  valorGlosa: number;
  numDocumento: string;
  urlDocumento?: string;
}

interface ExpensesStats {
  deputadoId: number;
  periodo: {
    ano?: number;
    mes?: number;
    startDate?: string;
    endDate?: string;
  };
  totalGeral: number;
  totalDespesas: number;
  gastosPorMes: GastoPorMes[];
  gastosPorCategoria: GastoPorCategoria[];
}

interface TopFornecedor {
  nomeFornecedor: string;
  cnpjCpfFornecedor?: string;
  total: number;
  quantidade: number;
  percentual: number;
}

interface StateCategoryAverage {
  tipo: string;
  media: number;
  total: number;
  deputadosComDespesa: number;
}

interface StateAverageStats {
  estado: string;
  periodo: {
    ano?: number;
    mes?: number;
    startDate?: string;
    endDate?: string;
  };
  totalGastos: number;
  mediaGeral: number;
  totalDeputadosConsiderados: number;
  totalDeputadosEstado: number;
  mediaPorCategoria: StateCategoryAverage[];
}

// Cores para o gráfico de pizza
const COLORS = [
  '#FDCF20',
  '#F59E0B',
  '#F97316',
  '#EF4444',
  '#EC4899',
  '#D946EF',
  '#A855F7',
  '#8B5CF6',
  '#6366F1',
  '#3B82F6',
  '#0EA5E9',
  '#06B6D4',
  '#14B8A6',
  '#10B981',
  '#22C55E',
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

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

export default function DeputadoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [deputado, setDeputado] = useState<Deputado | null>(null);
  const [stats, setStats] = useState<ExpensesStats | null>(null);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [topFornecedores, setTopFornecedores] = useState<TopFornecedor[]>([]);
  const [stateAverage, setStateAverage] = useState<StateAverageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [year, setYear] = useState<number>(2025);
  const [deputadoId, setDeputadoId] = useState<number | null>(null);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const itemsPerPage = 20;
  const yearDropdownRef = useRef<HTMLDivElement | null>(null);
  const monthDropdownRef = useRef<HTMLDivElement | null>(null);

  const availableYears = [2023, 2024, 2025];
  const [month, setMonth] = useState<number>(0);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setIsYearDropdownOpen(false);
      }
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMonthDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Aguardar params e extrair o id
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      const id = parseInt(resolvedParams.id);
      setDeputadoId(id);
    };

    resolveParams();
  }, [params]);

  // Buscar dados do deputado apenas uma vez
  useEffect(() => {
    const fetchDeputado = async () => {
      if (!deputadoId) return;

      try {
        const deputadoRes = await fetch(`${API_URL}/deputado/${deputadoId}`);
        if (!deputadoRes.ok) throw new Error('Erro ao buscar deputado');
        const deputadoData = await deputadoRes.json();
        setDeputado(deputadoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };

    fetchDeputado();
  }, [deputadoId]);

  // Buscar estatísticas e despesas quando filtros mudarem
  useEffect(() => {
    const fetchData = async () => {
      if (!deputadoId || !deputado?.siglaUf) return;

      try {
        setLoading(true);
        setStateAverage(null);

        // Buscar estatísticas
        const statsRes = await fetch(
          `${API_URL}/estatisticas/deputado/${deputadoId}/gastos?year=${year}${
            month > 0 ? `&month=${month}` : ''
          }`,
        );
        if (!statsRes.ok) throw new Error('Erro ao buscar estatísticas');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Buscar ranking de fornecedores
        const fornecedoresRes = await fetch(
          `${API_URL}/estatisticas/deputado/${deputadoId}/fornecedores?year=${year}&limit=10${
            month > 0 ? `&month=${month}` : ''
          }`,
        );
        if (fornecedoresRes.ok) {
          const fornecedoresData = await fornecedoresRes.json();
          setTopFornecedores(fornecedoresData);
        }

        // Buscar média estadual
        const stateAverageRes = await fetch(
          `${API_URL}/estatisticas/estado/${deputado.siglaUf}/media-gastos?year=${year}${
            month > 0 ? `&month=${month}` : ''
          }`,
        );
        if (stateAverageRes.ok) {
          const stateAverageData = await stateAverageRes.json();
          setStateAverage(stateAverageData);
        } else {
          setStateAverage(null);
        }

        // Resetar página e buscar despesas
        setCurrentPage(1);
        await fetchDespesas(deputadoId, 1, undefined, month > 0 ? month : undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deputadoId, deputado?.siglaUf, year, month]);

  const fetchDespesas = async (
    deputadoId: number,
    page: number,
    ano?: number,
    mes?: number,
  ) => {
    try {
      const anoFiltro = ano || year;
      const mesFiltro = mes ?? (month > 0 ? month : undefined);
      const res = await fetch(
        `${API_URL}/despesa/list?deputadoId=${deputadoId}&page=${page}&limit=${itemsPerPage}&ano=${anoFiltro}${
          mesFiltro ? `&mes=${mesFiltro}` : ''
        }`,
      );
      if (!res.ok) throw new Error('Erro ao buscar despesas');
      const data = await res.json();
      setDespesas(data.data || []);
      setTotalDespesas(data.total || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error('Erro ao buscar despesas:', err);
    }
  };

  const handlePageChange = (page: number) => {
    if (deputadoId) {
      fetchDespesas(deputadoId, page, undefined, month > 0 ? month : undefined);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dados do deputado...</p>
        </div>
      </div>
    );
  }

  if (error || !deputado) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Erro: {error || 'Deputado não encontrado'}</p>
            <Link
              href="/deputados"
              className="text-yellow-500 hover:text-yellow-400 underline"
            >
              Voltar para lista de deputados
            </Link>
          </div>
        </div>
    );
  }

  const totalGasto = stats?.totalGeral || 0;
  const categorias = stats?.gastosPorCategoria || [];
  const selectedMonthLabel = month > 0 ? MONTH_LABELS[month - 1] : null;
  const stateComparison = stateAverage
    ? (() => {
        const diff = totalGasto - stateAverage.mediaGeral;
        const tolerance = Math.max(stateAverage.mediaGeral * 0.02, 100);
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
          color: 'text-yellow-900',
          diffDisplay: formatCurrency(Math.abs(diff)),
        };
      })()
    : null;

  // Preparar dados para o gráfico de pizza
  const chartData = categorias.map((cat, index) => ({
    name: cat.tipo,
    value: cat.valor,
    percentual: cat.percentual,
    color: COLORS[index % COLORS.length],
  }));

  const totalPages = Math.ceil(totalDespesas / itemsPerPage);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <Image
                src="/image.png"
                alt="Janela Aberta logo"
                width={40}
                height={40}
              />
            </Link>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com informações do deputado */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-500 flex-shrink-0">
              <Image
                src={deputado.urlFoto}
                alt={deputado.nome}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-yellow-500">
                {deputado.nome}
              </h1>
              <div className="flex justify-center md:justify-start mb-4">
                <Link
                  href={`/compare?primary=${deputado.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Comparar
                  <span aria-hidden="true">↔</span>
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-4">
                <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-gray-400 text-sm block">Partido</span>
                  <p className="font-semibold text-yellow-400">{deputado.siglaPartido}</p>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-gray-400 text-sm block">Estado</span>
                  <p className="font-semibold text-yellow-400">{deputado.siglaUf}</p>
                </div>
                {deputado.email && (
                  <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                    <span className="text-gray-400 text-sm block">Email</span>
                    <p className="font-semibold text-sm break-all text-gray-300">
                      {deputado.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filtro de Ano */}
        <div className="mb-6 flex flex-wrap gap-6 justify-between items-center bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-3" ref={yearDropdownRef}>
            <span className="text-gray-300 text-sm font-medium">Filtrar por ano:</span>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setIsYearDropdownOpen((prev) => !prev)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors cursor-pointer flex items-center gap-2"
                aria-haspopup="listbox"
                aria-expanded={isYearDropdownOpen}
              >
                {year}
                <svg
                  className={`w-4 h-4 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 7.5L10 12L14.5 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isYearDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-full min-w-[8rem] bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
                  role="listbox"
                >
                  {availableYears.map((optionYear) => (
                    <button
                      key={optionYear}
                      type="button"
                      onClick={() => {
                        setYear(optionYear);
                        setIsYearDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        year === optionYear
                          ? 'bg-yellow-500 text-black font-semibold'
                          : 'text-white hover:bg-gray-700'
                      }`}
                      role="option"
                      aria-selected={year === optionYear}
                    >
                      {optionYear}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3" ref={monthDropdownRef}>
            <span className="text-gray-300 text-sm font-medium">Filtrar por mês:</span>
            <div className="relative inline-block min-w-[12rem]">
              <button
                type="button"
                onClick={() => setIsMonthDropdownOpen((prev) => !prev)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors cursor-pointer flex items-center justify-between gap-2 w-full"
                aria-haspopup="listbox"
                aria-expanded={isMonthDropdownOpen}
              >
                {availableMonths.find((option) => option.value === month)?.label}
                <svg
                  className={`w-4 h-4 transition-transform ${isMonthDropdownOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 7.5L10 12L14.5 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isMonthDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                  role="listbox"
                >
                  {availableMonths.map((optionMonth) => (
                    <button
                      key={optionMonth.value}
                      type="button"
                      onClick={() => {
                        setMonth(optionMonth.value);
                        setIsMonthDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        month === optionMonth.value
                          ? 'bg-yellow-500 text-black font-semibold'
                          : 'text-white hover:bg-gray-700'
                      }`}
                      role="option"
                      aria-selected={month === optionMonth.value}
                    >
                      {optionMonth.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Total de gastos destacado */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-8 mb-8 text-center">
          { selectedMonthLabel ? (
            <p className="text-gray-900 text-sm md:text-base mb-2 font-medium">
              Total de Gastos em {selectedMonthLabel} de {year}
            </p>
          ): (
            <p className="text-gray-900 text-sm md:text-base mb-2 font-medium">
              Total de Gastos em {year}
            </p>
          )}
          
          <h2 className="text-4xl md:text-6xl font-bold text-black">
            {formatCurrency(totalGasto)}
          </h2>
          {stats && (
            <p className="text-gray-800 text-sm md:text-base mt-2">
              {stats.totalDespesas} despesas registradas
            </p>
          )}
          {stateComparison && (
            <div className="mt-4 flex flex-col items-center gap-1">
              <div className={`flex items-center gap-2 text-sm font-semibold ${stateComparison.color}`}>
                <span className="inline-flex items-center justify-center rounded-full bg-black/20 p-2">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {stateComparison.direction === 'up' && (
                      <path d="M10 4l4.5 4.5h-3v7h-3v-7h-3L10 4z" />
                    )}
                    {stateComparison.direction === 'down' && (
                      <path d="M10 16l-4.5-4.5h3v-7h3v7h3L10 16z" />
                    )}
                    {stateComparison.direction === 'equal' && (
                      <path d="M5 9h10v2H5z" />
                    )}
                  </svg>
                </span>
                <span>{stateComparison.label}</span>
              </div>
              <p className="text-xs text-gray-900 font-medium">
                Diferença de {stateComparison.diffDisplay} em relação à média por deputado no estado
              </p>
            </div>
          )}
        </div>

        {/* Média de gastos do estado */}
        {/* {stateAverage && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-yellow-500 mb-2">
                  Média estadual ({deputado.siglaUf})
                </h2>
                <p className="text-gray-400 text-sm">
                  {selectedMonthLabel ? (
                    <>
                      {selectedMonthLabel} de {year}
                    </>
                  ) : (
                    <>Ano de {year}</>
                  )}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Considerando {stateAverage.totalDeputadosConsiderados}{' '}
                  {stateAverage.totalDeputadosConsiderados === 1 ? 'deputado' : 'deputados'} com despesas
                  (de {stateAverage.totalDeputadosEstado}{' '}
                  {stateAverage.totalDeputadosEstado === 1 ? 'parlamentar' : 'parlamentares'} no estado)
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    Média por deputado
                  </p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {formatCurrency(stateAverage.mediaGeral)}
                  </p>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                    Total gasto pelo estado
                  </p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {formatCurrency(stateAverage.totalGastos)}
                  </p>
                </div>
              </div>
            </div>

            {stateAverage.mediaPorCategoria.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Média por categoria no estado
                </h3>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {stateAverage.mediaPorCategoria.map((cat, index) => (
                    <div
                      key={`${cat.tipo}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm text-white">
                            {cat.tipo}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {cat.deputadosComDespesa}{' '}
                            {cat.deputadosComDespesa === 1 ? 'deputado' : 'deputados'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-500 text-sm">
                          Média: {formatCurrency(cat.media)}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Total: {formatCurrency(cat.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )} */}

        {/* Gráfico de Pizza - Gastos por Categoria */}
        {categorias.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">
              Gastos por Categoria ({year})
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percentual }) =>
                        `${percentual.toFixed(1)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#FFF',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center">
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {categorias.map((cat, index) => (
                    <div
                      key={cat.tipo}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS[index % COLORS.length],
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm">{cat.tipo}</p>
                          <p className="text-gray-400 text-xs">
                            {cat.quantidade} despesas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-500">
                          {formatCurrency(cat.valor)}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {cat.percentual.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ranking dos 10 Maiores Fornecedores */}
        {topFornecedores.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">
              Top 10 Maiores Fornecedores ({year})
            </h2>
            <div className="space-y-3">
              {topFornecedores.map((fornecedor, index) => (
                <div
                  key={`${fornecedor.nomeFornecedor}-${index}`}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {fornecedor.nomeFornecedor}
                      </p>
                      {fornecedor.cnpjCpfFornecedor && (
                        <p className="text-gray-400 text-xs truncate">
                          {fornecedor.cnpjCpfFornecedor}
                        </p>
                      )}
                      <p className="text-gray-400 text-xs mt-1">
                        {fornecedor.quantidade} despesa{fornecedor.quantidade !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="font-bold text-yellow-500 text-lg">
                      {formatCurrency(fornecedor.total)}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {fornecedor.percentual.toFixed(1)}% do total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Despesas */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-yellow-500">
            Lista de Despesas ({year})
          </h2>

          {despesas.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Nenhuma despesa encontrada para este período.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
                        Tipo
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">
                        Fornecedor
                      </th>
                      <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">
                        Valor
                      </th>
                      <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">
                        Documento
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {despesas.map((despesa) => (
                      <tr
                        key={despesa.id_local}
                        className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm">
                          {formatDate(despesa.dataDocumento)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {despesa.tipoDespesa}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {despesa.nomeFornecedor}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-yellow-500">
                          {formatCurrency(despesa.valorLiquido)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          {despesa.urlDocumento ? (
                            <a
                              href={despesa.urlDocumento}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-500 hover:text-yellow-400 underline"
                            >
                              {despesa.numDocumento}
                            </a>
                          ) : (
                            <span className="text-gray-400">{despesa.numDocumento}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-gray-400">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Link para voltar */}
        <div className="mt-8 text-center">
          <Link
            href="/deputados"
            className="inline-block px-6 py-3 bg-gray-800 text-yellow-500 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Voltar para lista de deputados
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

