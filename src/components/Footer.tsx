'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm text-center md:text-left">
            <p>© {new Date().getFullYear()} Operação Janela Aberta. Todos os direitos reservados.</p>
          </div>
          <div className="text-gray-400 text-sm text-center md:text-right">
            <p>
              Sugestões e bugs:{' '}
              <a
                href="mailto:ihangra@ufrrj.br"
                className="text-yellow-500 hover:text-yellow-400 transition-colors underline"
              >
                ihangra@ufrrj.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

