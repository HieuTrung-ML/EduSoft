# Báo Cáo Dọn Dẹp Dự Án (Cleanup Report)

Báo cáo này liệt kê chi tiết quá trình phân loại, di chuyển và đề xuất dọn dẹp các tệp tin/thư mục rác để tối ưu dự án EduTest Landing Page.

## 1. Tóm tắt kết quả
- **Tổng số tệp tĩnh trong public/:** 81 tệp.
- **Số tệp đang được sử dụng (KEEP):** 62 tệp.
- **Số tệp không sử dụng (UNUSED - Đề xuất xóa):** 19 tệp.
- **Thư mục cache/build tự sinh (REVIEW):** 3 thư mục (`.parcel-cache/`, `dist/`, `build/`).
- **Cách ly công cụ build Node/npm:** Đã di chuyển `package.json`, `package-lock.json`, và `node_modules/` vào thư mục cách ly `bundler/`.
- **Trạng thái hiện tại:** Thư mục gốc chỉ chứa mã nguồn giao diện thuần sạch sẽ. Dự án đã được build kiểm thử và chạy bình thường.

---

## 2. Danh sách File/Folder Đã Giữ Lại (KEEP & REQUIRED_DOCS)

Các tệp này liên quan trực tiếp đến giao diện, logic vận hành hoặc tài liệu bắt buộc của dự án:

### Mã nguồn chính tại thư mục gốc
- `index.html` (Trang landing page chính chạy trực tiếp bằng Live Server)
- `css/` (Thư mục chứa 16 file CSS module)
- `js/` (Thư mục chứa 7 file JS module)
- `sections/` (Thư mục chứa 7 file tham chiếu HTML)

### Tài liệu dự án (REQUIRED_DOCS)
- `README.md` (Hướng dẫn chạy và build)
- `PROJECT_MAP.md` (Sơ đồ cấu trúc section, CSS, JS)
- `TODO_REFACTOR.md` (Danh sách nợ kỹ thuật)

### 62 Tệp tĩnh trong `public/` đang được sử dụng
Các tệp này được gọi trong `index.html` hoặc các file CSS, JS:
1. `437887433_122098022516289779_1476705749833095785_n 1.png`
2. `6eb3a2205130e06eb921 1.png`
3. `App-Store-1@2x.png`
4. `Brand-Icon.svg`
5. `CH-Play-1@2x.png`
6. `Chat-Action-Blank.svg`
7. `Content-Details.svg`
8. `E-DIGITAL-White-1@2x.png`
9. `Element-Bottom.svg`
10. `Ellipse-1.svg`
11. `Email-Icon.svg`
12. `Empty-Access.svg`
13. `Empty-Promotion.svg`
14. `Frame-1000009442.svg`
15. `Frame-1000009443.svg`
16. `Frame-1000009444.svg`
17. `Frame-1000009445.svg`
18. `Frame-1000009451.svg`
19. `Frame-1000009457.svg`
20. `Frame-1000009461.svg`
21. `Frame-1000009462.svg`
22. `Frame-239721.svg`
23. `Frame.svg`
24. `Frame1.svg`
25. `Frame2.svg`
26. `Group-239438@2x.png`
27. `Group-239440@2x.png`
28. `Home-Component.svg`
29. `Info-Box.svg`
30. `Line.svg`
31. `Line1.svg`
32. `Logo chon.png`
33. `Logo ĐH Hoà Bình - Peace University ori 1.png`
34. `Primary-Region.svg`
35. `Product-Solution-Options.svg`
36. `SacomBank logo-01 1.png`
37. `Setting 1.svg`
38. `Shape-Marker.svg`
39. `Skills-Areas.svg`
40. `Store-Icon.svg`
41. `THCS xuân đỉnh 1.png`
42. `TamSơn_Logo(Horizontal)_RGB 1.png`
43. `Type-Items.svg`
44. `VB-CC-1.svg`
45. `bactuliemlogo 1.png`
46. `book-2@2x.png`
47. `daotao1-1.svg`
48. `download.png`
49. `draw-2@2x.png`
50. `draw-ngang-white-1@2x.png`
51. `extend 1.svg`
52. `hoctap2-1.svg`
53. `images (1).png`
54. `images 2.png`
55. `images.png`
56. `khaothi-2.svg`
57. `lam hồng.png`
58. `logo-dai-hoc-hang-hai-inkythuatso 1.png`
59. `logo-pte-magic 1.png`
60. `protected 1.svg`
61. `share_fb_home 1.png`
62. `tabler-wallet.svg`

---

## 3. Danh sách File/Folder Đã Di Dời Sang `_unused_review/`

Các tệp dưới đây không được tham chiếu trong mã nguồn hoặc là file cache tự sinh:

### A. Thư mục tự sinh (REVIEW)
- `.parcel-cache/` -> Cache của công cụ build Parcel.
- `dist/` & `build/` -> Thư mục chứa file bundle biên dịch.

### B. 19 Tệp tĩnh dư thừa (UNUSED)
Nằm tại `_unused_review/public/`:
1. `Group-1000009209.svg`
2. `Group-239428.svg`
3. `Group-239432.svg`
4. `Group-239448.svg`
5. `Logo-H-Ho-B-nh-Peace-University-ori-1@2x.png`
6. `VB-CC-2.svg`
7. `Wenet-1@2x.png`
8. `daotao1-2.svg`
9. `hoctap2-3.svg`
10. `iPhone-13-13-Pro-21@2x.png`
11. `iPhone-13-13-Pro-2@2x.png`
12. `images-1@2x.png`
13. `logo-pte-magic-1@2x.png`
14. `logo-truong-dai-hoc-thu-do-ha-noi-inkythuatso-01-1@2x.png`
15. `protected-1@2x.png`
16. `slide-dao-tao.png`
17. `slide-hoc-tap.png`
18. `slide-khao-thi.png`
19. `slide-van-bang.png`

---

## 4. Cách ly Cấu hình Node/npm (Đặt trong `bundler/`)
Các tệp cấu hình đóng gói mã nguồn và thư viện được gom hoàn toàn vào thư mục [bundler/](file:///d:/EduTest/MainPage2/bundler):
- `bundler/package.json`
- `bundler/package-lock.json`
- `bundler/node_modules/`

**Lý do cách ly:** Việc chuyển các file cấu hình phát triển này vào thư mục `bundler/` giúp thư mục gốc chỉ chứa mã nguồn giao diện thuần khiết chạy trực tiếp bằng Live Server, ngăn ngừa hoàn toàn nguy cơ lập trình viên hoặc AI agent chỉnh sửa nhầm file hoặc làm rối cây thư mục gốc.

---

## 5. Hướng dẫn xác nhận
- Bạn hãy khởi chạy dự án thông qua Live Server trên `index.html` của dự án chính.
- Kiểm tra toàn bộ giao diện, hiệu ứng và xem log console F12 xem có bất kỳ lỗi nào không.
- Nếu mọi thứ hoạt động hoàn hảo, bạn có thể đồng ý để thực hiện xóa vĩnh viễn thư mục `_unused_review/`.
