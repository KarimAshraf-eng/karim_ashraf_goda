// =========================================
// المنطق الخاص بصفحة الملخص (Overview Animation)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // تحديد جميع البطاقات
    const cards = document.querySelectorAll('.fade-in-card');

    // إعطاء تأخير زمني متتالي لكل بطاقة لتظهر واحدة تلو الأخرى
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 150); // 150 ملي ثانية تأخير بين كل بطاقة والتي تليها
    });
});