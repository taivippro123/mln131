/**
 * Vô hiệu hóa phím tắt mở DevTools
 */

export const enableDevToolsProtection = () => {
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault()
      return false
    }
    
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault()
      return false
    }
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault()
      return false
    }
    
    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault()
      return false
    }
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault()
      return false
    }

    // Command+Option+I (Mac)
    if (e.metaKey && e.altKey && e.key === 'i') {
      e.preventDefault()
      return false
    }

    // Command+Option+J (Mac Console)
    if (e.metaKey && e.altKey && e.key === 'j') {
      e.preventDefault()
      return false
    }

    // Command+Option+C (Mac Inspect)
    if (e.metaKey && e.altKey && e.key === 'c') {
      e.preventDefault()
      return false
    }
  })

  // Vô hiệu hóa right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    return false
  })
}

export default enableDevToolsProtection

