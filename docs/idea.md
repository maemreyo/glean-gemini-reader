Chào bạn, "Coding partner" đây! Bạn chọn **WXT** là cực kỳ chuẩn xác. Đây là framework hiện đại, "sướng" nhất hiện nay để làm extension vì nó hỗ trợ TypeScript, React, và tự động hóa mọi khâu build (tạo manifest, nén zip) cho cả Firefox và Chrome.

Dưới đây là hướng dẫn **Build "Gemini Ultimate Reader" bằng WXT + React** từ con số 0.

### BƯỚC 1: Khởi tạo Project WXT

Mở Terminal (CMD/PowerShell/VSCode Terminal) và chạy lệnh:

```bash
npx wxt@latest init gemini-reader

```

Lúc nó hỏi, bạn chọn như sau:

1. **Template:** `React` (Để viết UI menu cho sướng).
2. **Package Manager:** `npm` (hoặc bun/pnpm tùy bạn, tôi dùng npm cho phổ thông).

Sau khi tạo xong:

```bash
cd gemini-reader
npm install

```

---

### BƯỚC 2: Cấu trúc thư mục

Chúng ta sẽ tổ chức code như thế này cho chuyên nghiệp:

```text
gemini-reader/
├── assets/
│   └── styles.css          <-- Chứa toàn bộ CSS Stylus cũ
├── components/
│   └── ThemeMenu.tsx       <-- Component React hiển thị nút chuyển Theme
├── utils/
│   └── autoClicker.ts      <-- Logic "Nuclear Click" để mở nguồn
├── entrypoints/
│   └── content.tsx         <-- File chính chạy trên trang Gemini
└── wxt.config.ts           <-- Cấu hình

```

---

### BƯỚC 3: Triển khai Code

#### 1. File `assets/styles.css`

