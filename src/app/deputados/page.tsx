"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Deputado {
  id_local: number;
  id: number;
  uri: string;
  nome: string;
  siglaPartido: string;
  uriPartido: string;
  siglaUf: string;
  idLegislatura: number;
  urlFoto: string;
  email: string;
}

export default function DeputadosPage() {
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroPartido, setFiltroPartido] = useState("");
  const [filtroUF, setFiltroUF] = useState("");
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAll, setTotalAll] = useState(0);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [allDeputados, setAllDeputados] = useState<Deputado[]>([]);
  const [searchDebounce, setSearchDebounce] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 640);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Debounce para busca por nome
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    // Reset para primeira página quando filtros mudarem
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchDeputados();
    }
  }, [searchDebounce, filtroPartido, filtroUF]);

  useEffect(() => {
    fetchDeputados();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    // Carregar todos os deputados para os filtros
    fetchAllDeputados();
  }, []);

  const fetchAllDeputados = async () => {
    try {
      const response = await fetch("https://oja-back-production.up.railway.app/deputado/list?page=1&limit=0");
      if (response.ok) {
        const responseData = await response.json();
        // Filtrar deputados de exemplo para os dropdowns
        const deputadosReais = responseData.data.filter((d: Deputado) => d.siglaPartido !== "ABC");
        setAllDeputados(deputadosReais);
      }
    } catch (err) {
      console.error("Erro ao carregar todos os deputados para filtros:", err);
    }
  };

  const fetchDeputados = async () => {
    try {
      setLoading(true);
      
      // Construir parâmetros da URL
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });
      
      // Adicionar filtros se existirem (usando os nomes corretos do backend)
      if (searchDebounce.trim()) {
        params.append('nome', searchDebounce.trim());
      }
      if (filtroPartido) {
        params.append('partido', filtroPartido);
      }
      if (filtroUF) {
        params.append('estado', filtroUF);
      }
      
      const url = `https://oja-back-production.up.railway.app/deputado/list?${params.toString()}`;
      console.log('Fetching URL:', url); // Debug
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar deputados: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Response data:', responseData); // Debug
      
      setDeputados(responseData.data);
      setTotalAll(responseData.totalAll);
      setTotal(responseData.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Os dados já vêm filtrados do backend, apenas remover deputados de exemplo
  const deputadosFiltrados = deputados.filter((deputado) => {
    return deputado.siglaPartido !== "ABC";
  });

  // Listas únicas para os filtros (excluindo dados de exemplo)
  const partidos = [...new Set(allDeputados
    .filter(d => d.siglaPartido !== "ABC")
    .map(d => d.siglaPartido)
  )].sort();
  
  const ufs = [...new Set(allDeputados
    .filter(d => d.siglaPartido !== "ABC")
    .map(d => d.siglaUf)
  )].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Carregando deputados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Erro ao carregar dados</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchDeputados}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/image.png"
                alt="Janela Aberta logo"
                width={40}
                height={40}
              />
              <div>
                <h1 className="text-white font-bold text-xl">Operação Janela Aberta</h1>
                <p className="text-gray-400 text-sm">Deputados Federais</p>
              </div>
            </div>
            <a
              href="/"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              ← Voltar ao início
            </a>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <section className="bg-gray-800 py-8 border-b border-gray-700">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca por nome */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Buscar por nome
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite o nome do deputado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                />
                {searchTerm && searchTerm !== searchDebounce && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Filtro por partido */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Partido
              </label>
              <select
                value={filtroPartido}
                onChange={(e) => setFiltroPartido(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
              >
                <option value="">Todos os partidos</option>
                {partidos.map(partido => (
                  <option key={partido} value={partido}>{partido}</option>
                ))}
              </select>
            </div>

            {/* Filtro por UF */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Estado (UF)
              </label>
              <select
                value={filtroUF}
                onChange={(e) => setFiltroUF(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
              >
                <option value="">Todos os estados</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contador de resultados e controles de visualização */}
          <div className="mt-4 flex flex-col gap-4">
            <div className="text-gray-400 text-sm">
              {itemsPerPage === 0 ? (
                <>Mostrando {deputadosFiltrados.length} deputados</>
              ) : (
                <>
                  Mostrando {deputadosFiltrados.length} de {total} deputados (página {currentPage} de {Math.ceil(total / itemsPerPage) || 1})
                  <br />
                  {(searchDebounce || filtroPartido || filtroUF) && (
                    <span className="text-yellow-400">Filtros aplicados • </span>
                  )}
                  Total no sistema: {totalAll} deputados
                </>
              )}
            </div>
            
            {/* Controles de paginação e visualização */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Controle de itens por página */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm whitespace-nowrap">Por página:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-yellow-400"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={0}>Todos</option>
                </select>
              </div>

              {/* Toggle de visualização */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm whitespace-nowrap">Visualização:</span>
                <div className="flex bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-yellow-400 text-black font-medium' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    🔲 Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-yellow-400 text-black font-medium' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    📋 Lista
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botão para limpar filtros */}
          {(searchTerm || filtroPartido || filtroUF) && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFiltroPartido("");
                  setFiltroUF("");
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors duration-300 flex items-center gap-2"
              >
                🗑️ Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lista de Deputados */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {deputadosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-white text-2xl font-bold mb-4">Nenhum deputado encontrado</h3>
              <p className="text-gray-400">
                Tente ajustar os filtros ou termo de busca
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                : 'grid-cols-1 gap-4'
            }`}>
              {deputadosFiltrados.map((deputado) => (
                <div
                  key={deputado.id}
                  className={`bg-gray-800 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20 group ${
                    viewMode === 'list' ? 'flex flex-row items-stretch min-h-[140px]' : 'flex flex-col'
                  }`}
                >
                  {/* Foto do deputado */}
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' 
                      ? 'w-32 flex-shrink-0 rounded-l-xl' 
                      : 'h-48 w-full rounded-t-xl'
                  }`}>
                    {imageErrors.has(deputado.id) || !deputado.urlFoto ? (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">👤</div>
                          <p className="text-gray-400 text-xs">Sem foto</p>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={deputado.urlFoto}
                        alt={deputado.nome}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => {
                          setImageErrors(prev => new Set([...prev, deputado.id]));
                        }}
                      />
                    )}
                  </div>

                  {/* Informações do deputado */}
                  <div className={`flex-1 flex flex-col ${
                    viewMode === 'list' ? 'p-4 justify-between' : 'p-6'
                  }`}>
                    <div className="flex-1">
                      <h3 className={`text-white font-bold mb-2 line-clamp-2 ${
                        viewMode === 'list' ? 'text-base leading-tight' : 'text-lg'
                      }`}>
                        {deputado.nome}
                      </h3>
                      
                      <div className={`space-y-2 ${viewMode === 'list' ? 'mb-3' : 'mb-4'}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-medium">
                            {deputado.siglaPartido}
                          </span>
                          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                            {deputado.siglaUf}
                          </span>
                        </div>
                        
                        {viewMode === 'grid' && (
                          <div className="text-gray-400 text-sm break-words">
                            📧 {deputado.email || 'Email não disponível'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className={`flex gap-2 ${
                      viewMode === 'list' ? 'flex-col' : 'flex-row'
                    }`}>
                      {deputado.uri && (
                        <a
                          href={deputado.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`bg-gray-700 hover:bg-gray-600 text-white text-center py-2 px-3 rounded-lg text-xs transition-colors duration-300 ${
                            viewMode === 'list' ? 'flex-shrink-0' : 'flex-1'
                          }`}
                        >
                          Ver Perfil
                        </a>
                      )}
                      <button className={`bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-300 ${
                        viewMode === 'list' ? 'flex-shrink-0' : 'flex-1'
                      }`}>
                        Ver Gastos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Controles de paginação */}
          {itemsPerPage !== 0 && total > itemsPerPage && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="text-gray-400 text-sm text-center">
                Página {currentPage} de {Math.ceil(total / itemsPerPage)} • {total} resultados encontrados
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors duration-300"
                >
                  ← Anterior
                </button>
                
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                  {/* Páginas */}
                  {(() => {
                    const totalPages = Math.ceil(total / itemsPerPage);
                    const pages = [];
                    const maxVisiblePages = isMobile ? 3 : 5; // Menos páginas no mobile
                    
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    
                    if (endPage - startPage < maxVisiblePages - 1) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    // Primeira página
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          className="px-2 sm:px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300 text-sm"
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(<span key="ellipsis1" className="text-gray-400 px-1 text-sm">...</span>);
                      }
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`px-2 sm:px-3 py-2 rounded-lg transition-colors duration-300 text-sm ${
                            currentPage === i
                              ? 'bg-yellow-400 text-black font-medium'
                              : 'bg-gray-700 hover:bg-gray-600 text-white'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }

                    // Última página
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="text-gray-400 px-1 text-sm">...</span>);
                      }
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                          className="px-2 sm:px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300 text-sm"
                        >
                          {totalPages}
                        </button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= Math.ceil(total / itemsPerPage)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors duration-300"
                >
                  Próxima →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 border-t border-gray-700">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Operação Janela Aberta - Dados obtidos da API oficial da Câmara dos Deputados
          </p>
        </div>
      </footer>
    </div>
  );
}
