document.addEventListener('DOMContentLoaded', () => {
    // 1. تفعيل حركة ظهور الشرائح الواحدة تلو الأخرى
    const slides = document.querySelectorAll('.slide-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 200); // تأخير متدرج لتأثير جمالي
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // تعمل عندما يظهر 10% من الشريحة

    slides.forEach(slide => observer.observe(slide));

    // ==========================================
    // 2. نظام فقاعة الترجمة الذكي
    // ==========================================
    const translatables = document.querySelectorAll('.translatable');
    const tooltip = document.getElementById('translation-tooltip');
    let pressTimer;
    let isPressing = false;

    const showTooltip = (el, clientX, clientY) => {
        isPressing = true;
        tooltip.innerText = el.getAttribute('data-ar');
        el.classList.add('active');
        // رفع الفقاعة 70 بكسل فوق الإصبع حتى لا تُحجب
        tooltip.style.left = `${clientX}px`;
        tooltip.style.top = `${clientY - 70}px`;
        tooltip.classList.add('visible');

        // اهتزاز الهاتف لتأكيد العملية
        if (navigator.vibrate) navigator.vibrate(40);
    };

    const hideTooltip = (el) => {
        isPressing = false;
        tooltip.classList.remove('visible');
        if (el) el.classList.remove('active');
    };

    translatables.forEach(el => {
        // منع القائمة المنسدلة الافتراضية (كليك يمين أو تحديد الموبايل)
        el.addEventListener('contextmenu', e => e.preventDefault());

        // --- للموبايل (Touch) ---
        el.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            pressTimer = setTimeout(() => showTooltip(el, touch.clientX, touch.clientY), 350);
        }, { passive: true });

        el.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
            if (isPressing) setTimeout(() => hideTooltip(el), 1500); // تبقى لثانية ونصف للقراءة
        });

        el.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
            hideTooltip(el);
        });

        // --- للكمبيوتر (Mouse) ---
        el.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            pressTimer = setTimeout(() => showTooltip(el, e.clientX, e.clientY), 350);
        });
        el.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
            if (isPressing) setTimeout(() => hideTooltip(el), 1500);
        });
        el.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
            hideTooltip(el);
        });
    });
});