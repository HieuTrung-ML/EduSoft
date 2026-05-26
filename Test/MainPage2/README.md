# EduSoft - Edu Digital Landing Page

Dự án landing page giới thiệu giải pháp chuyển đổi số Giáo dục toàn diện của EduSoft. Dự án đã được refactor phân tách thành các module CSS/JS và các section HTML riêng biệt để tăng cường khả năng bảo trì và dễ đọc cho lập trình viên/AI agent.

Cấu hình đóng gói mã nguồn và thư viện Node/npm đã được cách ly trong thư mục `bundler/` để giữ thư mục gốc sạch sẽ, tránh nhầm lẫn tệp tin code.

## Cấu trúc Dự án

- `index.html`: File HTML chạy chính của ứng dụng.
- `/css/`: Chứa các module CSS.
- `/js/`: Chứa các script JS điều khiển hoạt động bằng ES6 modules.
- `/sections/`: Thư mục chứa các phân đoạn HTML tách riêng làm bản tham chiếu.
- `/public/`: Thư mục lưu trữ hình ảnh, biểu tượng tĩnh đang sử dụng.
- `/bundler/`: Chứa cấu hình Node/npm (`package.json`, `package-lock.json`, `node_modules`).
- `PROJECT_MAP.md`: Bản đồ liên kết chi tiết giữa các file và class của từng section.
- `TODO_REFACTOR.md`: Ghi nhận các nợ kỹ thuật và các điểm cần lưu ý khi nâng cấp.
- `CLEANUP_REPORT.md`: Báo cáo các file đã dọn dẹp và giữ lại.
- `/_unused_review/`: Thư mục tạm lưu trữ tài nguyên rác đề xuất xóa.

## Hướng dẫn Khởi chạy

Dự án này là dự án HTML/CSS/JS thuần, không yêu cầu công cụ build khi chạy trực tiếp.

### 1. Chạy bằng Live Server (Khuyến nghị)
1. Mở thư mục `MainPage2` trong VS Code hoặc editor của bạn.
2. Click chuột phải vào file `index.html` và chọn **Open with Live Server**.
3. Website sẽ chạy tại địa chỉ `http://127.0.0.1:5500/index.html`.

### 2. Chạy Build bằng Parcel
Nếu bạn muốn build bundle phục vụ triển khai production, chạy các lệnh sau từ thư mục gốc của dự án:
- Cài đặt dependencies (nếu cần tải lại thư viện):
  ```bash
  cd bundler && npm install
  ```
- Build bản production ra thư mục `/build/` ở thư mục gốc:
  ```bash
  npx --prefix bundler parcel build index.html --dist-dir ./build
  ```
- Chạy môi trường dev với Parcel:
  ```bash
  npx --prefix bundler parcel index.html
  ```
