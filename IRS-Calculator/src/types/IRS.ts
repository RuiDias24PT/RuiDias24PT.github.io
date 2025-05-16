export interface TaxBracket {
  label: string
  escalão: number
  min: number
  max: number | null
  taxa_marginal: number
  parcela_abater: number
}

export interface Municipality {
  name: string
  municipality: string
  participation: number
}

export interface TaxBracket {
  label: string
  escalão: number
  min: number
  max: number | null
  taxa_marginal: number
  parcela_abater: number
}

export interface Municipality  {
  name: string
  municipality: string
  participation: number
}