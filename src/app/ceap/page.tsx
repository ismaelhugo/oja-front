'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface DeputadoRanking {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  totalGastos: number;
  quantidadeDespesas: number;
  posicao: number;
  mediaEstado: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

interface TotalGeral {
  totalGastos: number;
  totalDespesas: number;
  totalDeputados: number;
}

interface FornecedorRanking {
  nomeFornecedor: string;
  cnpjCpfFornecedor?: string;
  total: number;
  quantidade: number;
  percentual: number;
  posicao: number;
}

export default function CEAPPage() {
  const [ranking, setRanking] = useState<DeputadoRanking[]>([]);
  const [fornecedores, setFornecedores] = useState<FornecedorRanking[]>([]);
  const [estados, setEstados] = useState<string[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>('GERAL');
  const [anoSelecionado, setAnoSelecionado] = useState<number | 'TODA_LEGISLATURA'>(2025);
  const [totalGeral, setTotalGeral] = useState<TotalGeral | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingFornecedores, setLoadingFornecedores] = useState(true);
  const [loadingGastometro, setLoadingGastometro] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEstadoDropdownOpen, setIsEstadoDropdownOpen] = useState(false);
  const [isAnoDropdownOpen, setIsAnoDropdownOpen] = useState(false);
  const estadoDropdownRef = useRef<HTMLDivElement | null>(null);
  const anoDropdownRef = useRef<HTMLDivElement | null>(null);

  const availableYears = [2023, 2024, 2025, 2026];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        estadoDropdownRef.current &&
        !estadoDropdownRef.current.contains(event.target as Node)
      ) {
        setIsEstadoDropdownOpen(false);
      }
      if (
        anoDropdownRef.current &&
        !anoDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAnoDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Buscar estados disponíveis
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch(`${API_URL}/estatisticas/estados`);
        if (!response.ok) throw new Error('Erro ao buscar estados');
        const data = await response.json();
        setEstados(data);
      } catch (err) {
        console.error('Erro ao buscar estados:', err);
      }
    };

    fetchEstados();
  }, []);

  // Buscar última atualização
  useEffect(() => {
    const fetchLastUpdate = async () => {
      try {
        const response = await fetch(`${API_URL}/estatisticas/ultima-atualizacao`);
        if (response.ok) {
          const data = await response.json();
          setLastUpdate(data.lastUpdate);
        }
      } catch (err) {
        console.error('Erro ao buscar última atualização:', err);
      }
    };

    fetchLastUpdate();
  }, []);

  // Função para formatar a última atualização
  const formatLastUpdate = (dateString: string | null) => {
    if (!dateString) return 'Carregando...';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const safeDiffMs = Math.max(0, diffMs);
    const diffDays = Math.floor(safeDiffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    return `A ${diffDays} dias`;
  };

  // Buscar total geral quando ano mudar
  useEffect(() => {
    const fetchTotalGeral = async () => {
      try {
        setLoadingGastometro(true);

        const anoParam =
          anoSelecionado === 'TODA_LEGISLATURA' ? undefined : anoSelecionado;

        let url = `${API_URL}/estatisticas/total-geral`;
        if (anoParam) {
          url += `?year=${anoParam}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar total geral');
        const data = await response.json();
        setTotalGeral(data);
      } catch (err) {
        console.error('Erro ao buscar total geral:', err);
      } finally {
        setLoadingGastometro(false);
      }
    };

    fetchTotalGeral();
  }, [anoSelecionado]);

  // Buscar ranking quando estado ou ano mudar
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        setError(null);

        const estadoParam =
          estadoSelecionado === 'GERAL' ? undefined : estadoSelecionado;
        const anoParam =
          anoSelecionado === 'TODA_LEGISLATURA' ? undefined : anoSelecionado;

        let url = `${API_URL}/estatisticas/ranking-deputados?limit=10`;
        if (estadoParam) {
          url += `&estado=${estadoParam}`;
        }
        if (anoParam) {
          url += `&year=${anoParam}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar ranking');
        const data = await response.json();
        setRanking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [estadoSelecionado, anoSelecionado]);

  // Buscar ranking de fornecedores quando ano mudar
  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        setLoadingFornecedores(true);

        const anoParam =
          anoSelecionado === 'TODA_LEGISLATURA' ? undefined : anoSelecionado;

        let url = `${API_URL}/estatisticas/ranking-fornecedores?limit=10`;
        if (anoParam) {
          url += `&year=${anoParam}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar fornecedores');
        const data = await response.json();
        setFornecedores(
          data.map((f: any, index: number) => ({
            ...f,
            posicao: index + 1,
          })),
        );
      } catch (err) {
        console.error('Erro ao buscar fornecedores:', err);
      } finally {
        setLoadingFornecedores(false);
      }
    };

    fetchFornecedores();
  }, [anoSelecionado]);

  const estadosComGeral = [
    { value: 'GERAL', label: 'Geral (Todos os Estados)' },
    ...estados.map((uf) => ({ value: uf, label: uf })),
  ];

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
        {/* Informações sobre CEAP */}
        <div className="mb-8 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg p-6 border border-yellow-500/30">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">
            O que é a CEAP?
          </h2>
          <div className="space-y-3 text-gray-300 leading-relaxed">
            <p>
              A Cota para o Exercício da Atividade Parlamentar (CEAP) custeia
              as despesas do mandato, como passagens aéreas e conta de celular.
              Algumas são reembolsadas, como as com os Correios, e outras são
              pagas por débito automático, como a compra de passagens.
            </p>
            <p>
              Nos casos de reembolso, os deputados têm três meses para
              apresentar os recibos. O valor mensal não utilizado fica
              acumulado ao longo do ano - isso explica porque em alguns meses o
              valor gasto pode ser maior que a média mensal.
            </p>
          </div>
          <div className="mt-6">
            <a
              href="https://www2.camara.leg.br/a-camara/documentos-e-pesquisa/arquivo/sites-tematicos/57a-legislatura/no-exercicio-do-mandato/cota-para-o-exercicio-da-atividade-parlamentar-ceap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Saiba mais
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Gastômetro */}
        <div className="mb-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-8 text-center border border-yellow-400 relative overflow-hidden">
          {/* Efeito de moedas caindo */}
          {totalGeral && !loadingGastometro && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute coin-fall"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    className="mario-coin"
                  >
                    <defs>
                      <linearGradient id={`coinGradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
                        <stop offset="50%" stopColor="#FFA500" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FFD700" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id={`coinGradientInner-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF8DC" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FFD700" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    {/* Brilho externo */}
                    <circle
                      cx="16"
                      cy="16"
                      r="15"
                      fill={`url(#coinGradient-${i})`}
                      stroke="#FFD700"
                      strokeWidth="1"
                    />
                    {/* Brilho interno */}
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      fill={`url(#coinGradientInner-${i})`}
                      opacity="0.8"
                    />
                    {/* Símbolo R$ */}
                    <text
                      x="16"
                      y="20"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill="#8B6914"
                      fontFamily="Arial, sans-serif"
                    >
                      R$
                    </text>
                  </svg>
                </div>
              ))}
            </div>
          )}
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black relative z-10">
            GASTÔMETRO
          </h2>
          {loadingGastometro ? (
            <div className="py-4 relative z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
              <p className="text-gray-800 text-sm">Carregando...</p>
            </div>
          ) : totalGeral ? (
            <div className="relative z-10">
              <p className="text-gray-900 text-sm md:text-base mb-2 font-medium">
                {anoSelecionado === 'TODA_LEGISLATURA'
                  ? 'Total gasto em toda a legislatura'
                  : `Total gasto em ${anoSelecionado}`}
              </p>
              <h3 className="text-4xl md:text-6xl font-bold text-black mb-4">
                {formatCurrency(totalGeral.totalGastos)}
              </h3>
              <div className="flex flex-wrap justify-center gap-6 mt-6 text-black">
                <div className="bg-black/10 rounded-lg px-4 py-2">
                  <p className="text-xs font-medium text-gray-900">Total de despesas</p>
                  <p className="text-lg font-bold">
                    {totalGeral.totalDespesas.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="bg-black/10 rounded-lg px-4 py-2">
                  <p className="text-xs font-medium text-gray-900">Deputados com despesas</p>
                  <p className="text-lg font-bold">{totalGeral.totalDeputados}</p>
                </div>
              </div>
              {lastUpdate && (
                <span className="block mt-4 text-xs text-gray-800/80 font-medium">
                  Última atualização: {formatLastUpdate(lastUpdate)}
                </span>
              )}
            </div>
          ) : (
            <p className="text-gray-800 relative z-10">Erro ao carregar dados</p>
          )}
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-500">
            Ranking 
          </h1>
          <p className="text-gray-300 text-lg">
            Os 10 deputados que mais gastaram com a Cota para Exercício da
            Atividade Parlamentar
          </p>
        </div>
        <div className="mb-8 bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex flex-wrap items-center gap-6">
            {/* Filtro de Estado */}
            <div className="flex items-center gap-3" ref={estadoDropdownRef}>
              <span className="text-gray-300 text-sm font-medium">
                Filtrar por estado:
              </span>
              <div className="relative inline-block min-w-[16rem]">
                <button
                  type="button"
                  onClick={() => setIsEstadoDropdownOpen((prev) => !prev)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors cursor-pointer flex items-center justify-between gap-2 w-full"
                  aria-haspopup="listbox"
                  aria-expanded={isEstadoDropdownOpen}
                >
                  {estadosComGeral.find((e) => e.value === estadoSelecionado)
                    ?.label || 'Selecione um estado'}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isEstadoDropdownOpen ? 'rotate-180' : ''
                    }`}
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
                {isEstadoDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                    role="listbox"
                  >
                    {estadosComGeral.map((estado) => (
                      <button
                        key={estado.value}
                        type="button"
                        onClick={() => {
                          setEstadoSelecionado(estado.value);
                          setIsEstadoDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          estadoSelecionado === estado.value
                            ? 'bg-yellow-500 text-black font-semibold'
                            : 'text-white hover:bg-gray-700'
                        }`}
                        role="option"
                        aria-selected={estadoSelecionado === estado.value}
                      >
                        {estado.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filtro de Ano */}
            <div className="flex items-center gap-3" ref={anoDropdownRef}>
              <span className="text-gray-300 text-sm font-medium">
                Filtrar por ano:
              </span>
              <div className="relative inline-block min-w-[12rem]">
                <button
                  type="button"
                  onClick={() => setIsAnoDropdownOpen((prev) => !prev)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors cursor-pointer flex items-center justify-between gap-2 w-full"
                  aria-haspopup="listbox"
                  aria-expanded={isAnoDropdownOpen}
                >
                  {anoSelecionado === 'TODA_LEGISLATURA'
                    ? 'Toda legislatura'
                    : anoSelecionado}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isAnoDropdownOpen ? 'rotate-180' : ''
                    }`}
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
                {isAnoDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
                    role="listbox"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAnoSelecionado('TODA_LEGISLATURA');
                        setIsAnoDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        anoSelecionado === 'TODA_LEGISLATURA'
                          ? 'bg-yellow-500 text-black font-semibold'
                          : 'text-white hover:bg-gray-700'
                      }`}
                      role="option"
                      aria-selected={anoSelecionado === 'TODA_LEGISLATURA'}
                    >
                      Toda legislatura
                    </button>
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setAnoSelecionado(year);
                          setIsAnoDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          anoSelecionado === year
                            ? 'bg-yellow-500 text-black font-semibold'
                            : 'text-white hover:bg-gray-700'
                        }`}
                        role="option"
                        aria-selected={anoSelecionado === year}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando ranking...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-8">
            <p className="text-red-400">Erro: {error}</p>
          </div>
        )}

        {/* Rankings - Deputados e Fornecedores */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ranking de Deputados */}
          {!loading && !error && ranking.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-yellow-500">
                Top 10 Deputados
                {estadoSelecionado !== 'GERAL' && (
                  <span className="text-white"> - {estadoSelecionado}</span>
                )}
                {anoSelecionado !== 'TODA_LEGISLATURA' && (
                  <span className="text-white"> ({anoSelecionado})</span>
                )}
                {anoSelecionado === 'TODA_LEGISLATURA' && (
                  <span className="text-white"> (Toda legislatura)</span>
                )}
              </h2>
            <div className="space-y-4">
              {ranking.map((deputado) => (
                <Link
                  key={deputado.id}
                  href={`/deputados/${deputado.id}`}
                  className="block"
                >
                  <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
                    {/* Posição */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-lg">
                      {deputado.posicao}
                    </div>

                    {/* Foto */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                      <Image
                        src={deputado.urlFoto}
                        alt={deputado.nome}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1 truncate">
                        {deputado.nome}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm mb-2">
                        <span className="text-gray-400">
                          {deputado.siglaPartido}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">
                          {deputado.siglaUf}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">
                          {deputado.quantidadeDespesas} despesa
                          {deputado.quantidadeDespesas !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Média do estado ({deputado.siglaUf}):{' '}
                        <span className="text-gray-400 font-medium">
                          {formatCurrency(deputado.mediaEstado)}
                        </span>
                      </div>
                    </div>

                    {/* Total de Gastos */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-yellow-500">
                        {formatCurrency(deputado.totalGastos)}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">Total gasto</p>
                      {deputado.mediaEstado > 0 && (
                        <div className="mt-2">
                          {deputado.totalGastos > deputado.mediaEstado ? (
                            <p className="text-red-400 text-xs font-medium">
                              ↑{' '}
                              {(
                                ((deputado.totalGastos - deputado.mediaEstado) /
                                  deputado.mediaEstado) *
                                100
                              ).toFixed(1)}
                              % acima da média
                            </p>
                          ) : (
                            <p className="text-green-400 text-xs font-medium">
                              ↓{' '}
                              {(
                                ((deputado.mediaEstado - deputado.totalGastos) /
                                  deputado.mediaEstado) *
                                100
                              ).toFixed(1)}
                              % abaixo da média
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          )}

          {/* Ranking de Fornecedores */}
          {!loadingFornecedores && fornecedores.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-yellow-500">
                Top 10 Fornecedores
                {anoSelecionado !== 'TODA_LEGISLATURA' && (
                  <span className="text-white"> ({anoSelecionado})</span>
                )}
                {anoSelecionado === 'TODA_LEGISLATURA' && (
                  <span className="text-white"> (Toda legislatura)</span>
                )}
              </h2>
              <div className="space-y-4">
                {fornecedores.map((fornecedor) => (
                  <div
                    key={`${fornecedor.nomeFornecedor}-${fornecedor.posicao}`}
                    className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors"
                  >
                    {/* Posição */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-lg">
                      {fornecedor.posicao}
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1 truncate">
                        {fornecedor.nomeFornecedor}
                      </h3>
                      {fornecedor.cnpjCpfFornecedor && (
                        <p className="text-gray-400 text-xs mb-2 truncate">
                          {fornecedor.cnpjCpfFornecedor}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="text-gray-400">
                          {fornecedor.quantidade} despesa
                          {fornecedor.quantidade !== 1 ? 's' : ''}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">
                          {fornecedor.percentual.toFixed(2)}% do total
                        </span>
                      </div>
                    </div>

                    {/* Total Recebido */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-yellow-500">
                        {formatCurrency(fornecedor.total)}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">Total recebido</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading Fornecedores */}
          {loadingFornecedores && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Carregando fornecedores...</p>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {!loading && !error && ranking.length === 0 && (
          <div className="bg-gray-900 rounded-lg p-12 text-center border border-gray-800">
            <p className="text-gray-400 text-lg">
              Nenhum deputado encontrado para o estado selecionado.
            </p>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

