//PAGE IN DASHBROAD MOVE
var currentPage = @(ViewBag.Page);
var totalPages = @(ViewBag.TotalPages);
var visiblePages = 5;

function showPages(start, end) {
    var pages = document.getElementsByClassName("page");
    for (var i = 0; i < pages.length; i++) {
        if (i >= start && i < end) {
            pages[i].classList.remove("hidden");
        } else {
            pages[i].classList.add("hidden");
        }
    }
}

function updatePagination() {
    var start = (currentPage - 1) * visiblePages;
    var end = Math.min(currentPage * visiblePages, totalPages);
    showPages(start, end);
}

function goToNextPage() {
    if (currentPage < totalPages) {
        currentPage += 1;
        updatePagination();
        console.log("Next button clicked. Current page: " + currentPage);
    }
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage -= 1;
        updatePagination();
        console.log("Previous button clicked. Current page: " + currentPage);
    }
}

document.getElementById("prev").addEventListener("click", function () {
    goToPrevPage();
});

document.getElementById("next").addEventListener("click", function () {
    goToNextPage();
});

var pageLinks = document.querySelectorAll(".page a");
pageLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        var page = parseInt(this.innerText);
        currentPage = page;
        updatePagination();
        console.log("Page link clicked. Current page: " + currentPage);
    });
});
updatePagination(); // Call this initially to show the correct page range

// ---- Trang EDIT HangHoa ----
// --- Truyền giá trị cho select ---
document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('selectNCC');
    var inputValueElement = document.getElementById('inputValueNCC');

    // Lấy giá trị của thẻ input
    var maNCCValue = inputValueElement.value;

    // Lặp qua từng option trong select element
    for (var i = 0; i < selectElement.options.length; i++) {
        var option = selectElement.options[i];
        // Nếu giá trị của option trùng với giá trị của thẻ input
        if (option.value === maNCCValue) {
            // Đặt thuộc tính selected cho option
            option.selected = true;
            // Thoát khỏi vòng lặp sau khi tìm thấy giá trị
            break;
        }
    }
});

// --- Truyền giá trị cho select ---
document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('selectLoaiSp');
    var inputValueElement = document.getElementById('inputValueLoaiSp');

    // Lấy giá trị của thẻ input
    var maLoaiValue = inputValueElement.value;

    // Lặp qua từng option trong select element
    for (var i = 0; i < selectElement.options.length; i++) {
        var option = selectElement.options[i];
        // Nếu giá trị của option trùng với giá trị của thẻ input
        if (option.value === maLoaiValue) {
            // Đặt thuộc tính selected cho option
            option.selected = true;
            // Thoát khỏi vòng lặp sau khi tìm thấy giá trị
            break;
        }
    }
});

// --- Truyền giá trị từ select vào input
document.getElementById('selectLoaiSp').addEventListener('change', function () {
    var selectedValue = this.value;
    var inputValue = document.getElementById('inputValueLoaiSp');

    if (selectedValue !== "") {
        inputValue.value = selectedValue;
    } else {
        inputValue.value = "";
    }
});
document.getElementById('selectNCC').addEventListener('change', function () {
    var selectedValue = this.value;
    var inputValue = document.getElementById('inputValueNCC');

    if (selectedValue !== "") {
        inputValue.value = selectedValue;
    } else {
        inputValue.value = "";
    }
});
//---- Xử lý phần hình ảnh trang EDIT HANGHOA ---
function previewImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var previewItem = input.closest('.image-input-group').querySelector('.image-preview-item');
            var img = previewItem.querySelector('img') || document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            img.alt = 'Preview';

            var p = previewItem.querySelector('p') || document.createElement('p');
            p.className = 'image-name';
            p.textContent = input.files[0].name;

            if (!previewItem.contains(img)) previewItem.appendChild(img);
            if (!previewItem.contains(p)) previewItem.appendChild(p);

            updateExistingImageNames();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function addNewImageInput() {
    var container = document.getElementById('imageInputsContainer');
    var newIndex = container.children.length;

    var newGroup = document.createElement('div');
    newGroup.className = 'image-input-group mb-3';
    newGroup.innerHTML = `
                <div class="image-preview-item"></div>
                <div class="input-group input-group-img">
                    <input type="file" class="form-control bg-dark image-input" name="ImageFiles" onchange="previewImage(this)" data-index="${newIndex}">
                    <button type="button" class="btn btn-danger remove-image" onclick="removeImageInput(this)">Xóa</button>
                </div>
            `;

    container.appendChild(newGroup);
}

function removeImageInput(button) {
    var group = button.closest('.image-input-group');
    group.remove();
    updateExistingImageNames();
}

function updateExistingImageNames() {
    var allImageNames = [];
    var imageNames = document.querySelectorAll('.image-name');
    imageNames.forEach(function (element) {
        allImageNames.push(element.textContent);
    });
    document.getElementById('existingImageNames').value = allImageNames.join(',');
}

document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('imageInputsContainer');
    if (container.children.length === 0) {
        addNewImageInput();
    }
    updateExistingImageNames();
})
//--- Xử lý phần ngày tháng trong CREATE HANG HOA ---
$(document).ready(function () {
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
    });
});
$(function () {
    var bindDatePicker = function () {
        $(".date").datetimepicker({
            format: 'YYYY-MM-DD',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            }
        }).find('input:first').on("blur", function () {
            // check if the date is correct. We can accept dd-mm-yyyy and yyyy-mm-dd.
            // update the format if it's yyyy-mm-dd
            var date = parseDate($(this).val());

            if (!isValidDate(date)) {
                //create date based on momentjs (we have that)
                date = moment().format('YYYY-MM-DD');
            }

            $(this).val(date);
        });
    }

    var isValidDate = function (value, format) {
        format = format || false;
        // lets parse the date to the best of our knowledge
        if (format) {
            value = parseDate(value);
        }

        var timestamp = Date.parse(value);

        return isNaN(timestamp) == false;
    }

    var parseDate = function (value) {
        var m = value.match(/^(\d{1,2})(\/|-)?(\d{1,2})(\/|-)?(\d{4})$/);
        if (m)
            value = m[5] + '-' + ("00" + m[3]).slice(-2) + '-' + ("00" + m[1]).slice(-2);

        return value;
    }

    bindDatePicker();
});