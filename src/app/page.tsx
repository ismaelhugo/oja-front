import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[16px] row-start-2 items-center justify-center">
        <Image
          src="/image.png"
          alt="Janela Aberta logo"
          width={200}
          height={200}
          priority
        />
        <div className="flex flex-col gap-2 items-center text-[var(--color-primary)]">
          <h1 className="text-4xl font-bold text-center sm:text-left">
            Operação Janela Aberta
          </h1>
          <p className="text-lg text-center sm:text-left">
            Uma iniciativa utilizando IA para promover a transparência e o acesso à informação
            pública no Brasil.
          </p>
        </div>
      </main>
      <footer className="row-start-3 flex flex-col gap-[24px] flex-wrap items-center justify-center">
        <p>© 2025 Operação Janela Aberta</p>
        <p>
          <a
            href="https://github.com/ismaelhugo/oja-front"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
