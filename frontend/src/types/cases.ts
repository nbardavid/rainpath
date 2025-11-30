export interface Slide {
  id: number
  staining: string
  createdAt?: string
  updatedAt?: string
}

export interface Block {
  id: number
  slides: Slide[]
  createdAt?: string
  updatedAt?: string
}

export interface Specimen {
  id: number
  blocks: Block[]
  createdAt?: string
  updatedAt?: string
}

export interface CaseRecord {
  id: number
  identifier: string
  specimens: Specimen[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateSlideInput {
  staining: string
}

export interface CreateBlockInput {
  slides: CreateSlideInput[]
}

export interface CreateSpecimenInput {
  blocks: CreateBlockInput[]
}

export interface CreateCasePayload {
  identifier: string
  specimens: CreateSpecimenInput[]
}
