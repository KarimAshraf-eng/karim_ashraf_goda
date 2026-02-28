document.addEventListener('DOMContentLoaded', () => {
    // 1. نظام ظهور الشرائح عند التمرير (Scroll Reveal)
    const slides = document.querySelectorAll('.slide-card');
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => { entry.target.classList.add('show'); }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    slides.forEach(slide => observer.observe(slide));

    // 2. نظام فقاعة الترجمة الذكية (Long Press)
    const bubble = document.getElementById('translation-bubble');
    const translatables = document.querySelectorAll('.translatable');
    let pressTimer;

    // دالة إظهار الفقاعة
    const showBubble = (e, element) => {
        const arabicText = element.getAttribute('data-ar');
        if (!arabicText) return;

        bubble.innerText = arabicText;
        bubble.classList.add('active');

        // حساب مكان الحدث (سواء كان لمس من الموبايل أو ماوس من اللابتوب)
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // تحديد موقع الفقاعة فوق مكان الضغطة بـ 20 بكسل
        bubble.style.left = `${clientX}px`;
        bubble.style.top = `${clientY - 20}px`;
    };

    // دالة إخفاء الفقاعة وإلغاء المؤقت
    const hideBubble = () => {
        clearTimeout(pressTimer);
        bubble.classList.remove('active');
    };

    translatables.forEach(el => {
        // أحداث اللمس (للموبايل والتابلت)
        el.addEventListener('touchstart', (e) => {
            pressTimer = window.setTimeout(() => showBubble(e, el), 400); // 400 ملي ثانية تعتبر ضغطة طويلة
        }, { passive: true });

        el.addEventListener('touchend', hideBubble);
        el.addEventListener('touchmove', hideBubble); // لو سحب إصبعه يلغي الترجمة

        // أحداث الماوس (للابتوب)
        el.addEventListener('mousedown', (e) => {
            pressTimer = window.setTimeout(() => showBubble(e, el), 400);
        });

        el.addEventListener('mouseup', hideBubble);
        el.addEventListener('mouseleave', hideBubble);

        // منع ظهور قائمة الـ Copy/Paste الافتراضية للمتصفح عند الضغط المطول لتسهيل رؤية الترجمة
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });
});