// 模块切换函数
function showModule(moduleId) {
    var modules = document.querySelectorAll('.module');
    modules.forEach(function(module) {
        module.classList.add('hidden');
    });
    
    var activeModule = document.getElementById(moduleId);
    if (activeModule) {
        activeModule.classList.remove('hidden');
    }
    
    var menuItems = document.querySelectorAll('.menu a');
    menuItems.forEach(function(item) {
        item.classList.remove('active');
    });
    
    var activeMenuItem = document.querySelector('.menu a[href="#' + moduleId + '"]');
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
}

// 切换管理员视图（演示用）
var isAdminView = false;
function toggleAdminView() {
    isAdminView = !isAdminView;
    var adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(function(el) {
        el.style.display = isAdminView ? 'block' : 'none';
    });
}

// 菜单分组切换函数
function toggleMenuGroup(element) {
    var menuGroup = element.closest('.menu-group');
    var submenu = menuGroup.querySelector('.submenu');
    var arrow = element.querySelector('.menu-arrow');
    
    if (submenu) {
        if (submenu.classList.contains('hidden')) {
            submenu.classList.remove('hidden');
            arrow.textContent = '▼';
            menuGroup.classList.add('expanded');
        } else {
            submenu.classList.add('hidden');
            arrow.textContent = '▶';
            menuGroup.classList.remove('expanded');
        }
    }
}

// 侧边栏收起/展开函数
function toggleSidebar() {
    var sidebar = document.querySelector('.sidebar');
    var content = document.querySelector('.content');
    
    if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        sidebar.style.width = '220px';
        content.style.marginLeft = '220px';
    } else {
        sidebar.classList.add('collapsed');
        sidebar.style.width = '64px';
        content.style.marginLeft = '64px';
    }
}

// 销售订单列表交互
function toggleOrderDetails(orderId) {
    var row = document.getElementById(orderId);
    if (row) {
        row.classList.toggle('hidden');
        
        var icon = event.target;
        if (icon.textContent === '▶') {
            icon.textContent = '▼';
        } else {
            icon.textContent = '▶';
        }
    }
}

