/**
 * 婚禮網站主要 JavaScript 文件
 * 包含所有互動功能和動態效果
 */

// ========================================
// 頁面載入後初始化
// ========================================
document.addEventListener('DOMContentLoaded', function() {

  // 初始化 AOS 動畫庫
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100
    });
  }

  // 初始化所有功能
  initCountdown();
  initBackToTop();
  initSmoothScroll();
  initNavbarScroll();
  initRSVPForm();
  initGallery();
  initHeroSlideshow();
});

// ========================================
// 倒數計時器
// ========================================
function initCountdown() {
  // 設定婚禮日期 (2026年5月12日 11:00:00)
  const weddingDate = new Date('2026-05-12T11:00:00').getTime();

  // 每秒更新一次
  const countdownInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // 計算天、時、分、秒
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 更新 DOM
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (daysElement) daysElement.textContent = padZero(days);
    if (hoursElement) hoursElement.textContent = padZero(hours);
    if (minutesElement) minutesElement.textContent = padZero(minutes);
    if (secondsElement) secondsElement.textContent = padZero(seconds);

    // 如果倒數結束
    if (distance < 0) {
      clearInterval(countdownInterval);
      if (daysElement) daysElement.textContent = '00';
      if (hoursElement) hoursElement.textContent = '00';
      if (minutesElement) minutesElement.textContent = '00';
      if (secondsElement) secondsElement.textContent = '00';

      // 顯示婚禮進行中的訊息
      const countdownDiv = document.getElementById('countdown');
      if (countdownDiv) {
        countdownDiv.innerHTML = '<h3 class="text-white">婚禮正在進行中！</h3>';
      }
    }
  }, 1000);
}

// 補零函數
function padZero(num) {
  return num < 10 ? '0' + num : num;
}

// ========================================
// 返回頂部按鈕
// ========================================
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');

  if (!backToTopBtn) return;

  // 監聽滾動事件
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // 點擊返回頂部
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ========================================
// 平滑滾動
// ========================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // 排除空連結和特殊連結
      if (href === '#' || href === '#!') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        // 獲取目標位置，減去導航欄高度
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // 在手機版關閉導航選單
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: true
          });
        }
      }
    });
  });
}

// ========================================
// 導航欄滾動效果
// ========================================
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');

  if (!navbar) return;

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 100) {
      // 滾動時：50% 透明度、四邊圓角、增強陰影
      navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
      navbar.style.background = 'rgba(255, 255, 255, 0.5)';
      navbar.style.backdropFilter = 'blur(10px)';
      navbar.style.borderRadius = '15px';
      navbar.style.margin = '10px 20px';
      navbar.style.width = 'calc(100% - 40px)';
      navbar.style.left = '0';
      navbar.style.right = '0';
    } else {
      // 頂部時：完全不透明、無圓角
      navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
      navbar.style.background = '#ffffff';
      navbar.style.backdropFilter = 'none';
      navbar.style.borderRadius = '0';
      navbar.style.margin = '0';
      navbar.style.width = '100%';
    }
  });
}

