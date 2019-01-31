import { Message } from 'element-ui'

export default {
  showError(error) {
    Message({
      message: `${error}`,
      type: "error",
      duration: 2000,
      showClose: true,
    })
  },
  showSuccess(message = 'Success') {
    Message({
      message: `${message}`,
      type: "success",
      duration: 2000,
      showClose: true,
    })
  },
  showMessage(message) {
    Message({
      message: `${message}`,
      duration: 2000,
      showClose: true,
    })
  },
}
