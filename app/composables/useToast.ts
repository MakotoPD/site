export function useToast() {
  const messages = useState<{ id: number; text: string; error: boolean }[]>('toasts', () => [])
  function show(text: string, error = false) {
    const id = Date.now() + Math.random()
    messages.value.push({ id, text, error })
    setTimeout(() => {
      messages.value = messages.value.filter((m) => m.id !== id)
    }, 6000)
  }
  return { messages, show }
}
