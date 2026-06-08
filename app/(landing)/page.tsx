import Hero from '@/components/landing/Hero'
import ComoFunciona from '@/components/landing/ComoFunciona'
import PreviewSection from '@/components/landing/PreviewSection'
import Diferenciais from '@/components/landing/Diferenciais'
import Depoimentos from '@/components/landing/Depoimentos'
import Precos from '@/components/landing/Precos'
import Link from 'next/link'

const faqItems = [
  {
    pergunta: 'A página fica no ar para sempre?',
    resposta: 'Sim! Você paga uma vez e a página fica no ar para sempre. Sem mensalidades, sem surpresas.',
  },
  {
    pergunta: 'Posso editar depois?',
    resposta: 'Sim, você pode editar textos, fotos e regenerar a narrativa da IA quando quiser, pelo seu dashboard.',
  },
  {
    pergunta: 'Em quanto tempo fica pronto?',
    resposta: 'Na hora! Assim que o pagamento é confirmado, você recebe o link e o QR Code por email. Todo o processo leva menos de 10 minutos.',
  },
  {
    pergunta: 'Meu par precisa ter conta ou instalar algo?',
    resposta: 'Não. É só apontar o celular para o QR Code (ou clicar no link) e abrir no navegador. Funciona em qualquer celular.',
  },
  {
    pergunta: 'Como funciona a IA?',
    resposta: 'Você descreve a história do casal — como se conheceram, momentos marcantes, apelidos — e nossa IA escreve uma narrativa única e poética, específica para vocês. Sem textos genéricos.',
  },
  {
    pergunta: 'Posso usar para noivado ou pedido de namoro?',
    resposta: 'Sim! Muita gente usa justamente para isso. O site é perfeito para momentos especiais de qualquer tipo.',
  },
]

export default function LandingPage() {
  return (
    <main>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: 'rgba(250,250,248,0.9)', borderColor: '#F5EDE3' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <span className="font-display text-xl font-bold" style={{ color: '#C9768F' }}>💌 Envelope Lacrado</span>
          <div className="flex items-center gap-6">
            <a href="#como-funciona" className="hidden sm:block text-sm transition-colors hover:text-[#C9768F]" style={{ color: '#A0785A' }}>
              Como funciona
            </a>
            <a href="#preco" className="hidden sm:block text-sm transition-colors hover:text-[#C9768F]" style={{ color: '#A0785A' }}>
              Preço
            </a>
            <Link href="/criar"
              className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)' }}>
              Criar agora
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <Hero />

        <div id="demo-preview">
          <PreviewSection />
        </div>

        <div id="como-funciona">
          <ComoFunciona />
        </div>

        <Diferenciais />

        <Depoimentos />

        <div id="preco">
          <Precos />
        </div>

        {/* FAQ */}
        <section className="py-28 px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#C9768F' }}>Dúvidas</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3" style={{ color: '#1a0e14' }}>
                Perguntas frequentes
              </h2>
            </div>
            <div className="space-y-3">
              {faqItems.map((item) => (
                <details key={item.pergunta} className="group rounded-2xl overflow-hidden border"
                  style={{ background: '#FAFAF8', borderColor: '#F5EDE3' }}>
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[#F5EDE3] transition-colors"
                    style={{ color: '#1a0e14' }}>
                    <span className="font-semibold pr-4">{item.pergunta}</span>
                    <span className="text-xl leading-none flex-shrink-0 transition-transform group-open:rotate-45"
                      style={{ color: '#C9768F' }}>+</span>
                  </summary>
                  <div className="px-6 pb-6 leading-relaxed" style={{ color: '#7a6070' }}>
                    {item.resposta}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-28 px-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #C9768F 0%, #b5607a 50%, #C9A96E 100%)' }}>
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-widest uppercase font-semibold mb-4 text-white/70">
              comece agora
            </p>
            <h2 className="font-display text-4xl sm:text-6xl font-bold mb-4 text-white">
              Pronto para emocionar?
            </h2>
            <p className="text-lg mb-10 text-white/80">
              Menos de 10 minutos. R$ 19,90. A história de vocês, para sempre.
            </p>
            <Link href="/criar"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-lg font-bold transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              style={{ background: 'white', color: '#C9768F', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
              Criar minha surpresa →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 text-center bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="font-display text-xl font-bold mb-2" style={{ color: '#C9768F' }}>💌 Envelope Lacrado</div>
            <p className="text-sm mb-6 text-gray-400">A história de vocês, lacrada com amor.</p>
            <div className="flex items-center justify-center gap-6 text-sm mb-6 text-gray-500">
              <a href="#como-funciona" className="hover:text-[#C9768F] transition-colors">Como funciona</a>
              <a href="#preco" className="hover:text-[#C9768F] transition-colors">Preço</a>
              <Link href="/criar" className="hover:text-[#C9768F] transition-colors">Criar</Link>
            </div>
            <p className="text-xs text-gray-700">Feito com amor no Brasil · © 2026 Envelope Lacrado</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
