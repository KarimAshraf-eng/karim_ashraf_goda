document.addEventListener('DOMContentLoaded', () => {
    const bubble = document.getElementById('tooltip');
    let activeEl = null;
    let pressTimer;

    function handleShow(e, el) {
        if (activeEl) activeEl.classList.remove('active-text');
        activeEl = el;
        activeEl.classList.add('active-text');

        // حساب المركز الدقيق للجملة لضمان التوسيط المطلق للفقاعة
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const topY = rect.top;

        bubble.innerText = el.getAttribute('data-ar');
        bubble.style.left = `${centerX}px`;
        bubble.style.top = `${topY}px`;
        bubble.classList.add('visible');

        if (navigator.vibrate) navigator.vibrate(50);
    }

    function handleHide() {
        if (activeEl) activeEl.classList.remove('active-text');
        activeEl = null;
        bubble.classList.remove('visible');
    }

    document.querySelectorAll('.translatable').forEach(el => {
        // دعم الموبايل والتابلت (الضغط المطول)
        el.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            pressTimer = setTimeout(() => handleShow(touch, el), 500);
        }, { passive: true });

        // دعم اللابتوب (الضغط المطول بالماوس)
        el.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            pressTimer = setTimeout(() => handleShow(e, el), 500);
        });

        // إلغاء التفعيل عند رفع اليد قبل الوقت المحدد
        const cancel = () => clearTimeout(pressTimer);
        el.addEventListener('mouseup', cancel);
        el.addEventListener('touchend', cancel);
        el.addEventListener('touchmove', cancel);
    });

    // إغلاق الفقاعة عند السكرول أو النقر في الخارج
    window.addEventListener('scroll', handleHide);
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('translatable')) handleHide();
    });
});