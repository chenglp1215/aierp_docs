
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修复重复复制按钮问题：修改initProductListUpdates函数，添加已存在检查
old_js = '''        // 更新产品列表页面
        function initProductListUpdates() {
            // 找到产品列表中的搜索栏
            const productSection = document.getElementById('product-list');
            if (!productSection) return;
            
            // 更新操作列宽度
            const headers = productSection.querySelectorAll('th');
            if (headers.length >= 8) {
                headers[7].style.width = '250px';
            }
            
            // 找到搜索栏中的分类选择并替换
            const searchItems = productSection.querySelectorAll('.search-item');
            searchItems.forEach(item =&gt; {
                const label = item.querySelector('label');
                if (label &amp;&amp; label.textContent === '分类') {
                    label.textContent = '产品状态';
                    const select = item.querySelector('select');
                    if (select) {
                        select.innerHTML = `
                            &lt;option value="1" selected&gt;在售&lt;/option&gt;
                            &lt;option value="2"&gt;作废&lt;/option&gt;
                            &lt;option value=""&gt;全部&lt;/option&gt;
                        `;
                    }
                }
            });
            
            // 为每个产品添加复制按钮
            const productRows = productSection.querySelectorAll('tbody &gt; tr');
            let productIndex = 1;
            productRows.forEach((row) =&gt; {
                // 跳过展开的规格行
                if (row.id &amp;&amp; row.id.startsWith('expand-')) return;
                if (productIndex &gt; 3) return;
                
                const actions = row.querySelector('.actions');
                if (actions) {
                    const editLink = actions.querySelector('a');
                    if (editLink) {
                        const copyLink = document.createElement('a');
                        copyLink.className = 'action-link';
                        copyLink.id = `btn-copy-prod${productIndex}`;
                        copyLink.setAttribute('onclick', `copyProduct('prod${productIndex}')`);
                        copyLink.textContent = '复制';
                        editLink.parentNode.insertBefore(copyLink, editLink.nextSibling);
                    }
                }
                productIndex++;
            });
        }'''

new_js = '''        // 更新产品列表页面
        function initProductListUpdates() {
            // 找到产品列表中的搜索栏
            const productSection = document.getElementById('product-list');
            if (!productSection) return;
            
            // 更新操作列宽度
            const headers = productSection.querySelectorAll('th');
            if (headers.length >= 8) {
                headers[7].style.width = '250px';
            }
            
            // 找到搜索栏中的分类选择并替换
            const searchItems = productSection.querySelectorAll('.search-item');
            searchItems.forEach(item =&gt; {
                const label = item.querySelector('label');
                if (label &amp;&amp; label.textContent === '分类') {
                    label.textContent = '产品状态';
                    const select = item.querySelector('select');
                    if (select) {
                        select.innerHTML = `
                            &lt;option value="1" selected&gt;在售&lt;/option&gt;
                            &lt;option value="2"&gt;作废&lt;/option&gt;
                            &lt;option value=""&gt;全部&lt;/option&gt;
                        `;
                    }
                }
            });
            
            // 为每个产品添加复制按钮（避免重复添加）
            const productRows = productSection.querySelectorAll('tbody &gt; tr');
            let productIndex = 1;
            productRows.forEach((row) =&gt; {
                // 跳过展开的规格行
                if (row.id &amp;&amp; row.id.startsWith('expand-')) return;
                if (productIndex &gt; 3) return;
                
                const actions = row.querySelector('.actions');
                if (actions) {
                    // 检查是否已存在复制按钮
                    const existingCopyBtn = actions.querySelector(`#btn-copy-prod${productIndex}`);
                    if (!existingCopyBtn) {
                        const editLink = actions.querySelector('a');
                        if (editLink) {
                            const copyLink = document.createElement('a');
                            copyLink.className = 'action-link';
                            copyLink.id = `btn-copy-prod${productIndex}`;
                            copyLink.setAttribute('onclick', `copyProduct('prod${productIndex}')`);
                            copyLink.textContent = '复制';
                            editLink.parentNode.insertBefore(copyLink, editLink.nextSibling);
                        }
                    }
                }
                productIndex++;
            });
        }'''

