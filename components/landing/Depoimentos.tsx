'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const depoimentos = [
  {
    nome: 'Gabriela M.',
    cidade: 'São Paulo, SP',
    tempo: '1 ano e 8 meses juntos',
    emoji: '😍',
    cor: '#C9768F',
    texto: 'Minha namorada chorou quando abriu. Ela me mandou mensagem às 23h só pra dizer que ia ler de novo. A narrativa ficou tão específica que parecia que alguém que nos conhecia havia escrito.',
    estrelas: 5,
  },
  {
    nome: 'Carlos Eduardo',
    cidade: 'Belo Horizonte, MG',
    tempo: '3 anos de casados',
    emoji: '🥹',
    cor: '#C9A96E',
    texto: 'Usei no aniversário de 3 anos da minha esposa. Ela disse que foi o presente mais criativo que já recebeu na vida. Pagamos menos que um buquê e o impacto foi 10x maior.',
    estrelas: 5,
  },
  {
    nome: 'Letícia F.',
    cidade: 'Curitiba, PR',
    tempo: '2 anos juntos',
    emoji: '🤧',
    cor: '#9B8EC4',
    texto: 'O modo colaborativo foi incrível! Pedi pra família dele contribuir e quando ele abriu a página, tinha mensagens da mãe, dos irmãos... Ficou em silêncio por uns 2 minutos lendo.',
    estrelas: 5,
  },
  {
    nome: 'Lucas & Mariana',
    cidade: 'Florianópolis, SC',
    tempo: 'Dia dos Namorados 2025',
    emoji: '❤️',
    cor: '#C9768F',
    texto: 'Fiz de surpresa pra ela. Quando abriu no Dia dos Namorados, ficou em silêncio por um minuto inteiro. Depois me abraçou e não soltou mais. Melhor R$ 19,90 que já gastei.',
    estrelas: 5,
  },
  {
    nome: 'Priscila R.',
    cidade: 'Porto Alegre, RS',
    tempo: '8 meses juntos',
    emoji: '🥰',
    cor: '#7D9B76',
    texto: 'Em 15 minutos estava tudo pronto. A narrativa era tão bonita que eu mesma me emocionei lendo antes de enviar.',
    estrelas: 5,
  },
]

function Estrelas() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-[#C9A96E] text-[#C9A96E]" />
      ))}
    </div>
  )
}

export default function Depoimentos() {
  const [featured, ...resto] = depoimentos

  return (
    <section className="py-16 lg:py-32 px-6 lg:px-8" style={{ background: '#0d0612' }}>
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10 lg:mb-20">
          <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#C9768F' }}>quem já usou</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4" style={{ color: '#F0E4D4' }}>
            Reações reais
          </h2>
          <p className="text-lg" style={{ color: 'rgba(240,228,212,0.55)' }}>
            Mais de 2.000 casais que vão lembrar desse presente para sempre.
          </p>
        </motion.div>

        {/* Depoimento em destaque */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl p-6 sm:p-10 mb-6 sm:mb-8 overflow-hidden border"
          style={{ background: 'rgba(201,118,143,0.07)', borderColor: 'rgba(201,118,143,0.25)' }}>

          <div className="absolute top-4 left-6 font-display font-bold select-none pointer-events-none leading-none"
            style={{ fontSize: '7rem', color: '#C9768F', opacity: 0.06 }}>&ldquo;</div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <Estrelas />
            <p className="font-display text-xl sm:text-3xl leading-relaxed mt-4 sm:mt-6 mb-5 sm:mb-8 italic"
              style={{ color: '#F0E4D4' }}>
              &ldquo;{featured.texto}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg border"
                style={{ background: `rgba(${featured.cor === '#C9768F' ? '201,118,143' : '201,169,110'},0.12)`, borderColor: `${featured.cor}44` }}>
                {featured.emoji}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm" style={{ color: '#F0E4D4' }}>{featured.nome}</p>
                <p className="text-xs font-medium" style={{ color: '#C9768F' }}>{featured.tempo}</p>
                <p className="text-xs" style={{ color: 'rgba(240,228,212,0.45)' }}>{featured.cidade}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resto.map((dep, i) => (
            <motion.div key={dep.nome}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl p-5 border"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(240,228,212,0.08)' }}>
              <Estrelas />
              <p className="text-sm leading-relaxed mt-4 mb-4 italic" style={{ color: 'rgba(240,228,212,0.65)' }}>
                &ldquo;{dep.texto.length > 130 ? dep.texto.slice(0, 130) + '...' : dep.texto}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm border"
                  style={{ background: `${dep.cor}12`, borderColor: `${dep.cor}30` }}>
                  {dep.emoji}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#F0E4D4' }}>{dep.nome}</p>
                  <p className="text-xs font-medium" style={{ color: '#C9768F' }}>{dep.tempo}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rating */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(240,228,212,0.1)' }}>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#C9A96E] text-[#C9A96E]" />)}
            </div>
            <span className="font-bold" style={{ color: '#F0E4D4' }}>5.0</span>
            <span className="text-sm" style={{ color: 'rgba(240,228,212,0.5)' }}>· 2.000+ avaliações</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
