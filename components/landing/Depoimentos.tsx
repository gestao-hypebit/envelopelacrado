'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const depoimentos = [
  {
    nome: 'Gabriela M.',
    cidade: 'São Paulo, SP',
    emoji: '😍',
    cor: '#C9768F',
    texto: 'Minha namorada chorou quando abriu. Ela me mandou mensagem às 23h só pra dizer que ia ler de novo. A narrativa ficou tão específica que parecia que alguém que nos conhecia tinha escrito.',
    estrelas: 5,
  },
  {
    nome: 'Carlos Eduardo',
    cidade: 'Belo Horizonte, MG',
    emoji: '🥹',
    cor: '#C9A96E',
    texto: 'Usei no aniversário de 3 anos da minha esposa. Ela disse que foi o presente mais criativo que já recebeu na vida. Pagamos menos que um buquê e o impacto foi 10x maior.',
    estrelas: 5,
  },
  {
    nome: 'Letícia F.',
    cidade: 'Curitiba, PR',
    emoji: '🤧',
    cor: '#9B8EC4',
    texto: 'O modo colaborativo foi incrível! Pedi para a família dele contribuir e quando ele abriu a página, tinha mensagens da mãe, dos irmãos... Ele ficou em silêncio por uns 2 minutos lendo.',
    estrelas: 5,
  },
  {
    nome: 'André & Camila',
    cidade: 'Rio de Janeiro, RJ',
    emoji: '❤️',
    cor: '#C9768F',
    texto: 'Criamos juntos para celebrar 5 anos. Colocamos fotos de cada viagem, os apelidos que a gente tem... A IA capturou perfeitamente o nosso tom.',
    estrelas: 5,
  },
  {
    nome: 'Priscila R.',
    cidade: 'Porto Alegre, RS',
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
    <section className="py-32 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-20">
          <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#C9768F' }}>quem já usou</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4" style={{ color: '#1a0e14' }}>
            Reações reais
          </h2>
          <p className="text-lg" style={{ color: '#A0785A' }}>
            Mais de 2.000 casais que vão lembrar desse presente para sempre.
          </p>
        </motion.div>

        {/* Depoimento em destaque */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl p-10 mb-8 overflow-hidden border"
          style={{ background: 'linear-gradient(135deg, #FEF2F5, #FFF8F2)', borderColor: '#F5C6D4' }}>

          <div className="absolute top-4 left-6 font-display font-bold select-none pointer-events-none leading-none"
            style={{ fontSize: '7rem', color: '#C9768F', opacity: 0.07 }}>&ldquo;</div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <Estrelas />
            <p className="font-display text-2xl sm:text-3xl leading-relaxed mt-6 mb-8 italic"
              style={{ color: '#3a1a2a' }}>
              &ldquo;{featured.texto}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg border"
                style={{ background: `${featured.cor}15`, borderColor: `${featured.cor}33` }}>
                {featured.emoji}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm" style={{ color: '#1a0e14' }}>{featured.nome}</p>
                <p className="text-xs" style={{ color: '#A0785A' }}>{featured.cidade}</p>
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
              style={{ background: '#FAFAF8', borderColor: '#F5EDE3' }}>
              <Estrelas />
              <p className="text-sm leading-relaxed mt-4 mb-4 italic" style={{ color: '#7a6070' }}>
                &ldquo;{dep.texto.length > 130 ? dep.texto.slice(0, 130) + '...' : dep.texto}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm border"
                  style={{ background: `${dep.cor}10`, borderColor: `${dep.cor}25` }}>
                  {dep.emoji}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#1a0e14' }}>{dep.nome}</p>
                  <p className="text-xs" style={{ color: '#A0785A' }}>{dep.cidade}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rating */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
            style={{ background: 'white', borderColor: '#F5EDE3', boxShadow: '0 2px 12px rgba(201,118,143,0.08)' }}>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#C9A96E] text-[#C9A96E]" />)}
            </div>
            <span className="font-bold" style={{ color: '#1a0e14' }}>5.0</span>
            <span className="text-sm" style={{ color: '#A0785A' }}>· 2.000+ avaliações</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
