# Danh sách cần tối ưu hóa & Refactor tiếp theo (TODO Refactor)

Tài liệu này ghi nhận các phần nợ kỹ thuật (technical debt) chưa xử lý triệt để trong đợt refactor đầu tiên nhằm bảo đảm giao diện chạy Live Server an toàn tuyệt đối 100%.

## 1. Inline Styles chưa chuyển sang CSS
- **Vị trí:** Khối các slide quản lý trong [sections/management-carousel.html](file:///d:/EduTest/MainPage2/sections/management-carousel.html).
- **Chi tiết:** Các slide chứa hàng trăm thẻ `div` lồng nhau mô phỏng bảng điểm, danh sách lịch thi, học phí, v.v., sử dụng style inline rất phức tạp (ví dụ: `style="width: 207px; align-self: stretch; background: rgba(255, 255, 255, 0); border-left: ..."`).
- **Giải pháp đề xuất:** Giữ nguyên các inline style này vì chúng rất khó chuyển sang CSS class sạch mà không làm lệch pixel các bảng mô phỏng. Nếu AI agent sau này muốn thay đổi bảng hiển thị, khuyên dùng cách chỉnh sửa inline trực tiếp hoặc chuyển dịch thủ công từng slide một và kiểm tra trực quan liên tục.

## 2. Các Class tự sinh (Auto-generated) chưa đổi tên
- **Vị trí:** Được gom gọn trong [css/legacy.css](file:///d:/EduTest/MainPage2/css/legacy.css).
- **Chi tiết:** Các class có định dạng:
  - `frame-child`, `frame-item`, `frame-parent`, `frame-div`
  - `frame-child1` đến `frame-child22`
  - `frame-parent1` đến `frame-parent19`
  - `glass-parent`, `ellipse-parent`, `desktop-6-child`, `desktop-6-inner`
- **Lý do giữ lại:** Đây là các class được sinh tự động khi convert từ thiết kế Figma sang HTML/CSS. Việc đổi tên chúng sang tên ngữ nghĩa (semantic classes) có rủi ro rất lớn làm vỡ bố cục grid/flexbox phức tạp vì các selector CSS bị chồng chéo nhiều tầng.
- **Khuyến nghị:** Khi sửa đổi HTML, chỉ đổi tên các class này nếu bạn tiến hành viết lại toàn bộ CSS của section đó. Nếu không, hãy giữ nguyên và chỉ ghi đè thuộc tính khi cần thiết.

## 3. Các khối CSS đang nằm trong `legacy.css`
- **Phần "Kết nối tri thức" ẩn:** Lớp `.background-1-parent` và các phần tử con liên quan (oval, oval-copy, book-2-icon, v.v.) đang có `display: none` và được giữ lại trong `legacy.css` để phục vụ bản backup hoặc tính năng ẩn của thiết kế gốc.

## 4. Các điểm cần kiểm tra Responsive thủ công
- **Carousel Management:** JS sử dụng `ResizeObserver` để co giãn `.mng-card-scaler` bằng hàm CSS `scale()`. Khi thay đổi kích thước trình duyệt hoặc xoay màn hình điện thoại, cần kiểm tra xem chiều cao của slider viewport (`#management-slider`) có cập nhật đúng để không tạo khoảng trắng dư thừa phía dưới hay không.
- **Vòng xoay Hero vệ tinh:** Các glass card vệ tinh xoay quanh trung tâm sử dụng các toạ độ định vị tuyệt đối `left`/`top` dựa trên biến CSS. Cần kiểm tra kỹ trên các màn hình có tỉ lệ lạ (siêu rộng hoặc màn hình dọc di động).

## 5. Sự phụ thuộc DOM Class của JS
- Các file JS phụ thuộc trực tiếp vào các class định danh cấu trúc DOM gốc:
  - Thao tác chuyển màu navbar phụ thuộc lớp `.ellipse-parent` để tính toán chiều cao ngưỡng cuộn trang.
  - Các carousel phụ thuộc cấu trúc thẻ con, thẻ dots và các class điều hướng tương ứng. Tránh đổi tên các class điều khiển này trong HTML nếu không cập nhật lại JS.
