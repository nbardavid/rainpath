import type { CaseRecord, CreateCasePayload } from '../types/cases'

const runtimeWindow = typeof window === 'undefined' ? undefined : window
const defaultBaseUrl = runtimeWindow?.location?.origin ?? 'http://localhost:5433'

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? defaultBaseUrl

async function extractErrorMessage(response: Response): Promise<string> {
  let message = `Request failed with status ${response.status}`
  try {
    const body = await response.json()
    if (body?.message) {
      message =
        typeof body.message === 'string'
          ? body.message
          : Array.isArray(body.message)
            ? body.message.join(', ')
            : message
    }
  } catch {
    // ignore JSON parse errors
  }
  return message
}

async function ensureOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response))
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  await ensureOk(response)
  return response.json() as Promise<T>
}

export async function fetchCases(signal?: AbortSignal): Promise<CaseRecord[]> {
  const response = await fetch(`${API_BASE_URL}/cases`, { signal })
  return handleResponse<CaseRecord[]>(response)
}

export async function fetchCaseById(
  caseId: number,
  signal?: AbortSignal,
): Promise<CaseRecord> {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}`, { signal })
  return handleResponse<CaseRecord>(response)
}

export async function createCase(
  payload: CreateCasePayload,
): Promise<CaseRecord> {
  const response = await fetch(`${API_BASE_URL}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<CaseRecord>(response)
}

export async function deleteCase(caseId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}`, {
    method: 'DELETE',
  })
  await ensureOk(response)
}
