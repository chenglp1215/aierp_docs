var isAdminView = false;

function toggleAdminView() {
    isAdminView = !isAdminView;
    var adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(function(el) {
        if (isAdminView) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
}

function toggleExpand(orderId) {
    var content = document.getElementById('expand-' + orderId);
    if (content) {
        content.classList.toggle('hidden');
        var icon = event.target;
        if (icon.textContent === '▶') {
            icon.textContent = '▼';
        } else {
            icon.textContent = '▶';
        }
    }
}

function openShipment(orderId) {
    currentOrderId = orderId;
    var modal = document.getElementById('shipmentModal');
    if (modal) {
        modal.style.display = 'flex';
        var checkboxes = modal.querySelectorAll('.product-check');
        checkboxes.forEach(function(cb) {
            cb.checked = false;
        });
    }
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function confirmShipment() {
    var modal = document.getElementById('shipmentModal');
    if (!modal) return;
    
    var checkboxes = modal.querySelectorAll('.product-check:checked');
    
    if (checkboxes.length === 0) {
        showAlert('请至少选择一个商品进行发货');
        return;
    }
    
    if (currentOrderId) {
        var statusCell = document.getElementById('status-' + currentOrderId);
        if (statusCell) {
            var totalCheckboxes = modal.querySelectorAll('.product-check');
            if (checkboxes.length === totalCheckboxes.length) {
                statusCell.innerHTML = '<span class="tag tag-approved">全部发货</span>';
            } else if (checkboxes.length > 0) {
                statusCell.innerHTML = '<span class="tag partial">部分发货</span>';
            }
        }
    }
    
    showAlert('发货成功！');
    closeModal('shipmentModal');
}

function deleteOrder(orderId) {
    showConfirm('确认', '确定要删除该订单吗？', function() {
        var row = document.getElementById('row-' + orderId);
        if (row) {
            row.remove();
        }
        showAlert('订单已删除！');
    });
}

function confirmDeleteOrder() {
    showConfirm('确认', '确定要删除该订单吗？', function() {
        showAlert('订单已删除！');
    });
}

function generateContract() {
    showAlert('正在生成合同...');
    setTimeout(function() {
        showAlert('合同生成成功！');
    }, 500);
}

function addReturn() {
    showAlert('正在跳转加单...');
}

function saveOrderDraft() {
    showAlert('订单已保存为草稿！\n订单状态：草稿');
    setTimeout(function() {
        showModule('sales-list');
    }, 500);
}

function saveReturnDraft() {
    showAlert('退货单已保存为草稿！');
    setTimeout(function() {
        showModule('return-list');
    }, 500);
}

function submitReturn() {
    showAlert('退货单已提交！\n审核状态：待审核');
    setTimeout(function() {
        showModule('return-list');
    }, 500);
}

function submitOrder() {
    var tables = document.querySelectorAll('.sub-table');
    var allDirect = true;
    var hasNonDirectWithoutWarehouse = false;
    
    tables.forEach(function(table) {
        var rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(row) {
            var deliverySelect = row.querySelector('.delivery-method');
            var warehouseSelect = row.querySelector('.warehouse');
            
            if (deliverySelect && warehouseSelect) {
                var delivery = deliverySelect.value;
                var warehouse = warehouseSelect.value;
                
                if (delivery !== '直运') {
                    allDirect = false;
                    if (!warehouse) {
                        hasNonDirectWithoutWarehouse = true;
                    }
                }
            }
        });
    });
    
    if (hasNonDirectWithoutWarehouse) {
        showAlert('请选择指定仓库');
        return false;
    }
    
    if (allDirect) {
        showConfirm('确认', '该订单全部为直运，确认提交吗？', function() {
            showAlert('订单已提交！\n订单状态：已审核');
            setTimeout(function() {
                showModule('sales-list');
            }, 500);
        });
        return false;
    }
    
    showAlert('订单已提交！\n订单状态：已审核');
    setTimeout(function() {
        showModule('sales-list');
    }, 500);
    return true;
}

function addProductRow() {
    var table = document.getElementById('productTable') || document.getElementById('productTableEdit');
    if (!table) return;
    
    var tbody = table.querySelector('tbody');
    var rows = tbody.querySelectorAll('tr');
    var rowNum = rows.length + 1;

    var newRow = document.createElement('tr');
    newRow.innerHTML = '<td>' + rowNum + '</td>' +
        '<td style="position:relative;">' +
        '<input type="text" class="brand-input" placeholder="品牌" autocomplete="off" oninput="onBrandInput(this)" onclick="showBrandDropdown(this)">' +
        '<div class="brand-dropdown hidden"></div></td>' +
        '<td style="position:relative;">' +
        '<input type="text" class="spec-input" placeholder="规格编号" autocomplete="off" oninput="onSpecInput(this)" onclick="showSpecDropdown(this)">' +
        '<div class="spec-dropdown hidden"></div></td>' +
        '<td><input type="text" class="product-input" placeholder="产品名称"></td>' +
        '<td><input type="text" placeholder="包装"></td>' +
        '<td><input type="text" placeholder="单位"></td>' +
        '<td><input type="text" placeholder="备注"></td>' +
        '<td><input type="number" value="0.00" onchange="calculateRow(this)"></td>' +
        '<td><input type="number" value="1.00" step="0.01" onchange="calculateRow(this)"></td>' +
        '<td><input type="number" value="1" onchange="calculateRow(this)"></td>' +
        '<td><input type="number" value="0.01" step="0.01" readonly></td>' +
        '<td class="amount">¥0.00</td>' +
        '<td class="amount">¥0.00</td>' +
        '<td><span class="tag tag-pending">0</span></td>' +
        '<td><select class="delivery-method" onchange="onDeliveryMethodChange(this)"><option value="直运">直运</option><option value="物流">物流</option><option value="自提">自提</option><option value="送货">送货</option></select></td>' +
        '<td><select class="warehouse" disabled><option value="">请选择</option><option value="北京仓库">北京仓库</option><option value="上海仓库">上海仓库</option><option value="深圳仓库">深圳仓库</option></select></td>' +
        '<td><a class="action-link danger" onclick="removeProductRow(this)">删除</a></td>';
    
    tbody.appendChild(newRow);
}

function removeProductRow(element) {
    var row = element.closest('tr');
    var tbody = row.parentElement;
    row.remove();

    var rows = tbody.querySelectorAll('tr');
    rows.forEach(function(r, index) {
        r.querySelector('td:first-child').textContent = index + 1;
    });
    
    calculateTotal();
    calculateTotalEdit();
}

function onProductSelect(input) {
    var row = input.closest('tr');
    if (input.value) {
        row.querySelector('td:nth-child(2) input').value = '测试品牌';
        row.querySelector('td:nth-child(3) input').value = 'SPEC001';
        row.querySelector('td:nth-child(5) input').value = '瓶';
        row.querySelector('td:nth-child(6) input').value = '个';
        row.querySelector('td:nth-child(8) input').value = '100.00';
        row.querySelector('td:nth-child(9) input').value = '0.9';
        row.querySelector('td:nth-child(10) input').value = '1';
        row.querySelector('td:nth-child(14) span').textContent = '100';
        calculateRow(input);
    }
}

function calculateRow(input) {
    var row = input.closest('tr');
    var originalPrice = parseFloat(row.querySelector('td:nth-child(8) input').value) || 0;
    var discount = parseFloat(row.querySelector('td:nth-child(9) input').value) || 1;
    var quantity = parseInt(row.querySelector('td:nth-child(10) input').value) || 0;
    
    var taxPrice = originalPrice * discount;
    var subtotal = taxPrice * quantity;
    
    row.querySelector('td:nth-child(12)').textContent = '¥' + taxPrice.toFixed(2);
    row.querySelector('td:nth-child(13)').textContent = '¥' + subtotal.toFixed(2);
    
    calculateTotal();
    calculateTotalEdit();
}

function calculateTotal() {
    var rows = document.querySelectorAll('#productTable tbody tr');
    var totalQty = 0;
    var subtotal = 0;
    
    rows.forEach(function(row) {
        var qty = parseInt(row.querySelector('td:nth-child(10) input').value) || 0;
        var rowTotal = parseFloat(row.querySelector('td:nth-child(13)').textContent.replace('¥', '')) || 0;
        totalQty += qty;
        subtotal += rowTotal;
    });
    
    var shipping = parseFloat(document.getElementById('shippingFee').value) || 0;
    var total = subtotal + shipping;
    
    if (document.getElementById('totalQuantity')) {
        document.getElementById('totalQuantity').textContent = totalQty;
    }
    if (document.getElementById('subtotalAmount')) {
        document.getElementById('subtotalAmount').textContent = '¥' + subtotal.toFixed(2);
    }
    if (document.getElementById('totalAmount')) {
        document.getElementById('totalAmount').textContent = '¥' + total.toFixed(2);
    }
}

function calculateTotalEdit() {
    var rows = document.querySelectorAll('#productTableEdit tbody tr');
    var totalQty = 0;
    var subtotal = 0;
    
    rows.forEach(function(row) {
        var qty = parseInt(row.querySelector('td:nth-child(9) input').value) || 0;
        var rowTotal = parseFloat(row.querySelector('td:nth-child(13)').textContent.replace('¥', '')) || 0;
        totalQty += qty;
        subtotal += rowTotal;
    });
    
    if (document.getElementById('totalQuantityEdit')) {
        document.getElementById('totalQuantityEdit').textContent = totalQty;
    }
    if (document.getElementById('subtotalAmountEdit')) {
        document.getElementById('subtotalAmountEdit').textContent = '¥' + subtotal.toFixed(2);
    }
    if (document.getElementById('totalAmountEdit')) {
        document.getElementById('totalAmountEdit').textContent = '¥' + subtotal.toFixed(2);
    }
}

function onDeliveryMethodChange(select) {
    var row = select.closest('tr');
    var warehouseSelect = row.querySelector('.warehouse');
    
    if (select.value === '直运') {
        warehouseSelect.disabled = true;
        warehouseSelect.value = '';
    } else {
        warehouseSelect.disabled = false;
    }
}

function batchSetDeliveryMethod(select) {
    if (!select.value) return;
    
    var tables = document.querySelectorAll('.sub-table');
    tables.forEach(function(table) {
        var rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(row) {
            var deliverySelect = row.querySelector('.delivery-method');
            var warehouseSelect = row.querySelector('.warehouse');
            
            deliverySelect.value = select.value;
            
            if (select.value === '直运') {
                warehouseSelect.disabled = true;
                warehouseSelect.value = '';
            } else {
                warehouseSelect.disabled = false;
            }
        });
    });
    
    select.value = '';
}

function batchSetWarehouse(select) {
    if (!select.value) return;
    
    var tables = document.querySelectorAll('.sub-table');
    tables.forEach(function(table) {
        var rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(row) {
            var deliverySelect = row.querySelector('.delivery-method');
            if (deliverySelect.value !== '直运') {
                row.querySelector('.warehouse').value = select.value;
            }
        });
    });
    
    select.value = '';
}

