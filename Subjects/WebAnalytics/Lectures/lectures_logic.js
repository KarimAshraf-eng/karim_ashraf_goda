document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('content-container');

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => { entry.target.classList.add('show'); }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // تحديث الرقم لـ v=2 عشان يقرأ المسارات والـ Classes الجديدة
    fetch('lectures_data.json?v=4')
        .then(response => {
            if (!response.ok) throw new Error('خطأ في تحميل بيانات المحاضرات');
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                const card = document.createElement(item.is_active ? 'a' : 'div');
                if (item.is_active) card.href = item.folder_path;

                // هنا بنسحب الـ custom_class من الـ JSON ونحطها في الكلاسات
                card.className = `subject-card ${item.custom_class || ''} ${item.is_active ? '' : 'disabled'}`;

                // لو الكارت بتاع الأسئلة مش هنطبع كود الصورة جواه عشان يفضل شكله بانر نيون
                const imageHtml = item.image ? `<div class="image-wrapper"><img src="${item.image}" alt="${item.name}" class="card-image" loading="lazy"></div>` : '';

                card.innerHTML = `
                    ${!item.is_active ? '<div class="coming-soon-badge">قريباً</div>' : ''}
                    ${imageHtml}
                    <div class="card-content">
                        <div class="icon-container">
                            <i class="${item.icon} card-icon"></i>
                        </div>
                        <h2 class="card-title">${item.name}</h2>
                    </div>
                `;

                container.appendChild(card);
                observer.observe(card);
            });
        })
        .catch(error => console.error('Error:', error));
});