function addProductRow() {
    var table = document.getElementById('productTable');
    if (!table) {
        table = document.getElementById('productTableEdit');
    }
    if (!table) {
        table = document.querySelector('.sub-table');
    }
    
    var tbody = table.querySelector('tbody');
    var rows = tbody.querySelectorAll('tr');
    var rowNum = rows.length + 1;

    var newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${rowNum}</td>
        <td><input type="text" placeholder="品牌" style="width:100%"></td>
        <td><input type="text" placeholder="规格编号" style="width:100%"></td>
        <td><input type="text" placeholder="请搜索选择商品" style="width:100%" onchange="onProductSelect(this)"></td>
        <td><input type="text" placeholder="包装" style="width:100%"></td>
        <td><input type="text" placeholder="单位" style="width:100%"></td>
        <td><input type="text" placeholder="备注" style="width:100%"></td>
        <td><input type="number" value="0.00" style="width:100%" onchange="calculateRow(this)"></td>
        <td><input type="number" value="1.00" step="0.01" style="width:100%" onchange="calculateRow(this)"></td>
        <td><input type="number" value="1" style="width:100%" onchange="calculateRow(this)"></td>
        <td><input type="number" value="0.01" step="0.01" style="width:100%" readonly></td>
        <td class="amount">¥0.00</td>
        <td class="amount">¥0.00</td>
        <td><span class="tag tag-pending">0</span></td>
        <td>
            <select class="delivery-method" onchange="onDeliveryMethodChange(this)">
                <option value="直运">直运</option>
                <option value="物流">物流</option>
                <option value="自提">自提</option>
                <option value="送货">送货</option>
            </select>
        </td>
        <td>
            <select class="warehouse" disabled>
                <option value="">请选择</option>
                <option value="北京仓库">北京仓库</option>
                <option value="上海仓库">上海仓库</option>
                <option value="深圳仓库">深圳仓库</option>
            </select>
        </td>
        <td><a class="action-link danger" onclick="removeProductRow(this)">删除</a></td>
    `;
    
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

// 发货功能
var currentOrderId = null;

function openShipment(orderId) {
    currentOrderId = orderId;
    var modal = document.getElementById('shipmentModal');
    if (modal) {
        modal.style.display = 'block';
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
                statusCell.innerHTML = '<span class="tag tag-pending" style="background:#fff5e6;color:#f97316">部分发货</span>';
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

function selectAllText(element) {
    var range = document.createRange();
    range.selectNodeContents(element);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function onCustomerSelect(input) {
    if (input.value) {
        // 查找客户信息
        var customer = customers.find(c => c.name === input.value);
        if (!customer) {
            customer = customers[0]; // 默认第一个客户
        }
        
        // 自动填充结算方式
        var settlementMap = { monthly: '月结', cash: '现结', prepaid: '预付' };
        var settlement = settlementMap[customer.settlement] || '月结';
        document.getElementById('settlementMethod').value = settlement;
        document.getElementById('settlementMethodEdit').value = settlement;
        
        // 自动填充收货信息（默认地址）
        var defaultAddress = customer.addresses.find(a => a.isDefault) || customer.addresses[0];
        if (defaultAddress) {
            var defaultReceiving = defaultAddress.receiver + ' - ' + defaultAddress.phone + ' - ' + defaultAddress.address;
            var receivingSearch = document.getElementById('receivingInfoSearch');
            var receivingSearchEdit = document.getElementById('receivingInfoSearchEdit');
            
            if (receivingSearch) receivingSearch.value = defaultReceiving;
            if (receivingSearchEdit) receivingSearchEdit.value = defaultReceiving;
        }
        
        // 自动填充开票信息
        var invoiceTypeText = customer.invoiceType === 'special' ? '增值税专用发票' : '增值税普通发票';
        var defaultInvoice = customer.invoiceTitle + ' - ' + invoiceTypeText;
        var invoiceSearch = document.getElementById('invoiceInfoSearch');
        var invoiceSearchEdit = document.getElementById('invoiceInfoSearchEdit');
        
        if (invoiceSearch) invoiceSearch.value = defaultInvoice;
        if (invoiceSearchEdit) invoiceSearchEdit.value = defaultInvoice;
        
        // 同时更新税率
        var taxInput = document.querySelector('#productTable tbody tr td:nth-child(11) input');
        if (taxInput) taxInput.value = customer.invoiceType === 'special' ? '0.13' : '0.03';
        var taxInputEdit = document.querySelector('#productTableEdit tbody tr td:nth-child(11) input');
        if (taxInputEdit) taxInputEdit.value = customer.invoiceType === 'special' ? '0.13' : '0.03';
    }
}

function onInvoiceInfoChange(select) {
    var taxRate = 0.01;
    if (select.value.indexOf('增值税') !== -1) {
        taxRate = 0.13;
    } else if (select.value.indexOf('普通') !== -1) {
        taxRate = 0.03;
    }
    
    var tables = document.querySelectorAll('.sub-table');
    tables.forEach(function(table) {
        var rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(row) {
            var taxInput = row.querySelector('td:nth-child(11) input');
            if (taxInput) {
                taxInput.value = taxRate.toFixed(2);
            }
        });
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
        row.querySelector('td:nth-child(13) span').textContent = '100';
        calculateRow(input);
        calculateShippingFee();
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
    
    document.getElementById('totalQuantity').textContent = totalQty;
    document.getElementById('subtotalAmount').textContent = '¥' + subtotal.toFixed(2);
    document.getElementById('totalAmount').textContent = '¥' + total.toFixed(2);
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
    
    calculateShippingFee();
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
    calculateShippingFee();
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

function calculateShippingFee() {
    var tables = document.querySelectorAll('.sub-table');
    var hasBiyuntian = false;
    
    tables.forEach(function(table) {
        var rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(row) {
            var brand = row.querySelector('td:nth-child(2) input').value;
            if (brand && brand.indexOf('碧云') !== -1) {
                hasBiyuntian = true;
            }
        });
    });
    
    if (hasBiyuntian && document.getElementById('shippingFee').value == '0') {
        document.getElementById('shippingFee').value = '15.00';
        calculateTotal();
    }
    if (hasBiyuntian && document.getElementById('shippingFeeEdit').value == '0') {
        document.getElementById('shippingFeeEdit').value = '15.00';
        calculateTotalEdit();
    }
}

function addNewReceivingInfo() {
    document.getElementById('receivingInfoText').value = '';
    document.getElementById('newReceiver').value = '';
    document.getElementById('newPhone').value = '';
    document.getElementById('newAddress').value = '';
    document.getElementById('receivingInfoModal').style.display = 'block';
}

function parseReceivingInfo() {
    var text = document.getElementById('receivingInfoText').value.trim();
    if (!text) {
        showAlert('请先粘贴收货信息！');
        return;
    }
    
    var name = '';
    var phone = '';
    var address = '';
    
    var phoneMatch = text.match(/(?:1[3-9]\d{9})/);
    if (phoneMatch) {
        phone = phoneMatch[0];
    }
    
    if (phone) {
        var parts = text.split(phone);
        var beforePhone = parts[0] ? parts[0].trim() : '';
        var afterPhone = parts[1] ? parts[1].trim() : '';
        
        var separators = /[,，\s\r\n]+/;
        
        if (beforePhone) {
            var beforeParts = beforePhone.split(separators).filter(function(p) { return p.trim(); });
            if (beforeParts.length > 0) {
                name = beforeParts[beforeParts.length - 1].trim();
            }
            if (beforeParts.length > 1) {
                address = beforeParts.slice(0, -1).join(' ');
            }
        }
        
        if (afterPhone) {
            var afterParts = afterPhone.split(separators).filter(function(p) { return p.trim(); });
            if (afterParts.length > 0) {
                if (!address) {
                    address = afterParts.join(' ');
                }
                if (!name && afterParts.length > 0) {
                    var firstPart = afterParts[0];
                    if (firstPart.length <= 5 && !/^\d/.test(firstPart)) {
                        name = firstPart;
                        if (afterParts.length > 1) {
                            address = afterParts.slice(1).join(' ');
                        }
                    }
                }
            }
        }
        
        if (!name) {
            var cleanText = text.replace(phone, '');
            var allParts = cleanText.split(separators).filter(function(p) { return p.trim(); });
            for (var i = 0; i < allParts.length; i++) {
                var part = allParts[i].trim();
                if (part.length <= 5 && !/^\d/.test(part) && /[\u4e00-\u9fa5]/.test(part)) {
                    name = part;
                    break;
                }
            }
            if (!name && allParts.length > 0) {
                name = allParts[0];
            }
        }
        
        if (!address) {
            var cleanText = text.replace(phone, '').replace(name, '');
            address = cleanText.trim();
        }
    }
    
    document.getElementById('newReceiver').value = name;
    document.getElementById('newPhone').value = phone;
    document.getElementById('newAddress').value = address;
}

function saveReceivingInfo() {
    var receiver = document.getElementById('newReceiver').value.trim();
    var phone = document.getElementById('newPhone').value.trim();
    var address = document.getElementById('newAddress').value.trim();
    
    if (!receiver || !phone || !address) {
        showAlert('请填写完整的收货信息！');
        return;
    }
    
    var value = receiver + ' - ' + phone + ' - ' + address;
    
    var dropdown = document.getElementById('receivingDropdown');
    var dropdownEdit = document.getElementById('receivingDropdownEdit');
    
    if (dropdown) {
        var newOption = document.createElement('div');
        newOption.className = 'receiving-option';
        newOption.setAttribute('onclick', 'selectReceivingInfo(this)');
        newOption.setAttribute('data-value', value);
        newOption.style.cssText = 'padding:8px 12px;cursor:pointer';
        newOption.textContent = value;
        dropdown.appendChild(newOption);
    }
    
    if (dropdownEdit) {
        var newOptionEdit = document.createElement('div');
        newOptionEdit.className = 'receiving-option';
        newOptionEdit.setAttribute('onclick', 'selectReceivingInfo(this)');
        newOptionEdit.setAttribute('data-value', value);
        newOptionEdit.style.cssText = 'padding:8px 12px;cursor:pointer';
        newOptionEdit.textContent = value;
        dropdownEdit.appendChild(newOptionEdit);
    }
    
    var searchInput = document.getElementById('receivingInfoSearch');
    var searchInputEdit = document.getElementById('receivingInfoSearchEdit');
    if (searchInput) searchInput.value = value;
    if (searchInputEdit) searchInputEdit.value = value;
    
    closeModal('receivingInfoModal');
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
    var dropdownEdit = document.getElementById('receivingDropdownEdit');
    
    var filterOptions = function(dropdownEl) {
        if (dropdownEl) {
            dropdownEl.style.display = 'block';
            var options = dropdownEl.querySelectorAll('.receiving-option');
            options.forEach(function(option) {
                var text = option.textContent.toLowerCase();
                option.style.display = text.indexOf(searchText) > -1 ? 'block' : 'none';
            });
        }
    };
    
    filterOptions(dropdown);
    filterOptions(dropdownEdit);
}

function selectReceivingInfo(element) {
    var value = element.getAttribute('data-value');
    var searchInput = document.getElementById('receivingInfoSearch');
    var searchInputEdit = document.getElementById('receivingInfoSearchEdit');
    var dropdown = document.getElementById('receivingDropdown');
    var dropdownEdit = document.getElementById('receivingDropdownEdit');
    
    if (searchInput) searchInput.value = value;
    if (searchInputEdit) searchInputEdit.value = value;
    if (dropdown) dropdown.style.display = 'none';
    if (dropdownEdit) dropdownEdit.style.display = 'none';
}

function addNewInvoiceInfo() {
    document.getElementById('invoiceInfoText').value = '';
    document.getElementById('newInvoiceType').value = '增值税普通发票';
    document.getElementById('newInvoiceTitle').value = '';
    document.getElementById('newTaxNumber').value = '';
    document.getElementById('newBank').value = '';
    document.getElementById('newBankAccount').value = '';
    document.getElementById('newCompanyAddress').value = '';
    document.getElementById('newCompanyPhone').value = '';
    document.getElementById('invoiceInfoModal').style.display = 'block';
}

function parseInvoiceInfo() {
    var text = document.getElementById('invoiceInfoText').value.trim();
    if (!text) {
        showAlert('请先粘贴开票信息！');
        return;
    }
    
    var title = '';
    var taxNumber = '';
    var bank = '';
    var bankAccount = '';
    var address = '';
    var phone = '';
    
    var taxMatch = text.match(/(?:纳税人识别号|税号|税务登记号)[:：\s]*([0-9A-Za-z]{15,20})/);
    if (!taxMatch) {
        taxMatch = text.match(/(?:\b)([0-9A-Za-z]{15,20})(?:\b)/);
    }
    if (taxMatch) {
        taxNumber = taxMatch[1];
    }
    
    var bankMatch = text.match(/(?:开户银行|开户行)[:：\s]*([^,，\s\r\n]+)/);
    if (bankMatch) {
        bank = bankMatch[1].trim();
    }
    
    var accountMatch = text.match(/(?:银行账号|账号)[:：\s]*([0-9]{10,30})/);
    if (accountMatch) {
        bankAccount = accountMatch[1];
    }
    
    var addressMatch = text.match(/(?:地址)[:：\s]*([^,，\s\r\n]+(?:[,，\s]+[^,，\s\r\n]+)*)/);
    if (addressMatch) {
        address = addressMatch[1].trim();
    }
    
    var phoneMatch = text.match(/(?:电话)[:：\s]*([0-9\-]{7,20})/);
    if (phoneMatch) {
        phone = phoneMatch[1];
    }
    
    var titleMatch = text.match(/(?:名称|公司名称|单位名称)[:：\s]*([^,，\s\r\n]+(?:[,，\s]+[^,，\s\r\n]+)*?)(?=\s*(?:税号|纳税人识别号|开户银行|地址|电话|$))/);
    if (titleMatch) {
        title = titleMatch[1].trim();
    } else {
        var parts = text.split(/[,，\s\r\n]+/).filter(function(p) { return p.trim(); });
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i].trim();
            if (part.length > 2 && part !== taxNumber && part !== bank && part !== bankAccount && 
                part !== address && part !== phone && !/^\d+$/.test(part) && 
                /[\u4e00-\u9fa5]/.test(part) && 
                !part.includes('税') && !part.includes('银行') && 
                !part.includes('地址') && !part.includes('电话')) {
                title = part;
                break;
            }
        }
    }
    
    document.getElementById('newInvoiceTitle').value = title;
    document.getElementById('newTaxNumber').value = taxNumber;
    document.getElementById('newBank').value = bank;
    document.getElementById('newBankAccount').value = bankAccount;
    document.getElementById('newCompanyAddress').value = address;
    document.getElementById('newCompanyPhone').value = phone;
    
    if (title || taxNumber) {
        showAlert('智能识别完成！请检查信息是否正确。');
    } else {
        showAlert('未识别到关键信息，请手动填写！');
    }
}

function saveInvoiceInfo() {
    var title = document.getElementById('newInvoiceTitle').value.trim();
    var invoiceType = document.getElementById('newInvoiceType').value;
    
    if (!title) {
        showAlert('请填写发票抬头！');
        return;
    }
    
    var value = title + ' - ' + invoiceType.replace('增值税', '').replace('普通', '').replace('发票', '').trim();
    value = value.replace(/\s*-\s*$/, '');
    
    var dropdown = document.getElementById('invoiceDropdown');
    var dropdownEdit = document.getElementById('invoiceDropdownEdit');
    
    if (dropdown) {
        var newOption = document.createElement('div');
        newOption.className = 'invoice-option';
        newOption.setAttribute('onclick', 'selectInvoiceInfo(this)');
        newOption.setAttribute('data-value', value);
        newOption.setAttribute('data-type', invoiceType.indexOf('增值税') > -1 ? '增值税' : '普通');
        newOption.style.cssText = 'padding:8px 12px;cursor:pointer';
        newOption.textContent = value;
        dropdown.appendChild(newOption);
    }
    
    if (dropdownEdit) {
        var newOptionEdit = document.createElement('div');
        newOptionEdit.className = 'invoice-option';
        newOptionEdit.setAttribute('onclick', 'selectInvoiceInfo(this)');
        newOptionEdit.setAttribute('data-value', value);
        newOptionEdit.setAttribute('data-type', invoiceType.indexOf('增值税') > -1 ? '增值税' : '普通');
        newOptionEdit.style.cssText = 'padding:8px 12px;cursor:pointer';
        newOptionEdit.textContent = value;
        dropdownEdit.appendChild(newOptionEdit);
    }
    
    var searchInput = document.getElementById('invoiceInfoSearch');
    var searchInputEdit = document.getElementById('invoiceInfoSearchEdit');
    if (searchInput) searchInput.value = value;
    if (searchInputEdit) searchInputEdit.value = value;
    
    closeModal('invoiceInfoModal');
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
    var dropdownEdit = document.getElementById('invoiceDropdownEdit');
    
    var filterOptions = function(dropdownEl) {
        if (dropdownEl) {
            dropdownEl.style.display = 'block';
            var options = dropdownEl.querySelectorAll('.invoice-option');
            options.forEach(function(option) {
                var text = option.textContent.toLowerCase();
                option.style.display = text.indexOf(searchText) > -1 ? 'block' : 'none';
            });
        }
    };
    
    filterOptions(dropdown);
    filterOptions(dropdownEdit);
}

function selectInvoiceInfo(element) {
    var value = element.getAttribute('data-value');
    var type = element.getAttribute('data-type');
    var searchInput = document.getElementById('invoiceInfoSearch');
    var searchInputEdit = document.getElementById('invoiceInfoSearchEdit');
    var dropdown = document.getElementById('invoiceDropdown');
    var dropdownEdit = document.getElementById('invoiceDropdownEdit');
    
    if (searchInput) searchInput.value = value;
    if (searchInputEdit) searchInputEdit.value = value;
    if (dropdown) dropdown.style.display = 'none';
    if (dropdownEdit) dropdownEdit.style.display = 'none';
    
    var event = {
        target: {
            value: type
        }
    };
    onInvoiceInfoChange(event.target);
}

var confirmCallback = null;

function showConfirm(title, message, callback) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    confirmCallback = callback;
    document.getElementById('confirmModal').style.display = 'block';
    
    var confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.onclick = function() {
        closeModal('confirmModal');
        if (confirmCallback) {
            confirmCallback();
        }
    };
}

function showAlert(message) {
    showConfirm('提示', message, null);
}

function validateOrder() {
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
    
    return true;
}

function submitOrder() {
    var isOk = validateOrder();
    if (isOk) {
        showAlert('订单已提交！\n订单状态：已审核');
        setTimeout(function() {
            showModule('sales-list');
        }, 500);
    }
}

function calculateTotalEdit() {
    var rows = document.querySelectorAll('#productTableEdit tbody tr');
    var totalQty = 0;
    var subtotal = 0;
    
    rows.forEach(function(row) {
        var qty = parseInt(row.querySelector('td:nth-child(10) input').value) || 0;
        var rowTotal = parseFloat(row.querySelector('td:nth-child(13)').textContent.replace('¥', '')) || 0;
        totalQty += qty;
        subtotal += rowTotal;
    });
    
    var shipping = parseFloat(document.getElementById('shippingFeeEdit').value) || 0;
    var total = subtotal + shipping;
    
    document.getElementById('totalQuantityEdit').textContent = totalQty;
    document.getElementById('subtotalAmountEdit').textContent = '¥' + subtotal.toFixed(2);
    document.getElementById('totalAmountEdit').textContent = '¥' + total.toFixed(2);
}

// ========== 客户管理功能 ==========
var customers = [
    {
        id: 1,
        code: 'KH20260501001',
        name: '测试客户公司',
        memberAccount: 'test_company_001',
        customerStatus: 'normal',
        customerType: 'terminal',
        contact: '张三',
        phone: '13800138000',
        email: 'zhangsan@test.com',
        settlement: 'monthly',
        invoiceType: 'special',
        invoiceTitle: '测试客户公司',
        taxNumber: '91110000MA00123456',
        bankName: '中国工商银行北京分行',
        bankAccount: '1102010109876543210',
        companyAddress: '北京市海淀区中关村大街1号',
        companyPhone: '010-88888888',
        accountBalance: 5000.00,
        debtTotal: 12500.00,
        lastOrderTime: '2026-05-24 14:30',
        totalOrderAmount: 123456.78,
        discountRate: 95,
        addresses: [
            { receiver: '张三', phone: '13800138000', address: '北京市朝阳区科技园1号', isDefault: true, remark: '默认地址' },
            { receiver: '李四', phone: '13900139000', address: '上海市浦东新区张江高科技园', isDefault: false, remark: '' }
        ],
        remark: '重点客户，请优先处理。'
    },
    {
        id: 2,
        code: 'KH20260505002',
        name: '李四个人客户',
        memberAccount: 'lisi_personal_002',
        customerStatus: 'normal',
        customerType: 'terminal',
        contact: '李四',
        phone: '13900139000',
        email: '',
        settlement: 'cash',
        invoiceType: 'normal',
        invoiceTitle: '李四',
        taxNumber: '',
        bankName: '',
        bankAccount: '',
        companyAddress: '',
        companyPhone: '',
        accountBalance: 0.00,
        debtTotal: 3200.00,
        lastOrderTime: '2026-05-20 09:15',
        totalOrderAmount: 8765.43,
        discountRate: 100,
        addresses: [
            { receiver: '李四', phone: '13900139000', address: '上海市浦东新区张江高科技园', isDefault: true, remark: '' }
        ],
        remark: ''
    },
    {
        id: 3,
        code: 'KH20251110003',
        name: '沉睡客户公司',
        memberAccount: 'sleeping_company_003',
        customerStatus: 'public',
        customerType: 'dealer',
        contact: '王五',
        phone: '13700137000',
        email: '',
        settlement: 'prepaid',
        invoiceType: 'special',
        invoiceTitle: '沉睡客户公司',
        taxNumber: '91110000MA00987654',
        bankName: '',
        bankAccount: '',
        companyAddress: '',
        companyPhone: '',
        accountBalance: 10000.00,
        debtTotal: 0.00,
        lastOrderTime: '2025-11-10 08:45',
        totalOrderAmount: 56789.00,
        discountRate: 90,
        addresses: [
            { receiver: '王五', phone: '13700137000', address: '广州市天河区珠江新城', isDefault: true, remark: '' }
        ],
        remark: ''
    }
];

var currentCustomer = null;

function addCustomerAddress() {
    var table = document.getElementById('customerAddressTable');
    var tableEdit = document.getElementById('customerAddressTableEdit');
    
    var newRow = '<tr>' +
        '<td><input type="text" style="width:100%"></td>' +
        '<td><input type="text" style="width:100%"></td>' +
        '<td><input type="text" style="width:100%"></td>' +
        '<td><select><option value="1">是</option><option value="0" selected>否</option></select></td>' +
        '<td><input type="text" style="width:100%"></td>' +
        '<td><a class="action-link danger" onclick="removeCustomerAddress(this)">删除</a></td>' +
        '</tr>';
    
    if (table) {
        table.insertAdjacentHTML('beforeend', newRow);
    }
    if (tableEdit) {
        tableEdit.insertAdjacentHTML('beforeend', newRow);
    }
}

function removeCustomerAddress(link) {
    var tr = link.closest('tr');
    tr.remove();
}

function saveCustomerDraft() {
    showAlert('保存成功！');
    showModule('customer-list');
}

function saveCustomer() {
    showAlert('保存成功！已启用。');
    showModule('customer-list');
}

function deleteCustomer(id) {
    showConfirm('确定要删除该客户吗？删除后相关数据将无法恢复。', function() {
        var row = document.getElementById('row-customer-' + id);
        if (row) {
            row.remove();
        }
        showAlert('删除成功！');
    });
}

function toggleDropdown(element) {
    var dropdown = element.nextElementSibling;
    var isOpen = dropdown.style.display === 'block';
    
    document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
        menu.style.display = 'none';
    });
    
    if (!isOpen) {
        dropdown.style.display = 'block';
        event.stopPropagation();
    }
}

document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
        menu.style.display = 'none';
    });
});

function setCustomerDefault(id) {
    var customer = customers.find(c => c.id === id);
    var customerName = customer ? customer.name : '该客户';
    
    showConfirm('确定为【' + customerName + '】设置订单默认值？', function() {
        showAlert('订单默认值设置成功！\n\n默认设置项：\n- 收货地址：将使用客户的默认收货地址\n- 开票信息：将使用客户维护的开票信息\n- 结算方式：将使用客户设定的结算方式\n- 税率：将根据客户发票类型自动带出');
    });
}

function registerMember(id) {
    var customer = customers.find(c => c.id === id);
    var memberAccount = customer ? customer.memberAccount : '';
    
    if (memberAccount) {
        showAlert('该客户已有会员账号：' + memberAccount);
    } else {
        showPrompt('请设置会员账号：', function(account) {
            if (account) {
                if (customer) {
                    customer.memberAccount = account;
                }
                showAlert('会员账号设置成功：' + account);
            }
        }, customer ? customer.code : '');
    }
}

function transferCustomer(id) {
    showPrompt('请输入新业务员名称：', function(salesman) {
        if (salesman) {
            showAlert('客户已成功转移给业务员：' + salesman);
        }
    }, '系统管理员');
}

function setDiscount(id) {
    var customer = customers.find(c => c.id === id);
    var currentDiscount = customer ? customer.discountRate : 100;
    
    showPrompt('请设置客户专属折扣（0-100）：', function(discount) {
        var num = parseInt(discount);
        if (!isNaN(num) && num >= 0 && num <= 100) {
            if (customer) {
                customer.discountRate = num;
            }
            showAlert('折扣设置成功：' + num + '%');
        } else {
            showAlert('请输入有效的折扣值（0-100）');
        }
    }, currentDiscount.toString());
}

function onCreateInvoiceTypeChange() {
    var type = document.getElementById('createInvoiceType').value;
    if (type === 'special') {
        showAlert('增值税专用发票需要填写完整的开票信息。');
    }
}

function onEditInvoiceTypeChange() {
    var type = document.getElementById('editInvoiceType').value;
    if (type === 'special') {
        showAlert('增值税专用发票需要填写完整的开票信息。');
    }
}

// ========== 全局点击事件 ==========
document.addEventListener('click', function(event) {
    var receivingSearch = document.getElementById('receivingInfoSearch');
    var receivingSearchEdit = document.getElementById('receivingInfoSearchEdit');
    var receivingDropdown = document.getElementById('receivingDropdown');
    var receivingDropdownEdit = document.getElementById('receivingDropdownEdit');
    var invoiceSearch = document.getElementById('invoiceInfoSearch');
    var invoiceSearchEdit = document.getElementById('invoiceInfoSearchEdit');
    var invoiceDropdown = document.getElementById('invoiceDropdown');
    var invoiceDropdownEdit = document.getElementById('invoiceDropdownEdit');
    
    var isReceivingClick = receivingSearch && (receivingSearch.contains(event.target) || 
        (receivingSearch.parentNode && receivingSearch.parentNode.contains(event.target)));
    var isReceivingEditClick = receivingSearchEdit && (receivingSearchEdit.contains(event.target) || 
        (receivingSearchEdit.parentNode && receivingSearchEdit.parentNode.contains(event.target)));
    var isReceivingDropdownClick = receivingDropdown && receivingDropdown.contains(event.target);
    var isReceivingDropdownEditClick = receivingDropdownEdit && receivingDropdownEdit.contains(event.target);
    
    var isInvoiceClick = invoiceSearch && (invoiceSearch.contains(event.target) || 
        (invoiceSearch.parentNode && invoiceSearch.parentNode.contains(event.target)));
    var isInvoiceEditClick = invoiceSearchEdit && (invoiceSearchEdit.contains(event.target) || 
        (invoiceSearchEdit.parentNode && invoiceSearchEdit.parentNode.contains(event.target)));
    var isInvoiceDropdownClick = invoiceDropdown && invoiceDropdown.contains(event.target);
    var isInvoiceDropdownEditClick = invoiceDropdownEdit && invoiceDropdownEdit.contains(event.target);
    
    if (!isReceivingClick && !isReceivingEditClick && !isReceivingDropdownClick && !isReceivingDropdownEditClick) {
        if (receivingDropdown) receivingDropdown.style.display = 'none';
        if (receivingDropdownEdit) receivingDropdownEdit.style.display = 'none';
    }
    
    if (!isInvoiceClick && !isInvoiceEditClick && !isInvoiceDropdownClick && !isInvoiceDropdownEditClick) {
        if (invoiceDropdown) invoiceDropdown.style.display = 'none';
        if (invoiceDropdownEdit) invoiceDropdownEdit.style.display = 'none';
    }
});

// 切换课题组字段显示
function toggleGroupFields() {
    var customerType = document.getElementById('customerTypeSelect') ? document.getElementById('customerTypeSelect').value : 'terminal';
    var groupFields = document.getElementById('groupFields');
    
    if (groupFields) {
        if (customerType === 'terminal') {
            groupFields.style.display = 'block';
        } else {
            groupFields.style.display = 'none';
        }
    }
}

// 设置默认checkbox（确保只有一个默认）
function setDefaultCheckbox(checkbox) {
    var table = checkbox.closest('table');
    var checkboxes = table.querySelectorAll('.default-checkbox');
    
    checkboxes.forEach(function(cb) {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
}

// 双击切换checkbox
function toggleCheckbox(checkbox) {
    checkbox.checked = !checkbox.checked;
    setDefaultCheckbox(checkbox);
}

// 添加发票信息行
function addInvoiceRow() {
    var table = document.getElementById('invoiceInfoTable') || document.getElementById('editInvoiceInfoTable');
    if (!table) return;
    
    var tbody = table.querySelector('tbody');
    var rowCount = tbody.children.length + 1;
    
    var newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td></td>
        <td><input type="text" placeholder="发票抬头"></td>
        <td><input type="text" placeholder="税号"></td>
        <td><input type="text" placeholder="开户行"></td>
        <td><input type="text" placeholder="银行帐号"></td>
        <td><input type="text" placeholder="电话"></td>
        <td><input type="text" placeholder="地址"></td>
        <td><input type="checkbox" class="default-checkbox" onchange="setDefaultCheckbox(this)" ondblclick="toggleCheckbox(this)"></td>
        <td><button class="btn btn-sm btn-danger" onclick="removeInvoiceRow(this)">删除</button></td>
    `;
    
    tbody.appendChild(newRow);
}