Bạn tạo file này trong thư mục `assets`. 
```css
/* ==========================================================================
   1. ĐỊNH NGHĨA BẢNG MÀU (GIỮ NGUYÊN)
   ========================================================================== */
:root {
    /* Mặc định là Light */
    --bg-page: #f5f5f7;
    --bg-paper: #ffffff;
    --text-main: #2c3e50;
    --text-heading: #111111;
    --text-sub: #666666;
    --accent-color: #2980b9;
    --link-bg: #eef6fc;
    --link-border: #cce5ff;
    --link-text: #0056b3;
    --shadow: 0 4px 30px rgba(0,0,0,0.06);
    --table-header: #f4f4f4;
    --table-border: #e0e0e0;
}

/* Theme Sepia & Dark (GIỮ NGUYÊN CODE CŨ CỦA BẠN Ở ĐÂY) */
/* ... copy lại đoạn theme sepia và theme dark ... */
body.theme-sepia {
    --bg-page: #f0e6d2; 
    --bg-paper: #f9f2e6; 
    --text-main: #4a4238; 
    --text-heading: #2b2218; 
    --text-sub: #756a5b; 
    --accent-color: #a65a3e; 
    --link-bg: #ece5d5; 
    --link-border: #dccfb9; 
    --link-text: #8c4b31; 
    --shadow: 0 4px 20px rgba(60, 50, 40, 0.1); 
    --table-header: #efe8db; 
    --table-border: #dccfb9; 
}
body.theme-dark {
    --bg-page: #121212; 
    --bg-paper: #1e1e1e; 
    --text-main: #e0e0e0; 
    --text-heading: #ffffff; 
    --text-sub: #a0a0a0; 
    --accent-color: #82aaff; 
    --link-bg: #2c3e50; 
    --link-border: #3e566d; 
    --link-text: #82aaff; 
    --shadow: 0 4px 30px rgba(0,0,0,0.5); 
    --table-header: #2a2a2a; 
    --table-border: #444444; 
}

/* ==========================================================================
   2. CẤU HÌNH KHUNG GIAO DIỆN (SỬA Z-INDEX TẠI ĐÂY)
   ========================================================================== */

deep-research-immersive-panel {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    
    /* SỬA LẠI DÒNG NÀY: Giảm xuống 9000 để Menu (9999) đè lên được */
    z-index: 9000 !important; 
    
    background-color: var(--bg-page) !important;
    padding: 0 !important;
    margin: 0 !important;

    /* Che viền đen */
    --mat-sidenav-container-background-color: var(--bg-page) !important;
    --mdc-theme-surface: var(--bg-page) !important;
}

/* Style cho cái Menu Theme để nó đẹp hơn */
#gemini-reader-menu {
    background-color: var(--bg-paper) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
    border: 1px solid var(--table-border) !important;
}

/* ==========================================================================
   2. CẤU HÌNH KHUNG GIAO DIỆN & LOẠI BỎ VIỀN ĐEN
   ========================================================================== */

deep-research-immersive-panel {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 2147483640 !important;
    background-color: var(--bg-page) !important; /* Dùng biến màu */
    padding: 0 !important;
    margin: 0 !important;
    
    /* FIX VIỀN ĐEN: Ép màu nền cho tất cả các lớp con để che viền */
    --mat-sidenav-container-background-color: var(--bg-page) !important;
    --mdc-theme-surface: var(--bg-page) !important;
}

/* Xóa viền/nền của các container con */
deep-research-immersive-panel .container,
deep-research-immersive-panel response-container,
deep-research-immersive-panel .response-container,
deep-research-immersive-panel .presented-response-container {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

/* Ẩn các thành phần thừa */
deep-research-immersive-panel toolbar,
deep-research-immersive-panel .create-button-container,
deep-research-immersive-panel .close-button,
deep-research-immersive-panel .action-buttons,
deep-research-immersive-panel collapsible-button,
deep-research-immersive-panel thinking-panel,
deep-research-immersive-panel .response-container-footer,
deep-research-immersive-panel source-footnote, 
deep-research-immersive-panel .superscript,
deep-research-immersive-panel sup {
    display: none !important;
}

/* ==========================================================================
   3. TYPOGRAPHY (BÀI VIẾT)
   ========================================================================== */

deep-research-immersive-panel .container {
    width: 100% !important;
    height: 100% !important;
    overflow-y: auto !important;
    display: block !important;
}

deep-research-immersive-panel .markdown-main-panel {
    max-width: 900px !important; /* Độ rộng tối ưu cho mắt */
    width: 95% !important;
    margin: 40px auto 100px auto !important;
    padding: 60px 70px !important;
    
    /* Áp dụng biến màu */
    background-color: var(--bg-paper) !important;
    color: var(--text-main) !important;
    box-shadow: var(--shadow) !important;
    
    border-radius: 8px !important;
    font-family: 'Merriweather', 'Georgia', serif !important; /* Font chữ có chân để đọc báo */
    font-size: 19px !important;
    line-height: 1.8 !important;
    transition: background-color 0.3s, color 0.3s; /* Hiệu ứng chuyển màu mượt */
}

/* Tiêu đề */
deep-research-immersive-panel h1 {
    font-family: 'Segoe UI', Helvetica, sans-serif !important;
    font-size: 2.4em !important;
    font-weight: 800 !important;
    color: var(--text-heading) !important;
    border-bottom: 2px solid var(--table-border) !important;
    padding-bottom: 15px;
    margin-bottom: 30px !important;
}

deep-research-immersive-panel h2 {
    font-family: 'Segoe UI', Helvetica, sans-serif !important;
    font-size: 1.6em !important;
    color: var(--accent-color) !important;
    margin-top: 40px !important;
    border-bottom: 1px solid var(--table-border) !important;
}

deep-research-immersive-panel p, 
deep-research-immersive-panel li {
    color: var(--text-main) !important;
}

/* ==========================================================================
   4. INLINE SOURCES (DANH SÁCH COMPACT)
   ========================================================================== */
sources-carousel-inline {
    display: block !important;
    margin: 10px 0 !important;
    width: 100% !important;
    clear: both !important;
}

/* Nút giả */
sources-carousel-inline .button-container::before {
    content: "⊕ Nguồn tham khảo";
    font-size: 11px;
    font-family: sans-serif;
    font-weight: bold;
    color: var(--text-sub); /* Theo theme */
    background: var(--table-header); /* Theo theme */
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid var(--table-border);
    display: inline-block !important;
}

/* Container link */
sources-carousel-inline sources-carousel,
sources-carousel-inline .container,
sources-carousel-inline .carousel-container,
sources-carousel-inline card-renderer,
sources-carousel-inline default-source-card,
sources-carousel-inline url-source-card,
sources-carousel-inline .source-card-container,
sources-carousel-inline .source-card-content,
sources-carousel-inline .source-card-body,
sources-carousel-inline .source-card-header,
sources-carousel-inline .source-card-title {
    display: block !important;
    width: 100% !important;
    height: auto !important; 
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: none !important;
    visibility: visible !important;
    opacity: 1 !important;
}

sources-carousel-inline .carousel-content {
    display: flex !important;
    flex-direction: column !important;
    gap: 0 !important;
}

/* Link Style */
sources-carousel-inline .source-card-content > a {
    display: block !important;
    width: 100% !important;
    text-decoration: none !important;
    background-color: transparent !important;
    border-bottom: 1px solid var(--table-border) !important; /* Theo theme */
    padding: 6px 0 !important;
    
    color: var(--link-text) !important; /* Theo theme */
    font-family: 'Segoe UI', sans-serif !important;
    font-size: 13px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    transition: all 0.2s ease !important;
}

sources-carousel-inline .source-card-content > a:hover {
    background-color: var(--link-bg) !important;
    padding-left: 8px !important;
}

sources-carousel-inline .source-card-footer,
sources-carousel-inline .source-card-subtitle { display: none !important; }

/* ==========================================================================
   5. BẢNG (TABLE) - ĐA GIAO DIỆN
   ========================================================================== */
deep-research-immersive-panel .table-footer { display: none !important; }

deep-research-immersive-panel table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin: 30px 0 !important;
    font-family: 'Segoe UI', sans-serif !important;
    font-size: 0.9em !important;
    
    background-color: var(--bg-paper) !important;
    color: var(--text-main) !important;
    border: 1px solid var(--table-border) !important;
}

deep-research-immersive-panel thead tr th,
deep-research-immersive-panel thead tr td {
    background-color: var(--table-header) !important;
    color: var(--text-heading) !important;
    font-weight: bold !important;
    border: 1px solid var(--table-border) !important;
    padding: 12px !important;
}

deep-research-immersive-panel tbody tr td {
    background-color: var(--bg-paper) !important;
    color: var(--text-main) !important;
    border: 1px solid var(--table-border) !important;
    padding: 12px !important;
}

/* Reset màu các thẻ con trong bảng */
deep-research-immersive-panel table * {
    background-color: transparent !important;
    color: inherit !important;
}

/* Ẩn danh sách tham khảo cuối trang */
deep-research-source-lists { display: none !important; }

/* ==========================================================================
   6. IN ẤN (PDF)
   ========================================================================== */
@media print {
    deep-research-immersive-panel {
        position: absolute !important;
        background-color: white !important;
        overflow: visible !important;
        height: auto !important;
    }
    deep-research-immersive-panel .markdown-main-panel {
        box-shadow: none !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        color: black !important;
        background: white !important;
    }
    /* Khi in thì ẩn menu theme đi */
    #gemini-reader-menu { display: none !important; }
}
```

