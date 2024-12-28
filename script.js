let bookings = [];
let companies = [];
let hotels = [];
let editingIndex = null; // مؤشر الحجز الذي يتم تعديله

// تسجيل الدخول
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = [
        { username: 'admin', password: 'password123' },
        { username: 'user1', password: 'mypassword' }
    ];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        alert('تم تسجيل الدخول بنجاح!');
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('welcome-container').classList.remove('hidden');
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
});

// إضافة شركة جديدة
document.getElementById('add-company-btn').addEventListener('click', function () {
    toggleVisibility('welcome-container', 'add-company-container');
});

document.getElementById('company-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const companyName = document.getElementById('company-name-input').value;

    if (companyName && !companies.includes(companyName)) {
        companies.push(companyName);
        updateCompanySelect();
        alert('تم إضافة الشركة بنجاح!');
    } else {
        alert('الشركة موجودة بالفعل أو الحقل فارغ.');
    }

    document.getElementById('company-name-input').value = '';
    toggleVisibility('add-company-container', 'welcome-container');
});

// إضافة فندق جديد
document.getElementById('add-hotel-btn').addEventListener('click', function () {
    toggleVisibility('welcome-container', 'add-hotel-container');
});

document.getElementById('hotel-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const hotelName = document.getElementById('hotel-name-input').value;

    if (hotelName && !hotels.includes(hotelName)) {
        hotels.push(hotelName);
        updateHotelSelect();
        alert('تم إضافة الفندق بنجاح!');
    } else {
        alert('الفندق موجود بالفعل أو الحقل فارغ.');
    }

    document.getElementById('hotel-name-input').value = '';
    toggleVisibility('add-hotel-container', 'welcome-container');
});

// العودة إلى الصفحة الرئيسية من إضافة شركة أو فندق
document.getElementById('back-to-welcome-from-company').addEventListener('click', () => toggleVisibility('add-company-container', 'welcome-container'));
document.getElementById('back-to-welcome-from-hotel').addEventListener('click', () => toggleVisibility('add-hotel-container', 'welcome-container'));

// إضافة حجز جديد
document.getElementById('add-booking-btn').addEventListener('click', function () {
    toggleVisibility('welcome-container', 'booking-container');
    resetBookingForm();
});

// عند حفظ الحجز
document.getElementById('booking-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const booking = {
        travelDate: document.getElementById('travel-date').value,
        tripType: document.getElementById('trip-type').value,
        tripTime: document.getElementById('trip-time').value,
        companyName: document.getElementById('company-name').value,
        hotelName: document.getElementById('hotel-name').value,
        roomNumber: document.getElementById('room-number').value,
        adults: document.getElementById('adults').value,
        children: document.getElementById('children').value,
        infants: document.getElementById('infants').value,
        notes: document.getElementById('notes').value,
    };

    if (editingIndex !== null) {
        bookings[editingIndex] = booking;
        alert('تم تعديل الحجز بنجاح!');
        editingIndex = null;
    } else {
        bookings.push(booking);
        alert('تم إضافة الحجز بنجاح!');
    }

    document.getElementById('booking-form').reset();
    toggleVisibility('booking-container', 'welcome-container');
    renderReport();
});

// عرض التقرير
document.getElementById('view-report-btn').addEventListener('click', function () {
    toggleVisibility('welcome-container', 'report-container');
    renderReport();
});

// تحميل التقرير كملف CSV
document.getElementById('download-report-btn').addEventListener('click', function () {
    downloadReport();
});

// طباعة التقرير
document.getElementById('print-report-btn').addEventListener('click', function () {
    printReport();
});

// عرض التقرير في جدول
function renderReport() {
    const reportBody = document.getElementById('report-body');
    reportBody.innerHTML = '';

    bookings.forEach((booking, index) => {
        const row = document.createElement('tr');
        row.innerHTML =
            `<td>${booking.travelDate}</td>
            <td>${booking.tripType}</td>
            <td>${booking.tripTime}</td>
            <td>${booking.companyName}</td>
            <td>${booking.hotelName}</td>
            <td>${booking.roomNumber}</td>
            <td>${booking.adults}</td>
            <td>${booking.children}</td>
            <td>${booking.infants}</td>
            <td>${booking.notes}</td>
            <td>
                <button onclick="editBooking(${index})">تعديل</button>
                <button onclick="deleteBooking(${index})">حذف</button>
            </td>`;
        reportBody.appendChild(row);
    });
}

// تعديل الحجز
function editBooking(index) {
    const booking = bookings[index];
    editingIndex = index;

    document.getElementById('travel-date').value = booking.travelDate;
    document.getElementById('trip-type').value = booking.tripType;
    document.getElementById('trip-time').value = booking.tripTime;
    document.getElementById('company-name').value = booking.companyName;
    document.getElementById('hotel-name').value = booking.hotelName;
    document.getElementById('room-number').value = booking.roomNumber;
    document.getElementById('adults').value = booking.adults;
    document.getElementById('children').value = booking.children;
    document.getElementById('infants').value = booking.infants;
    document.getElementById('notes').value = booking.notes;

    toggleVisibility('report-container', 'booking-container');
}

// حذف الحجز
function deleteBooking(index) {
    bookings.splice(index, 1);
    alert('تم حذف الحجز بنجاح!');
    renderReport();
}

// إعادة تعيين النموذج
function resetBookingForm() {
    document.getElementById('booking-form').reset();
    editingIndex = null;
}

// العودة إلى الصفحة الرئيسية من التقرير أو إضافة حجز
document.getElementById('back-to-welcome-report-btn').addEventListener('click', () => toggleVisibility('report-container', 'welcome-container'));
document.getElementById('back-to-welcome-btn').addEventListener('click', () => toggleVisibility('booking-container', 'welcome-container'));

// تحديث قائمة الشركات والفنادق
function updateCompanySelect() {
    const companySelect = document.getElementById('company-name');
    companySelect.innerHTML = '<option value="">اختر الشركة</option>';
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companySelect.appendChild(option);
    });
}

function updateHotelSelect() {
    const hotelSelect = document.getElementById('hotel-name');
    hotelSelect.innerHTML = '<option value="">اختر الفندق</option>';
    hotels.forEach(hotel => {
        const option = document.createElement('option');
        option.value = hotel;
        option.textContent = hotel;
        hotelSelect.appendChild(option);
    });
}

// تسجيل الخروج
document.getElementById('logout-btn').addEventListener('click', function () {
    toggleVisibility('welcome-container', 'login-container');
    alert('تم تسجيل الخروج بنجاح!');
});

// مساعدة لتبديل الرؤية بين العناصر
function toggleVisibility(hideId, showId) {
    document.getElementById(hideId).classList.add('hidden');
    document.getElementById(showId).classList.remove('hidden');
}

// تحميل التقرير كملف CSV
function downloadReport() {
    let csvContent = 'travelDate,tripType,tripTime,companyName,hotelName,roomNumber,adults,children,infants,notes\n';

    bookings.forEach(booking => {
        const row = [
            booking.travelDate,
            booking.tripType,
            booking.tripTime,
            booking.companyName,
            booking.hotelName,
            booking.roomNumber,
            booking.adults,
            booking.children,
            booking.infants,
            booking.notes
        ].join(',');
        csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/xlsx' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'report.xlsx';
    link.click();
}

// طباعة التقرير
function printReport() {
    const reportContent = document.getElementById('report-container').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>تقرير</title></head><body>');
    printWindow.document.write(reportContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}