function onCustomerSelect(input) {
    if (input.value) {
        var settlementMap = { monthly: '月结', cash: '现结', prepaid: '预付' };
        document.getElementById('settlementMethod').value = 'monthly';
        document.getElementById('settlementMethodEdit').value = 'monthly';
    }
}

function toggleReceivingDropdown() {
    var dropdown = document.getElementById('receivingDropdown');
    var dropdownEdit = document.getElementById('receivingDropdownEdit');
    
    if (dropdown) dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    if (dropdownEdit) dropdownEdit.style.display = dropdownEdit.style.display === 'none' ? 'block' : 'none';
}

function filterReceivingInfo(input) {
    var searchText = input.value.toLowerCase();
    var dropdown = document.getElementById('receivingDropdown');
    
    if (dropdown) {
        dropdown.style.display = 'block';
        var options = dropdown.querySelectorAll('.receiving-option');
        options.forEach(function(option) {
            var text = option.textContent.toLowerCase();
            option.style.display = text.indexOf(searchText) > -1 ? 'block' : 'none';
        });
    }
}

function selectReceivingInfo(element) {
    var value = element.getAttribute('data-value');
    var searchInput = document.getElementById('receivingInfoSearch');
    var dropdown = document.getElementById('receivingDropdown');
    
    if (searchInput) searchInput.value = value;
    if (dropdown) dropdown.style.display = 'none';
}