#### 2. File `utils/autoClicker.ts`

Tạo file này để tách biệt logic click chuột cho gọn.

```typescript
// utils/autoClicker.ts

export function triggerClick(element: Element) {
  // Chuỗi sự kiện "Nuclear"
  ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(eventType => {
      const event = new MouseEvent(eventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1
      });
      element.dispatchEvent(event);
  });
}

export function autoExpandSources() {
  const selector = 'sources-carousel-inline button[aria-label="Learn More"][aria-expanded="false"]';
  const buttons = document.querySelectorAll(selector);

  buttons.forEach((btn) => {
      if ((btn as HTMLElement).offsetParent !== null) {
          // Check retry count
          let attempts = parseInt(btn.getAttribute('data-retry-count') || '0');
          if (attempts >= 10) return;

          console.log(`[Gemini Reader] Auto-opening source... (${attempts + 1})`);
          
          (btn as HTMLElement).click();
          triggerClick(btn);
          
          btn.setAttribute('data-retry-count', (attempts + 1).toString());
      }
  });
}

```

#### 3. File `components/ThemeMenu.tsx`

Viết UI bằng React thay vì `document.createElement`.

```tsx
// components/ThemeMenu.tsx
import { useEffect, useState } from 'react';

const themes = [
  { id: 'theme-light', icon: '☀️', title: 'Light' },
  { id: 'theme-sepia', icon: '📖', title: 'Sepia' },
  { id: 'theme-dark',  icon: '🌙', title: 'Dark' }
];

export default function ThemeMenu() {
  const [activeTheme, setActiveTheme] = useState('theme-light');

  // Load theme từ LocalStorage khi khởi động
  useEffect(() => {
    const saved = localStorage.getItem('gemini-reader-theme') || 'theme-light';
    setActiveTheme(saved);
    document.body.classList.add(saved);
  }, []);

  const changeTheme = (id: string) => {
    document.body.classList.remove('theme-light', 'theme-sepia', 'theme-dark');
    document.body.classList.add(id);
    localStorage.setItem('gemini-reader-theme', id);
    setActiveTheme(id);
  };

  return (
    <div style={{
      position: 'fixed', bottom: '30px', right: '30px', zIndex: 2147483647,
      display: 'flex', gap: '8px', padding: '8px', borderRadius: '50px',
      backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.15)', border: '1px solid #e0e0e0'
    }}>
      {themes.map(t => (
        <button
          key={t.id}
          onClick={() => changeTheme(t.id)}
          title={t.title}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: activeTheme === t.id ? '2px solid #007bff' : '1px solid #ddd',
            backgroundColor: activeTheme === t.id ? '#eef6fc' : 'white',
            cursor: 'pointer', fontSize: '18px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
          }}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}

```

