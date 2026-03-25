// بيانات الشرائح
const packagesData = {
    platform: [
        { value: 500, fees: 125, net: 375 },
        { value: 1000, fees: 250, net: 750 },
        { value: 1500, fees: 325, net: 1175 },
        { value: 1880, fees: 410, net: 1470 },
        { value: 2000, fees: 450, net: 1550 },
        { value: 2500, fees: 575, net: 1925 }
    ],
    customer: [
        { value: 500, payment: 125, fees: 125, net: 250 },
        { value: 1000, payment: 250, fees: 250, net: 500 },
        { value: 1500, payment: 375, fees: 325, net: 800 },
        { value: 1880, payment: 470, fees: 410, net: 1000 },
        { value: 2000, payment: 500, fees: 450, net: 1050 },
        { value: 2500, payment: 625, fees: 575, net: 1300 }
    ]
};

let currentPaymentMethod = null;
let selectedPackage = null;
let isSending = false;

// عناصر DOM
const firstNameInput = document.getElementById('firstName');
const secondNameInput = document.getElementById('secondName');
const familyNameInput = document.getElementById('familyName');
const mobileInput = document.getElementById('mobile');
const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
const packagesContainer = document.getElementById('packagesContainer');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const loadingOverlay = document.getElementById('loadingOverlay');

// عرض الشرائح بناءً على طريقة الدفع
function renderPackages(method) {
    if (!method) {
        packagesContainer.style.display = 'none';
        packagesContainer.innerHTML = '';
        return;
    }
    const packages = packagesData[method];
    if (!packages) return;

    packagesContainer.innerHTML = '';
    packages.forEach((pkg, index) => {
        const card = document.createElement('div');
        card.className = 'package-card';
        card.dataset.index = index;
        card.dataset.value = pkg.value;
        // محتوى البطاقة حسب الطريقة
        let detailsHtml = `
            <div class="package-title">${pkg.value} ريال</div>
            <div class="package-detail"><span>القيمة:</span><span>${pkg.value} ريال</span></div>
            <div class="package-detail"><span>الرسوم:</span><span>${pkg.fees} ريال</span></div>
        `;
        if (method === 'customer') {
            detailsHtml += `<div class="package-detail"><span>الدفعة:</span><span>${pkg.payment} ريال</span></div>`;
        }
        detailsHtml += `<div class="package-detail"><span>الصافي:</span><span>${pkg.net} ريال</span></div>`;
        card.innerHTML = detailsHtml;

        card.addEventListener('click', () => {
            // إزالة التحديد من جميع البطاقات
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedPackage = { method, ...pkg };
        });
        packagesContainer.appendChild(card);
    });
    packagesContainer.style.display = 'grid';
}

// إعادة ضبط النموذج بالكامل
function resetForm() {
    firstNameInput.value = '';
    secondNameInput.value = '';
    familyNameInput.value = '';
    mobileInput.value = '';
    paymentRadios.forEach(radio => radio.checked = false);
    currentPaymentMethod = null;
    selectedPackage = null;
    packagesContainer.style.display = 'none';
    packagesContainer.innerHTML = '';
    document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('selected'));
    // إزالة أي تحذيرات ظاهرية
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

// التحقق من صحة البيانات
function validateForm() {
    let isValid = true;
    // إزالة رسائل الخطأ السابقة
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    const firstName = firstNameInput.value.trim();
    const secondName = secondNameInput.value.trim();
    const familyName = familyNameInput.value.trim();
    const mobile = mobileInput.value.trim();

    if (!firstName) {
        showError(firstNameInput, 'الاسم الأول مطلوب');
        isValid = false;
    }
    if (!secondName) {
        showError(secondNameInput, 'الاسم الثاني مطلوب');
        isValid = false;
    }
    if (!familyName) {
        showError(familyNameInput, 'اسم العائلة مطلوب');
        isValid = false;
    }
    if (!mobile) {
        showError(mobileInput, 'رقم الجوال مطلوب');
        isValid = false;
    } else if (!/^\d{9}$/.test(mobile)) {
        showError(mobileInput, 'يجب أن يتكون رقم الجوال من 9 أرقام فقط');
        isValid = false;
    }

    if (!currentPaymentMethod) {
        showError(document.querySelector('.payment-methods'), 'يرجى اختيار طريقة الشراء');
        isValid = false;
    }

    if (!selectedPackage) {
        showError(packagesContainer, 'يرجى اختيار شريحة');
        isValid = false;
    }

    return isValid;
}

