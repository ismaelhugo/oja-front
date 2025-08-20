"use client";
import Image from "next/image";
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
          {/* Fallback para navegadores que não suportam vídeo */}
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
                Transparência e acesso à informação pública no Brasil através de inteligência artificial
              </p>
              <div className="bg-yellow-400/20 border-2 border-yellow-400 rounded-lg p-6 backdrop-blur-sm hover-lift shimmer">
                <p className="text-yellow-300 font-bold text-lg mb-2">🚀 Lançamento em Breve</p>
                <p className="text-gray-300">
                  Estamos finalizando os últimos detalhes para trazer transparência completa aos gastos públicos
                </p>
              </div>
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
                    💡 Nossa IA analisará os dados do CEAP e responderá suas perguntas sobre gastos públicos
                  </p>
                </div>
                <div className="text-center">
                  <span className="inline-block bg-yellow-400/20 border border-yellow-400 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium hover-glow">
                    Em Desenvolvimento
                  </span>
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Facilitar o acesso às informações de despesas dos deputados federais brasileiros através de interfaces acessíveis e intuitivas
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-700 hover-lift card-animate">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 hover-glow">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Dados CEAP</h3>
              <p className="text-gray-300 leading-relaxed">
                Acesso completo aos dados de despesas da Cota para Exercício da Atividade Parlamentar
              </p>
            </div>
            
            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-yellow-500/20 hover-lift card-animate">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 hover-glow float-animation">
                <span className="text-2xl text-black">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Mobile First</h3>
              <p className="text-gray-300 leading-relaxed">
                Interface otimizada para dispositivos móveis, garantindo acessibilidade para todos os públicos
              </p>
            </div>
            
            <div className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-700 hover-lift card-animate">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 hover-glow">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">IA Conversacional</h3>
              <p className="text-gray-300 leading-relaxed">
                Agente LLM que permite consultas em linguagem natural sobre gastos públicos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section className="bg-gray-900 py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Funcionalidades
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ferramentas poderosas para análise e compreensão dos gastos públicos
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex gap-4 hover-lift">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-black text-xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Gráficos Interativos</h3>
                    <p className="text-gray-300">
                      Visualizações dinâmicas dos gastos por categoria, período e deputado
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 hover-lift">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-xl">⚖️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Comparações</h3>
                    <p className="text-gray-300">
                      Compare gastos entre deputados, estados e partidos políticos
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 hover-lift">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Rankings</h3>
                    <p className="text-gray-300">
                      Rankings de gastos por diferentes categorias e critérios
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 hover-lift">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 hover-glow">
                    <span className="text-white text-xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Análise de Fornecedores</h3>
                    <p className="text-gray-300">
                      Identifique principais fornecedores e padrões de contratação
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Exemplos de Consultas</h3>
              <p className="text-gray-400 text-sm mb-4">Clique nos exemplos para ver como diferentes tipos de perguntas podem ser feitas:</p>
              <div className="space-y-4">
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Quanto o deputado Eduardo Bolsonaro gastou em 2024 com combustível?"
                  </p>
                </div>
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Quais são os principais fornecedores do deputado Marcelo Freixo?"
                  </p>
                </div>
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Compare os gastos com passagens aéreas entre deputados de SP"
                  </p>
                </div>
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Mostre o ranking de gastos com alimentação em 2024"
                  </p>
                </div>
                <div className="query-example bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-200 font-medium">
                    "Qual o total gasto por deputados do PT em divulgação parlamentar?"
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-xs text-center">
                  💡 Dica: Nossa IA entende perguntas em linguagem natural e pode responder sobre qualquer aspecto dos gastos públicos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - Processo Técnico */}
      <section className="bg-slate-900 py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-6">
              Processo transparente e confiável de coleta, processamento e consulta de dados públicos
            </p>
            
            {/* Open Source Badge */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="bg-gray-800 border border-yellow-500/30 rounded-full px-6 py-3 flex items-center gap-3 hover-glow">
                <span className="text-2xl">🌟</span>
                <div className="text-left">
                  <p className="text-yellow-400 font-semibold text-sm">Projeto Open Source</p>
                  <p className="text-gray-300 text-xs">Código aberto, transparente e colaborativo</p>
                </div>
              </div>
              <div className="bg-gray-800 border border-green-500/30 rounded-full px-6 py-3 flex items-center gap-3 hover-glow">
                <span className="text-2xl">🚀</span>
                <div className="text-left">
                  <p className="text-green-400 font-semibold text-sm">Contribuições Bem-vindas</p>
                  <p className="text-gray-300 text-xs">Participe do desenvolvimento no GitHub</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Visual */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="grid lg:grid-cols-4 gap-8 mb-12">
              
              {/* Etapa 1: Coleta */}
              <div className="pipeline-step hover-lift relative">
                <div className="flow-step-number">1</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                    <span className="text-black text-2xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Coleta Automática</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Dados coletados diretamente da API oficial da Câmara dos Deputados
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    <span className="tech-badge">REST API</span>
                    <span className="tech-badge">HTTPS</span>
                    <span className="tech-badge">JSON</span>
                  </div>
                </div>
                <div className="pipeline-connector hidden lg:block"></div>
              </div>

              {/* Etapa 2: Transformação */}
              <div className="pipeline-step hover-lift relative">
                <div className="flow-step-number">2</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                    <span className="text-black text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Processamento</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Limpeza, validação e estruturação dos dados brutos
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    <span className="tech-badge">ETL Pipeline</span>
                    <span className="tech-badge">Data Validation</span>
                    <span className="tech-badge">PostgreSQL</span>
                  </div>
                </div>
                <div className="pipeline-connector hidden lg:block"></div>
              </div>

              {/* Etapa 3: Indexação */}
              <div className="pipeline-step hover-lift relative">
                <div className="flow-step-number">3</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                    <span className="text-black text-2xl">🗂️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Indexação IA</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Vetorização para consultas em linguagem natural
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    <span className="tech-badge">Vector DB</span>
                    <span className="tech-badge">Embeddings</span>
                    <span className="tech-badge">Semantic Search</span>
                  </div>
                </div>
                <div className="pipeline-connector hidden lg:block"></div>
              </div>

              {/* Etapa 4: Consulta */}
              <div className="pipeline-step hover-lift relative">
                <div className="flow-step-number">4</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 hover-glow">
                    <span className="text-black text-2xl">🤖</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">IA Conversacional</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Interface conversacional para perguntas em português
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    <span className="tech-badge">LLM</span>
                    <span className="tech-badge">RAG</span>
                    <span className="tech-badge">Natural Language</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalhes Técnicos */}
          <div className="grid lg:grid-cols-1 gap-12 mb-16">
            {/* Fonte de Dados */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover-lift max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-yellow-400">📡</span>
                Fonte de Dados Oficial
              </h3>
              <div className="space-y-4">
                <div className="security-badge">
                  <span>🔒</span>
                  <span>Dados Abertos Oficiais</span>
                </div>
                <div className="code-block">
                  <div className="api-endpoint">GET</div> dadosabertos.camara.leg.br/api/v2/deputados
                  <br />
                  <div className="json-key">"ano"</div>: <div className="json-value">"2024"</div>
                  <br />
                  <div className="json-key">"despesas"</div>: <div className="json-value">[]</div>
                </div>
                <p className="text-gray-300 text-sm">
                  Utilizamos exclusivamente dados oficiais da API da Câmara dos Deputados, 
                  garantindo autenticidade e rastreabilidade de todas as informações.
                </p>
              </div>
            </div>
          </div>

          {/* Fluxo de Consulta Detalhado */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 data-wave">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Fluxo de Consulta em Tempo Real
            </h3>
            <div className="grid md:grid-cols-9 gap-2 items-center">
              <div className="text-center flow-step-animated">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 data-flow-circle">
                  <span className="text-white">👤</span>
                </div>
                <p className="text-gray-300 text-sm">Usuário faz pergunta</p>
              </div>
              
              <div className="text-center flow-arrow-animated">
                <span className="flow-arrow hidden md:block text-yellow-400 text-xl animate-pulse">→</span>
              </div>
              
              <div className="text-center flow-step-animated">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 data-flow-circle">
                  <span className="text-black">🔍</span>
                </div>
                <p className="text-gray-300 text-sm">Análise semântica</p>
              </div>
              
              <div className="text-center flow-arrow-animated">
                <span className="flow-arrow hidden md:block text-yellow-400 text-xl animate-pulse">→</span>
              </div>
              
              <div className="text-center flow-step-animated">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2 data-flow-circle">
                  <span className="text-white">🗃️</span>
                </div>
                <p className="text-gray-300 text-sm">Busca no banco</p>
              </div>
              
              <div className="text-center flow-arrow-animated">
                <span className="flow-arrow hidden md:block text-yellow-400 text-xl animate-pulse">→</span>
              </div>
              
              <div className="text-center flow-step-animated">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 data-flow-circle">
                  <span className="text-white">🤖</span>
                </div>
                <p className="text-gray-300 text-sm">IA processa contexto</p>
              </div>
              
              <div className="text-center flow-arrow-animated">
                <span className="flow-arrow hidden md:block text-yellow-400 text-xl animate-pulse">→</span>
              </div>
              
              <div className="text-center flow-step-animated">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 data-flow-circle">
                  <span className="text-white">📊</span>
                </div>
                <p className="text-gray-300 text-sm">Resposta formatada</p>
              </div>
            </div>
            
            {/* Indicador de performance */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex justify-center items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Tempo médio: &lt;2s</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Processamento em tempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Resposta contextualizada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Garantias de Qualidade */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Garantias de Qualidade</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover-lift">
                <div className="text-green-400 text-3xl mb-4">✅</div>
                <h4 className="text-white font-bold mb-2">Dados Verificados</h4>
                <p className="text-gray-300 text-sm">
                  Validação automática contra a fonte oficial a cada atualização
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover-lift">
                <div className="text-blue-400 text-3xl mb-4">🔄</div>
                <h4 className="text-white font-bold mb-2">Atualização Contínua</h4>
                <p className="text-gray-300 text-sm">
                  Sincronização diária com os dados mais recentes da Câmara
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover-lift">
                <div className="text-yellow-400 text-3xl mb-4">🛡️</div>
                <h4 className="text-white font-bold mb-2">Transparência Total</h4>
                <p className="text-gray-300 text-sm">
                  Código aberto e metodologia de processamento documentada
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source e Colaboração */}
      <section className="bg-gray-900 py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 flex items-center justify-center gap-4">
                <span className="text-4xl">🌍</span>
                Projeto Open Source
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Acreditamos na transparência total. Por isso, todo o código fonte do projeto está disponível publicamente, 
                permitindo auditoria, colaboração e melhorias contínuas da comunidade.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Benefícios Open Source */}
              <div className="space-y-6">
                <div className="flex items-start gap-4 hover-lift">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Transparência Completa</h3>
                    <p className="text-gray-300">
                      Todo o processo de coleta, tratamento e apresentação dos dados pode ser auditado pela comunidade.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 hover-lift">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Colaboração Comunitária</h3>
                    <p className="text-gray-300">
                      Desenvolvedores, jornalistas e cidadãos podem contribuir com melhorias, correções e novas funcionalidades.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 hover-lift">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Evolução Contínua</h3>
                    <p className="text-gray-300">
                      A comunidade pode sugerir melhorias, reportar problemas e participar do desenvolvimento de novas features.
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action para GitHub */}
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-black text-3xl">💻</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Participe do Desenvolvimento</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Este é um projeto <strong>open source</strong> que aceita contribuições via <strong>fork + pull request</strong>. 
                    Você pode contribuir com:
                  </p>
                  
                  <div className="space-y-2 mb-8">
                    <div className="tech-badge">🐛 Correções de bugs</div>
                    <div className="tech-badge">✨ Novas funcionalidades</div>
                    <div className="tech-badge">🎨 Melhorias de UI/UX</div>
                    <div className="tech-badge">📚 Documentação</div>
                    <div className="tech-badge">🧪 Testes automatizados</div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4 border border-yellow-500/20 mb-6">
                    <h4 className="text-yellow-300 font-semibold mb-2">Como Contribuir:</h4>
                    <div className="text-left text-sm text-gray-300 space-y-1">
                      <p>1. 🍴 <strong>Fork</strong> o repositório</p>
                      <p>2. 🌿 Crie uma <strong>branch</strong> para sua feature</p>
                      <p>3. 💻 Faça suas <strong>alterações</strong></p>
                      <p>4. 🔃 Abra um <strong>Pull Request</strong></p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://github.com/ismaelhugo/oja-front"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg flex items-center gap-2"
                    >
                      <span>⭐</span>
                      Ver no GitHub
                    </a>
                    <a
                      href="https://github.com/ismaelhugo/oja-front/blob/main/CONTRIBUTING.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2"
                    >
                      <span>📋</span>
                      Guia de Contribuição
                    </a>
                  </div>

                  <p className="text-gray-400 text-xs mt-4">
                    💡 Todas as contribuições passam por revisão antes do merge
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-black py-16 lg:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Promovendo a Transparência Pública
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Acreditamos que a transparência é fundamental para uma democracia saudável. 
            Nosso projeto democratiza o acesso à informação pública através da tecnologia.
          </p>
          <div className="bg-yellow-400/10 border-2 border-yellow-400 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">🚀 Lançamento em Breve</h3>
            <p className="text-gray-300 text-lg mb-6">
              Estamos trabalhando para trazer uma plataforma completa de transparência pública. 
              Em breve você poderá consultar todos os gastos dos deputados federais de forma simples e intuitiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/ismaelhugo/oja-front"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg flex items-center gap-2 justify-center"
              >
                <span>⭐</span>
                Acompanhar no GitHub
              </a>
              <a
                href="https://github.com/ismaelhugo/oja-front/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2 justify-center"
              >
                <span>🤝</span>
                Como Contribuir
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
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
                <p className="text-gray-400 text-sm">© 2025 - Transparência Pública</p>
              </div>
            </div>
            <div className="flex gap-6">
              <a
                href="https://github.com/ismaelhugo/oja-front"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                GitHub
              </a>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">
                Lançamento em Breve
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
