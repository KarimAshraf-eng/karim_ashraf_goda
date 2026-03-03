document.addEventListener('DOMContentLoaded', () => {
    // تحديد جميع الأقسام في الصفحة
    const sections = document.querySelectorAll('.content-section');

    // إعداد الـ Observer لظهور العناصر عند التمرير
    const observerOptions = {
        threshold: 0.1, // يبدأ التأثير لما يظهر 10% من القسم
        rootMargin: "0px 0px -50px 0px" // تشغيل التأثير قبل ما العنصر يوصل لآخر الشاشة بـ 50 بكسل
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // إضافة كلاس العرض مع تأخير بسيط لو في كذا قسم ظاهرين مع بعض
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 150);

                // التوقف عن مراقبة العنصر بعد ظهوره
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // تطبيق المراقبة على كل قسم
    sections.forEach(section => {
        observer.observe(section);
    });
});