#### 4. File `entrypoints/content.tsx`

Đây là nơi kết nối mọi thứ. WXT làm việc này cực gọn.

```tsx
// entrypoints/content.tsx
import "@/assets/styles.css"; // Tự động Inject CSS vào trang
import ReactDOM from "react-dom/client";
import ThemeMenu from "@/components/ThemeMenu";
import { autoExpandSources } from "@/utils/autoClicker";

export default defineContentScript({
  matches: ["https://gemini.google.com/*"],
  cssInjectionMode: "ui", // Inject CSS như một file style tag

  main(ctx) {
    // 1. Khởi chạy Auto Clicker Loop
    const clickerInterval = setInterval(autoExpandSources, 1500);

    // 2. Mount React UI (Menu Theme) vào trang web
    // WXT cung cấp hàm createIntegratedUi để quản lý việc mount vào DOM an toàn
    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body", // Gắn vào body
      append: "last", // Nằm cuối cùng
      onMount: (container) => {
        // Tạo root React
        const root = ReactDOM.createRoot(container);
        root.render(<ThemeMenu />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    // Hiện UI
    ui.mount();
  },
});

```

---

### BƯỚC 4: Chạy thử & Đóng gói (Ship)

#### 1. Chạy thử (Development Mode)

Bạn muốn test trên Firefox? Chỉ cần chạy lệnh:

```bash
npm run dev:firefox

```

* WXT sẽ tự động mở một cửa sổ Firefox Developer Edition (hoặc Firefox thường) với extension đã được cài sẵn.
* Mỗi khi bạn sửa code và lưu (`Ctrl+S`), extension sẽ **tự động reload** (Hot Module Replacement) ngay lập tức. Cảm giác code phê hơn hẳn F5 thủ công đúng không?

#### 2. Đóng gói để Ship (Production Build)

Khi đã ưng ý và muốn gửi cho bạn bè, chạy lệnh:

```bash
npm run build

```

Sau khi chạy xong, bạn vào thư mục `.output/`.

* Bạn sẽ thấy file `gemini-reader-1.0.0-firefox.zip` (hoặc `.xpi`).
* Đây chính là file bạn đem đi "ship" hoặc upload lên Mozilla Add-ons Store.

### Tại sao dùng WXT lại "đỉnh"?

1. **React:** Bạn viết UI (cái Menu) bằng React component quen thuộc, không phải nối chuỗi HTML thủ công.
2. **TypeScript:** Code nhắc lệnh (Intellisense) đầy đủ, tránh lỗi gõ sai tên hàm `click` hay `querySelector`.
3. **Auto Import:** CSS tự động được inject vào trang chỉ bằng 1 dòng `import`.
4. **Cross-Browser:** Cùng 1 source code, bạn chạy `npm run dev:chrome` là nó build ra bản cho Chrome luôn.

Bạn thử setup đi, đảm bảo sẽ thấy việc viết Extension trở nên "sang chảnh" hơn hẳn!