// ========================================
// RSVP 表單處理
// ========================================
function initRSVPForm() {
  const form = document.getElementById('rsvpForm');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const guestCountSection = document.getElementById('guestCountSection');
  const dietarySection = document.getElementById('dietarySection');
  const successMessage = document.getElementById('successMessage');

  if (!form) return;

  // 監聽出席選項變化
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'no') {
        // 無法出席時隱藏人數和飲食選項
        if (guestCountSection) guestCountSection.style.display = 'none';
        if (dietarySection) dietarySection.style.display = 'none';
      } else {
        // 出席時顯示人數和飲食選項
        if (guestCountSection) guestCountSection.style.display = 'block';
        if (dietarySection) dietarySection.style.display = 'block';
      }
    });
  });

  // 表單提交處理
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 獲取表單數據
    const formData = {
      name: document.getElementById('guestName').value,
      email: document.getElementById('guestEmail').value,
      phone: document.getElementById('guestPhone').value,
      attendance: document.querySelector('input[name="attendance"]:checked').value,
      guestCount: document.getElementById('guestCount').value,
      vegetarian: document.getElementById('vegetarian').checked,
      childSeat: document.getElementById('childSeat').checked,
      message: document.getElementById('message').value
    };

    // 驗證表單
    if (!formData.name || !formData.email) {
      alert('請填寫必填欄位（姓名和電子信箱）');
      return;
    }

    // 驗證 Email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('請輸入有效的電子信箱地址');
      return;
    }

    // 模擬表單提交
    console.log('RSVP 表單數據:', formData);

    // 這裡可以添加實際的表單提交邏輯，例如：
    // - 發送到後端 API
    // - 發送到 Google Sheets
    // - 發送郵件通知

    // 顯示成功訊息
    if (successMessage) {
      successMessage.classList.remove('d-none');

      // 滾動到成功訊息
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // 重置表單
      setTimeout(() => {
        form.reset();
        successMessage.classList.add('d-none');

        // 重新顯示人數和飲食選項（因為預設是出席）
        if (guestCountSection) guestCountSection.style.display = 'block';
        if (dietarySection) dietarySection.style.display = 'block';
      }, 3000);
    }

    // 實際應用中，這裡應該要有 AJAX 請求
    /*
    fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      successMessage.classList.remove('d-none');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('提交失敗，請稍後再試');
    });
    */
  });

  // 重置按鈕處理
  form.addEventListener('reset', function() {
    if (successMessage) {
      successMessage.classList.add('d-none');
    }
    // 確保重置後顯示人數和飲食選項
    if (guestCountSection) guestCountSection.style.display = 'block';
    if (dietarySection) dietarySection.style.display = 'block';
  });
}

// ========================================
// 相片集互動
// ========================================
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (img) {
        // 這裡可以添加燈箱效果
        // 例如使用 lightbox2 或其他圖片查看器套件
        console.log('點擊圖片:', img.src);

        // 簡單的全螢幕顯示
        openImageModal(img.src, img.alt);
      }
    });
  });
}

// 簡單的圖片模態視窗
function openImageModal(src, alt) {
  // 創建模態視窗
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: pointer;
  `;

  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    border-radius: 10px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  `;

  modal.appendChild(img);
  document.body.appendChild(modal);

  // 點擊關閉
  modal.addEventListener('click', function() {
    document.body.removeChild(modal);
  });

  // ESC 鍵關閉
  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape' && document.body.contains(modal)) {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', closeOnEsc);
    }
  });
}

// ========================================
// 首頁背景投影片輪播
// ========================================
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');

  console.log('投影片輪播初始化 - 找到投影片數量:', slides.length);

  if (!slides || slides.length === 0) {
    console.error('錯誤：找不到投影片元素');
    return;
  }

  let currentSlide = 0;
  console.log('投影片輪播已啟動，每 5 秒切換一次');

  // 每 5 秒切換到下一張照片
  setInterval(function() {
    // 移除當前幻燈片的 active 類別
    slides[currentSlide].classList.remove('active');

    // 移動到下一張幻燈片
    currentSlide = (currentSlide + 1) % slides.length;

    // 添加 active 類別到新的幻燈片
    slides[currentSlide].classList.add('active');

    console.log('切換至投影片:', currentSlide + 1, '/', slides.length);
  }, 5000); // 5000 毫秒 = 5 秒
}

// ========================================
// 其他輔助函數
// ========================================

// 檢測元素是否在視窗中
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// 節流函數（用於優化滾動事件）
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 防抖函數（用於優化輸入事件）
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// 性能優化：使用 Intersection Observer
// ========================================
if ('IntersectionObserver' in window) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // 觀察需要動畫的元素
  document.querySelectorAll('.timeline-item, .gallery-item, .info-card').forEach(el => {
    observer.observe(el);
  });
}

// ========================================
// 控制台歡迎訊息
// ========================================
console.log('%c❤️ 歡迎來到我們的婚禮網站！', 'color: #dc3545; font-size: 20px; font-weight: bold;');
console.log('%c感謝您的蒞臨，期待與您分享我們的喜悅！', 'color: #6c757d; font-size: 14px;');
