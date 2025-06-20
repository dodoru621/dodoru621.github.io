// js.txt

// 漢堡選單和回到頂部按鈕的 JavaScript (這部分可以保持在最上方，因為它們通常不需要等待所有 DOM 內容)
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navLinks = document.querySelector(".nav-links");
// backToTopBtn 可能會是 null，因為它在 footer 裡，如果 script 在 footer 前載入，可能會抓不到
// 建議也將 backToTopBtn 的獲取放到 DOMContentLoaded 裡，或者確保 script 標籤在 body 結束標籤之前
const backToTopBtn = document.getElementById("backToTopBtn");

// 監聽漢堡選單按鈕的點擊事件
hamburgerMenu.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  hamburgerMenu.classList.toggle("open"); // 這行是為了漢堡圖標本身的動畫
});

// 當點擊導航連結時，關閉漢堡選單
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburgerMenu.classList.remove("open");
  });
});

// 回到頂部按鈕的顯示與隱藏 (這部分也可以移到 DOMContentLoaded 裡面，更安全)
// window.addEventListener("scroll", () => {
//   if (window.scrollY > document.getElementById("hero").offsetHeight) {
//     backToTopBtn.classList.add("show");
//   } else {
//     backToTopBtn.classList.remove("show");
//   }
// });

// 回到頂部按鈕的點擊事件 (這部分也可以移到 DOMContentLoaded 裡面，更安全)
// backToTopBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   window.scrollTo({
//     top: 0,
//     behavior: "smooth",
//   });
// });

