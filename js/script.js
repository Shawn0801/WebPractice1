// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  initParallax();
  initInvitationCard();
  initFormHandler();
  initSmoothScroll();
});

// ==================== 滾動動畫 ====================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // 觀察所有需要動畫的元素
  const animatedElements = document.querySelectorAll('.section-title, .timeline-item, .info-card');
  animatedElements.forEach(el => observer.observe(el));
}

// ==================== 視差滾動效果 ====================
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-speed]');

  function updateParallax() {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-speed');
      const elementTop = element.parentElement.offsetTop;
      const elementHeight = element.parentElement.offsetHeight;
      const windowHeight = window.innerHeight;

      // 計算元素是否在視窗內
      if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
        const yPos = (scrolled - elementTop) * speed;
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });
  }

  // 使用 requestAnimationFrame 優化性能
  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  // 初始化
  updateParallax();
}

// ==================== 喜帖打開動畫 ====================
function initInvitationCard() {
  const invitationCard = document.getElementById('invitationCard');
  const invitationSection = document.querySelector('.invitation-section');

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 延遲打開效果，讓用戶先看到關閉的狀態
        setTimeout(() => {
          invitationCard.classList.add('opened');
        }, 500);
      }
    });
  }, observerOptions);

  observer.observe(invitationSection);

  // 添加點擊事件，可以手動控制開關
  invitationCard.addEventListener('click', function(e) {
    // 如果點擊的是卡片左右兩側
    if (e.target.classList.contains('card-left') ||
        e.target.classList.contains('card-right') ||
        e.target.classList.contains('card-pattern')) {
      invitationCard.classList.toggle('opened');
    }
  });
}

// ==================== 表單處理 ====================
function initFormHandler() {
  const form = document.getElementById('rsvpForm');
  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 獲取表單數據
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      if (data[key]) {
        // 處理多選的情況（如飲食限制）
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    });

    // 在這裡可以發送數據到後端
    console.log('表單數據:', data);

    // 顯示成功訊息
    form.style.display = 'none';
    successMessage.classList.add('show');

    // 3秒後重置表單（可選）
    setTimeout(() => {
      // form.reset();
      // form.style.display = 'block';
      // successMessage.classList.remove('show');
    }, 3000);
  });

  // 表單驗證增強
  const requiredInputs = form.querySelectorAll('[required]');
  requiredInputs.forEach(input => {
    input.addEventListener('invalid', function(e) {
      e.preventDefault();
      this.classList.add('error');
    });

    input.addEventListener('input', function() {
      this.classList.remove('error');
    });
  });
}

// ==================== 平滑滾動 ====================
function initSmoothScroll() {
  // 為所有內部錨點鏈接添加平滑滾動
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ==================== 滾動進度指示器（可選） ====================
function createScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 4px;
    background: linear-gradient(90deg, #d4a574, #8b7355);
    z-index: 9999;
    transition: width 0.3s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// 可選：啟用滾動進度指示器
// createScrollProgress();

// ==================== 浮動元素互動（可選） ====================
function initFloatingElements() {
  const floatingElements = document.querySelectorAll('.float-element');

  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    floatingElements.forEach((element, index) => {
      const speed = (index + 1) * 20;
      const x = (mouseX - 0.5) * speed;
      const y = (mouseY - 0.5) * speed;

      element.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// 可選：啟用浮動元素互動
// initFloatingElements();

// ==================== 加載動畫 ====================
window.addEventListener('load', function() {
  // 頁面加載完成後的動畫
  document.body.style.opacity = '0';

  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// ==================== 響應式處理 ====================
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    // 重新計算視差效果
    if (window.innerWidth > 768) {
      initParallax();
    }
  }, 250);
});

// ==================== 防止表單重複提交 ====================
let isSubmitting = false;

document.addEventListener('submit', function(e) {
  if (isSubmitting) {
    e.preventDefault();
    return false;
  }

  const form = e.target;
  if (form.id === 'rsvpForm') {
    isSubmitting = true;

    setTimeout(() => {
      isSubmitting = false;
    }, 3000);
  }
});

// ==================== 添加錯誤樣式 ====================
const style = document.createElement('style');
style.textContent = `
  .error {
    border-color: #e74c3c !important;
    animation: shake 0.5s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  /* 滾動條樣式 */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #d4a574 0%, #8b7355 100%);
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #8b7355 0%, #d4a574 100%);
  }
`;
document.head.appendChild(style);

// ==================== Console 訊息 ====================
console.log('%c💒 歡迎來到我們的婚禮網站！', 'color: #d4a574; font-size: 20px; font-weight: bold;');
console.log('%c祝福我們吧 ❤️', 'color: #8b7355; font-size: 16px;');
