document.addEventListener('DOMContentLoaded', async () => {
    // منع كليك يمين في الموقع كله
    document.addEventListener('contextmenu', event => event.preventDefault());

    const container = document.getElementById('presentation-container');

    // قائمة مسارات الشرائح التي تريد عرضها بالترتيب
    const slidesToLoad = [
        'Slide_1/slide_1_page.html',
        'Slide_2/slide_2_page.html',
        'Slide_3/slide_3_page.html',
        'Slide_4/slide_4_page.html',
        'Slide_5/slide_5_page.html',
        'Slide_6/slide_6_page.html',
        'Slide_7/slide_7_page.html',
        'Slide_8/slide_8_page.html',
        'Slide_9/slide_9_page.html',
        'Slide_10/slide_10_page.html',
        'Slide_11/slide_11_page.html',
        'Slide_12/slide_12_page.html',
        'Slide_13/slide_13_page.html',
        'Slide_14/slide_14_page.html',
        'Slide_15/slide_15_page.html',
        'Slide_16/slide_16_page.html',
        'Slide_17/slide_17_page.html',
        'Slide_18/slide_18_page.html',
        'Slide_19/slide_19_page.html',
        'Slide_20/slide_20_page.html',
        'Slide_21/slide_21_page.html',
        'Slide_22/slide_22_page.html',
    ];

    // جلب الشرائح واحدة تلو الأخرى لضمان الترتيب
    for (const slidePath of slidesToLoad) {
        try {
            const response = await fetch(slidePath);
            if (response.ok) {
                const htmlContent = await response.text();
                // حقن كود الشريحة داخل الحاوية الرئيسية
                container.insertAdjacentHTML('beforeend', htmlContent);
            } else {
                console.error(`Failed to load: ${slidePath}`);
            }
        } catch (error) {
            console.error(`Error fetching: ${slidePath}`, error);
        }
    }

    // بعد أن تم رص كل الشرائح في الصفحة، نقوم بتفعيل الأزرار والترجمة
    initializeLectureLogic();
});

// دالة تحتوي على كل المنطق (تعمل بذكاء على الموجود فقط)
function initializeLectureLogic() {
    // 1. منطق الأزرار التفاعلية (لو الشريحة مفيهاش أزرار، الكود ده هيتم تجاهله بدون أخطاء)
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const targetId = this.getAttribute('data-target');
            const parentSlide = this.closest('.slide-box');

            parentSlide.querySelectorAll('.info-panel').forEach(panel => {
                if (panel.id !== targetId) panel.classList.remove('show-panel');
            });

            parentSlide.querySelectorAll('.action-btn').forEach(b => {
                if (b !== this) b.classList.remove('active-btn');
            });

            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.toggle('show-panel');
            this.classList.toggle('active-btn');
        });
    });

    // 2. منطق فقاعة الترجمة (يطبق على كل الشرائح المحملة)
    const bubble = document.getElementById('tooltip');
    let activeEl = null;
    let pressTimer;

    function handleShow(x, y, el) {
        if (activeEl) activeEl.classList.remove('active-text');
        activeEl = el;
        activeEl.classList.add('active-text');

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const topY = rect.top;

        bubble.innerText = el.getAttribute('data-ar');
        bubble.style.left = `${centerX}px`;
        bubble.style.top = `${topY}px`;
        bubble.classList.add('visible');

        if (navigator.vibrate) navigator.vibrate(40);
    }

    function handleHide() {
        if (activeEl) activeEl.classList.remove('active-text');
        activeEl = null;
        bubble.classList.remove('visible');
    }

    window.addEventListener('scroll', handleHide, true);
    document.addEventListener('touchmove', handleHide, { passive: true });

    document.querySelectorAll('.translatable').forEach(el => {
        el.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            pressTimer = setTimeout(() => handleShow(touch.clientX, touch.clientY, el), 600);
        }, { passive: true });

        el.addEventListener('mousedown', (e) => {
            if (e.button === 0) pressTimer = setTimeout(() => handleShow(e.clientX, e.clientY, el), 600);
        });

        const cancel = () => clearTimeout(pressTimer);
        el.addEventListener('touchend', cancel);
        el.addEventListener('mouseup', cancel);
        el.addEventListener('touchmove', cancel);
    });

    document.addEventListener('touchstart', (e) => {
        if (!e.target.classList.contains('translatable') && !e.target.closest('.action-btn')) handleHide();
    }, { passive: true });

    document.addEventListener('mousedown', (e) => {
        if (!e.target.classList.contains('translatable') && !e.target.closest('.action-btn')) handleHide();
    });
}