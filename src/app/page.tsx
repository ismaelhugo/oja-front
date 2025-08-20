"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
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

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent"></div>
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-6">
                <Image
                  src="/image.png"
                  alt="Janela Aberta logo"
                  width={120}
                  height={120}
                  priority
                  className="mx-auto lg:mx-0"
                />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Operação <span className="text-yellow-400">Janela Aberta</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                Transparência e acesso à informação pública no Brasil através de inteligência artificial
              </p>
              <div className="bg-yellow-400/20 border-2 border-yellow-400 rounded-lg p-6 backdrop-blur-sm">
                <p className="text-yellow-300 font-bold text-lg mb-2">🚀 Lançamento em Breve</p>
                <p className="text-blue-100">
                  Estamos finalizando os últimos detalhes para trazer transparência completa aos gastos públicos
                </p>
              </div>
            </div>
            <div className="flex-1 lg:flex-none">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Pergunte em linguagem natural</h3>
                <div className="bg-white rounded-lg p-4 mb-4 min-h-[60px] flex items-center search-input-simulation">
                  <div className="flex items-center w-full">
                    <span className="text-gray-500 mr-3 text-lg">🔍</span>
                    <div className="flex-1">
                      <span id="typewriter-text" className="text-gray-700 font-medium"></span>
                      <span id="cursor" className="text-gray-700 typewriter-cursor ml-1">|</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-blue-900 font-medium">
                    💡 Nossa IA analisará os dados do CEAP e responderá suas perguntas sobre gastos públicos
                  </p>
                </div>
                <div className="text-center">
                  <span className="inline-block bg-yellow-400/20 border border-yellow-400 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
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
            <div className="text-center p-8 bg-blue-50 rounded-2xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dados CEAP</h3>
              <p className="text-gray-600 leading-relaxed">
                Acesso completo aos dados de despesas da Cota para Exercício da Atividade Parlamentar
              </p>
            </div>
            
            <div className="text-center p-8 bg-yellow-50 rounded-2xl">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile First</h3>
              <p className="text-gray-600 leading-relaxed">
                Interface otimizada para dispositivos móveis, garantindo acessibilidade para todos os públicos
              </p>
            </div>
            
            <div className="text-center p-8 bg-green-50 rounded-2xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">IA Conversacional</h3>
              <p className="text-gray-600 leading-relaxed">
                Agente LLM que permite consultas em linguagem natural sobre gastos públicos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Funcionalidades
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ferramentas poderosas para análise e compreensão dos gastos públicos
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Gráficos Interativos</h3>
                    <p className="text-gray-600">
                      Visualizações dinâmicas dos gastos por categoria, período e deputado
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">⚖️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Comparações</h3>
                    <p className="text-gray-600">
                      Compare gastos entre deputados, estados e partidos políticos
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Rankings</h3>
                    <p className="text-gray-600">
                      Rankings de gastos por diferentes categorias e critérios
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Análise de Fornecedores</h3>
                    <p className="text-gray-600">
                      Identifique principais fornecedores e padrões de contratação
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Exemplos de Consultas</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-900 font-medium">
                    "Quanto o deputado X gastou em 2024 com combustível?"
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-900 font-medium">
                    "Quais são os principais fornecedores do deputado Y?"
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-yellow-900 font-medium">
                    "Compare os gastos com passagens aéreas entre os deputados de SP"
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-purple-900 font-medium">
                    "Mostre o ranking de gastos com alimentação em 2024"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status do Projeto */}
      <section className="bg-gradient-to-r from-yellow-50 to-blue-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-full px-6 py-3 mb-6">
              <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
              <span className="text-yellow-800 font-semibold">Projeto em Desenvolvimento</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Construindo o Futuro da Transparência
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Estamos trabalhando intensamente para criar uma plataforma que revolucione o acesso à informação pública no Brasil. 
              Nossa equipe está desenvolvendo cada funcionalidade com foco na usabilidade e acessibilidade para todos os cidadãos.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Pesquisa e Planejamento</h3>
                <p className="text-gray-600 text-sm">Análise dos dados CEAP e definição da arquitetura</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-yellow-200">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-yellow-600 text-xl">🔄</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Desenvolvimento</h3>
                <p className="text-gray-600 text-sm">Criação das interfaces e integração com IA</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-xl">⏳</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Testes e Lançamento</h3>
                <p className="text-gray-600 text-sm">Validação final e disponibilização pública</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-900 py-16 lg:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Promovendo a Transparência Pública
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Acreditamos que a transparência é fundamental para uma democracia saudável. 
            Nosso projeto democratiza o acesso à informação pública através da tecnologia.
          </p>
          <div className="bg-yellow-400/10 border-2 border-yellow-400 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">🚀 Lançamento em Breve</h3>
            <p className="text-blue-100 text-lg mb-6">
              Estamos trabalhando para trazer uma plataforma completa de transparência pública. 
              Em breve você poderá consultar todos os gastos dos deputados federais de forma simples e intuitiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/ismaelhugo/oja-front"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg"
              >
                Acompanhar no GitHub
              </a>
              <button className="border-2 border-blue-100 text-blue-100 hover:bg-blue-100 hover:text-blue-900 font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                Receber Notificações
              </button>
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
