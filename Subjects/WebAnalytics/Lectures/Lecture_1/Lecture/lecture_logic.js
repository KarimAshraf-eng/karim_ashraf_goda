document.addEventListener('DOMContentLoaded', () => {
    const bubble = document.getElementById('tooltip');
    let activeEl = null;

    function handleShow(e, el) {
        if (activeEl) activeEl.classList.remove('active-text');
        activeEl = el;
        activeEl.classList.add('active-text');

        // تحديد إحداثيات اللمس أو الماوس
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
        // الكمبيوتر
        el.addEventListener('mouseenter', (e) => handleShow(e, el));
        el.addEventListener('mouseleave', handleHide);

        // الموبايل والتابلت
        el.addEventListener('touchstart', (e) => {
            handleShow(e, el);
        }, { passive: true });

        el.addEventListener('touchend', handleHide);
    });
});