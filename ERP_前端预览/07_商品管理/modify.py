
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 修改新建产品页面
old_create = '''                        <div class="form-row">
                            <div class="form-item">
                                <label><span class="required">*</span> 品牌</label>
                                <div style="display:flex;gap:8px;">
                                    <select id="brandSelectCreate" style="flex:1;">
                                        <option value="">请选择品牌</option>
                                        <option>运费测试品牌A</option>
                                        <option>运费测试品牌B</option>
                                        <option>碧云天</option>
                                    </select>
                                    <button class="btn" onclick="showQuickAddBrand()" title="快速新增品牌">+</button>
                                </div>
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 分类</label>
                                <select id="categorySelectCreate">
                                    <option value="">请选择分类</option>
                                    <option>分类1</option>
                                    <option>分类2</option>
                                    <option>分类1-1</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-item">
                                <label>产品图片</label>
                                <input type="file" accept="image/*">
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 产品状态</label>
                                <select>
                                    <option value="1" selected>在售</option>
                                    <option value="0">下架</option>
                                </select>
                            </div>
                        </div>'''

new_create = '''                        <div class="form-row">
                            <div class="form-item">
                                <label><span class="required">*</span> 品牌</label>
                                <div style="display:flex;gap:8px;">
                                    <select id="brandSelectCreate" style="flex:1;">
                                        <option value="">请选择品牌</option>
                                        <option>运费测试品牌A</option>
                                        <option>运费测试品牌B</option>
                                        <option>碧云天</option>
                                    </select>
                                    <button class="btn" onclick="showQuickAddBrand()" title="快速新增品牌">+</button>
                                </div>
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 分类</label>
                                <select id="categorySelectCreate">
                                    <option value="">请选择分类</option>
                                    <option>分类1</option>
                                    <option>分类2</option>
                                    <option>分类1-1</option>
                                </select>
                            </div>
                            <div class="form-item">
                                <label>产品图片</label>
                                <input type="file" accept="image/*">
                            </div>
                        </div>'''

content = content.replace(old_create, new_create)

# 修改编辑产品页面
old_edit = '''                        <div class="form-row">
                            <div class="form-item">
                                <label><span class="required">*</span> 品牌</label>
                                <div style="display:flex;gap:8px;">
                                    <select id="brandSelectEdit" style="flex:1;">
                                        <option value="">请选择品牌</option>
                                        <option>运费测试品牌A</option>
                                        <option selected>运费测试品牌B_4357</option>
                                        <option>碧云天</option>
                                    </select>
                                    <button class="btn" onclick="showQuickAddBrand()" title="快速新增品牌">+</button>
                                </div>
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 分类</label>
                                <select id="categorySelectEdit">
                                    <option value="">请选择分类</option>
                                    <option>分类1</option>
                                    <option>分类2</option>
                                    <option selected>运费测试分类_3095</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-item">
                                <label>产品图片</label>
                                <input type="file" accept="image/*">
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 产品状态</label>
                                <select>
                                    <option value="1" selected>在售</option>
                                    <option value="0">下架</option>
                                </select>
                            </div>
                        </div>'''

new_edit = '''                        <div class="form-row">
                            <div class="form-item">
                                <label><span class="required">*</span> 品牌</label>
                                <div style="display:flex;gap:8px;">
                                    <select id="brandSelectEdit" style="flex:1;">
                                        <option value="">请选择品牌</option>
                                        <option>运费测试品牌A</option>
                                        <option selected>运费测试品牌B_4357</option>
                                        <option>碧云天</option>
                                    </select>
                                    <button class="btn" onclick="showQuickAddBrand()" title="快速新增品牌">+</button>
                                </div>
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 分类</label>
                                <select id="categorySelectEdit">
                                    <option value="">请选择分类</option>
                                    <option>分类1</option>
                                    <option>分类2</option>
                                    <option selected>运费测试分类_3095</option>
                                </select>
                            </div>
                            <div class="form-item">
                                <label>产品图片</label>
                                <input type="file" accept="image/*">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-item">
                                <label><span class="required">*</span> 产品状态</label>
                                <select>
                                    <option value="1" selected>在售</option>
                                    <option value="0">下架</option>
                                </select>
                            </div>
                        </div>'''

content = content.replace(old_edit, new_edit)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('修改完成！')
