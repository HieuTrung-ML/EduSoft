# Sơ đồ Project (Project Map)

Tài liệu này mô tả cấu trúc thư mục mới và quan hệ giữa các thành phần HTML, CSS, và JS sau khi refactor và dọn dẹp.

## 1. Cấu trúc Thư mục Tổng quan
```
/MainPage2
│
├── index.html                  # File chạy chính trực tiếp trên Live Server
├── README.md                   # Hướng dẫn chạy và tổng quan dự án
├── PROJECT_MAP.md              # Sơ đồ bản đồ dự án này
├── TODO_REFACTOR.md            # Các phần tồn đọng cần dọn dẹp thêm
├── CLEANUP_REPORT.md           # Báo cáo các file rác đã dọn dẹp
│
├── css/                        # Thư mục CSS đã chia nhỏ theo section và chức năng
│   ├── variables.css           # Biến CSS dùng chung (:root)
│   ├── reset.css               # Reset styles cơ bản
│   ├── base.css                # Style toàn cục cho container, button chung
│   ├── typography.css          # Cấu hình font chữ h1, h2, h3
│   ├── layout.css              # Layout wrapper chính (.desktop-6)
│   ├── navbar.css              # Style của thanh điều hướng (header)
│   ├── hero.css                # Phần Hero Banner, vòng xoay vệ tinh, thẻ kính
│   ├── partners.css            # Khối Partners logo chạy ngang marquee
│   ├── foundation.css          # Carousel nhỏ "Nền tảng số hoá..."
│   ├── solutions.css           # Khối hiển thị các gói giải pháp giáo dục
│   ├── management-carousel.css # Carousel lớn tích hợp 30+ phần mềm
│   ├── knowledge.css           # Khối "Kết nối tri thức" & form email đăng ký
│   ├── footer.css              # Footer liên hệ và thông tin cuối trang
│   ├── animations.css          # Định nghĩa fade-in và scroll keyframes
│   ├── responsive.css          # Tổng hợp media queries cho responsive
│   └── legacy.css              # Chứa các class tự sinh và phần tri thức ẩn
│
├── js/                         # Thư mục JS đã module hoá bằng ES6 modules
│   ├── main.js                 # Entry point khởi tạo và chạy các script
│   ├── navbar.js               # Quản lý hiệu ứng scrolled của thanh điều hướng
│   ├── fade-animation.js       # IntersectionObserver cho fade-in animation
│   ├── foundation-carousel.js  # Điều khiển carousel phần Nền tảng
│   ├── management-carousel.js  # Điều khiển carousel lớn Tích hợp 30+ phần mềm
│   ├── logo-marquee.js         # Placeholder (marquee chạy bằng CSS)
│   └── utils.js                # Tiện ích bổ trợ (viết tắt querySelector)
│
├── public/                     # Chứa tài nguyên tĩnh (ảnh, SVG, PNG) đang sử dụng
│
├── sections/                   # Bản tham chiếu HTML tách riêng cho AI agent dễ đọc
│   ├── hero.html               # Gồm cả Navbar Header lồng bên trong
│   ├── partners.html           # Khối đối tác và marquee
│   ├── foundation.html         # Khối carousel nhỏ
│   ├── solutions.html          # Khối các gói giải pháp
│   ├── management-carousel.html# Khối carousel lớn (chứa code dashboard inline rất dài)
│   ├── knowledge.html          # Khối kết nối tri thức và newsletter
│   └── footer.html             # Khối thông tin chân trang
│
├── bundler/                    # Môi trường đóng gói Node/npm cách ly
│   ├── package.json            # Cấu hình biên dịch Parcel
│   ├── package-lock.json       # Khoá phiên bản thư viện npm
│   └── node_modules/           # Thư mục thư viện cài đặt Node
│
└── _unused_review/             # Các tệp tĩnh dư thừa tạm thời di dời chờ duyệt xóa
```

---

## 2. Chi tiết bản đồ phân chia Section