// 删除发票信息行
function removeInvoiceRow(btn) {
    var row = btn.closest('tr');
    row.remove();
    updateRowNumbers();
}

// 添加收货地址行
function addAddressRow() {
    var table = document.getElementById('customerAddressTable') || document.getElementById('editCustomerAddressTable');
    if (!table) return;
    
    var tbody = table.querySelector('tbody');
    var rowCount = tbody.children.length + 1;
    
    var newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td></td>
        <td><input type="text" placeholder="收货人"></td>
        <td><input type="text" placeholder="电话"></td>
        <td><input type="text" placeholder="收货地址"></td>
        <td><input type="checkbox" class="default-checkbox" onchange="setDefaultCheckbox(this)" ondblclick="toggleCheckbox(this)"></td>
        <td><button class="btn btn-sm btn-danger" onclick="removeAddressRow(this)">删除</button></td>
    `;
    
    tbody.appendChild(newRow);
}

// 删除收货地址行
function removeAddressRow(btn) {
    var row = btn.closest('tr');
    row.remove();
    updateRowNumbers();
}

// 更新行号
function updateRowNumbers() {
    var tables = document.querySelectorAll('.sub-table');
    tables.forEach(function(table) {
        var rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(row, index) {
            row.querySelector('td:first-child').textContent = index + 1;
        });
    });
}

// 显示添加地址弹窗（智能识别）
function showAddAddressModal() {
    document.getElementById('receivingInfoModal').style.display = 'flex';
}

// 保存客户
function saveCustomer() {
    var customerType = document.getElementById('customerTypeSelect') ? document.getElementById('customerTypeSelect').value : 'terminal';
    
    // 检查必填字段
    var customerName = document.querySelector('#customer-create input[type="text"]').value.trim();
    if (!customerName) {
        alert('请填写客户名称');
        return;
    }
    
    // 如果是终端客户，检查课题组信息
    if (customerType === 'terminal') {
        var groupName = document.getElementById('groupName').value.trim();
        var groupLeader = document.getElementById('groupLeader').value.trim();
        var groupPhone = document.getElementById('groupPhone').value.trim();
        
        if (!groupName || !groupLeader || !groupPhone) {
            alert('请填写课题组信息');
            return;
        }
    }
    
    alert('客户保存成功！');
    showModule('customer-list');
}
