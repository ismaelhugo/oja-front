"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Typewriter animation
    const questions = [
      "O deputado Eduardo Bolsonaro gastou quanto no total em 2024?",
      "Qual o ranking de gastos dos deputados do Rio de Janeiro?",
      "Quanto foi gasto com passagens aéreas por deputados de SP?",
      "Quais os principais fornecedores do deputado Lula Silva?",
      "Compare os gastos com combustível entre PT e PSDB",
      "Mostre os deputados que mais gastaram com alimentação",
      "Quanto custaram os aluguéis de carros em 2024?",
      "Quais deputados gastaram mais com telefonia?",
      "Ranking de gastos com hospedagem dos deputados",
      "Despesas com divulgação da atividade parlamentar em 2024"
    ];

    let questionIndex = Math.floor(Math.random() * questions.length);
    let charIndex = 0;
    let isDeleting = false;
    let usedQuestions = new Set();
    const typewriterElement = document.getElementById('typewriter-text');
    const cursorElement = document.getElementById('cursor');

    if (!typewriterElement || !cursorElement) return;

    // Função para obter próxima pergunta aleatória
    const getRandomQuestionIndex = () => {
      // Se todas as perguntas foram usadas, reinicia o conjunto
      if (usedQuestions.size >= questions.length) {
        usedQuestions.clear();
      }
      
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * questions.length);
      } while (usedQuestions.has(randomIndex));
      
      usedQuestions.add(randomIndex);
      return randomIndex;
    };

    // Velocidades variáveis para parecer mais humano
    const getTypeSpeed = () => Math.random() * 50 + 50; // 50-100ms
    const deleteSpeed = 30;
    const pauseTime = 2500;

    function typeWriter() {
      const currentQuestion = questions[questionIndex];
      
      if (!typewriterElement || !cursorElement) return;
      
      if (!isDeleting && charIndex < currentQuestion.length) {
        // Digitando
        typewriterElement.textContent = currentQuestion.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeWriter, getTypeSpeed());
      } else if (isDeleting && charIndex > 0) {
        // Apagando
        typewriterElement.textContent = currentQuestion.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeWriter, deleteSpeed);
      } else {
        // Mudança de estado
        if (!isDeleting) {
          // Pausar antes de apagar
          setTimeout(() => {
            isDeleting = true;
            typeWriter();
          }, pauseTime);
        } else {
          // Próxima pergunta aleatória
          isDeleting = false;
          questionIndex = getRandomQuestionIndex();
          setTimeout(typeWriter, 800);
        }
      }
    }

    // Iniciar a animação após um pequeno delay
    const timeoutId = setTimeout(typeWriter, 1500);

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

    // Interatividade dos Exemplos de Consultas
    const handleQueryExamples = () => {
      const queryExamples = document.querySelectorAll('.query-example');
      
      queryExamples.forEach((example, index) => {
        const htmlElement = example as HTMLElement;
        
        // Adicionar evento de click
        htmlElement.addEventListener('click', () => {
          // Remover classe 'active' de todos os exemplos
          queryExamples.forEach(ex => ex.classList.remove('active'));
          
          // Adicionar classe 'active' ao exemplo clicado
          htmlElement.classList.add('active');
          
          // Efeito de brilho ao clicar
          htmlElement.classList.add('clicked');
          setTimeout(() => {
            htmlElement.classList.remove('clicked');
          }, 500);
        });
      });

      // Definir o primeiro exemplo como ativo por padrão
      if (queryExamples.length > 0) {
        queryExamples[0].classList.add('active');
      }
    };

    // Aguardar um pouco para garantir que os elementos estejam no DOM
    const queryTimeout = setTimeout(handleQueryExamples, 2000);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(queryTimeout);
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
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left parallax-element" data-speed="0.2">
              <div className="mb-6">
                <Image
                  src="/image.png"
                  alt="Janela Aberta logo"
                  width={120}
                  height={120}
                  priority
                  className="mx-auto lg:mx-0 float-animation hover-glow"
                />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Operação <span className="gradient-text">Janela Aberta</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                Inteligência artificial para análise completa dos gastos públicos. Converse naturalmente e obtenha insights profundos sobre despesas de deputados federais.
              </p>
            </div>
            <div className="flex-1 lg:flex-none parallax-element" data-speed="0.1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover-lift card-animate">
                <h3 className="text-2xl font-bold text-white mb-4">Pergunte em linguagem natural</h3>
                <div className="bg-white rounded-lg p-4 mb-4 min-h-[60px] flex items-center search-input-simulation hover-glow">
                  <div className="flex items-center w-full">
                    <span className="text-gray-500 mr-3 text-lg">🔍</span>
                    <div className="flex-1">
                      <span id="typewriter-text" className="text-gray-700 font-medium"></span>
                      <span id="cursor" className="text-gray-700 typewriter-cursor ml-1">|</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mb-4 hover-scale">
                  <p className="text-blue-900 font-medium">
                    💡 Nossa IA entende rankings, médias, comparações e análises estatísticas complexas
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Link 
                    href="/chat" 
                    className="inline-block bg-green-400/20 border border-green-400 text-green-300 px-4 py-2 rounded-full text-sm font-medium hover-glow cursor-pointer transition-all hover:bg-green-400/30 hover:scale-105"
                  >
                    Experimente Agora
                  </Link>
                  <Link 
                    href="/deputados" 
                    className="inline-block bg-yellow-400/20 border border-yellow-400 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium hover-glow cursor-pointer transition-all hover:bg-yellow-400/30 hover:scale-105"
                  >
                    Explore Deputados
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Nossa Missão
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Democratizar o acesso à informação pública através de inteligência artificial, tornando análises complexas 
              de gastos públicos acessíveis a todos através de conversas naturais.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-700 hover-lift card-animate">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 hover-glow">
                <span className="text-2xl text-white">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">IA Conversacional</h3>
              <p className="text-gray-300 leading-relaxed">
                Converse naturalmente com nossa IA. Faça perguntas sobre rankings, médias, comparações e análises estatísticas complexas.
              </p>
            </div>
            
            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-yellow-500/20 hover-lift card-animate">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 hover-glow float-animation">
                <span className="text-2xl text-black">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Análises Profundas</h3>
              <p className="text-gray-300 leading-relaxed">
                Rankings, comparações, médias e estatísticas detalhadas sobre gastos de deputados, partidos e estados.
              </p>
            </div>
            
            <div className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-700 hover-lift card-animate">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 hover-glow">
                <span className="text-2xl text-white">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Respostas Rápidas</h3>
              <p className="text-gray-300 leading-relaxed">
                Análises complexas processadas em segundos, com visualizações interativas e gráficos dinâmicos.
              </p>
            </div>
          </div>
          
          {/* CTAs na seção Missão */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Conversar com IA
            </Link>
            <Link 
              href="/deputados" 
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium cursor-pointer transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ver Deputados
            </Link>
          </div>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section className="bg-gray-900 py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Uma plataforma completa para análise inteligente de gastos públicos
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="space-y-6">
                {/* Agente LLM */}
                <div className="flex gap-4 hover-lift bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-lg border border-yellow-500/30">
                  <div className="w-14 h-14 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-black text-2xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Agente IA Conversacional
                    </h3>
                    <p className="text-gray-300">
                      Converse em português natural. Nossa IA entende contexto, interpreta perguntas complexas e fornece 
                      respostas precisas sobre rankings, médias, comparações e análises estatísticas dos gastos públicos.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 hover-lift bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                  <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-2xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Gráficos Interativos</h3>
                    <p className="text-gray-300">
                      Visualizações dinâmicas de gastos por categoria, período, deputado, partido e estado. 
                      Gráficos atualizados em tempo real conforme você explora os dados.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 hover-lift bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                  <div className="w-14 h-14 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-2xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Rankings Inteligentes</h3>
                    <p className="text-gray-300">
                      Rankings de deputados, partidos e estados por diferentes critérios: maiores gastos, menores gastos, 
                      médias, por categoria de despesa e muito mais.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 hover-lift bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                  <div className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-2xl">⚖️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Comparações Avançadas</h3>
                    <p className="text-gray-300">
                      Compare gastos entre deputados, partidos políticos, estados e períodos diferentes. 
                      Análise lado a lado com métricas detalhadas.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 hover-lift bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                  <div className="w-14 h-14 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Estatísticas e Médias</h3>
                    <p className="text-gray-300">
                      Calcule médias de gastos por partido, estado, categoria. Análise estatística completa com 
                      totais, mínimos, máximos e distribuições.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 hover-lift bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                  <div className="w-14 h-14 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-2xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Análise de Fornecedores</h3>
                    <p className="text-gray-300">
                      Identifique principais fornecedores, padrões de contratação e empresas que mais receberam 
                      recursos públicos de deputados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Exemplos de Consultas</h3>
              <p className="text-gray-400 text-sm mb-6">
                Nossa IA responde perguntas complexas sobre rankings, médias, comparações e análises estatísticas:
              </p>
              <div className="space-y-4">
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Qual o partido que tem a menor média de gasto em 2025?"
                  </p>
                </div>
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Ranking dos deputados que mais gastaram com passagens aéreas"
                  </p>
                </div>
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Compare os gastos entre PT e PL em 2024"
                  </p>
                </div>
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Qual a média de gastos dos deputados de São Paulo?"
                  </p>
                </div>
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Deputados que menos gastaram em 2025"
                  </p>
                </div>
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Gasto médio mensal do deputado Benedita da Silva"
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-xs text-center">
                  💡 A IA entende contexto e pode responder perguntas de acompanhamento como "E o gasto médio por mês?"
                </p>
              </div>
            </div>
          </div>

          {/* Cards de Destaque */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-500/30 hover-lift">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="text-white font-bold mb-2">Análise Contextual</h4>
              <p className="text-gray-300 text-sm">
                A IA entende o contexto da conversa e pode responder perguntas de acompanhamento sem precisar repetir informações.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-500/30 hover-lift">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="text-white font-bold mb-2">Respostas Instantâneas</h4>
              <p className="text-gray-300 text-sm">
                Análises complexas processadas em menos de 2 segundos, mesmo para consultas envolvendo milhões de registros.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30 hover-lift">
              <div className="text-3xl mb-3">🔍</div>
              <h4 className="text-white font-bold mb-2">Busca Inteligente</h4>
              <p className="text-gray-300 text-sm">
                Filtre por ano, mês, legislatura, partido, estado ou período específico. A IA adapta a análise ao que você precisa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - Fluxo do Agente IA */}
      <section className="bg-slate-900 py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Como Funciona o Agente IA
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-6">
              Processo inteligente que transforma sua pergunta em análise completa dos gastos públicos
            </p>
          </div>

          {/* Pipeline Visual */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="grid lg:grid-cols-5 gap-6 mb-12">
              
              {/* Etapa 1: Pergunta */}
              <div className="pipeline-step hover-lift relative">
                <div className="flow-step-number">1</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                    <span className="text-white text-2xl">💬</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Você Pergunta</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Faça perguntas em linguagem natural sobre gastos, rankings, médias ou comparações
                  </p>
                </div>
                <div className="pipeline-connector hidden lg:block"></div>
              </div>

              {/* Etapa 2: Interpretação */}
              <div className="pipeline-step hover-lift relative">
                <div className="flow-step-number">2</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                    <span className="text-black text-2xl">🧠</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">IA Interpreta</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    O agente IA analisa sua pergunta, identifica o tipo de consulta e seleciona as ferramentas adequadas
                  </p>
                </div>
                <div className="pipeline-connector hidden lg:block"></div>
              </div>

              {/* Etapa 3: Busca */}
              <div className="pipeline-step hover-lift relative">
                <div className="flow-step-number">3</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                    <span className="text-white text-2xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Busca no Banco</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Consulta otimizada no banco de dados com milhões de despesas, aplicando filtros e agregações necessárias
                  </p>
                </div>
                <div className="pipeline-connector hidden lg:block"></div>
              </div>

              {/* Etapa 4: Processamento */}
              <div className="pipeline-step hover-lift relative">
                <div className="flow-step-number">4</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                    <span className="text-white text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Processa Dados</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Cálculos de médias, rankings, comparações e estatísticas são processados com precisão
                  </p>
                </div>
                <div className="pipeline-connector hidden lg:block"></div>
              </div>

              {/* Etapa 5: Resposta */}
              <div className="pipeline-step hover-lift relative">
                <div className="flow-step-number">5</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Resposta Completa</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Resposta formatada com dados precisos, gráficos e visualizações interativas quando aplicável
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fluxo de Consulta Detalhado */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 data-wave">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Exemplo de Conversa com o Agente
            </h3>
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                <p className="text-blue-200 text-sm mb-1">👤 Você pergunta:</p>
                <p className="text-white font-medium">"Qual o partido que tem a menor média de gasto?"</p>
              </div>
              <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/30">
                <p className="text-yellow-200 text-sm mb-1">🤖 Agente IA responde:</p>
                <p className="text-white">"O partido com menor média de gasto em 2025 é o <strong>CIDADANIA</strong>, com uma média de R$ 180.176,03 por deputado..."</p>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                <p className="text-blue-200 text-sm mb-1">👤 Você pergunta:</p>
                <p className="text-white font-medium">"E qual os deputados do partido?"</p>
              </div>
              <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/30">
                <p className="text-yellow-200 text-sm mb-1">🤖 Agente IA responde:</p>
                <p className="text-white">"Os deputados do partido CIDADANIA são: • Alex Manente (CIDADANIA/SP) • Amom Mandel (CIDADANIA/AM)..."</p>
              </div>
            </div>
            
            {/* Indicadores */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Resposta em &lt;2s</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Contexto preservado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Dados precisos e atualizados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garantias de Qualidade */}
      <section className="bg-gray-900 py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Dados Confiáveis e Atualizados
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Garantimos precisão e transparência em todas as análises
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover-lift">
              <div className="text-green-400 text-4xl mb-4">✅</div>
              <h4 className="text-white font-bold mb-3 text-lg">Dados Verificados</h4>
              <p className="text-gray-300">
                Validação automática contra a API oficial da Câmara dos Deputados a cada atualização
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover-lift">
              <div className="text-blue-400 text-4xl mb-4">🔄</div>
              <h4 className="text-white font-bold mb-3 text-lg">Atualização Contínua</h4>
              <p className="text-gray-300">
                Sincronização diária com os dados mais recentes da Câmara, garantindo informações sempre atualizadas
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover-lift">
              <div className="text-yellow-400 text-4xl mb-4">🛡️</div>
              <h4 className="text-white font-bold mb-3 text-lg">Metodologia Transparente</h4>
              <p className="text-gray-300">
                Processamento e cálculos realizados de forma transparente, com todas as análises baseadas em dados públicos oficiais
              </p>
            </div>
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
                <p className="text-gray-400 text-sm">© 2025 - Transparência Pública através de IA</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              <p>Análise inteligente dos gastos públicos</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

