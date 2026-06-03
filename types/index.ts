export type StatusPagina = 'draft' | 'pending_payment' | 'active'
export type TemaVisual = 'classico' | 'escuro' | 'pastel' | 'floral'
export type TomNarrativa = 'romantico' | 'poetico' | 'divertido' | 'simples'

export interface Pagina {
  id: string
  slug: string
  user_id: string | null
  status: StatusPagina
  nome_pessoa1: string
  nome_pessoa2: string
  data_inicio: string
  narrativa_ia: string | null
  tema: TemaVisual
  musica_url: string | null
  colaboracao_ativa: boolean
  colaboracao_token: string | null
  colaboracao_prazo: string | null
  payment_id: string | null
  paid_at: string | null
  email_criador: string | null
  created_at: string
  updated_at: string
}

export interface Momento {
  id: string
  page_id: string
  titulo: string
  descricao: string | null
  data: string | null
  foto_url: string | null
  ordem: number
  created_at: string
}

export interface Contribuicao {
  id: string
  page_id: string
  nome_autor: string
  mensagem: string
  foto_url: string | null
  aprovada: boolean
  created_at: string
}

export interface Resposta {
  id: string
  page_id: string
  mensagem: string
  foto_url: string | null
  created_at: string
}

export interface PaginaComMomentos extends Pagina {
  momentos: Momento[]
  contribuicoes: Contribuicao[]
}

// Tipos para o formulário de criação
export interface DadosCriacao {
  nome1: string
  nome2: string
  email: string
  dataInicio: string
  comoSeConheceram: string
  momentos: MomentoFormulario[]
  apelidos: string
  musicaUrl: string
  tema: TemaVisual
  tom: TomNarrativa
}

export interface MomentoFormulario {
  titulo: string
  descricao: string
  data: string
  fotoUrl?: string
  arquivo?: File
}

export interface DadosFotos {
  momentos: MomentoComFoto[]
}

export interface MomentoComFoto {
  titulo: string
  descricao: string
  data: string
  foto_url: string | null
  arquivo?: File
}

// Tipos para a API
export interface RespostaGerarNarrativa {
  narrativa: string
}

export interface RespostaCriarPagamento {
  preferenceId: string
  initPoint: string
  pixQrCode?: string
}

export interface WebhookMercadoPago {
  type: string
  data: {
    id: string
  }
}

// Sessão de criação (salva no sessionStorage)
export interface SessaoCriacao {
  pageId?: string
  slug?: string
  step1: {
    tipo: string
  }
  step2: DadosCriacao
  step3: DadosFotos
  narrativaGerada?: string
}
