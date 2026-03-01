document.addEventListener('DOMContentLoaded', () => {
    const bubble = document.getElementById('tooltip');
    let activeEl = null;

    function handleShow(e, el) {
        if (activeEl) activeEl.classList.remove('active-text');
        activeEl = el;
        activeEl.classList.add('active-text');

        const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const y = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        bubble.innerText = el.getAttribute('data-ar');
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        bubble.classList.add('visible');
    }

    function handleHide() {
        if (activeEl) activeEl.classList.remove('active-text');
        activeEl = null;
        bubble.classList.remove('visible');
    }

    document.querySelectorAll('.translatable').forEach(el => {
        // دعم الماوس (لابتوب)
        el.addEventListener('mouseenter', (e) => handleShow(e, el));
        el.addEventListener('mouseleave', handleHide);

        // دعم اللمس (تابلت وموبايل) - ضغطة واحدة تظهر، ورفع اليد يخفي
        el.addEventListener('touchstart', (e) => {
            // e.preventDefault(); // مفعل فقط لو احتجت منع السكرول أثناء الترجمة
            handleShow(e, el);
        }, { passive: true });

        el.addEventListener('touchend', handleHide);
    });
});