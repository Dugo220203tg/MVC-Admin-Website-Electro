document.addEventListener('DOMContentLoaded', function () {
    const paginationContainer = $('#pagination');
    const totalPages = 10; // Cần đồng bộ với ViewBag.TotalPages từ server
    const visiblePages = 5;
    let currentPage = 1;

    if (!paginationContainer) return;

    const prevButton = $('#prev');
    const nextButton = $('#next');
    const pageButtons = $$(".page");

    function showPages(start, end) {
        pageButtons.forEach(page => {
            const pageNum = parseInt(page.getAttribute("data-page"));
            page.classList.toggle("hidden", pageNum < start || pageNum > end);
        });
    }

    function updatePagination() {
        const start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
        const end = Math.min(start + visiblePages - 1, totalPages);
        showPages(start, end);
    }

    window.goToPage = function (page) { // Gán hàm cho window
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            updatePagination();
            console.log(`Current page: ${currentPage}`); // sử dụng backticks cho template literal
        }
    }

    prevButton?.addEventListener("click", () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });

    nextButton?.addEventListener("click", () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    });

    // Xử lý sự kiện click cho các trang
    pageButtons.forEach(page => {
        page.addEventListener('click', function () {
            const pageNum = parseInt(this.getAttribute('data-page'));
            goToPage(pageNum);
        });
    });

    // Khởi tạo phân trang lần đầu
    updatePagination();
});


// Utility functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// Active link highlighting
const currentUrl = window.location.href;
$$('a[href]').forEach(link => {
    if (currentUrl.endsWith(link.getAttribute('href'))) {
        link.classList.add('active');
    }
});
// Date handling functions
function bindDatePicker() {
    $(".date").datetimepicker({
        format: 'YYYY-MM-DD',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        },
        showTodayButton: true,
        useCurrent: false
    }).on("blur", function () {
        let date = parseDate(this.value);
        if (!isValidDate(date)) {
            date = moment().format('YYYY-MM-DD');
        }
        this.value = date;
    });
}

function isValidDate(value) {
    return !isNaN(Date.parse(value));
}

function parseDate(value) {
    const m = value.match(/^(\d{1,2})(\/|-)?(\d{1,2})(\/|-)?(\d{4})$/);
    return m ? ${ m[5] } -${ ("0" + m[3]).slice(-2) } -${ ("0" + m[1]).slice(-2) } : value;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Image handling
    const imageContainer = $('#imageInputsContainer');
    if (imageContainer && imageContainer.children.length === 0) {
        addNewImageInput();
    }
    // updateExistingImageNames();

    // Date picker
    $('.datepicker')?.datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        todayHighlight: true
    });

    bindDatePicker();

    // Delete confirmation
    $('#delete-form')?.addEventListener('submit', function (event) {
        if (!confirm('Bạn có chắc muốn xóa?')) {
            event.preventDefault();
        }
    });


});
// Select element handling
['NCC', 'LoaiSp'].forEach(type => {
    const select = $(#select${ type });
    const input = $(#inputValue${ type });
    if (select && input) {
        const value = input.value;
        Array.from(select.options).find(option => option.value === value)?.setAttribute('selected', true);
        select.addEventListener('change', function () {
            input.value = this.value || "";
        });
    }
});
// For HANG_SP image preview
function previewHangSPImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgElement = $('#imagePreview');
            imgElement.src = e.target.result;
            imgElement.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

console.log('Script started loading');

// Function to attach event listeners to select elements
function attachEventListeners() {
    console.log('Attempting to attach event listeners');

    // Select all dropdowns that start with 'selectTrangThai-'
    var statusSelects = document.querySelectorAll('select[id^="selectTrangThai-"]');
    console.log('Found ' + statusSelects.length + ' select elements');

    // Loop through each select element and attach the 'change' event listener
    statusSelects.forEach(function (select) {
        console.log('Attaching listener to', select.id);

        select.addEventListener('change', function () {
            console.log('Change event triggered for', this.id);

            // Extract the order ID (maHD) from the select element's ID
            var maHD = this.id.split('-')[1];
            confirmChangeTrangThai(maHD, this);
        });
    });
}

// Function to handle the confirmation and AJAX request for changing status
function confirmChangeTrangThai(maHD, selectElement) {
    console.log('confirmChangeTrangThai called for order:', maHD);

    // Get the newly selected status value
    var newMaTrangThai = selectElement.value;

    // Get the original status value (in case we need to revert)
    var originalValue = selectElement.getAttribute('data-original-value');

    // Confirm with the user before proceeding
    if (confirm("Bạn có chắc chắn muốn thay đổi trạng thái của đơn hàng này không?")) {
        console.log('User confirmed status change. Sending AJAX request...');

        // Make the AJAX POST request
        $.ajax({
            url: 'https://localhost:7109/api/HoaDon/UpdateTrangThai',  // Correct API endpoint
            type: 'POST',
            data: JSON.stringify({
                maHD: maHD,                // Pass the order ID (maHD)
                maTrangThai: newMaTrangThai // Pass the new status value (maTrangThai)
            }),
            contentType: 'application/json',
            success: function (response) {
                console.log('AJAX request successful. Status updated.');
                alert('Cập nhật trạng thái thành công!');

                // Update the original value to the new value
                selectElement.setAttribute('data-original-value', newMaTrangThai);
            },
            error: function (xhr) {
                console.error('AJAX request failed:', xhr.statusText);

                // Show error and revert the select element to the original value
                alert('Cập nhật trạng thái thất bại: ' + xhr.responseText);
                selectElement.value = originalValue;
            }
        });
    } else {
        console.log('User cancelled status change. Reverting select value.');

        // If the user cancels, revert to the original status value
        selectElement.value = originalValue;
    }
}

// Call the function to attach event listeners when the page loads
document.addEventListener('DOMContentLoaded', attachEventListeners);