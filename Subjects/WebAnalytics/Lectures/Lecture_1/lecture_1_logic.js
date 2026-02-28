document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('modules-container');

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -20px 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => { entry.target.classList.add('show'); }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // سحب البيانات مع رقم الإصدار لمنع الكاش
    fetch('lecture_1_data.json?v=2')
        .then(response => {
            if (!response.ok) throw new Error('خطأ في تحميل بيانات أقسام المحاضرة');
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                const card = document.createElement(item.is_active ? 'a' : 'div');
                if (item.is_active) card.href = item.folder_path;

                card.className = `module-card ${item.is_active ? '' : 'disabled'}`;

                card.innerHTML = `
                    ${!item.is_active ? '<div class="coming-soon-badge">قريباً</div>' : ''}
                    <div class="module-header">
                        <div class="module-icon">
                            <i class="${item.icon}"></i>
                        </div>
                        <span class="module-en-name">${item.name_en}</span>
                    </div>
                    <h2 class="module-ar-name">${item.name_ar}</h2>
                    <p class="module-desc">${item.description}</p>
                `;

                container.appendChild(card);
                observer.observe(card);
            });
        })
        .catch(error => console.error('Error:', error));
});