content = content.replace(old_js, new_js)

# 2. 修改主列表：将"价格"改成"目录价格"
old_table_head1 = '''                                &lt;tr&gt;
                                    &lt;th style="width:60px"&gt;序号&lt;/th&gt;
                                    &lt;th style="width:150px"&gt;产品编号&lt;/th&gt;
                                    &lt;th style="width:150px"&gt;产品名称&lt;/th&gt;
                                    &lt;th style="width:100px"&gt;品牌&lt;/th&gt;
                                    &lt;th style="width:100px"&gt;分类&lt;/th&gt;
                                    &lt;th style="width:60px"&gt;产品状态&lt;/th&gt;
                                    &lt;th style="width:80px"&gt;价格&lt;/th&gt;
                                    &lt;th style="width:150px"&gt;操作&lt;/th&gt;
                                &lt;/tr&gt;'''

new_table_head1 = '''                                &lt;tr&gt;
                                    &lt;th style="width:60px"&gt;序号&lt;/th&gt;
                                    &lt;th style="width:150px"&gt;产品编号&lt;/th&gt;
                                    &lt;th style="width:150px"&gt;产品名称&lt;/th&gt;
                                    &lt;th style="width:100px"&gt;品牌&lt;/th&gt;
                                    &lt;th style="width:100px"&gt;分类&lt;/th&gt;
                                    &lt;th style="width:60px"&gt;产品状态&lt;/th&gt;
                                    &lt;th style="width:100px"&gt;目录价格&lt;/th&gt;
                                    &lt;th style="width:150px"&gt;操作&lt;/th&gt;
                                &lt;/tr&gt;'''

content = content.replace(old_table_head1, new_table_head1)

# 3. 修改规格列表：在目录价格后面增加库存字段
old_spec_table1 = '''                                                &lt;thead&gt;
                                                    &lt;tr&gt;
                                                        &lt;th style="width:120px"&gt;规格编号&lt;/th&gt;
                                                        &lt;th style="width:150px"&gt;包装&lt;/th&gt;
                                                        &lt;th style="width:80px"&gt;包装单位&lt;/th&gt;
                                                        &lt;th style="width:100px"&gt;目录价格&lt;/th&gt;
                                                        &lt;th style="width:60px"&gt;操作&lt;/th&gt;
                                                    &lt;/tr&gt;
                                                &lt;/thead&gt;
                                                &lt;tbody&gt;
                                                    &lt;tr id="spec-prod1-1"&gt;
                                                        &lt;td&gt;PROD202605251271852-标准规格&lt;/td&gt;
                                                        &lt;td&gt;标准规格&lt;/td&gt;
                                                        &lt;td&gt;瓶&lt;/td&gt;
                                                        &lt;td class="amount"&gt;¥200.00&lt;/td&gt;
                                                        &lt;td&gt;
                                                            &lt;a class="action-link danger" onclick="confirmDeleteSpec('规格', 'spec-prod1-1')"&gt;删除&lt;/a&gt;
                                                        &lt;/td&gt;
                                                    &lt;/tr&gt;
                                                &lt;/tbody&gt;'''

new_spec_table1 = '''                                                &lt;thead&gt;
                                                    &lt;tr&gt;
                                                        &lt;th style="width:120px"&gt;规格编号&lt;/th&gt;
                                                        &lt;th style="width:150px"&gt;包装&lt;/th&gt;
                                                        &lt;th style="width:80px"&gt;包装单位&lt;/th&gt;
                                                        &lt;th style="width:100px"&gt;目录价格&lt;/th&gt;
                                                        &lt;th style="width:120px"&gt;库存&lt;/th&gt;
                                                        &lt;th style="width:60px"&gt;操作&lt;/th&gt;
                                                    &lt;/tr&gt;
                                                &lt;/thead&gt;
                                                &lt;tbody&gt;
                                                    &lt;tr id="spec-prod1-1"&gt;
                                                        &lt;td&gt;PROD202605251271852-标准规格&lt;/td&gt;
                                                        &lt;td&gt;标准规格&lt;/td&gt;
                                                        &lt;td&gt;瓶&lt;/td&gt;
                                                        &lt;td class="amount"&gt;¥200.00&lt;/td&gt;
                                                        &lt;td&gt;
                                                            &lt;div style="font-size:12px;line-height:1.4;"&gt;
                                                                库存a：5&lt;br/&gt;
                                                                库存b：2
                                                            &lt;/div&gt;
                                                        &lt;/td&gt;
                                                        &lt;td&gt;
                                                            &lt;a class="action-link danger" onclick="confirmDeleteSpec('规格', 'spec-prod1-1')"&gt;删除&lt;/a&gt;
                                                        &lt;/td&gt;
                                                    &lt;/tr&gt;
                                                &lt;/tbody&gt;'''

