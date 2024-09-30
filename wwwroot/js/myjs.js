document.addEventListener('DOMContentLoaded', function () {
    // PAGE IN DASHBOARD MOVE
    let currentPage = 1; // Replace with actual value from server
    const totalPages = 10; // Replace with actual value from server
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

    // Handle events for prev and next buttons
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    if (prevButton) prevButton.addEventListener("click", goToPrevPage);
    if (nextButton) nextButton.addEventListener("click", goToNextPage);

    // Events for page links
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

    // Set selected value for select (MaNCC and MaLoai)
    function setSelectedValue(selectId, inputId) {
        const selectElement = document.getElementById(selectId);
        const inputValueElement = document.getElementById(inputId);

        if (selectElement && inputValueElement) {
            const inputValue = inputValueElement.value;

            if (inputValue) {
                for (let i = 0; i < selectElement.options.length; i++) {
                    if (selectElement.options[i].value === inputValue) {
                        selectElement.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    }

    setSelectedValue('selectNCC', 'inputValueNCC');
    setSelectedValue('selectLoaiSp', 'inputValueLoaiSp');

    // Pass value from select to input
    const selectLoaiSp = document.getElementById('selectLoaiSp');
    const selectNCC = document.getElementById('selectNCC');

    if (selectLoaiSp) {
        selectLoaiSp.addEventListener('change', function () {
            const inputValue = document.getElementById('inputValueLoaiSp');
            if (inputValue) inputValue.value = this.value || '';
        });
    }

    if (selectNCC) {
        selectNCC.addEventListener('change', function () {
            const inputValue = document.getElementById('inputValueNCC');
            if (inputValue) inputValue.value = this.value || '';
        });
    }

    // IMAGE HANDLING IN EDIT HANG HOA
    window.previewImage = function (input) {
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

    window.addNewImageInput = function () {
        const container = document.getElementById('imageInputsContainer');
        if (container) {
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
    }

    window.removeImageInput = function (button) {
        const group = button.closest('.image-input-group');
        if (group) {
            group.remove();
            updateExistingImageNames();
        }
    }

    function updateExistingImageNames() {
        const imageNames = Array.from(document.querySelectorAll('.image-name')).map(el => el.textContent);
        const hinhInput = document.getElementById('hinhInput');
        if (hinhInput) {
            hinhInput.value = imageNames.join(',');
        }
    }

    // Initialize image inputs
    const imageInputsContainer = document.getElementById('imageInputsContainer');
    if (imageInputsContainer && imageInputsContainer.children.length === 0) {
        addNewImageInput();
    }
    updateExistingImageNames();

    // DATE HANDLING IN CREATE HANG HOA
    if (typeof $ !== 'undefined' && $.fn.datepicker) {
        $('.datepicker').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true,
            todayHighlight: true
        });
    }

    if (typeof $ !== 'undefined' && $.fn.datetimepicker) {
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
    }

    function isValidDate(value) {
        return !isNaN(Date.parse(value));
    }

    function parseDate(value) {
        const m = value.match(/^(\d{1,2})(\/|-)?(\d{1,2})(\/|-)?(\d{4})$/);
        return m ? `${m[5]}-${("00" + m[3]).slice(-2)}-${("00" + m[1]).slice(-2)}` : value;
    }

    // Confirm delete
    const deleteForm = document.getElementById('delete-form');
    if (deleteForm) {
        deleteForm.addEventListener('submit', function (event) {
            if (!confirm('Bạn có chắc muốn xóa?')) {
                event.preventDefault();
            }
        });
    }

    // Pagination link behavior
    if (typeof $ !== 'undefined') {
        $(".page-link").click(function (e) {
            e.preventDefault();
            const page = $(this).text();
            console.log("Chuyển đến trang: " + page);
            // Uncomment for real pagination:
            // window.location.href = `/products?page=${page}`;
        });
    }

    // Active link highlight
    const currentUrl = window.location.href;
    document.querySelectorAll('a[href]').forEach(function (link) {
        if (currentUrl.endsWith(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });

    // Add event listener to the form for image name collection
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (event) {
            updateExistingImageNames();
        });
    }
});
