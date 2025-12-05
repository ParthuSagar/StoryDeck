import toast from 'react-hot-toast'

export const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-center',
    })
  }

  const showError = (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-center',
    })
  }

  return { showSuccess, showError }
}