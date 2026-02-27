document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('subjects-container');

    // إعداد الـ Observer لتشغيل الـ Animation عند ظهور العنصر في الشاشة
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // تأخير بسيط لكل كارت عشان يظهروا ورا بعض بشكل جمالي (Stagger effect)
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 100);
                observer.unobserve(entry.target); // إيقاف المراقبة بعد الظهور
            }
        });
    }, observerOptions);

    // جلب البيانات من ملف JSON
    fetch('home_data.json')
        .then(response => {
            if (!response.ok) throw new Error('خطأ في التحميل');
            return response.json();
        })
        .then(data => {
            data.forEach(subject => {
                const card = document.createElement('a');
                card.href = subject.folder_path;
                card.className = 'subject-card';

                card.innerHTML = `
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

                // مراقبة الكارت لتشغيل الأنيميشن
                observer.observe(card);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = '<p style="text-align:center; color:#ff4757; grid-column: 1 / -1;">عذراً، لم نتمكن من تحميل المواد حالياً. يرجى التأكد من تشغيل المشروع على سيرفر محلي.</p>';
        });
});