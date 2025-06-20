// js.txt

// 漢堡選單和回到頂部按鈕的 JavaScript (這部分可以保持在最上方，因為它們通常不需要等待所有 DOM 內容)
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navLinks = document.querySelector(".nav-links");

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

// *** 確保所有需要等待 DOM 加載完成的代碼都放在這裡面！***
document.addEventListener("DOMContentLoaded", () => {
    // 搜尋框的 JavaScript (保持不動)
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
        if (!searchBox.contains(event.target) && searchBox.classList.contains("active")) {
            searchBox.classList.remove("active");
            searchInput.value = ""; // 清空輸入框
        }
    });

      // 影片彈出視窗 JavaScript
    const videoButton = document.querySelector(".view-animation-btn");
    const videoModal = document.getElementById("videoModal");
    const closeButton = document.querySelector(".close-button"); // 確保這裡能正確抓到
    const localVideo = document.getElementById("localVideo");

    if (videoButton) {
        videoButton.addEventListener("click", (event) => {
            event.preventDefault();
            videoModal.style.display = "flex"; // 顯示 modal
            if (localVideo) {
                localVideo.play();
            }
            videoModal.classList.remove("fadeOut");
            videoModal.classList.add("fadeIn");
        });
    }

    // 確保 closeButton 被正確選取到，並綁定點擊事件
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            closeVideoModal();
        });
    } else {
        console.error("錯誤：影片彈出視窗的關閉按鈕未找到。請檢查 HTML 中的 '.close-button' 類別或 ID。");
    }

    // 點擊黑色背景時關閉
    videoModal.addEventListener("click", (event) => {
        if (event.target === videoModal) { // 只有點擊到 modal 本身（背景）時才關閉
            closeVideoModal();
        }
    });

    function closeVideoModal() {
        videoModal.classList.remove("fadeIn");
        videoModal.classList.add("fadeOut");

        // 在 fadeOut 動畫結束後徹底隱藏 modal 並停止影片
        videoModal.addEventListener("animationend", function handler() {
            if (videoModal.classList.contains("fadeOut")) {
                videoModal.style.display = "none";
                if (localVideo) {
                    localVideo.pause();
                    localVideo.currentTime = 0; // 重置影片到開頭
                }
                videoModal.removeEventListener("animationend", handler); // 移除事件監聽器，避免重複觸發
            }
        });
    }

    // 按下 Escape 鍵關閉影片
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && videoModal.style.display === "flex") {
            closeVideoModal();
        }
    });


    
    // 回到頂部按鈕的顯示與隱藏 (已確保在 DOMContentLoaded 內)
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            // 確保 hero 元素存在
            const heroSection = document.getElementById("hero");
            if (heroSection && window.scrollY > heroSection.offsetHeight) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    }


     // ====== 輪播圖 JavaScript (根據你提供的最新邏輯) ======
    const carouselTrack = document.querySelector(".carousel-track");
    const originalCarouselItems = Array.from(document.querySelectorAll(".carousel-item")); // 獲取原始項目
    const prevButton = document.querySelector(".carousel-button.prev");
    const nextButton = document.querySelector(".carousel-button.next");

    const totalOriginalItems = originalCarouselItems.length;
    // currentIndex: 指向原始圖片陣列的索引 (0 到 totalOriginalItems - 1)
    let currentIndex = 0;
    const clonedCount = 2; // 頭尾各複製的數量

    // 複製首尾元素以實現無縫循環
    // 從原始陣列末尾複製到 track 的前面
    for (let i = 0; i < clonedCount; i++) {
        const clone = originalCarouselItems[totalOriginalItems - 1 - i].cloneNode(true);
        carouselTrack.prepend(clone);
    }
    // 從原始陣列開頭複製到 track 的後面
    for (let i = 0; i < clonedCount; i++) {
        const clone = originalCarouselItems[i].cloneNode(true);
        carouselTrack.appendChild(clone);
    }

    // 重新獲取所有輪播項目，包含原始和克隆的
    const allCarouselItems = Array.from(document.querySelectorAll(".carousel-item"));

    // 設置初始位置：顯示原始的第一張圖片 (索引 0) 在中間
    const initializeCarousel = () => {
        carouselTrack.style.transition = "none"; // 暫時移除過渡

        // 計算偏移量，將原始第一張圖片 (在 allCarouselItems 中的索引為 clonedCount) 的中心對齊容器中心
        let centerOffset = 0;
        for (let i = 0; i < clonedCount; i++) {
            centerOffset += allCarouselItems[i].offsetWidth;
            const itemStyle = window.getComputedStyle(allCarouselItems[i]);
            centerOffset += parseFloat(itemStyle.marginRight) + parseFloat(itemStyle.marginLeft);
        }
        // 加上要顯示的當前圖片的一半寬度，使計算的起點是圖片的中心
        centerOffset += allCarouselItems[clonedCount].offsetWidth / 2;

        const containerWidth = carouselTrack.parentElement.offsetWidth;
        carouselTrack.style.transform = `translateX(${ -centerOffset + containerWidth / 2 }px)`;

        // 這裡的 setTimeout 確保瀏覽器有時間應用 transform: none，然後再恢復過渡
        setTimeout(() => {
            carouselTrack.style.transition = "transform 0.5s ease-in-out";
        }, 100); // 增加延遲到 100ms 確保無閃爍

        updateActiveItem();
    };

    // 更新輪播位置和 active 類別
    function updateCarouselPosition(animate = true) {
        if (!animate) {
            carouselTrack.style.transition = "none";
        } else {
            carouselTrack.style.transition = "transform 0.5s ease-in-out";
        }

        // targetRealIndex 是在 allCarouselItems 中實際要移動到的元素索引
        const targetRealIndex = currentIndex + clonedCount;

        let currentTranslateX = 0;
        // 計算到 targetRealIndex 元素左邊緣的總寬度
        for (let i = 0; i < targetRealIndex; i++) {
            currentTranslateX += allCarouselItems[i].offsetWidth;
            const itemStyle = window.getComputedStyle(allCarouselItems[i]);
            currentTranslateX += parseFloat(itemStyle.marginRight) + parseFloat(itemStyle.marginLeft);
        }
        // 加上 targetRealIndex 元素的一半寬度，使其變成到該元素中心的距離
        currentTranslateX += allCarouselItems[targetRealIndex].offsetWidth / 2;

        const containerWidth = carouselTrack.parentElement.offsetWidth;
        // 計算最終的 transform 值：將圖片中心與容器中心對齊
        carouselTrack.style.transform = `translateX(${ -currentTranslateX + containerWidth / 2 }px)`;

        // 如果不觸發動畫 (即跳轉時)，不需要立即調用 updateActiveItem
        // 因為 transitionend 會觸發它 (不過此處你的邏輯是直接觸發了)
        // 為了避免重複觸發，當 animate 為 true 時，讓 transitionend 負責。
        // 當 animate 為 false 時 (跳轉)，直接調用。
        if (!animate) {
            updateActiveItem();
        }
    }

    // 更新 active 類別
    function updateActiveItem() {
        allCarouselItems.forEach((item) => {
            item.classList.remove("active");
        });
        // currentIndex 是原始陣列的索引，加上 clonedCount 才是 allCarouselItems 中的實際索引
        if (allCarouselItems[currentIndex + clonedCount]) {
            allCarouselItems[currentIndex + clonedCount].classList.add("active");
        }
    }

    // 當 transition 結束時，瞬間跳轉以實現無縫循環
    carouselTrack.addEventListener("transitionend", () => {
        // 檢查是否到了克隆的元素
        if (currentIndex < 0) {
            // 從原始第一張向前滑，到了克隆的最後一張
            currentIndex = totalOriginalItems - 1; // 跳回原始的最後一張
            updateCarouselPosition(false); // 不觸發動畫，直接跳轉
        } else if (currentIndex >= totalOriginalItems) {
            // 從原始最後一張向後滑，到了克隆的第一張
            currentIndex = 0; // 跳回原始的第一張
            updateCarouselPosition(false); // 不觸發動畫，直接跳轉
        }
        // 無論是否跳轉，都確保 active class 正確更新 (因為 updateCarouselPosition(true) 時沒有立即調用)
        updateActiveItem();
    });

    // 綁定左右按鈕事件
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


    // 自動輪播功能
    let autoSlideInterval;
    const startAutoSlide = () => {
        stopAutoSlide(); // 確保清除任何現有的計時器
        autoSlideInterval = setInterval(() => {
            currentIndex++;
            updateCarouselPosition(true); // 觸發動畫
        }, 5000); // 每 5 秒切換一次
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // 鼠標進入輪播區域時停止自動播放
    // 注意：這裡使用 carouselTrack.parentElement 來監聽，因為按鈕也在其父級內
    carouselTrack.parentElement.addEventListener("mouseenter", stopAutoSlide);
    // 鼠標離開輪播區域時恢復自動播放
    carouselTrack.parentElement.addEventListener("mouseleave", startAutoSlide);

    // 初始化輪播
    initializeCarousel();
    startAutoSlide();
});