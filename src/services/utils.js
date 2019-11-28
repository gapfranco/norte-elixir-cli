import { Modal } from 'antd'

export function encodeParam (param) {
  return Buffer.from(JSON.stringify(param)).toString('base64')
}

export function errorAlert (title, content, seconds = 0) {
  const modal = Modal.error({
    title,
    content
  })
  if (seconds) {
    setTimeout(() => {
      modal.destroy()
    }, seconds * 1000)
  }
}
