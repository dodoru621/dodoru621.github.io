document.addEventListener("DOMContentLoaded", function () {
  // ============== 導覽列 (Navbar) 相關功能 ==============
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const navLinks = document.querySelector(".nav-links");
  const searchBox = document.querySelector(".search-box");
  const searchInput = document.querySelector(".search-input");
  const searchImage = document.querySelector(".search-image");

  // 點擊漢堡選單時切換打開狀態
  if (hamburgerMenu && navLinks) {
    // 確保元素存在才添加事件監聽器
    hamburgerMenu.addEventListener("click", function () {
      hamburgerMenu.classList.toggle("open"); // 切換漢堡圖標動畫
      navLinks.classList.toggle("open"); // 切換導航連結的顯示/隱藏
    });
  }

  // 點擊導航連結時關閉菜單 (可選)
  if (navLinks) {
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        // 如果菜單是打開的，就關閉它
        if (navLinks.classList.contains("open")) {
          if (hamburgerMenu) hamburgerMenu.classList.remove("open");
          navLinks.classList.remove("open");
        }
      });
    });
  }

  // 手機版搜尋框點擊行為
  function handleSearchClick() {
    if (window.innerWidth <= 728 && searchInput && searchBox) {
      // 判斷是否處於展開狀態 (基於寬度或透明度)
      if (
        searchInput.style.width === "200px" ||
        searchInput.style.opacity === "1"
      ) {
        // 如果已經展開，則收起
        searchInput.style.width = "0";
        searchInput.style.opacity = "0";
        searchInput.style.visibility = "hidden";
        searchBox.style.width = "40px"; // 恢復只顯示圖標的寬度
        searchBox.style.padding = "8px";
        searchBox.style.backgroundColor = "transparent"; // 恢復背景
      } else {
        // 如果是收起狀態，則展開
        searchInput.style.width = "200px"; // 展開輸入框的寬度
        searchInput.style.opacity = "1";
        searchInput.style.visibility = "visible";
        searchInput.focus(); // 自動聚焦輸入框
        searchBox.style.width = "200px"; // searchBox 也需要展開
        searchBox.style.padding = "8px 15px";
        searchBox.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; // 顯示背景
      }
    }
  }

  if (searchImage) {
    // 確保搜尋圖標存在才添加事件監聽器
    searchImage.addEventListener("click", handleSearchClick);
  }

  // 處理視窗大小變化時的行為，確保樣式正確重置
  window.addEventListener("resize", function () {
    if (window.innerWidth > 728) {
      // 桌面版
      // 確保漢堡選單和導航連結是關閉狀態，並隱藏漢堡選單
      if (hamburgerMenu) {
        hamburgerMenu.classList.remove("open");
        hamburgerMenu.style.display = "none"; // 確保桌面版隱藏
      }
      if (navLinks) {
        navLinks.classList.remove("open");
        navLinks.style.position = "static"; // 恢復桌面版定位
        navLinks.style.right = "auto"; // 恢復桌面版右邊距
        navLinks.style.height = "auto"; // 恢復桌面版高度
        navLinks.style.backgroundColor = "transparent"; // 恢復桌面版背景
        navLinks.style.boxShadow = "none"; // 移除陰影
        navLinks.style.flexDirection = "row"; // 恢復桌面版排列
        navLinks.style.justifyContent = "flex-start";
        navLinks.style.alignItems = "center";
        navLinks.style.padding = "initial"; // 恢復默認內邊距
        // 顯示導航連結 (因為在手機版會被隱藏)
        navLinks.style.display = "flex"; // 確保桌面版顯示
      }

      // 確保搜尋框回到桌面版狀態
      if (searchInput) {
        searchInput.style.display = "block"; // 桌面版維持 block
        searchInput.style.width = "auto"; // 恢復auto寬度
        searchInput.style.opacity = "1";
        searchInput.style.visibility = "visible";
      }
      if (searchBox) {
        searchBox.style.width = "200px";
        searchBox.style.padding = "8px 15px";
        searchBox.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      }
    } else {
      // 手機版
      // 確保漢堡選單顯示
      if (hamburgerMenu) hamburgerMenu.style.display = "flex";

      // 確保導航連結初始狀態是隱藏的，為滑出做準備
      if (navLinks) {
        navLinks.style.position = "fixed";
        navLinks.style.right = "-100%"; // 保持在視窗外
        navLinks.style.height = "100vh";
        navLinks.style.backgroundColor = "rgba(28, 42, 80, 0.95)";
        navLinks.style.boxShadow = "-5px 0 15px rgba(0, 0, 0, 0.3)";
        navLinks.style.flexDirection = "column";
        navLinks.style.justifyContent = "flex-start";
        navLinks.style.alignItems = "flex-start";
        navLinks.style.padding = "80px 30px 20px";
        navLinks.style.display = "flex"; // 確保手機版也顯示，但被 right:-100% 隱藏
        // 關閉菜單 (如果有打開)
        navLinks.classList.remove("open");
        if (hamburgerMenu) hamburgerMenu.classList.remove("open");
      }

      // 確保搜尋輸入框是隱藏的
      if (searchInput) {
        searchInput.style.width = "0"; // 初始為0寬度
        searchInput.style.opacity = "0";
        searchInput.style.visibility = "hidden";
      }
      if (searchBox) {
        searchBox.style.width = "40px";
        searchBox.style.padding = "8px";
        searchBox.style.backgroundColor = "transparent";
      }
    }
  });

  // 頁面加載時檢查一次螢幕尺寸，設置初始狀態
  window.dispatchEvent(new Event("resize"));

  // ============== 輪播圖 (Carousel) 相關功能 ==============
  // 檢查輪播相關元素是否存在，避免在沒有輪播圖的頁面報錯
  const carouselTrack = document.querySelector(".carousel-track");
  if (carouselTrack) {
    // 只有當 carouselTrack 存在時才執行輪播圖的邏輯
    // 輪播圖的所有程式碼保持不變，但將其放入一個函數中
    function initCarousel() {
      const carouselItems = Array.from(
        document.querySelectorAll(".carousel-item")
      );

      const totalItems = carouselItems.length;
      let currentIndex = 0; // 當前中間顯示的原始圖片索引 (0 到 totalItems - 1)
      const clonedCount = 2; // 頭尾各複製的數量

      // 清除之前的克隆，避免重複添加（如果此函數被多次調用）
      // 注意：這個清理邏輯需要小心，確保不會刪除原始圖片
      // 最好的方式是只在第一次初始化時執行克隆，或者在重新初始化時先移除所有克隆
      // 為了簡潔，這裡假設 initCarousel 只會在 window.onload 時被調用一次。
      // 如果您有動態加載內容或多次調用此函數的需求，需要更健壯的克隆管理。

      // 移除所有現有的克隆節點，但保留原始圖片
      // 找到所有非原始的克隆節點並移除
      const existingClones = carouselTrack.querySelectorAll(
        ".carousel-item.cloned"
      );
      existingClones.forEach((clone) => clone.remove());

      // 重新複製首尾元素以實現無縫循環
      for (let i = 0; i < clonedCount; i++) {
        const clone = carouselItems[totalItems - 1 - i].cloneNode(true);
        clone.classList.add("cloned"); // 添加 class 標記為克隆，方便下次清理
        carouselTrack.prepend(clone);
      }
      for (let i = 0; i < clonedCount; i++) {
        const clone = carouselItems[i].cloneNode(true);
        clone.classList.add("cloned"); // 添加 class 標記為克隆，方便下次清理
        carouselTrack.appendChild(clone);
      }

      // 重新獲取所有輪播項目，包括新添加的克隆
      const allCarouselItems = Array.from(
        document.querySelectorAll(".carousel-item:not(.cloned)") // 確保原始圖片在正確的順序中
      ).concat(Array.from(document.querySelectorAll(".carousel-item.cloned")));
      // 更安全的做法是直接獲取所有 .carousel-item
      // const allCarouselItems = Array.from(document.querySelectorAll(".carousel-item"));

      // 設置初始位置：顯示原始的第一張圖片 (索引 0) 在中間
      const initializeCarousel = () => {
        carouselTrack.style.transition = "none"; // 暫時移除過渡

        let centerOffset = 0;
        // 計算到原始第一張圖片 (allCarouselItems[clonedCount]) 的前緣距離
        for (let i = 0; i < clonedCount; i++) {
          centerOffset += allCarouselItems[i].offsetWidth;
          const itemStyle = window.getComputedStyle(allCarouselItems[i]);
          centerOffset +=
            parseFloat(itemStyle.marginRight) +
            parseFloat(itemStyle.marginLeft);
        }

        const containerWidth = carouselTrack.parentElement.offsetWidth;
        const firstItemOffset = allCarouselItems[clonedCount].offsetLeft; // 原始第一張圖片的左邊緣相對於 track 的距離

        // 計算需要移動的距離，使原始第一張圖片居中
        const targetTranslateX =
          -firstItemOffset +
          containerWidth / 2 -
          allCarouselItems[clonedCount].offsetWidth / 2;

        carouselTrack.style.transform = `translateX(${targetTranslateX}px)`;

        updateActiveItem();

        // 這裡的 setTimeout 確保瀏覽器有時間應用 transform: none，然後再恢復過渡
        setTimeout(() => {
          carouselTrack.style.transition = "transform 0.5s ease-in-out";
        }, 100);
      };

      // 更新輪播位置和 active 類別
      function updateCarouselPosition(animate = true) {
        if (!animate) {
          carouselTrack.style.transition = "none";
        } else {
          carouselTrack.style.transition = "transform 0.5s ease-in-out";
        }

        const targetRealIndex = currentIndex + clonedCount;

        let currentTranslateX = 0;
        // 計算目標圖片 (targetRealIndex) 的前緣距離
        for (let i = 0; i < targetRealIndex; i++) {
          currentTranslateX += allCarouselItems[i].offsetWidth;
          const itemStyle = window.getComputedStyle(allCarouselItems[i]);
          currentTranslateX +=
            parseFloat(itemStyle.marginRight) +
            parseFloat(itemStyle.marginLeft);
        }

        const containerWidth = carouselTrack.parentElement.offsetWidth;
        const targetItemOffset = allCarouselItems[targetRealIndex].offsetLeft; // 目標圖片的左邊緣相對於 track 的距離

        // 計算需要移動的距離，使目標圖片居中
        const targetTranslateX =
          -targetItemOffset +
          containerWidth / 2 -
          allCarouselItems[targetRealIndex].offsetWidth / 2;

        carouselTrack.style.transform = `translateX(${targetTranslateX}px)`;

        if (!animate) {
          updateActiveItem();
        }
      }

      function updateActiveItem() {
        // 確保只對原始圖片應用 active 類別
        carouselItems.forEach((item, index) => {
          // 這裡使用原始的 carouselItems
          item.classList.remove("active");
          if (index === currentIndex) {
            // active 類別應該對應 currentIndex
            item.classList.add("active");
          }
        });
      }

      // 當 transition 結束時，瞬間跳轉以實現無縫循環
      carouselTrack.addEventListener("transitionend", () => {
        if (currentIndex < 0) {
          currentIndex = totalItems - 1;
          updateCarouselPosition(false);
        } else if (currentIndex >= totalItems) {
          currentIndex = 0;
          updateCarouselPosition(false);
        }
        updateActiveItem();
      });

      // 自動輪播功能
      let autoSlideInterval;
      const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
          currentIndex++;
          updateCarouselPosition();
        }, 5000);
      };

      const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
      };

      // 鼠標進入輪播區域時停止自動播放
      carouselTrack.parentElement.addEventListener("mouseenter", stopAutoSlide);
      // 鼠標離開輪播區域時恢復自動播放
      carouselTrack.parentElement.addEventListener(
        "mouseleave",
        startAutoSlide
      );

      initializeCarousel(); // 在圖片載入後初始化
      startAutoSlide(); // 在圖片載入後開始自動播放
    }

    // 將輪播圖的初始化邏輯放在 window.onload 事件中
    window.addEventListener("load", initCarousel);

    // 如果 carousel 容器的尺寸可能在 resize 時改變，可以考慮在 resize 事件中重新初始化
    // 或者至少調整位置
    window.addEventListener("resize", () => {
      // 在這裡判斷是否需要重新執行 initializeCarousel
      // 如果只是視窗大小變化，且 Carousel 的佈局是響應式的，可能只需要更新位置
      // 由於 initializeCarousel 內部會重新計算位置，這裡直接調用是安全的
      if (
        carouselTrack.parentElement.offsetWidth !== carouselTrack.scrollWidth
      ) {
        // 簡單檢查容器寬度是否變化
        initCarousel(); // 重新初始化，這會重新計算並設置位置
      }
    });
  } // 結束 if (carouselTrack)
});
