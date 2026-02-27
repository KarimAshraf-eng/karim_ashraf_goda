document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('subjects-container');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fetch('home_data.json?v=1')
        .then(response => {
            if (!response.ok) throw new Error('خطأ في التحميل');
            return response.json();
        })
        .then(data => {
            data.forEach(subject => {
                // إذا كانت المادة مفعلة، نجعلها رابط <a>، وإذا لم تكن نجعلها <div> عادي
                const card = document.createElement(subject.is_active ? 'a' : 'div');

                if (subject.is_active) {
                    card.href = subject.folder_path;
                }

                // إضافة كلاس disabled إذا كانت المادة غير مفعلة
                card.className = `subject-card ${subject.is_active ? '' : 'disabled'}`;

                card.innerHTML = `
                    ${!subject.is_active ? '<div class="coming-soon-badge">قريباً</div>' : ''}
                    <div class="image-wrapper">
                        <img src="${subject.image}" alt="${subject.name}" class="card-image" loading="lazy">
                    </div>
                    <div class="card-content">
                        <div class="icon-container">
                            <i class="${subject.icon} card-icon"></i>
                        </div>
                        <h2 class="card-title">${subject.name}</h2>
                    </div>
                `;

                container.appendChild(card);
                observer.observe(card);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = '<p style="text-align:center; color:#ff4757; grid-column: 1 / -1;">عذراً، لم نتمكن من تحميل المواد حالياً.</p>';
        });
});