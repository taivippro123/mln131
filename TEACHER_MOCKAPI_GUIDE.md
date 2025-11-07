## Hướng dẫn cho giáo viên: Tạo MockAPI endpoint `quiz` và gửi link

### Mục tiêu
- Tạo một endpoint tên `quiz` trên MockAPI để lưu câu hỏi trắc nghiệm
- Nhập dữ liệu mẫu (có thể nhập thủ công vài câu đầu)
- Sao chép đường dẫn (URL) của endpoint và gửi lại cho kỹ thuật viên

---

### Chuẩn bị
- Máy tính có kết nối internet
- Trình duyệt Chrome/Edge/Firefox

---

### Bước 1: Đăng nhập/Đăng ký MockAPI
1. Mở trang `https://mockapi.io` trong trình duyệt
2. Nhấn “Sign in” (Đăng nhập) hoặc “Sign up” (Đăng ký) nếu chưa có tài khoản
3. Có thể đăng nhập nhanh bằng Google/GitHub

---

### Bước 2: Tạo Project mới
1. Sau khi đăng nhập, nhấn “Create new project”
2. Đặt tên tùy ý (ví dụ: `MLN Quiz`)
3. Nhấn “Create” để tạo project

---

### Bước 3: Tạo Resource/Endpoint tên `quiz`
1. Trong project vừa tạo, nhấn nút “Create resource”
2. Ở mục “Resource name”, nhập: `quiz`
3. Nhấn “Create”
4. Vào resource `quiz`, mở tab “Fields” (nếu có), thêm các trường sau (nếu giao diện yêu cầu tạo field mẫu):
   - `stage` → Number
   - `questionNumber` → Number
   - `question` → String
   - `options` → Object
   - `answer` → String
   - `explanation` → String

Lưu ý: Một số giao diện MockAPI có thể không bắt buộc tạo field trước. Khi thêm bản ghi, bạn có thể nhập trực tiếp các trường như trên.

---

### Bước 4: Nhập dữ liệu mẫu
Bạn có thể nhập thủ công vài câu hỏi đầu để kiểm tra (thêm dần các câu khác sau):

1. Trong resource `quiz`, nhấn “Create” hoặc “New” (tạo bản ghi mới)
2. Dán dữ liệu mẫu như ví dụ dưới đây và nhấn “Create”/“Save”

Ví dụ bản ghi mẫu (copy nguyên khối bên dưới):

```json
{
  "stage": 1,
  "questionNumber": 1,
  "question": "Sau Cách mạng Tháng Tám năm 1945, nước Việt Nam Dân chủ Cộng hòa mới thành lập phải đối mặt với khó khăn chủ yếu nào?",
  "options": {
    "A": "Thiếu nguồn nhân lực và trình độ khoa học kỹ thuật thấp kém.",
    "B": "Khó khăn trong việc mở rộng quan hệ ngoại giao và thu hút viện trợ quốc tế.",
    "C": "Thiếu vốn đầu tư, cơ sở hạ tầng yếu kém, thị trường tiêu thụ nhỏ hẹp.",
    "D": "Nạn đói trầm trọng, nạn mù chữ lan rộng và sự bao vây của các thế lực đế quốc."
  },
  "answer": "D",
  "explanation": "Trong những năm đầu sau Cách mạng Tháng Tám, nước ta đứng trước ba giặc: giặc đói, giặc dốt, giặc ngoại xâm — đe dọa sự tồn vong của chính quyền cách mạng non trẻ."
}
```

Bạn có thể tiếp tục thêm các bản ghi khác với:
- `stage`: 1 đến 5 (5 giai đoạn)
- `questionNumber`: 1 đến 9 cho mỗi giai đoạn

Gợi ý: Nếu cần bộ dữ liệu đầy đủ 45 câu, hãy yêu cầu kỹ thuật viên import file `MOCKAPI_TEMPLATE.json` hoặc hỗ trợ nhập hàng loạt.

---

### Bước 5: Sao chép link endpoint và gửi lại
1. Ở trang resource `quiz`, bạn sẽ thấy đường dẫn API dạng:
   - `https://<PROJECT_ID>.mockapi.io/quiz`
2. Nhấn biểu tượng copy hoặc bôi đen và sao chép URL này
3. Gửi lại đường dẫn đó cho kỹ thuật viên qua chat/email

Ví dụ link hợp lệ:
- `https://687b9cdcb4bc7cfbda868165.mockapi.io/quiz`

Bạn có thể mở link này trên trình duyệt để kiểm tra: nếu hiện danh sách (hoặc mảng rỗng `[]`), nghĩa là endpoint hoạt động bình thường.

---

### Câu hỏi thường gặp (FAQ)
- Không thấy nút “Create resource”? Hãy vào bên trong project trước, sau đó mới tạo resource `quiz`.
- Nhập `options` (Object) như thế nào? Dán đúng cấu trúc JSON như ví dụ (có ngoặc nhọn `{}` và cặp "key": "value").
- Có bắt buộc đủ 45 câu không? Không bắt buộc, có thể nhập dần. Khi cần dùng đầy đủ, giáo viên có thể nhờ kỹ thuật viên import file sẵn.

---

Chúc thầy/cô thao tác thuận lợi! Nếu cần hỗ trợ từ xa, vui lòng gửi lại link endpoint `quiz` đã tạo để kỹ thuật viên tích hợp ngay vào hệ thống.