content = content.replace(old_spec_table1, new_spec_table1)

# 4. 修改第二个产品的规格列表
old_spec_table2 = '''                                                &lt;thead&gt;
                                                    &lt;tr&gt;
                                                        &lt;th style="width:120px"&gt;规格编号&lt;/th&gt;
                                                        &lt;th style="width:150px"&gt;包装&lt;/th&gt;
                                                        &lt;th style="width:80px"&gt;包装单位&lt;/th&gt;
                                                        &lt;th style="width:100px"&gt;目录价格&lt;/th&gt;
                                                        &lt;th style="width:60px"&gt;操作&lt;/th&gt;
                                                    &lt;/tr&gt;
                                                &lt;/thead&gt;
                                                &lt;tbody&gt;
                                                    &lt;tr id="spec-prod2-1"&gt;
                                                        &lt;td&gt;PROD202605251608025-标准规格&lt;/td&gt;
                                                        &lt;td&gt;标准规格&lt;/td&gt;
                                                        &lt;td&gt;盒&lt;/td&gt;
                                                        &lt;td class="amount"&gt;¥100.00&lt;/td&gt;
                                                        &lt;td&gt;
                                                            &lt;a class="action-link danger" onclick="confirmDeleteSpec('规格', 'spec-prod2-1')"&gt;删除&lt;/a&gt;
                                                        &lt;/td&gt;
                                                    &lt;/tr&gt;
                                                &lt;/tbody&gt;'''

new_spec_table2 = '''                                                &lt;thead&gt;
                                                    &lt;tr&gt;
                                                        &lt;th style="width:120px"&gt;规格编号&lt;/th&gt;
                                                        &lt;th style="width:150px"&gt;包装&lt;/th&gt;
                                                        &lt;th style="width:80px"&gt;包装单位&lt;/th&gt;
                                                        &lt;th style="width:100px"&gt;目录价格&lt;/th&gt;
                                                        &lt;th style="width:120px"&gt;库存&lt;/th&gt;
                                                        &lt;th style="width:60px"&gt;操作&lt;/th&gt;
                                                    &lt;/tr&gt;
                                                &lt;/thead&gt;
                                                &lt;tbody&gt;
                                                    &lt;tr id="spec-prod2-1"&gt;
                                                        &lt;td&gt;PROD202605251608025-标准规格&lt;/td&gt;
                                                        &lt;td&gt;标准规格&lt;/td&gt;
                                                        &lt;td&gt;盒&lt;/td&gt;
                                                        &lt;td class="amount"&gt;¥100.00&lt;/td&gt;
                                                        &lt;td&gt;
                                                            &lt;div style="font-size:12px;line-height:1.4;"&gt;
                                                                库存a：10&lt;br/&gt;
                                                                库存b：5
                                                            &lt;/div&gt;
                                                        &lt;/td&gt;
                                                        &lt;td&gt;
                                                            &lt;a class="action-link danger" onclick="confirmDeleteSpec('规格', 'spec-prod2-1')"&gt;删除&lt;/a&gt;
                                                        &lt;/td&gt;
                                                    &lt;/tr&gt;
                                                &lt;/tbody&gt;'''

content = content.replace(old_spec_table2, new_spec_table2)

