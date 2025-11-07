# 📚 Hướng Dẫn Sử Dụng MockAPI Cho Quiz App

## 🎯 Tổng Quan

Dự án đã được cập nhật để sử dụng **MockAPI** thay vì file `quiz.json` tĩnh. Điều này giúp:
- Dễ dàng quản lý và cập nhật câu hỏi
- Mô phỏng API thực tế
- Dễ dàng mở rộng và bảo trì
- Có thể thay thế bằng API thực trong tương lai

## 🏗️ Cấu Trúc Dự Án Mới

```
src/
├── services/
│   └── quizApi.js          # Service xử lý API calls
├── hooks/
│   └── useQuizData.js      # Custom hook để fetch quiz data
└── components/
    └── QuizModal.jsx       # Component đã được cập nhật

MOCKAPI_TEMPLATE.json       # Template mẫu cho 5 giai đoạn
```

## 🚀 Cách Thiết Lập MockAPI

### Bước 1: Tạo Tài Khoản MockAPI

1. Truy cập [https://mockapi.io/](https://mockapi.io/)
2. Đăng ký tài khoản miễn phí
3. Tạo một project mới

### Bước 2: Tạo Endpoint

1. Trong project của bạn, tạo một endpoint mới với tên: **`quiz`**
2. Thiết lập các trường (fields) như sau:

```json
{
  "stage": "number",
  "questionNumber": "number",
  "question": "string",
  "options": "object",
  "answer": "string",
  "explanation": "string"
}
```

### Bước 3: Upload Dữ Liệu

Có 2 cách để upload dữ liệu:

#### Cách 1: Upload thủ công qua MockAPI UI
1. Mở file `MOCKAPI_TEMPLATE.json`
2. Copy từng object và tạo record mới trên MockAPI

#### Cách 2: Sử dụng API (Khuyến nghị)
```bash
# Sử dụng script Python để upload hàng loạt
python upload_to_mockapi.py
```

hoặc sử dụng curl:
```bash
curl -X POST \
  https://YOUR_MOCKAPI_ID.mockapi.io/quiz \
  -H 'Content-Type: application/json' \
  -d '{
    "stage": 1,
    "questionNumber": 1,
    "question": "Câu hỏi của bạn",
    "options": {
      "A": "Đáp án A",
      "B": "Đáp án B",
      "C": "Đáp án C",
      "D": "Đáp án D"
    },
    "answer": "A",
    "explanation": "Giải thích"
  }'
```

### Bước 4: Cập Nhật URL API

Mở file `src/services/quizApi.js` và thay đổi URL:

```javascript
const MOCKAPI_BASE_URL = 'https://YOUR_MOCKAPI_ID.mockapi.io/quiz'
```

Thay `YOUR_MOCKAPI_ID` bằng ID project thực tế của bạn.

## 📋 Template Mẫu

File `MOCKAPI_TEMPLATE.json` chứa **45 câu hỏi** được chia thành **5 giai đoạn**, mỗi giai đoạn có **9 câu hỏi**:

### Cấu Trúc Mỗi Câu Hỏi:

```json
{
  "stage": 1,                    // Giai đoạn (1-5)
  "questionNumber": 1,           // Số thứ tự câu hỏi trong giai đoạn (1-9)
  "question": "Nội dung câu hỏi",
  "options": {
    "A": "Đáp án A",
    "B": "Đáp án B",
    "C": "Đáp án C",
    "D": "Đáp án D"
  },
  "answer": "A",                 // Đáp án đúng
  "explanation": "Giải thích"    // Giải thích câu trả lời
}
```

### Phân Bổ Câu Hỏi:

- **Stage 1 (1945-1954)**: 9 câu - Giai đoạn sau Cách mạng Tháng Tám
- **Stage 2 (1954-1975)**: 9 câu - Xây dựng CNXH miền Bắc và giải phóng miền Nam
- **Stage 3 (1975-1986)**: 9 câu - Thời kỳ bao cấp và khủng hoảng
- **Stage 4 (1986-2000)**: 9 câu - Công cuộc Đổi mới
- **Stage 5 (2000-nay)**: 9 câu - Hội nhập và phát triển

## 🔧 API Service Functions

File `src/services/quizApi.js` cung cấp các hàm:

```javascript
// Lấy tất cả câu hỏi (tự động nhóm theo stage)
const data = await quizApi.getAllQuestions()

// Lấy câu hỏi theo stage
const stage1Questions = await quizApi.getQuestionsByStage(1)

// Thêm câu hỏi mới
await quizApi.addQuestion(questionData)

// Cập nhật câu hỏi
await quizApi.updateQuestion(id, questionData)

// Xóa câu hỏi
await quizApi.deleteQuestion(id)
```

## 🎨 Custom Hook Usage

Component có thể sử dụng hook `useQuizData`:

```javascript
import { useQuizData } from '../hooks/useQuizData'

function MyComponent() {
  const { quizData, loading, error } = useQuizData()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  // quizData có cấu trúc:
  // {
  //   'Stage 1': [...9 câu],
  //   'Stage 2': [...9 câu],
  //   'Stage 3': [...9 câu],
  //   'Stage 4': [...9 câu],
  //   'Stage 5': [...9 câu]
  // }
}
```

## 🧪 Testing

Để test API locally:

```javascript
// Test trong browser console hoặc tạo file test
fetch('https://YOUR_MOCKAPI_ID.mockapi.io/quiz')
  .then(res => res.json())
  .then(data => console.log(data))
```

## 📝 Thêm Câu Hỏi Mới

### Bước 1: Tạo object câu hỏi

```json
{
  "stage": 3,
  "questionNumber": 10,
  "question": "Câu hỏi mới của bạn?",
  "options": {
    "A": "Lựa chọn A",
    "B": "Lựa chọn B",
    "C": "Lựa chọn C",
    "D": "Lựa chọn D"
  },
  "answer": "B",
  "explanation": "Giải thích chi tiết"
}
```

### Bước 2: POST lên MockAPI

```bash
curl -X POST \
  https://YOUR_MOCKAPI_ID.mockapi.io/quiz \
  -H 'Content-Type: application/json' \
  -d @new_question.json
```

## 🔄 Migration từ quiz.json

Dự án đã tự động chuyển đổi. Các thay đổi chính:

✅ **Đã hoàn thành:**
- Tạo `quizApi.js` service
- Tạo `useQuizData.js` hook
- Cập nhật `QuizModal.jsx` để sử dụng API
- Thêm loading và error states
- Tạo template mẫu 45 câu hỏi

❌ **Có thể xóa:**
- File `quiz.json` (không còn được sử dụng)

## 🚨 Lưu Ý Quan Trọng

1. **Rate Limiting**: MockAPI miễn phí có giới hạn request. Nếu cần production, hãy nâng cấp hoặc chuyển sang API thực.

2. **CORS**: MockAPI tự động hỗ trợ CORS, không cần cấu hình thêm.

3. **Caching**: Hook `useQuizData` fetch data khi component mount. Dữ liệu được cache trong React state.

4. **Error Handling**: Component tự động hiển thị loading spinner và error message.

## 📊 Ví Dụ Dữ Liệu Response

### GET /quiz (All questions)

```json
[
  {
    "id": "1",
    "stage": 1,
    "questionNumber": 1,
    "question": "Sau Cách mạng Tháng Tám...",
    "options": {...},
    "answer": "D",
    "explanation": "Trong những năm đầu..."
  },
  // ... 44 câu khác
]
```

### Transformed Data (trong app)

```json
{
  "Stage 1": [
    {
      "questionNumber": 1,
      "question": "...",
      "options": {...},
      "answer": "D",
      "explanation": "..."
    }
    // ... 8 câu khác
  ],
  "Stage 2": [...],
  "Stage 3": [...],
  "Stage 4": [...],
  "Stage 5": [...]
}
```

## 🎓 Tổng Kết

Bây giờ dự án của bạn đã sử dụng MockAPI hoàn toàn! 

- ✨ Dễ dàng quản lý câu hỏi
- 🔄 Có thể update real-time
- 🚀 Sẵn sàng scale lên production API
- 📱 Responsive với loading states

Nếu có câu hỏi hoặc gặp vấn đề, hãy kiểm tra console logs hoặc Network tab trong DevTools.

---

**Happy Coding! 🎉**

