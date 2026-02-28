document.addEventListener('DOMContentLoaded', () => {
    // 1. أنيميشن ظهور الشرائح عند السكرول
    const cards = document.querySelectorAll('.slide-card');
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => { entry.target.classList.add('show'); }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    cards.forEach(card => observer.observe(card));

    // ==========================================
    // 2. السحر البرمجي لفقاعة الترجمة التفاعلية
    // ==========================================
    const translatables = document.querySelectorAll('.translatable');
    const tooltip = document.getElementById('translation-tooltip');
    let pressTimer;
    let isPressing = false;

    // دالة إظهار الفقاعة
    const showTooltip = (el, clientX, clientY) => {
        isPressing = true;
        const arText = el.getAttribute('data-ar');
        tooltip.innerText = arText;
        el.classList.add('active'); // تغيير لون الكلمة لتمييزها

        // حساب مكان الفقاعة (فوق مكان الضغطة بـ 60 بكسل حتى لا يغطيها الإصبع)
        const tooltipX = clientX;
        const tooltipY = clientY - 60;

        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.top = `${tooltipY}px`;
        tooltip.classList.add('visible');

        // هزاز خفيف للموبايل لتأكيد نجاح الضغطة الطويلة (تعمل على الأجهزة الداعمة)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    // دالة إخفاء الفقاعة
    const hideTooltip = (el) => {
        isPressing = false;
        tooltip.classList.remove('visible');
        if (el) el.classList.remove('active');
    };

    translatables.forEach(el => {
        // --- أحداث الموبايل (Touch Events) ---
        el.addEventListener('touchstart', (e) => {
            // نمنع أي حدث افتراضي لو أمكن
            const touch = e.touches[0];
            // تعيين مؤقت (400 ملي ثانية) يعتبر كضغطة طويلة
            pressTimer = setTimeout(() => {
                showTooltip(el, touch.clientX, touch.clientY);
            }, 400);
        }, { passive: true });

        // إذا رفع إصبعه قبل اكتمال المؤقت، يتم الإلغاء. وإذا كانت الفقاعة ظاهرة، تختفي.
        el.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
            if (isPressing) {
                setTimeout(() => hideTooltip(el), 1000); // تظل ظاهرة لثانية بعد رفع الإصبع لتسهيل القراءة
            }
        });

        // إذا قام بالتمرير (Scroll) بإصبعه على الكلمة، يتم الإلغاء
        el.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
            hideTooltip(el);
        });

        // --- أحداث اللابتوب (Mouse Events) ---
        el.addEventListener('mousedown', (e) => {
            pressTimer = setTimeout(() => {
                showTooltip(el, e.clientX, e.clientY);
            }, 400);
        });

        el.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
            if (isPressing) {
                setTimeout(() => hideTooltip(el), 1000);
            }
        });

        el.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
            hideTooltip(el);
        });

        // تعطيل القائمة المزعجة الخاصة بكليك يمين أو الضغطة الطويلة
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });
});