function toggleInvoiceDropdown() {
    var dropdown = document.getElementById('invoiceDropdown');
    var dropdownEdit = document.getElementById('invoiceDropdownEdit');
    
    if (dropdown) dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    if (dropdownEdit) dropdownEdit.style.display = dropdownEdit.style.display === 'none' ? 'block' : 'none';
}

function filterInvoiceInfo(input) {
    var searchText = input.value.toLowerCase();
    var dropdown = document.getElementById('invoiceDropdown');
    
    if (dropdown) {
        dropdown.style.display = 'block';
        var options = dropdown.querySelectorAll('.invoice-option');
        options.forEach(function(option) {
            var text = option.textContent.toLowerCase();
            option.style.display = text.indexOf(searchText) > -1 ? 'block' : 'none';
        });
    }
}

function selectInvoiceInfo(element) {
    var value = element.getAttribute('data-value');
    var searchInput = document.getElementById('invoiceInfoSearch');
    var dropdown = document.getElementById('invoiceDropdown');
    
    if (searchInput) searchInput.value = value;
    if (dropdown) dropdown.style.display = 'none';
}

document.addEventListener('click', function(event) {
    var receivingSearch = document.getElementById('receivingInfoSearch');
    var receivingDropdown = document.getElementById('receivingDropdown');
    var invoiceSearch = document.getElementById('invoiceInfoSearch');
    var invoiceDropdown = document.getElementById('invoiceDropdown');
    
    var isReceivingClick = receivingSearch && receivingSearch.contains(event.target);
    var isReceivingDropdownClick = receivingDropdown && receivingDropdown.contains(event.target);
    var isInvoiceClick = invoiceSearch && invoiceSearch.contains(event.target);
    var isInvoiceDropdownClick = invoiceDropdown && invoiceDropdown.contains(event.target);
    
    if (!isReceivingClick && !isReceivingDropdownClick) {
        if (receivingDropdown) receivingDropdown.style.display = 'none';
    }
    
    if (!isInvoiceClick && !isInvoiceDropdownClick) {
        if (invoiceDropdown) invoiceDropdown.style.display = 'none';
    }
    
    // 关闭品牌、规格下拉
    var dropdowns = document.querySelectorAll('.brand-dropdown, .spec-dropdown');
    dropdowns.forEach(function(dropdown) {
        if (!dropdown.contains(event.target) && !dropdown.previousElementSibling.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });
});

// 模拟产品数据
var productData = [
    { brand: '测试品牌', spec: 'SPEC001', product: '测试产品A', price: 100, unit: '个', packaging: '瓶' },
    { brand: '品牌B', spec: 'SPEC001', product: '测试产品B', price: 120, unit: '盒', packaging: '箱' },
    { brand: '品牌C', spec: 'SPEC001', product: '测试产品C', price: 90, unit: '箱', packaging: '包' },
    { brand: '品牌B', spec: 'SPEC002', product: '测试产品D', price: 110, unit: '个', packaging: '盒' },
    { brand: '品牌D', spec: 'SPEC002', product: '测试产品E', price: 115, unit: '台', packaging: '箱' },
    { brand: '测试品牌', spec: 'PRD-001', product: '产品X', price: 200, unit: '个', packaging: '箱' },
    { brand: '品牌E', spec: 'PRD-002', product: '产品Y', price: 180, unit: '台', packaging: '箱' },
    { brand: '品牌F', spec: 'ABC-100', product: '产品Z', price: 150, unit: '套', packaging: '盒' }
];

// 获取所有唯一规格
function getAllSpecs() {
    var specs = [];
    productData.forEach(function(item) {
        if (specs.indexOf(item.spec) === -1) {
            specs.push(item.spec);
        }
    });
    return specs.sort();
}

// 获取所有唯一品牌
function getAllBrands() {
    var brands = [];
    productData.forEach(function(item) {
        if (brands.indexOf(item.brand) === -1) {
            brands.push(item.brand);
        }
    });
    return brands.sort();
}

// 根据规格筛选品牌
function getBrandsBySpec(spec) {
    var brands = [];
    productData.forEach(function(item) {
        if (item.spec === spec && brands.indexOf(item.brand) === -1) {
            brands.push(item.brand);
        }
    });
    return brands.sort();
}

// 根据品牌筛选规格
function getSpecsByBrand(brand) {
    var specs = [];
    productData.forEach(function(item) {
        if (item.brand === brand && specs.indexOf(item.spec) === -1) {
            specs.push(item.spec);
        }
    });
    return specs.sort();
}

// 根据品牌和规格筛选产品
function filterProducts(brand, spec) {
    return productData.filter(function(item) {
        var brandMatch = !brand || item.brand === brand;
        var specMatch = !spec || item.spec === spec;
        return brandMatch && specMatch;
    });
}

// 显示规格下拉
function showSpecDropdown(input) {
    var dropdown = input.nextElementSibling;
    if (dropdown && dropdown.classList.contains('spec-dropdown')) {
        dropdown.classList.remove('hidden');
        var row = input.closest('tr');
        var brandValue = row.querySelector('.brand-input').value;
        renderSpecDropdown(dropdown, brandValue);
    }
}

// 渲染规格下拉列表
function renderSpecDropdown(dropdown, brandFilter) {
    var specs = getAllSpecs();
    if (brandFilter) {
        specs = getSpecsByBrand(brandFilter);
    }
    
    var html = '<div class="dropdown-item" onclick="selectSpec(this, null)">-- 不限规格 --</div>';
    specs.forEach(function(spec) {
        var count = productData.filter(function(item) { return item.spec === spec; }).length;
        html += '<div class="dropdown-item" onclick="selectSpec(this, \'' + spec + '\')">' + spec + ' (' + count + '个品牌)</div>';
    });
    dropdown.innerHTML = html;
}

// 规格输入时显示下拉
function onSpecInput(input) {
    var dropdown = input.nextElementSibling;
    if (dropdown && dropdown.classList.contains('spec-dropdown')) {
        dropdown.classList.remove('hidden');
        var row = input.closest('tr');
        var brandValue = row.querySelector('.brand-input').value;
        renderSpecDropdown(dropdown, brandValue);
    }
}

// 选择规格
function selectSpec(element, spec) {
    var dropdown = element.closest('.spec-dropdown');
    var input = dropdown.previousElementSibling;
    var row = input.closest('tr');
    var brandInput = row.querySelector('.brand-input');
    
    input.value = spec || '';
    dropdown.classList.add('hidden');
    
    // 如果选择了规格，更新品牌下拉显示该规格可用的品牌
    if (spec) {
        var brands = getBrandsBySpec(spec);
        var dropdown = brandInput.nextElementSibling;
        if (dropdown && dropdown.classList.contains('brand-dropdown')) {
            var html = '<div class="dropdown-item" onclick="selectBrand(this, null)">-- 不限品牌 --</div>';
            brands.forEach(function(brand) {
                html += '<div class="dropdown-item" onclick="selectBrand(this, \'' + brand + '\')">' + brand + '</div>';
            });
            dropdown.innerHTML = html;
        }
    }
}

// 显示品牌下拉
function showBrandDropdown(input) {
    var dropdown = input.nextElementSibling;
    if (dropdown && dropdown.classList.contains('brand-dropdown')) {
        dropdown.classList.remove('hidden');
        var row = input.closest('tr');
        var specValue = row.querySelector('.spec-input').value;
        renderBrandDropdown(dropdown, specValue);
    }
}

// 渲染品牌下拉列表
function renderBrandDropdown(dropdown, specFilter) {
    var brands = getAllBrands();
    if (specFilter) {
        brands = getBrandsBySpec(specFilter);
    }
    
    var html = '<div class="dropdown-item" onclick="selectBrand(this, null)">-- 不限品牌 --</div>';
    brands.forEach(function(brand) {
        html += '<div class="dropdown-item" onclick="selectBrand(this, \'' + brand + '\')">' + brand + '</div>';
    });
    dropdown.innerHTML = html;
}

// 品牌输入时显示下拉
function onBrandInput(input) {
    var dropdown = input.nextElementSibling;
    if (dropdown && dropdown.classList.contains('brand-dropdown')) {
        dropdown.classList.remove('hidden');
        var row = input.closest('tr');
        var specValue = row.querySelector('.spec-input').value;
        renderBrandDropdown(dropdown, specValue);
    }
}

// 选择品牌
function selectBrand(element, brand) {
    var dropdown = element.closest('.brand-dropdown');
    var input = dropdown.previousElementSibling;
    var row = input.closest('tr');
    var specInput = row.querySelector('.spec-input');
    
    input.value = brand || '';
    dropdown.classList.add('hidden');
    
    // 如果选择了品牌，更新规格下拉显示该品牌可用的规格
    if (brand) {
        var specs = getSpecsByBrand(brand);
        var dropdown = specInput.nextElementSibling;
        if (dropdown && dropdown.classList.contains('spec-dropdown')) {
            var html = '<div class="dropdown-item" onclick="selectSpec(this, null)">-- 不限规格 --</div>';
            specs.forEach(function(spec) {
                var count = productData.filter(function(item) { return item.spec === spec; }).length;
                html += '<div class="dropdown-item" onclick="selectSpec(this, \'' + spec + '\')">' + spec + ' (' + count + '个品牌)</div>';
            });
            dropdown.innerHTML = html;
        }
    }
}

// 填充产品行
function fillProductRow(row, item) {
    row.querySelector('.brand-input').value = item.brand;
    row.querySelector('.spec-input').value = item.spec;
    row.querySelector('.product-input').value = item.product;
    
    row.querySelector('td:nth-child(5) input').value = item.packaging;
    row.querySelector('td:nth-child(6) input').value = item.unit;
    row.querySelector('td:nth-child(8) input').value = item.price.toFixed(2);
    row.querySelector('td:nth-child(14) span').textContent = '100';
    calculateRow(row.querySelector('td:nth-child(8) input'));
}

// 通用创建元素
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.firstChild;
}