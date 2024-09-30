document.addEventListener('DOMContentLoaded', function () {
    // PAGE IN DASHBOARD MOVE
    let currentPage = 1; // Thay thế bằng giá trị thực tế từ server
    const totalPages = 10; // Thay thế bằng giá trị thực tế từ server
    const visiblePages = 5;

    function showPages(start, end) {
        const pages = document.getElementsByClassName("page");
        for (let i = 0; i < pages.length; i++) {
            if (i >= start && i < end) {
                pages[i].classList.remove("hidden");
            } else {
                pages[i].classList.add("hidden");
            }
        }
    }

    function updatePagination() {
        const start = (currentPage - 1) * visiblePages;
        const end = Math.min(currentPage * visiblePages, totalPages);
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

    // Xử lý sự kiện cho nút prev và next
    document.getElementById("prev").addEventListener("click", goToPrevPage);
    document.getElementById("next").addEventListener("click", goToNextPage);

    // Sự kiện cho các liên kết trang
    const pageLinks = document.querySelectorAll(".page a");
    pageLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const page = parseInt(this.innerText);
            currentPage = page;
            updatePagination();
            console.log("Page link clicked. Current page: " + currentPage);
        });
    });

    updatePagination();

    //--- Truyền giá trị cho select (MaNCC và MaLoai) ---
    function setSelectedValue(selectId, inputId) {
        const selectElement = document.getElementById(selectId);
        const inputValueElement = document.getElementById(inputId);

        const inputValue = inputValueElement ? inputValueElement.value : null;

        if (inputValue) {
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].value === inputValue) {
                    selectElement.selectedIndex = i;
                    break;
                }
            }
        }
    }

    setSelectedValue('selectNCC', 'inputValueNCC');
    setSelectedValue('selectLoaiSp', 'inputValueLoaiSp');

    // Truyền giá trị từ select vào input
    document.getElementById('selectLoaiSp').addEventListener('change', function () {
        const inputValue = document.getElementById('inputValueLoaiSp');
        inputValue.value = this.value || '';
    });

    document.getElementById('selectNCC').addEventListener('change', function () {
        const inputValue = document.getElementById('inputValueNCC');
        inputValue.value = this.value || '';
    });

    //--- Xử lý hình ảnh trong EDIT HANG HOA ---
    function previewImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const previewItem = input.closest('.image-input-group').querySelector('.image-preview-item');
                previewItem.innerHTML = '';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-image';
                img.alt = 'Preview';

                const p = document.createElement('p');
                p.className = 'image-name';
                p.textContent = input.files[0].name;

                previewItem.appendChild(img);
                previewItem.appendChild(p);

                updateExistingImageNames();
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    function addNewImageInput() {
        const container = document.getElementById('imageInputsContainer');
        const newIndex = container.children.length;

        const newGroup = document.createElement('div');
        newGroup.className = 'image-input-group mb-3';
        newGroup.innerHTML = `
            <div class="image-preview-item"></div>
            <div class="input-group input-group-img">
                <input type="file" class="form-control bg-dark image-input" name="ImageFiles" onchange="previewImage(this)" data-index="${newIndex}">
                <button type="button" class="btn btn-danger remove-image" onclick="removeImageInput(this)">Xóa</button>
            </div>`;

        container.appendChild(newGroup);
    }

    function removeImageInput(button) {
        const group = button.closest('.image-input-group');
        group.remove();
        updateExistingImageNames();
    }

    function updateExistingImageNames() {
        const imageNames = Array.from(document.querySelectorAll('.image-name')).map(el => el.textContent);
        document.getElementById('existingImageNames').value = imageNames.join(',');
    }

    if (document.getElementById('imageInputsContainer').children.length === 0) {
        addNewImageInput();
    }
    updateExistingImageNames();

    //--- Xử lý ngày tháng trong CREATE HANG HOA ---
    $(function () {
        $('.datepicker').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true,
            todayHighlight: true
        });

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
        }).find('input:first').on("blur", function () {
            const date = parseDate($(this).val());
            $(this).val(isValidDate(date) ? date : moment().format('YYYY-MM-DD'));
        });

        function isValidDate(value) {
            return !isNaN(Date.parse(value));
        }

        function parseDate(value) {
            const m = value.match(/^(\d{1,2})(\/|-)?(\d{1,2})(\/|-)?(\d{4})$/);
            return m ? `${m[5]}-${("00" + m[3]).slice(-2)}-${("00" + m[1]).slice(-2)}` : value;
        }
    });

    // Confirm delete
    document.getElementById('delete-form').addEventListener('submit', function (event) {
        if (!confirm('Bạn có chắc muốn xóa?')) {
            event.preventDefault();
        }
    });

    // Pagination link behavior
    $(".page-link").click(function (e) {
        e.preventDefault();
        const page = $(this).text();
        console.log("Chuyển đến trang: " + page);
        // window.location.href = `/products?page=${page}`; // Uncomment for real pagination
    });

    // Active link highlight
    const currentUrl = window.location.href;
    document.querySelectorAll('a[href]').forEach(function (link) {
        if (currentUrl.endsWith(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
    function collectImageNames() {
        var imageInputs = document.querySelectorAll('.image-input');
        var imageNames = [];

        imageInputs.forEach(function (input) {
            if (input.files.length > 0) {
                var fileName = input.files[0].name;
                imageNames.push(fileName);
            }
        });

        // Gộp tên các file hình ảnh thành chuỗi và gán vào hidden input
        document.getElementById('hinhInput').value = imageNames.join(',');
    }

    // Tự động gọi collectImageNames() khi người dùng submit form
    document.querySelector('form').addEventListener('submit', function (event) {
        collectImageNames();
    });
});
