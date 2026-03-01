document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.getElementById('translation-tooltip');
    const translatables = document.querySelectorAll('.translatable');
    let activeElement = null;

    function showTranslation(el, x, y) {
        // إزالة التحديد القديم لو وجد
        if (activeElement) activeElement.classList.remove('active-selection');

        activeElement = el;
        activeElement.classList.add('active-selection');

        tooltip.innerText = el.getAttribute('data-ar');
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        tooltip.classList.add('visible');
    }

    function hideTranslation() {
        if (activeElement) {
            activeElement.classList.remove('active-selection');
            activeElement = null;
        }
        tooltip.classList.remove('visible');
    }

    translatables.forEach(el => {
        // للكمبيوتر: بمجرد الوقوف بالماوس يتم التحديد (Hover)
        el.addEventListener('mouseenter', (e) => {
            showTranslation(el, e.clientX, e.clientY);
        });

        el.addEventListener('mouseleave', hideTranslation);

        // للموبايل والتابلت: الضغطة الطويلة تظهر الترجمة، ورفع اليد يخفيها فوراً
        el.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            // منع السلوك الافتراضي للمتصفح (تحديد النص الأصلي)
            // e.preventDefault(); 
            showTranslation(el, touch.clientX, touch.clientY);
        }, { passive: true });

        el.addEventListener('touchend', (e) => {
            // إخفاء الترجمة فور رفع اليد لجعل التجربة سلسة
            hideTranslation();
        });

        // إذا تم تحريك الإصبع (سكرول) يتم الإخفاء
        el.addEventListener('touchmove', hideTranslation);
    });

    // إخفاء الترجمة عند الضغط في أي مكان فارغ (للأمان)
    document.addEventListener('touchstart', (e) => {
        if (!e.target.classList.contains('translatable')) {
            hideTranslation();
        }
    }, { passive: true });
});