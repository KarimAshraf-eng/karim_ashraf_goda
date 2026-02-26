let currentSlide = 1;
// حساب عدد الشرائح ديناميكياً بناءً على عدد العناصر الموجودة في الصفحة
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active-slide');
    });
    const targetSlide = document.getElementById('slide-' + index);
    if (targetSlide) {
        targetSlide.classList.add('active-slide');
        document.getElementById('slide-counter').innerText = index + " / " + totalSlides;
    }
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

// تهيئة العداد عند فتح الصفحة
if (totalSlides > 0) {
    showSlide(currentSlide);
}