# 5. 修改第三个产品的规格列表
old_spec_table3 = '''                                                &lt;thead&gt;
                                                    &lt;tr&gt;
                                                        &lt;th style="width:120px"&gt;规格编号&lt;/th&gt;
                                                        &lt;th style="width:150px"&gt;包装&lt;/th&gt;
                                                        &lt;th style="width:80px"&gt;包装单位&lt;/th&gt;
                                                        &lt;th style="width:100px"&gt;目录价格&lt;/th&gt;
                                                        &lt;th style="width:60px"&gt;操作&lt;/th&gt;
                                                    &lt;/tr&gt;
                                                &lt;/thead&gt;
                                                &lt;tbody&gt;
                                                    &lt;tr id="spec-prod3-1"&gt;
                                                        &lt;td&gt;PROD202605241292596-500g规格&lt;/td&gt;
                                                        &lt;td&gt;500g规格&lt;/td&gt;
                                                        &lt;td&gt;袋&lt;/td&gt;
                                                        &lt;td class="amount"&gt;¥88.00&lt;/td&gt;
                                                        &lt;td&gt;
                                                            &lt;a class="action-link danger" onclick="confirmDeleteSpec('规格', 'spec-prod3-1')"&gt;删除&lt;/a&gt;
                                                        &lt;/td&gt;
                                                    &lt;/tr&gt;
                                                &lt;/tbody&gt;'''

new_spec_table3 = '''                                                &lt;thead&gt;
                                                    &lt;tr&gt;
                                                        &lt;th style="width:120px"&gt;规格编号&lt;/th&gt;
                                                        &lt;th style="width:150px"&gt;包装&lt;/th&gt;
                                                        &lt;th style="width:80px"&gt;包装单位&lt;/th&gt;
                                                        &lt;th style="width:100px"&gt;目录价格&lt;/th&gt;
                                                        &lt;th style="width:120px"&gt;库存&lt;/th&gt;
                                                        &lt;th style="width:60px"&gt;操作&lt;/th&gt;
                                                    &lt;/tr&gt;
                                                &lt;/thead&gt;
                                                &lt;tbody&gt;
                                                    &lt;tr id="spec-prod3-1"&gt;
                                                        &lt;td&gt;PROD202605241292596-500g规格&lt;/td&gt;
                                                        &lt;td&gt;500g规格&lt;/td&gt;
                                                        &lt;td&gt;袋&lt;/td&gt;
                                                        &lt;td class="amount"&gt;¥88.00&lt;/td&gt;
                                                        &lt;td&gt;
                                                            &lt;div style="font-size:12px;line-height:1.4;"&gt;
                                                                库存a：3&lt;br/&gt;
                                                                库存b：1
                                                            &lt;/div&gt;
                                                        &lt;/td&gt;
                                                        &lt;td&gt;
                                                            &lt;a class="action-link danger" onclick="confirmDeleteSpec('规格', 'spec-prod3-1')"&gt;删除&lt;/a&gt;
                                                        &lt;/td&gt;
                                                    &lt;/tr&gt;
                                                &lt;/tbody&gt;'''

content = content.replace(old_spec_table3, new_spec_table3)

# 6. 修改展开区域的colspan（因为增加了一列，从11改成12）
old_colspan1 = '''                                &lt;tr id="expand-prod1"&gt;
                                    &lt;td colspan="11"&gt;'''

new_colspan1 = '''                                &lt;tr id="expand-prod1"&gt;
                                    &lt;td colspan="12"&gt;'''

content = content.replace(old_colspan1, new_colspan1)

old_colspan2 = '''                                &lt;tr id="expand-prod2"&gt;
                                    &lt;td colspan="11"&gt;'''

new_colspan2 = '''                                &lt;tr id="expand-prod2"&gt;
                                    &lt;td colspan="12"&gt;'''

content = content.replace(old_colspan2, new_colspan2)

old_colspan3 = '''                                &lt;tr id="expand-prod3"&gt;
                                    &lt;td colspan="11"&gt;'''

new_colspan3 = '''                                &lt;tr id="expand-prod3"&gt;
                                    &lt;td colspan="12"&gt;'''

content = content.replace(old_colspan3, new_colspan3)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('修改完成！已修复以下问题：')
print('1. 修复了重复复制按钮问题')
print('2. 将产品列表"价格"改成"目录价格"')
print('3. 在规格列表增加"库存"列，格式：库存a：5，库存b：2')
