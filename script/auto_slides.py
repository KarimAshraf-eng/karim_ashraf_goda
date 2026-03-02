import os
import pyperclip
import keyboard
import re

# مسار مجلد المحاضرة الأساسي
LECTURE_FOLDER = r"D:\My Work\FCI-Platform\Subjects\WebAnalytics\Lectures\Lecture_1\Lecture"

def get_next_slide_number(lecture_dir):
    """دالة لمعرفة رقم الشريحة الجديد اللي عليه الدور"""
    max_num = 0
    if not os.path.exists(lecture_dir):
        os.makedirs(lecture_dir)
        return 1
        
    for folder_name in os.listdir(lecture_dir):
        if folder_name.startswith("Slide_"):
            try:
                num = int(folder_name.split("_")[1])
                if num > max_num:
                    max_num = num
            except ValueError:
                pass
    return max_num + 1

# تحديد رقم الشريحة الحالية عند تشغيل السكربت
current_slide = get_next_slide_number(LECTURE_FOLDER)

def clean_code(text, lang):
    """تنظيف الكود من علامات النسخ الخاصة بـ Gemini"""
    text = re.sub(rf"```{lang}\n?", "", text, flags=re.IGNORECASE)
    text = re.sub(r"```", "", text)
    return text.strip()

def ensure_folder_exists(slide_num):
    folder = os.path.join(LECTURE_FOLDER, f"Slide_{slide_num}")
    os.makedirs(folder, exist_ok=True)
    return folder

def get_file_paths(slide_num):
    folder = ensure_folder_exists(slide_num)
    html_path = os.path.join(folder, f"slide_{slide_num}_page.html")
    css_path = os.path.join(folder, f"slide_{slide_num}_design.css")
    return html_path, css_path

def save_html():
    html_path, _ = get_file_paths(current_slide)
    content = pyperclip.paste()
    cleaned = clean_code(content, "html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(cleaned)
    print(f"✅ [Alt+H] تم حفظ الكود المنسوخ حالياً في ملف HTML (الشريحة {current_slide})")

def save_css():
    _, css_path = get_file_paths(current_slide)
    content = pyperclip.paste()
    cleaned = clean_code(content, "css")
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(cleaned)
    print(f"✅ [Alt+C] تم حفظ الكود المنسوخ حالياً في ملف CSS (الشريحة {current_slide})")

def clear_files():
    html_path, css_path = get_file_paths(current_slide)
    # فتح الملفات ومسح محتواها بالكامل (جعلها فارغة)
    with open(html_path, "w", encoding="utf-8") as f:
        f.write("")
    with open(css_path, "w", encoding="utf-8") as f:
        f.write("")
    print(f"🗑️ [Alt+D] تم تفريغ محتويات ملفات الـ HTML والـ CSS للشريحة {current_slide} بنجاح!")

def next_slide():
    global current_slide
    current_slide += 1
    ensure_folder_exists(current_slide)
    print("-" * 50)
    print(f"➡️ [Alt+N] تم الانتقال وإنشاء مجلد الشريحة الجديدة: Slide_{current_slide}")
    print("-" * 50)

# ربط الاختصارات بالدوال
keyboard.add_hotkey('alt+h', save_html)
keyboard.add_hotkey('alt+c', save_css)
keyboard.add_hotkey('alt+d', clear_files)
keyboard.add_hotkey('alt+n', next_slide) # اختصار مهم للانتقال للشريحة اللي بعدها

print("🚀 نظام التحكم بالاختصارات جاهز ويعمل في الخلفية!")
print(f"📁 الشريحة المستهدفة الآن: Slide_{current_slide}")
print("-" * 50)
print("⌨️  انسخ الكود ثم اضغط Alt + H لحفظه في ملف HTML")
print("⌨️  انسخ الكود ثم اضغط Alt + C لحفظه في ملف CSS")
print("⌨️  اضغط Alt + D لتفريغ محتويات ملفات الشريحة الحالية")
print("⌨️  اضغط Alt + N للانتقال لشريحة جديدة (بمجرد الانتهاء من الشريحة الحالية)")
print("⌨️  اضغط Ctrl + C في هذه الشاشة لإيقاف السكربت تماماً")
print("-" * 50)

# إبقاء السكربت قيد التشغيل
keyboard.wait()