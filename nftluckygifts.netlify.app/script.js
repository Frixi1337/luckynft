const gifts = [
    { src: 'images/gift1.png', name: 'Frog & Heart' },
    { src: 'images/gift2.png', name: 'Light Saber' },
    { src: 'images/gift3.png', name: 'Eternal Candle' },
    { src: 'images/gift4.png', name: 'Evil Eye' },
    { src: 'images/gift5.png', name: 'Candy Cane' },
    { src: 'images/gift6.png', name: 'Vintage Cigar' },
    { src: 'images/gift7.png', name: 'Party Sparkler' },
    { src: 'images/gift8.png', name: 'Perfume Bottle' },
    { src: 'images/gift9.png', name: 'Easter Eggs' },
    { src: 'images/gift10.png', name: 'Star' },
    { src: 'images/gift11.png', name: 'Calendar' },
    { src: 'images/gift12.png', name: 'Voodoo Doll' }
];

const carousel = document.getElementById('carousel');
const carouselWrapper = document.querySelector('.carousel-wrapper');
const spinBtn = document.getElementById('spin');
const modal = document.getElementById('modal');
const connectBtn = document.getElementById('connect');
const prizeImg = document.getElementById('prize-img');
const prizeName = document.getElementById('prize-name');
const countdownEl = document.getElementById('countdown');
const loadingIndicator = document.getElementById('loading-indicator');

const itemWidth = 228; // 200px + margins
const infiniteSpeed = 1.5; // пикселей в кадр
let infiniteScrollOffset = 0;
let infiniteInterval;
let isSpinning = false;
let isFirstSpin = true;

function preloadImages() {
    const imagePromises = gifts.map(p => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = p.src;
        img.onload = () => resolve();
        img.onerror = () => {
        console.warn(`Ошибка загрузки ${p.src}`);
        p.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwADZQGO4dB3KAAAAABJRU5ErkJggg==';
        resolve();
        };
    });
    });
    return Promise.all(imagePromises);
}

function initCarousel() {
    const repeated = [];
    for (let i = 0; i < 10; i++) repeated.push(...gifts); // повторение
    carousel.innerHTML = repeated.map(p => `
    <div class="item" style="background-image:url('${p.src}');">
        <span class="item-label">${p.name}</span>
    </div>
    `).join('');
    carousel.style.width = `${repeated.length * itemWidth}px`;
    carousel.classList.add('loaded');
    loadingIndicator.style.display = 'none';
    spinBtn.disabled = false;
    startInfiniteScroll();
}

function startInfiniteScroll() {
    infiniteScrollOffset = 0;
    clearInterval(infiniteInterval);
    infiniteInterval = setInterval(() => {
    infiniteScrollOffset -= infiniteSpeed;
    if (Math.abs(infiniteScrollOffset) >= carousel.offsetWidth / 2) {
        infiniteScrollOffset = 0;
    }
    carousel.style.transition = 'none';
    carousel.style.left = `${infiniteScrollOffset}px`;
    }, 16); // ~60fps
}

function stopInfiniteScroll() {
    clearInterval(infiniteInterval);
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    modal.style.display = 'none';
    stopInfiniteScroll();

    const winIndex = Math.floor(Math.random() * gifts.length);
    const totalItems = gifts.length * 10;
    const currentLeft = parseFloat(carousel.style.left) || 0;
    const currentOffset = -currentLeft;

    const spins = 5;
    const targetIndex = gifts.length * spins + winIndex;
    const finalOffset = targetIndex * itemWidth;

    // Ширина видимой области (центра карусели)
    const carouselContainerWidth = carouselWrapper.offsetWidth;
    const centerOffset = (carouselContainerWidth / 2) - (itemWidth / 2); // центр – половина item ширины

    // Итоговая позиция — выравниваем по центру
    const finalLeft = -(finalOffset - centerOffset);

    carousel.style.transition = 'left 6s cubic-bezier(0.1, 0.7, 0.3, 1)';
    carousel.style.left = `${finalLeft}px`;

    setTimeout(() => {
        const items = carousel.querySelectorAll('.item');
        const winningItem = items[targetIndex];
        if (winningItem) {
            winningItem.classList.add('highlight');
            setTimeout(() => winningItem.classList.remove('highlight'), 1500);
        }

        prizeImg.src = gifts[winIndex].src;
        prizeName.textContent = gifts[winIndex].name;
        modal.style.display = 'flex';

        isSpinning = false;
        if (isFirstSpin) {
            isFirstSpin = false;
            startCountdown();
        }
    }, 6000);
}

function startCountdown() {
    let timer = 24 * 3600;
    spinBtn.disabled = true;
    countdownEl.textContent = formatTime(timer);
    const interval = setInterval(() => {
    if (timer > 0) {
        timer--;
        countdownEl.textContent = formatTime(timer);
    } else {
        spinBtn.disabled = false;
        countdownEl.textContent = '00:00:00';
        clearInterval(interval);
    }
    }, 1000);
}

function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

spinBtn.addEventListener('click', spin);
connectBtn.addEventListener('click', () => {
    window.open('tg://resolve?domain=luckyrollet_robot&start=business', '_blank');
});

window.addEventListener('load', () => {
    spinBtn.disabled = true;
    loadingIndicator.style.display = 'flex';
    preloadImages().then(() => {
    initCarousel();
    });
});