function showError(element, message) {
    const errorSpan = document.createElement('div');
    errorSpan.className = 'error-message';
    errorSpan.style.color = '#e11d48';
    errorSpan.style.fontSize = '0.75rem';
    errorSpan.style.marginTop = '0.25rem';
    errorSpan.innerText = message;
    element.parentNode.insertBefore(errorSpan, element.nextSibling);
    element.style.borderColor = '#e11d48';
    element.addEventListener('input', () => {
        if (errorSpan) errorSpan.remove();
        element.style.borderColor = '#e2e8f0';
    }, { once: true });
}

// بناء رسالة واتساب
function buildWhatsAppMessage() {
    const fullName = `${firstNameInput.value.trim()} ${secondNameInput.value.trim()} ${familyNameInput.value.trim()}`;
    const mobile = mobileInput.value.trim();
    const methodName = currentPaymentMethod === 'platform' ? 'دفعة من المنصة' : 'دفعة من العميل';
    let message = `📋 *طلب شراء بطاقة سوا - منصة تيرا*%0A`;
    message += `👤 *الاسم الكامل:* ${fullName}%0A`;
    message += `📞 *رقم الجوال:* ${mobile}%0A`;
    message += `🛒 *نوع الطلب:* ${methodName}%0A`;
    message += `🎯 *الشريحة:* ${selectedPackage.value} ريال%0A`;
    message += `💰 *القيمة:* ${selectedPackage.value} ريال%0A`;
    message += `💸 *الرسوم:* ${selectedPackage.fees} ريال%0A`;
    if (currentPaymentMethod === 'customer') {
        message += `💵 *الدفعة:* ${selectedPackage.payment} ريال%0A`;
    }
    message += `✅ *الصافي:* ${selectedPackage.net} ريال%0A`;
    message += `------------------------%0A`;
    message += `📅 تم الإرسال عبر نظام تيرا`;
    return message;
}

// فتح واتساب
function sendWhatsApp() {
    const phoneNumber = '966500000000'; // يمكن تعديل الرقم حسب الطلب، نضع رقم افتراضي للتوضيح
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
}

// عرض مودال التأكيد
function showConfirmModal() {
    if (!validateForm()) return;
    confirmModal.style.display = 'flex';
}

// إرسال الطلب بعد التأكيد
function submitOrder() {
    if (isSending) return;
    isSending = true;
    confirmModal.style.display = 'none';
    loadingOverlay.style.display = 'flex';

    // محاكاة وقت قصير للإرسال
    setTimeout(() => {
        sendWhatsApp();
        loadingOverlay.style.display = 'none';
        resetForm();
        isSending = false;
    }, 800);
}

// أحداث التفاعل
paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.checked) {
            currentPaymentMethod = e.target.value;
            // تحديث التحديد البصري للبطاقات
            document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('selected'));
            e.target.closest('.radio-card').classList.add('selected');
            renderPackages(currentPaymentMethod);
            selectedPackage = null; // إعادة تعيين الشريحة المختارة
        }
    });
});

confirmBtn.addEventListener('click', showConfirmModal);
cancelBtn.addEventListener('click', resetForm);
confirmYes.addEventListener('click', submitOrder);
confirmNo.addEventListener('click', () => {
    confirmModal.style.display = 'none';
});

// منع إدخال غير رقمي في حقل الجوال
mobileInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0,9);
});

// إعادة تعيين أي تحديد عند تغيير طريقة الدفع عبر النقر المباشر على البطاقة (اختياري)
document.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
        const radio = card.querySelector('input');
        if (radio) radio.checked = true;
        radio.dispatchEvent(new Event('change'));
    });
});

// بداية خالية
resetForm();
