'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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

export default function DeputadoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [deputado, setDeputado] = useState<Deputado | null>(null);
  const [stats, setStats] = useState<ExpensesStats | null>(null);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [topFornecedores, setTopFornecedores] = useState<TopFornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [year, setYear] = useState<number>(2025);
  const [deputadoId, setDeputadoId] = useState<number | null>(null);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const itemsPerPage = 20;
  const yearDropdownRef = useRef<HTMLDivElement | null>(null);

  const availableYears = [2023, 2024, 2025];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setIsYearDropdownOpen(false);
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

  // Buscar estatísticas e despesas quando o ano mudar
  useEffect(() => {
    const fetchData = async () => {
      if (!deputadoId) return;

      try {
        setLoading(true);

        // Buscar estatísticas
        const statsRes = await fetch(
          `${API_URL}/estatisticas/deputado/${deputadoId}/gastos?year=${year}`,
        );
        if (!statsRes.ok) throw new Error('Erro ao buscar estatísticas');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Buscar ranking de fornecedores
        const fornecedoresRes = await fetch(
          `${API_URL}/estatisticas/deputado/${deputadoId}/fornecedores?year=${year}&limit=10`,
        );
        if (fornecedoresRes.ok) {
          const fornecedoresData = await fornecedoresRes.json();
          setTopFornecedores(fornecedoresData);
        }

        // Resetar página e buscar despesas
        setCurrentPage(1);
        await fetchDespesas(deputadoId, 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deputadoId, year]);

  const fetchDespesas = async (deputadoId: number, page: number, ano?: number) => {
    try {
      const anoFiltro = ano || year;
      const res = await fetch(
        `${API_URL}/despesa/list?deputadoId=${deputadoId}&page=${page}&limit=${itemsPerPage}&ano=${anoFiltro}`,
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
      fetchDespesas(deputadoId, page);
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
        <div className="mb-6 flex justify-between items-center bg-gray-900 rounded-lg p-4 border border-gray-800">
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
        </div>

        {/* Total de gastos destacado */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-8 mb-8 text-center">
          <p className="text-gray-900 text-sm md:text-base mb-2 font-medium">
            Total de Gastos em {year}
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-black">
            {formatCurrency(totalGasto)}
          </h2>
          {stats && (
            <p className="text-gray-800 text-sm md:text-base mt-2">
              {stats.totalDespesas} despesas registradas
            </p>
          )}
        </div>

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
    </div>
  );
}

