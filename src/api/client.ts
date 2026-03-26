import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL ?? '/api'

export const api = axios.create({ baseURL: BASE })

export interface UploadResponse {
  doc_id: string
  word_frequencies: Record<string, number>
  page_count: number
}

export interface RedactResponse {
  doc_id: string
  page_count: number
}

export interface PreviewResponse {
  doc_id: string
  pages: string[]
}

export interface ShareResponse {
  share_url: string
  share_id: string
}

export interface SharedResponse {
  share_id: string
  pages: string[]
}

export async function uploadPdf(file: File): Promise<UploadResponse> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<UploadResponse>('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function redactPdf(doc_id: string, words: string[]): Promise<RedactResponse> {
  const { data } = await api.post<RedactResponse>('/redact', { doc_id, words })
  return data
}

export async function getPreview(doc_id: string, redacted = false): Promise<PreviewResponse> {
  const { data } = await api.get<PreviewResponse>(`/preview/${doc_id}`, {
    params: { redacted },
  })
  return data
}

export async function sharePdf(doc_id: string): Promise<ShareResponse> {
  const { data } = await api.post<ShareResponse>(`/share/${doc_id}`)
  return data
}

export async function getShared(share_id: string): Promise<SharedResponse> {
  const { data } = await api.get<SharedResponse>(`/shared/${share_id}`)
  return data
}

export interface DetectResponse {
  doc_id: string
  suggested_words: string[]
}

export async function detectSensitiveWords(doc_id: string): Promise<DetectResponse> {
  const { data } = await api.post<DetectResponse>(`/detect/${doc_id}`)
  return data
}
