import { useState, useEffect } from 'react'

/**
 * Custom hook để quản lý localStorage
 * @param {string} key - Key để lưu trong localStorage
 * @param {any} initialValue - Giá trị mặc định nếu không có dữ liệu trong localStorage
 * @returns {[any, function]} - [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // Lấy giá trị từ localStorage hoặc sử dụng giá trị mặc định
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Hàm để cập nhật giá trị trong localStorage
  const setValue = (value) => {
    try {
      // Cho phép value là một function để cập nhật dựa trên giá trị hiện tại
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Lắng nghe thay đổi từ các tab khác
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}
