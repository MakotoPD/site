import { defaultSettings } from '#shared/defaults'
export async function useSite() {
  const { data, refresh } = await useFetch('/api/settings', {
    key: 'site-settings',
    default: () => structuredClone(defaultSettings),
  })
  return { settings: data, refresh }
}
export function formatMoney(value: number) {
  return new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(value) + ' zł'
}
export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}
export function errorMessage(error: unknown) {
  const e = error as { data?: { statusMessage?: string }; message?: string }
  return e?.data?.statusMessage || 'Nie udało się zapisać danych. Spróbuj ponownie.'
}