### 1. Navbar
- **HTML:** `index.html` từ `<!-- ================= NAVBAR ================= -->` đến `<!-- ================= /NAVBAR ================= -->`. Có bản sao tham chiếu tại [sections/hero.html](file:///d:/EduTest/MainPage2/sections/hero.html#L3-L60).
- **CSS:** [css/navbar.css](file:///d:/EduTest/MainPage2/css/navbar.css)
- **JS:** [js/navbar.js](file:///d:/EduTest/MainPage2/js/navbar.js)
- **Class quan trọng:** `.frame-header`, `#main-nav`, trạng thái cuộn trang sử dụng class `.scrolled` (thay đổi màu nền và làm mờ logo phụ).
- **Lưu ý:** Không sửa đường dẫn logo `./public/E-DIGITAL-White-1@2x.png` và các icon.

### 2. Hero Section
- **HTML:** `index.html` từ `<!-- ================= HERO SECTION ================= -->` đến `<!-- ================= /HERO SECTION ================= -->`. Tham chiếu tại [sections/hero.html](file:///d:/EduTest/MainPage2/sections/hero.html).
- **CSS:** [css/hero.css](file:///d:/EduTest/MainPage2/css/hero.css) & [css/animations.css](file:///d:/EduTest/MainPage2/css/animations.css) (chứa hiệu ứng quay của orbit-ring).
- **JS:** Không có logic JS riêng ngoài animation fade-in được quản lý bởi [js/fade-animation.js](file:///d:/EduTest/MainPage2/js/fade-animation.js).
- **Class quan trọng:** `.ellipse-parent` (nền Hero), `.orbit-ring-outer`, `.orbit-ring-inner` (vòng tròn quay), `.glass-parent` đến `.glass-parent7` (các thẻ kính vệ tinh quay quanh như Tài chính, Học tập, Tuyển sinh).

### 3. Partners Section
- **HTML:** `index.html` từ `<!-- ================= PARTNERS SECTION ================= -->` đến `<!-- ================= /PARTNERS SECTION ================= -->`. Tham chiếu tại [sections/partners.html](file:///d:/EduTest/MainPage2/sections/partners.html).
- **CSS:** [css/partners.css](file:///d:/EduTest/MainPage2/css/partners.css) & [css/animations.css](file:///d:/EduTest/MainPage2/css/animations.css) (cho keyframes `scroll-left`).
- **JS:** Hoạt động hoàn toàn bằng CSS keyframe animation (`scroll-left`).
- **Class quan trọng:** `.desktop-6-inner`, `.logo-collection-wrapper`, `.logo-collection` (marquee logos chạy ngang liên tục).

### 4. Foundation Section
- **HTML:** `index.html` từ `<!-- ================= FOUNDATION SECTION ================= -->` đến `<!-- ================= /FOUNDATION SECTION ================= -->`. Tham chiếu tại [sections/foundation.html](file:///d:/EduTest/MainPage2/sections/foundation.html).
- **CSS:** [css/foundation.css](file:///d:/EduTest/MainPage2/css/foundation.css)
- **JS:** [js/foundation-carousel.js](file:///d:/EduTest/MainPage2/js/foundation-carousel.js)
- **Class quan trọng:** `.frame-wrapper3` (Wrapper tiêu đề), `.frame-parent7` (Khung hiển thị thông tin slide gồm tiêu đề `.ph-hp-vi` và mô tả `.tch-hp-b`), `.foundation-dots` (Các nút chuyển slide).

### 5. Solutions Section
- **HTML:** `index.html` từ `<!-- ================= SOLUTIONS SECTION ================= -->` đến `<!-- ================= /SOLUTIONS SECTION ================= -->`. Tham chiếu tại [sections/solutions.html](file:///d:/EduTest/MainPage2/sections/solutions.html).
- **CSS:** [css/solutions.css](file:///d:/EduTest/MainPage2/css/solutions.css)
- **JS:** Không có logic JS riêng, hoạt động dựa trên CSS flexbox/grid và fade-in.
- **Class quan trọng:** `.desktop-6-child`, `.frame-parent8` (Wrapper chính), `.header-container-parent` (Chứa các khối giải pháp như Giáo dục Đại học, K12, Nghề nghiệp).

### 6. Management Carousel Section
- **HTML:** `index.html` từ `<!-- ================= MANAGEMENT CAROUSEL SECTION ================= -->` đến `<!-- ================= /MANAGEMENT CAROUSEL SECTION ================= -->`. Tham chiếu tại [sections/management-carousel.html](file:///d:/EduTest/MainPage2/sections/management-carousel.html).
- **CSS:** [css/management-carousel.css](file:///d:/EduTest/MainPage2/css/management-carousel.css)
- **JS:** [js/management-carousel.js](file:///d:/EduTest/MainPage2/js/management-carousel.js)
- **Class quan trọng:** `.integrate-school`, `.mng-carousel-wrap`, `.mng-viewport` (`#management-slider`), `.mng-track` (`#management-track`), `.mng-slide`, `.mng-card-scaler`, `.mng-nav` (Nút chuyển slide trái/phải), `.mng-dots`.
- **Ghi chú:** Đây là section phức tạp nhất. Mỗi `.mng-slide` chứa một dashboard giao diện mô phỏng được tạo hoàn toàn bằng inline HTML styled divs rất đồ sộ. Để giữ giao diện chính xác tuyệt đối, phần inline styles này được giữ nguyên. `.mng-card-scaler` được JS tính toán tỉ lệ `scale()` để responsive co giãn khớp với kích thước màn hình mà không bị vỡ layout.

### 7. Knowledge Section
- **HTML:** `index.html` từ `<!-- ================= KNOWLEDGE SECTION ================= -->` đến `<!-- ================= /KNOWLEDGE SECTION ================= -->`. Tham chiếu tại [sections/knowledge.html](file:///d:/EduTest/MainPage2/sections/knowledge.html).
- **CSS:** [css/knowledge.css](file:///d:/EduTest/MainPage2/css/knowledge.css)
- **JS:** Không có logic JS.
- **Class quan trọng:** `.technology-platform`, `.value-knowledge` (Khối Kết nối tri thức hiển thị hoạt động), `.email-promotions` (Khối form newsletter nhập email).

### 8. Footer Section
- **HTML:** `index.html` từ `<!-- ================= FOOTER ================= -->` đến `<!-- ================= /FOOTER ================= -->`. Tham chiếu tại [sections/footer.html](file:///d:/EduTest/MainPage2/sections/footer.html).
- **CSS:** [css/footer.css](file:///d:/EduTest/MainPage2/css/footer.css)
- **JS:** Không có logic JS.
- **Class quan trọng:** `.site-disclaimer` (Khung footer chính), `.contact-details` (Chân trang chứa địa chỉ, chợ ứng dụng và bản quyền).

---

## 3. Chỉ dẫn dành cho AI Agent sửa chữa sau này

1. **Nếu cần sửa giao diện hoặc sửa text một phần nhất định:**
   - Tìm comment mốc tương ứng trong `index.html` để sửa HTML.
   - Sửa CSS tương ứng trong `css/tên-section.css` thay vì mở file index.css đồ sộ.
   
2. **Nếu cần sửa hiệu ứng/hành vi chuyển động:**
   - Sửa file JS tương ứng trong thư mục `js/`.
   - Lưu ý tất cả các module JS sử dụng cú pháp ES6 module (`export function`) và được import trực tiếp trong [js/main.js](file:///d:/EduTest/MainPage2/js/main.js).

3. **Nguyên tắc bảo toàn giao diện:**
   - Tránh làm thay đổi kích thước của container chính của các vòng tròn vệ tinh quay ở Hero (quản lý bởi `.ellipse-parent`) và tỉ lệ Carousel lớn (quản lý bởi `.mng-card-scaler`).
   - Không được thay đổi các class tự sinh dạng `frame-parent`, `frame-child` trong `css/legacy.css` nếu không nắm rõ cấu trúc Figma xuất ra.