// *** 這是最關鍵的修改：將影片相關的代碼移入 DOMContentLoaded ***
document.addEventListener("DOMContentLoaded", () => {
  // 搜尋框的 JavaScript (這部分已經在裡面了，保持不動)
  const searchBox = document.querySelector(".search-box");
  const searchInput = document.querySelector(".search-input");
  const searchImage = document.querySelector(".search-image");

  searchImage.addEventListener("click", () => {
    searchBox.classList.toggle("active");
    if (searchBox.classList.contains("active")) {
      searchInput.focus();
    } else {
      searchInput.value = ""; // 清空輸入框
    }
  });

  // 點擊搜尋框以外的區域時隱藏搜尋框 (如果它處於展開狀態)
  document.addEventListener("click", (event) => {
    if (
      !searchBox.contains(event.target) &&
      searchBox.classList.contains("active")
    ) {
      searchBox.classList.remove("active");
      searchInput.value = ""; // 清空輸入框
    }
  });

  // 輪播圖 JavaScript (這部分已經在裡面了，保持不動)
  const carouselTrack = document.querySelector(".carousel-track");
  const carouselItems = Array.from(document.querySelectorAll(".carousel-item"));

  const totalItems = carouselItems.length;
  let currentIndex = 0; // 當前中間顯示的原始圖片索引 (0 到 totalItems - 1)
  const clonedCount = 2; // 頭尾各複製的數量

  // 複製首尾元素以實現無縫循環
  for (let i = 0; i < clonedCount; i++) {
    const clone = carouselItems[totalItems - 1 - i].cloneNode(true);
    carouselTrack.prepend(clone);
  }
  for (let i = 0; i < clonedCount; i++) {
    const clone = carouselItems[i].cloneNode(true);
    carouselTrack.appendChild(clone);
  }

  const allCarouselItems = Array.from(
    document.querySelectorAll(".carousel-item")
  );

  // 設置初始位置：顯示原始的第一張圖片 (索引 0) 在中間
  const initializeCarousel = () => {
    carouselTrack.style.transition = "none"; // 暫時移除過渡

    let centerOffset = 0;
    for (let i = 0; i < clonedCount; i++) {
      centerOffset += allCarouselItems[i].offsetWidth;
      const itemStyle = window.getComputedStyle(allCarouselItems[i]);
      centerOffset +=
        parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight);
    }
    carouselTrack.style.transform = `translateX(-${centerOffset}px)`;
    setTimeout(() => {
      carouselTrack.style.transition = "transform 0.5s ease-in-out"; // 恢復過渡
    }, 50); // 稍作延遲，確保過渡移除生效
    updateActiveItem();
  };

  initializeCarousel();

  // 輪播功能
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");

  prevButton.addEventListener("click", () => {
    currentIndex--;
    updateCarouselPosition(true);
    stopAutoSlide(); // 用戶手動操作後停止自動輪播
    startAutoSlide(); // 重新啟動計時器
  });

  nextButton.addEventListener("click", () => {
    currentIndex++;
    updateCarouselPosition(true);
    stopAutoSlide(); // 用戶手動操作後停止自動輪播
    startAutoSlide(); // 重新啟動計時器
  });

  function updateCarouselPosition(animate = true) {
    if (!allCarouselItems.length) return; // 防止沒有輪播項目時出錯

    let offset = 0;
    // 計算到當前應顯示的原始圖片 (考慮到克隆元素) 的偏移量
    for (let i = 0; i < currentIndex + clonedCount; i++) {
      offset += allCarouselItems[i].offsetWidth;
      const itemStyle = window.getComputedStyle(allCarouselItems[i]);
      offset +=
        parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight);
    }

    carouselTrack.style.transform = `translateX(-${offset}px)`;

    // 如果不觸發動畫 (即跳轉時)，不需要立即調用 updateActiveItem
    // 因為 transitionend 會觸發它
    if (animate) {
      updateActiveItem();
    }
  }

  function updateActiveItem() {
    allCarouselItems.forEach((item, index) => {
      item.classList.remove("active");
      if (index === currentIndex + clonedCount) {
        item.classList.add("active");
      }
    });
  }

  // 當 transition 結束時，瞬間跳轉以實現無縫循環
  carouselTrack.addEventListener("transitionend", () => {
    // 檢查是否到了克隆的元素
    if (currentIndex < 0) {
      // 從原始第一張向前滑，到了克隆的最後一張
      currentIndex = totalItems - 1; // 跳回原始的最後一張
      updateCarouselPosition(false); // 不觸發動畫，直接跳轉
    } else if (currentIndex >= totalItems) {
      // 從原始最後一張向後滑，到了克隆的第一張
      currentIndex = 0; // 跳回原始的第一張
      updateCarouselPosition(false); // 不觸發動畫，直接跳轉
    }
    // 無論是否跳轉，都確保 active class 正確更新
    updateActiveItem();
  });

  // 自動輪播功能
  let autoSlideInterval;
  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      currentIndex++;
      updateCarouselPosition(true);
    }, 5000); // 每5秒自動切換
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  startAutoSlide(); // 初始化時開始自動輪播

  // ** 將所有影片相關的 DOM 獲取和事件監聽移到這裡面！**
  // ** 將所有影片相關的 DOM 獲取和事件監聽移到這裡面！**
  const videoButton = document.querySelector(".view-animation-btn");
  const videoModal = document.getElementById("videoModal");
  let closeButton = document.querySelector(".close-button"); // **將 const 改為 let，方便後續賦值**
  const localVideo = document.getElementById("localVideo");
  // 點擊「觀看影片」按鈕時顯示彈出視窗
  if (videoButton) {
    // 添加檢查，確保按鈕存在
    videoButton.addEventListener("click", (event) => {
      event.preventDefault();
      videoModal.style.display = "flex";

      if (localVideo) {
        localVideo.play();
      }
      videoModal.classList.remove("fadeOut");
      videoModal.classList.add("fadeIn");
    });
  }
  // 點擊關閉按鈕時關閉彈出視窗
  if (closeButton) {
    // **新增：確保 closeButton 存在才綁定事件**
    closeButton.addEventListener("click", () => {
      closeVideoModal();
    });
  } else {
    console.error("關閉按鈕不存在，無法綁定點擊事件。");
  }
  // 點擊彈出視窗外部區域時關閉彈出視窗
  videoModal.addEventListener("click", (event) => {
    if (event.target === videoModal) {
      closeVideoModal();
    }
  });

  // 定義關閉視窗的函數，包括停止影片播放
  function closeVideoModal() {
    videoModal.classList.remove("fadeIn");
    videoModal.classList.add("fadeOut");

    videoModal.addEventListener("animationend", function handler() {
      if (videoModal.classList.contains("fadeOut")) {
        videoModal.style.display = "none";
        if (localVideo) {
          // 再次確認 localVideo 是否存在
          localVideo.pause();
          localVideo.currentTime = 0;
        }
        videoModal.removeEventListener("animationend", handler);
      }
    });
  }

  // 鍵盤 ESC 鍵關閉彈出視窗
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && videoModal.style.display === "flex") {
      closeVideoModal();
    }
  });

  // 回到頂部按鈕的顯示與隱藏 (這裡更安全)
  const realBackToTopBtn = document.getElementById("backToTopBtn");
  if (realBackToTopBtn) {
    // 只有當按鈕存在時才添加事件監聽
    window.addEventListener("scroll", () => {
      if (window.scrollY > document.getElementById("hero").offsetHeight) {
        realBackToTopBtn.classList.add("show");
      } else {
        realBackToTopBtn.classList.remove("show");
      }
    });

    realBackToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}); // DOMContentLoaded 結束
