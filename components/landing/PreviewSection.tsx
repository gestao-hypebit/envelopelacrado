'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fbq } from '@/components/MetaPixel'

/* ── Helpers ── */
function pad(n: number) { return String(n).padStart(2, '0') }

function useContadorMock() {
  // 2 anos, 3 meses, 22 dias de relacionamento mockado
  const init = Math.floor(2 * 365.25 * 86400 + 3 * 30.44 * 86400 + 22 * 86400 + 8 * 3600 + 42 * 60 + 17)
  const [s, setS] = useState(init)
  useEffect(() => {
    const id = setInterval(() => setS(v => v + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return {
    anos:    Math.floor(s / (365.25 * 86400)),
    meses:   Math.floor((s % (365.25 * 86400)) / (30.44 * 86400)),
    dias:    Math.floor((s % (30.44 * 86400)) / 86400),
    horas:   Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segs:    s % 60,
  }
}

/* ── Dados mockados ── */
const NARRATIVA = [
  'oi numa tarde de outubro, num café no centro que já não existe mais, que Ana e João descobriram que o acaso tem um jeito próprio de apresentar pessoas que vão mudar tudo. Ele chegou atrasado, ela estava prestes a ir embora — trinta segundos a mais e essa história não existiria.',
  'Mas ela ficou. E naquele momento, sem saber, começou a maior aventura das suas vidas. Cada viagem improvisada, cada apelido carinhoso e cada madrugada conversando virou parte de uma linguagem que só eles dois falam.',
  'Que venham mais anos, mais aventuras e muito mais amor. Para sempre juntos.',
]

const MOMENTOS = [
  { emoji: '☕', titulo: 'Primeiro encontro', data: 'Out 2023', bg: 'linear-gradient(135deg,#5c2a3a,#3a1a24)', rot: -3 },
  { emoji: '✈️', titulo: 'Porto de Galinhas', data: 'Jan 2024', bg: 'linear-gradient(135deg,#3a2a0a,#241a06)', rot: 2 },
  { emoji: '💍', titulo: 'Pedido oficial',   data: 'Mar 2024', bg: 'linear-gradient(135deg,#2a1a3a,#1a0e28)', rot: -2 },
]

const GALERIA = [
  { bg: 'linear-gradient(135deg,#5c2a3a,#3a1a24)', emoji: '☕', h: 'aspect-square'  },
  { bg: 'linear-gradient(135deg,#3a2a0a,#241a06)', emoji: '✈️', h: 'aspect-[3/4]'  },
  { bg: 'linear-gradient(135deg,#2a1a3a,#1a0e28)', emoji: '💍', h: 'aspect-[4/3]'  },
  { bg: 'linear-gradient(135deg,#1a3a2a,#0e2418)', emoji: '🎭', h: 'aspect-square'  },
  { bg: 'linear-gradient(135deg,#3a1a3a,#240e24)', emoji: '🌊', h: 'aspect-[3/4]'  },
  { bg: 'linear-gradient(135deg,#1a2a3a,#0e1824)', emoji: '🏖️', h: 'aspect-[4/3]'  },
]

const ANOTACOES = [
  { cor: '#C9768F', emoji: '⏱', titulo: 'Contador ao vivo',     desc: 'Anos, meses, dias, horas, minutos e segundos juntos — atualiza a cada segundo.' },
  { cor: '#C9A96E', emoji: '✨', titulo: 'Narrativa única da IA', desc: 'Texto poético com drop cap, layout de livro. Não é template — é a história deles.' },
  { cor: '#9B8EC4', emoji: '📸', titulo: 'Galeria mosaico',       desc: 'Fotos em mosaico com lightbox. Cada imagem ocupa a tela inteira ao toque.' },
  { cor: '#C9768F', emoji: '🖼️', titulo: 'Polaroids inclinados', desc: 'Timeline em polaroids com rotação e efeito tilt 3D no mouse.' },
  { cor: '#C9A96E', emoji: '♫',  titulo: 'Player de música',      desc: 'Thumbnail do YouTube com play. A música toca direto na página.' },
  { cor: '#9B8EC4', emoji: '🎡', titulo: 'Roleta de programas',   desc: 'Roda interativa que sorteia o próximo programa do casal.' },
  { cor: '#7D9B76', emoji: '💬', titulo: 'Ela pode responder',    desc: 'Messageboard — quem recebe a surpresa escreve de volta na própria página.' },
]

/* ── Seção 1: Contador (cópia fiel do ContadorRelacionamento) ── */
function SecaoContador({ c }: { c: ReturnType<typeof useContadorMock> }) {
  const partesData = [
    c.anos  > 0 ? `${c.anos} ${c.anos  === 1 ? 'ano'  : 'anos'}`  : null,
    c.meses > 0 ? `${c.meses} ${c.meses === 1 ? 'mês' : 'meses'}` : null,
    `${c.dias} ${c.dias === 1 ? 'dia' : 'dias'}`,
  ].filter(Boolean).join(' · ')

  const tempo = `${pad(c.horas)}h ${pad(c.minutos)}min ${pad(c.segs)}s`

  return (
    <div className="relative overflow-hidden text-center" style={{ background: 'linear-gradient(155deg,#1e0818,#0d0612)', paddingTop: 32, paddingBottom: 32 }}>
      {/* Bokeh */}
      {[{ l:'-5%',t:'-8%',s:180 },{ r:'-3%',b:'5%',s:140 }].map((o,i) => (
        <div key={i} className="absolute rounded-full pointer-events-none" style={{ width:o.s, height:o.s, left:o.l, right:(o as any).r, top:o.t, bottom:(o as any).b, background:'#C9768F', filter:'blur(60px)', opacity:0.13, transform:'translate(-50%,-50%)' }} />
      ))}

      {/* Foto central (simula o carrossel) */}
      <div className="flex justify-center mb-5">
        <div className="rounded-2xl overflow-hidden flex items-center justify-center text-3xl relative"
          style={{ width:120, height:158, background:'linear-gradient(135deg,#5c2a3a,#3a1a24)', boxShadow:'0 12px 40px rgba(0,0,0,0.6), 0 0 0 2px rgba(201,118,143,0.3)' }}>
          <span>📸</span>
          {/* Sobreposição lateral */}
          {[-1,1].map((d,i) => (
            <div key={i} className="absolute rounded-2xl" style={{ width:90, height:130, top:'50%', left:'50%', transform:`translate(calc(-50% + ${d*52}px),-50%) scale(0.82)`, background: d<0 ? 'linear-gradient(135deg,#3a2a0a,#241a06)' : 'linear-gradient(135deg,#2a1a3a,#1a0e28)', opacity:0.55, boxShadow:'0 4px 16px rgba(0,0,0,0.45)', zIndex:-1 }} />
          ))}
        </div>
      </div>

      {/* Nome */}
      <h2 className="font-bold tracking-tight mb-3 relative z-10"
        style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1.4rem,4vw,1.9rem)', color:'#F0E4D4', lineHeight:1.1 }}>
        Ana<span style={{ color:'#C9768F' }}> &amp; </span>João
      </h2>
      <div className="w-12 h-px mx-auto mb-3 relative z-10" style={{ background:'linear-gradient(to right,transparent,#C9768F,transparent)' }} />

      {/* unidos há */}
      <p className="relative z-10 text-xs font-semibold tracking-[0.22em] uppercase mb-2" style={{ color:'#C9768F' }}>✦ unidos há ✦</p>

      {/* Counter text — igual ao real */}
      <p className="relative z-10 font-bold mb-1" style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1rem,3vw,1.3rem)', color:'#F0E4D4' }}>
        {partesData}
      </p>
      <p className="relative z-10 tabular-nums text-sm tracking-widest" style={{ color:'rgba(240,228,212,0.42)' }}>
        {tempo}
      </p>
      <p className="relative z-10 text-xs mt-5 tracking-wide" style={{ color:'rgba(240,228,212,0.38)' }}>e contando, segundo a segundo</p>
    </div>
  )
}

/* ── Seção 2: Narrativa (cópia fiel do NarrativaIA) ── */
function SecaoNarrativa() {
  return (
    <div className="py-8 px-5" style={{ background:'#18081c' }}>
      {/* Header com linhas + sparkles */}
      <div className="flex items-center gap-2 mb-5">
        <div className="h-px flex-1" style={{ background:'linear-gradient(to right,transparent,#C9768F)' }} />
        <div className="flex items-center gap-1.5">
          <span style={{ color:'#C9768F', fontSize:'0.6rem' }}>✦</span>
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color:'#C9768F' }}>Nossa história</span>
          <span style={{ color:'#C9768F', fontSize:'0.6rem' }}>✦</span>
        </div>
        <div className="h-px flex-1" style={{ background:'linear-gradient(to left,transparent,#C9768F)' }} />
      </div>

      {/* Parágrafos — layout de livro */}
      <div className="space-y-4">
        {NARRATIVA.map((p, i) => (
          <p key={i} className="leading-relaxed" style={{
            fontFamily:"'Cormorant Garamond',Georgia,serif",
            color:'#F0E4D4',
            fontSize:'0.9rem',
            lineHeight:1.85,
            fontStyle: i === NARRATIVA.length - 1 ? 'italic' : 'normal',
          }}>
            {i === 0 && (
              <span className="float-left font-bold mr-1" style={{ color:'#C9768F', fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', lineHeight:'0.8', marginTop:'0.1em' }}>
                F
              </span>
            )}
            {i === 0 ? p : p}
          </p>
        ))}
      </div>

      {/* Footer decorativo */}
      <div className="text-center mt-5">
        <span style={{ color:'#C9768F', opacity:0.6, fontSize:'0.85rem' }}>✦ ♥ ✦</span>
        <p className="text-xs mt-2" style={{ color:'rgba(240,228,212,0.35)' }}>Narrativa criada com inteligência artificial</p>
      </div>
    </div>
  )
}

/* ── Seção 3: Galeria (cópia fiel do GaleriaFotos) ── */
function SecaoGaleria() {
  return (
    <div className="py-8 px-4" style={{ background:'#F5EDE3' }}>
      <div className="text-center mb-4">
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color:'#C9768F' }}>Em imagens</span>
        <h2 className="font-display text-lg font-bold mt-1" style={{ color:'#1a1a1a' }}>Nossa galeria</h2>
      </div>
      {/* Mosaico colunas — igual ao real */}
      <div className="columns-2 gap-2 space-y-2">
        {GALERIA.map((g, i) => (
          <div key={i} className={`break-inside-avoid rounded-xl overflow-hidden relative w-full ${g.h} flex items-center justify-center`}
            style={{ background:g.bg }}>
            <span className="text-2xl">{g.emoji}</span>
            {/* Overlay hover */}
            <div className="absolute inset-0 flex items-end p-2" style={{ background:'linear-gradient(to top,rgba(0,0,0,0.5),transparent)' }}>
              <span className="text-xs text-white opacity-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Seção 4: Timeline polaroids (cópia fiel do TimeLine) ── */
function SecaoTimeline() {
  return (
    <div className="py-8 px-4" style={{ background:'#0d0612' }}>
      <div className="text-center mb-5">
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color:'#C9768F' }}>A nossa jornada</span>
        <h2 className="font-display text-lg font-bold mt-1" style={{ color:'#F0E4D4' }}>Momentos que ficaram</h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {MOMENTOS.map((m, i) => (
          <div key={i} className="relative" style={{ transform:`rotate(${m.rot}deg)`, transformOrigin:'center bottom' }}>
            <div className="p-1.5 pb-7" style={{ background:'#f0e8e0', boxShadow:'0 8px 24px rgba(0,0,0,0.55)' }}>
              <div className="aspect-square flex items-center justify-center text-2xl rounded" style={{ background:m.bg }}>
                {m.emoji}
              </div>
              <div className="pt-2 text-center px-1">
                <p className="leading-tight" style={{ fontFamily:'Georgia,serif', color:'#333', fontSize:'0.6rem' }}>{m.titulo}</p>
                <p className="opacity-60 mt-0.5" style={{ color:'#C9768F', fontFamily:'Georgia,serif', fontSize:'0.55rem' }}>{m.data}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Seção 5: Player de música (cópia fiel do PlayerMusica) ── */
function SecaoPlayer() {
  return (
    <div className="py-8 px-4" style={{ background:'#F5EDE3' }}>
      <div className="text-center mb-4">
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color:'#C9768F' }}>♫ nossa música</span>
      </div>
      <div className="rounded-3xl overflow-hidden shadow-lg" style={{ background:'linear-gradient(145deg,#fff,#fdf8f5)', border:'1px solid #f0e6dd' }}>
        {/* Thumbnail com play */}
        <div className="relative w-full aspect-video flex items-center justify-center" style={{ background:'linear-gradient(135deg,#1a0e14,#0d0608)' }}>
          <div className="absolute inset-0" style={{ background:'rgba(0,0,0,0.35)' }} />
          <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 relative" style={{ background:'#C9768F' }}>
            <span className="text-white text-lg ml-0.5">▶</span>
          </div>
          <p className="absolute bottom-2 text-xs" style={{ color:'rgba(255,255,255,0.45)' }}>Toque para ouvir ♪</p>
        </div>
        {/* Info */}
        <div className="p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:'rgba(201,118,143,0.15)' }}>
            <span style={{ color:'#C9768F', fontSize:'0.85rem' }}>♫</span>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ fontFamily:"'Playfair Display',Georgia,serif", color:'#1a1a1a' }}>Nossa música especial</p>
            <p className="text-xs" style={{ color:'#aaa' }}>Toque para ouvir ♪</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Seção 6: Roleta (cópia fiel do RoletaDestinos) ── */
function SecaoRoleta() {
  const slices = [
    ['#C9768F','#fff'],['#F5EDE3','#8a3a50'],['#e8b4c0','#5a1a30'],
    ['#F0D9D0','#8a3a50'],['#d4a0b0','#fff'],['#fceee8','#8a3a50'],
  ]
  return (
    <div className="py-8 px-4 text-center" style={{ background:'#130818' }}>
      <h2 className="font-display text-lg font-bold mb-1" style={{ color:'#F0E4D4' }}>Para onde vamos hoje?</h2>
      <p className="text-xs mb-4" style={{ color:'rgba(240,228,212,0.4)' }}>Deixa o acaso decidir o próximo programa de vocês.</p>

      {/* Roda simulada com conic-gradient */}
      <div className="flex justify-center mb-4 relative">
        <div className="relative">
          {/* Ponteiro */}
          <div className="absolute z-10" style={{ top:-6, left:'50%', transform:'translateX(-50%)', width:0, height:0, borderLeft:'8px solid transparent', borderRight:'8px solid transparent', borderTop:'16px solid #C9768F', filter:'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }} />
          {/* Roda */}
          <div className="rounded-full" style={{
            width:140, height:140,
            background:`conic-gradient(${slices.map(([bg],i) => `${bg} ${i*60}deg ${(i+1)*60}deg`).join(',')})`,
            boxShadow:'0 8px 24px rgba(0,0,0,0.5)',
            border:'2px solid rgba(255,255,255,0.15)',
          }} />
          {/* Centro */}
          <div className="absolute rounded-full" style={{ width:20, height:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'#C9768F', border:'2px solid white' }} />
        </div>
      </div>

      <button className="px-6 py-2 rounded-full text-sm font-semibold" style={{ background:'#C9768F', color:'#fff' }}>Girar!</button>
    </div>
  )
}

/* ── Seção 7: MessageBoard (cópia fiel) ── */
function SecaoMessageBoard() {
  return (
    <div className="py-8 px-4" style={{ background:'#0d0612' }}>
      {/* Resposta existente */}
      <div className="mb-5">
        <h3 className="font-display text-lg font-bold text-center mb-3" style={{ color:'#F0E4D4' }}>Respostas</h3>
        <div className="rounded-2xl p-4 border" style={{ background:'#1a1010', borderColor:'#2a1818' }}>
          <p className="leading-relaxed italic" style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", color:'#E8D5B7', fontSize:'1.05rem', lineHeight:1.8 }}>
            &ldquo;João... eu não tenho palavras. Fiquei lendo três vezes seguidas. Eu te amo demais.&rdquo;
          </p>
          <p className="text-xs mt-2 opacity-40" style={{ color:'#C9768F' }}>7 de junho de 2026</p>
        </div>
      </div>

      {/* CTA — botão de responder */}
      <div className="text-center">
        <div className="mb-2 flex justify-center">
          <div className="w-8 h-8 rounded-full bg-pink-900 flex items-center justify-center">
            <span style={{ color:'#C9768F', fontSize:'1rem' }}>💬</span>
          </div>
        </div>
        <p className="text-xs mb-3" style={{ color:'rgba(240,228,212,0.45)' }}>Esta página foi feita para você. Quer deixar uma mensagem de volta?</p>
        <button className="px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background:'linear-gradient(135deg,#C9768F,#b5607a)', color:'#fff' }}>
          ♥ Deixar minha resposta
        </button>
      </div>
    </div>
  )
}

/* ── Separador de gradiente ── */
function Sep({ from, to }: { from: string; to: string }) {
  return <div style={{ height:24, background:`linear-gradient(to bottom,${from},${to})` }} />
}

/* ── Componente principal ── */
export default function PreviewSection() {
  const c = useContadorMock()

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background:'linear-gradient(180deg, #0d0612 0%, #130818 100%)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Título */}
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-14">
          <span className="text-xs tracking-widest uppercase font-semibold" style={{ color:'#C9768F' }}>demo ao vivo</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4" style={{ color:'#F0E4D4' }}>
            Veja como eles vão abrir
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color:'rgba(240,228,212,0.55)' }}>
            Cada seção abaixo é idêntica à página real — contador ao vivo, narrativa, fotos, roleta e messageboard.
          </p>
        </motion.div>

        {/* Layout */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* ── Browser mockup ── */}
          <motion.div initial={{ opacity:0, y:30, scale:0.97 }} whileInView={{ opacity:1, y:0, scale:1 }} viewport={{ once:true }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }} className="relative">
            <div className="absolute rounded-3xl blur-3xl opacity-15 pointer-events-none" style={{ inset:0, background:'linear-gradient(135deg,#C9768F,#C9A96E)', transform:'scale(0.85) translateY(40px)' }} />

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor:'#1e1010' }}>

              {/* Barra do browser */}
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background:'#0a0406', borderColor:'#1a0808' }}>
                <div className="flex gap-1.5 flex-shrink-0">
                  {['#ff5f57','#febc2e','#28c840'].map((cor,i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background:cor }} />)}
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-3 py-1 rounded text-xs" style={{ background:'#1a0808', color:'#6a5858', fontFamily:'monospace' }}>
                    🔒 envelopelacrado.com.br/p/<span style={{ color:'#C9768F', opacity:0.8 }}>ana-e-joao-k3m9</span>
                  </div>
                </div>
                <div className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background:'rgba(40,200,64,0.15)', color:'#28c840', border:'1px solid rgba(40,200,64,0.2)' }}>
                  AO VIVO
                </div>
              </div>

              {/* Conteúdo scrollável */}
              <div style={{ maxHeight:620, overflowY:'auto' }}>

                {/* 1 — Contador */}
                <SecaoContador c={c} />

                {/* 2 — Narrativa */}
                <Sep from="#0d0612" to="#18081c" />
                <SecaoNarrativa />

                {/* 3 — Galeria */}
                <Sep from="#18081c" to="#F5EDE3" />
                <SecaoGaleria />

                {/* 4 — Timeline polaroids */}
                <Sep from="#F5EDE3" to="#0d0612" />
                <SecaoTimeline />

                {/* 5 — Player */}
                <Sep from="#0d0612" to="#F5EDE3" />
                <SecaoPlayer />

                {/* 6 — Roleta */}
                <Sep from="#F5EDE3" to="#130818" />
                <SecaoRoleta />

                {/* 7 — MessageBoard */}
                <Sep from="#130818" to="#0d0612" />
                <SecaoMessageBoard />

                {/* Footer da página */}
                <div className="py-5 text-center" style={{ background:'#080410', borderTop:'1px solid rgba(201,118,143,0.06)' }}>
                  <p className="text-xs" style={{ color:'#C9768F', opacity:0.3 }}>Crie o seu em envelopelacrado.com.br</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Anotações (desktop) ── */}
          <div className="hidden lg:flex flex-col gap-3 pt-10">
            {ANOTACOES.map((a, i) => (
              <motion.div key={a.titulo} initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay: i * 0.08 + 0.2 }}
                className="flex items-start gap-3 p-3 rounded-xl border" style={{ background:'rgba(255,255,255,0.04)', borderColor:'rgba(240,228,212,0.08)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base" style={{ background:`${a.cor}12`, border:`1px solid ${a.cor}25` }}>
                  {a.emoji}
                </div>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color:'#F0E4D4' }}>{a.titulo}</p>
                  <p className="text-xs leading-relaxed" style={{ color:'rgba(240,228,212,0.55)' }}>{a.desc}</p>
                </div>
              </motion.div>
            ))}

            <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.7 }} className="mt-3">
              <Link href="/criar" onClick={() => fbq('track', 'Lead')}>
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  className="w-full py-3.5 rounded-2xl font-bold text-white shadow-lg text-sm"
                  style={{ background:'linear-gradient(135deg,#C9768F,#b5607a)', boxShadow:'0 8px 30px rgba(201,118,143,0.35)' }}>
                  Quero criar igual a esse →
                </motion.button>
              </Link>
              <p className="text-center text-xs mt-2" style={{ color:'#A0785A' }}>R$ 19,90 · Pronto em 10 minutos</p>
            </motion.div>
          </div>
        </div>

        {/* CTA mobile */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="mt-10 text-center lg:hidden">
          <Link href="/criar">
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white shadow-lg"
              style={{ background:'linear-gradient(135deg,#C9768F,#b5607a)', boxShadow:'0 8px 30px rgba(201,118,143,0.35)' }}>
              Quero criar igual a esse →
            </motion.button>
          </Link>
          <p className="text-sm mt-2" style={{ color:'#A0785A' }}>R$ 19,90 · Pronto em 10 minutos</p>
        </motion.div>
      </div>
    </section>
  )
}
