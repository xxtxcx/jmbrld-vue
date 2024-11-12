import { ref } from 'vue'

export function useToast() {
  const message = ref('')
  
  const showToast = (text: string) => {
    message.value = text;
  }

  return {
    message,
    showToast
  }
}