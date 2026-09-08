"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://oja-back-production.up.railway.app' : 'http://localhost:3333');

export default function Home() {
  const [anos, setAnos] = useState<number[] | null>(null);
  const [ultimaImportacao, setUltimaImportacao] = useState<string | null>(null);

  // Cobertura e data da última importação vêm da API — nunca do texto fixo,
  // para a página não afirmar um período que a base não tem.
  useEffect(() => {
    const buscarCobertura = async () => {
      try {
        const [anosRes, atualizacaoRes] = await Promise.all([
          fetch(`${API_URL}/despesa/anos-disponiveis`),
          fetch(`${API_URL}/estatisticas/ultima-atualizacao`),
        ]);

        if (anosRes.ok) {
          const dados = await anosRes.json();
          if (Array.isArray(dados) && dados.length > 0) {
            setAnos([...dados].sort((a, b) => a - b));
          }
        }

        if (atualizacaoRes.ok) {
          const dados = await atualizacaoRes.json();
          setUltimaImportacao(dados.lastUpdate ?? null);
        }
      } catch (err) {
        console.error('Erro ao buscar cobertura dos dados:', err);
      }
    };

    buscarCobertura();
  }, []);

  const periodoCoberto = anos
    ? anos.length === 1
      ? String(anos[0])
      : `${anos[0]} a ${anos[anos.length - 1]}`
    : null;

  const dataImportacao = ultimaImportacao
    ? new Date(ultimaImportacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  useEffect(() => {
    // Parallax effect
    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const speed = Number(htmlElement.getAttribute('data-speed')) || 0.5;
        const yPos = -(scrolled * speed);
        htmlElement.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleParallax);

    return () => {
      window.removeEventListener('scroll', handleParallax);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden parallax-container min-h-screen flex items-center">
        {/* Video Background */}
        <video
          className="video-background"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/7710243/7710243-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        </video>
        
        {/* Video Overlay */}
        <div className="video-overlay"></div>
        
        {/* Parallax Background Elements */}
        <div className="parallax-element absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" data-speed="0.3"></div>
        
        <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
          <div className="max-w-5xl mx-auto text-center parallax-element" data-speed="0.2">
            <div className="mb-8">
              <Image
                src="/image.png"
                alt="Janela Aberta logo"
                width={120}
                height={120}
                priority
                className="mx-auto float-animation hover-glow"
              />
            </div>
            <h1 className="text-4xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Operação <span className="gradient-text">Janela Aberta</span>
            </h1>
            <p className="text-xl lg:text-3xl text-gray-300 mb-4 leading-relaxed">
              Plataforma completa para análise e fiscalização dos gastos públicos
            </p>
            <p className="text-lg lg:text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Explore rankings, estatísticas e informações detalhadas sobre a Cota para Exercício da Atividade Parlamentar (CEAP) dos deputados federais, a partir dos dados abertos da Câmara.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/ceap" 
                className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg text-lg font-bold cursor-pointer transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explorar Dados do CEAP
              </Link>
              <Link 
                href="/chat" 
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-lg text-lg font-medium cursor-pointer transition-all hover:scale-105 backdrop-blur-sm"
              >
                Conversar com IA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problema Section */}
      <section className="bg-red-950/30 py-16 lg:py-24 border-y border-red-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="text-red-400 text-6xl mb-4 block">⚠️</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                O Problema que Resolvemos
              </h2>
            </div>
            <div className="bg-gray-900/50 rounded-2xl p-8 border border-red-900/30 mb-8">
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                O Portal da Câmara dos Deputados, principal fonte oficial de dados do CEAP, sofre com <strong className="text-red-400">instabilidades e erros recorrentes</strong> que dificultam o acesso contínuo à informação.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Esses problemas comprometem a confiabilidade dos dados e limitam a capacidade dos cidadãos de exercer o <strong className="text-yellow-400">controle social</strong> sobre os gastos públicos.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <div className="text-4xl mb-4">❌</div>
                <h3 className="text-white font-bold mb-2">Instabilidade</h3>
                <p className="text-gray-400 text-sm">Falhas técnicas frequentes no portal oficial</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-white font-bold mb-2">Acesso Limitado</h3>
                <p className="text-gray-400 text-sm">Dificuldade para cidadãos acessarem informações</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-white font-bold mb-2">Dados Desorganizados</h3>
                <p className="text-gray-400 text-sm">Falta de organização e visualização clara</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solução Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Nossa Solução
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Uma plataforma estável, acessível e completa que organiza e simplifica os dados abertos de gastos parlamentares, 
              utilizando boas práticas de design, linguagem acessível e recursos visuais interativos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-2xl border border-yellow-500/30 hover-lift card-animate">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 hover-glow">
                <span className="text-2xl text-black">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rankings e Estatísticas</h3>
              <p className="text-gray-700 leading-relaxed">
                Visualize rankings de deputados, partidos e estados. Explore o gastômetro e análises detalhadas dos gastos públicos.
              </p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl border border-blue-500/30 hover-lift card-animate">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 hover-glow float-animation">
                <span className="text-2xl text-white">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Exploração Interativa</h3>
              <p className="text-gray-700 leading-relaxed">
                Filtre por estado, ano, partido ou categoria. Compare gastos, identifique padrões e analise fornecedores de forma intuitiva.
              </p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl border border-green-500/30 hover-lift card-animate">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 hover-glow">
                <span className="text-2xl text-white">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">IA como Diferencial</h3>
              <p className="text-gray-700 leading-relaxed">
                Converse naturalmente com o Guardião da Transparência. Faça perguntas complexas e obtenha respostas instantâneas sobre os gastos públicos.
              </p>
            </div>
          </div>
          
          {/* CTAs na seção Solução */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link 
              href="/ceap" 
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-bold text-lg cursor-pointer transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ver Rankings e Estatísticas
            </Link>
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg cursor-pointer transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Conversar com IA
            </Link>
          </div>
        </div>
      </section>

      {/* Funcionalidades Principais Section */}
      <section className="bg-gray-900 py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Funcionalidades da Plataforma
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Uma plataforma completa para análise e fiscalização dos gastos públicos com a CEAP
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <div className="space-y-6">
                {/* Gastômetro */}
                <div className="flex gap-4 hover-lift bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-lg border border-yellow-500/30">
                  <div className="w-14 h-14 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-black text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Gastômetro
                    </h3>
                    <p className="text-gray-300">
                      Visualize o total gasto com a CEAP no período disponível. Filtre por ano ou veja tudo de uma vez. 
                      Veja quantos deputados têm despesas registradas e o total de despesas processadas.
                    </p>
                  </div>
                </div>
                
                {/* Rankings */}
                <div className="flex gap-4 hover-lift bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                  <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-2xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Rankings Detalhados</h3>
                    <p className="text-gray-300">
                      Rankings dos 10 deputados que mais gastaram, com filtros por estado e ano. 
                      Veja também os principais fornecedores que receberam recursos públicos.
                    </p>
                  </div>
                </div>
                
                {/* Comparações */}
                <div className="flex gap-4 hover-lift bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                  <div className="w-14 h-14 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-2xl">⚖️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Comparações e Análises</h3>
                    <p className="text-gray-300">
                      Compare gastos entre deputados, partidos políticos e estados. 
                      Veja como cada deputado se compara com a média do seu estado.
                    </p>
                  </div>
                </div>
                
                {/* Informações Básicas */}
                <div className="flex gap-4 hover-lift bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                  <div className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-2xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Informações sobre CEAP</h3>
                    <p className="text-gray-300">
                      Entenda o que é a Cota para Exercício da Atividade Parlamentar, como funciona, 
                      quais despesas são cobertas e como os valores são utilizados.
                    </p>
                  </div>
                </div>

                {/* IA como Diferencial */}
                <div className="flex gap-4 hover-lift bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                  <div className="w-14 h-14 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-2xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Guardião da Transparência (IA)
                    </h3>
                    <p className="text-gray-300">
                      <strong className="text-yellow-400">Diferencial:</strong> Converse em português natural e obtenha 
                      análises complexas sobre rankings, médias, comparações e estatísticas dos gastos públicos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Explore a Plataforma</h3>
              <div className="space-y-4 mb-6">
                <Link 
                  href="/ceap"
                  className="block bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30 hover:border-yellow-500 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-black text-xl">📊</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Rankings e Gastômetro</h4>
                      <p className="text-gray-400 text-sm">Veja os deputados que mais gastaram e o total de gastos</p>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  href="/deputados"
                  className="block bg-gray-700/50 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">👥</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Lista de Deputados</h4>
                      <p className="text-gray-400 text-sm">Explore os gastos individuais de cada deputado</p>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  href="/chat"
                  className="block bg-gray-700/50 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">💬</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Conversar com IA</h4>
                      <p className="text-gray-400 text-sm">Faça perguntas em linguagem natural sobre os gastos</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-xs text-center">
                  💡 Todas as funcionalidades estão disponíveis de forma gratuita e sem necessidade de cadastro
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão e Objetivo Section */}
      <section className="bg-slate-900 py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                Nossa Missão
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Empoderar o cidadão comum para exercer seu papel fiscalizador, promovendo maior engajamento democrático 
                e contribuindo para a redução da opacidade nos gastos públicos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="text-yellow-400 text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-4">Objetivo Geral</h3>
                <p className="text-gray-300 leading-relaxed">
                  Desenvolver uma plataforma digital interativa que colete, processe e visualize dados públicos da CEAP, 
                  com foco na facilitação da compreensão, comparação e <strong className="text-yellow-400">auditoria cidadã</strong>, 
                  promovendo uma participação ativa da sociedade civil no controle dos gastos públicos.
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="text-blue-400 text-5xl mb-4">🌐</div>
                <h3 className="text-2xl font-bold text-white mb-4">Acessibilidade</h3>
                <p className="text-gray-300 leading-relaxed">
                  Utilizamos linguagem acessível, recursos visuais interativos e boas práticas de design para tornar 
                  os dados compreensíveis para <strong className="text-blue-400">qualquer pessoa</strong>, independentemente 
                  do nível de escolaridade ou conhecimento técnico.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-2xl p-8 border border-yellow-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Controle Social e Transparência
              </h3>
              <p className="text-gray-300 text-center leading-relaxed max-w-3xl mx-auto">
                Acreditamos que a transparência é fundamental para uma democracia saudável. Nossa plataforma facilita 
                o acesso à informação pública, permitindo que cidadãos exerçam seu direito de fiscalizar os gastos públicos 
                de forma simples, rápida e eficiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Garantias de Qualidade */}
      <section className="bg-gray-900 py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              De onde vêm os dados
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {periodoCoberto
                ? `Despesas de ${periodoCoberto}, importadas do portal de dados abertos da Câmara dos Deputados.`
                : 'Despesas importadas do portal de dados abertos da Câmara dos Deputados.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover-lift">
              <div className="text-green-400 text-4xl mb-4">✅</div>
              <h4 className="text-white font-bold mb-3 text-lg">Fonte oficial</h4>
              <p className="text-gray-300">
                Todos os números vêm do portal de dados abertos da Câmara dos Deputados.
                Nenhum valor é editado aqui: o que a plataforma mostra é o que a Câmara publica.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover-lift">
              <div className="text-blue-400 text-4xl mb-4">🔄</div>
              <h4 className="text-white font-bold mb-3 text-lg">Importação periódica</h4>
              <p className="text-gray-300">
                A base é reimportada manualmente, não em tempo real.
                {dataImportacao
                  ? ` A carga mais recente é de ${dataImportacao}.`
                  : ' A data da carga mais recente aparece na página do CEAP.'}
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover-lift">
              <div className="text-yellow-400 text-4xl mb-4">🛡️</div>
              <h4 className="text-white font-bold mb-3 text-lg">Consulta agregada</h4>
              <p className="text-gray-300">
                Rankings, totais e comparações são calculados sobre uma base própria,
                em vez de paginar a API oficial a cada pergunta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-16 lg:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-black mb-6">
            Comece a Explorar os Dados Agora
          </h2>
          <p className="text-xl text-gray-900 mb-8 max-w-2xl mx-auto">
            Acesse rankings, estatísticas e informações detalhadas sobre os gastos públicos com a CEAP
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/ceap" 
              className="inline-flex items-center justify-center bg-black hover:bg-gray-900 text-yellow-500 px-8 py-4 rounded-lg text-lg font-bold cursor-pointer transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ver Rankings e Gastômetro
            </Link>
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 border-2 border-black text-black px-8 py-4 rounded-lg text-lg font-bold cursor-pointer transition-all hover:scale-105 backdrop-blur-sm"
            >
              Conversar com IA
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Image
                src="/image.png"
                alt="Janela Aberta logo"
                width={40}
                height={40}
              />
              <div>
                <p className="text-white font-bold">Operação Janela Aberta</p>
                <p className="text-gray-400 text-sm">© {new Date().getFullYear()} - Transparência Pública e Controle Social</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm text-center lg:text-right">
              <p>Plataforma completa para análise dos gastos públicos</p>
              <p className="mt-1">Dados oficiais da Câmara dos Deputados</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
