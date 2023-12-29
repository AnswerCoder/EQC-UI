<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="序列号" prop="equipmentNo">
        <el-input
          v-model="queryParams.equipmentNo"
          placeholder="请输入设备序列号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="供应商" prop="equipmentSupplier">
        <el-input
          v-model="queryParams.equipmentSupplier"
          placeholder="请输入设备供应商"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="所属科室" prop="department">
        <el-tree-select
          v-model="queryParams.department"
          :data="deptOptions"
          :props="{ value: 'id', label: 'label', children: 'children' }"
          value-key="id"
          placeholder="请选择所属科室"
          check-strictly
        />
      </el-form-item>
      <!-- <el-form-item label="所在位置" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="请输入所在位置"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:equipments:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:equipments:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:equipments:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:equipments:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="equipmentsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="equipmentId" v-if="true"/> -->
      <el-table-column label="设备名称" align="center" prop="equipmentName" >
          <template #default="scope">
            <router-link :to="'/equipments/consumables/index/' + scope.row.equipmentId" class="link-type">
              <span>{{ scope.row.equipmentName }}</span>
            </router-link>
          </template>
      </el-table-column>
      <el-table-column label="序列号" align="center" prop="equipmentNo" />
      <el-table-column label="供应商" align="center" prop="equipmentSupplier" />
      <el-table-column label="所属科室" align="center" prop="department" />
      <el-table-column label="所在位置" align="center" prop="location" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['equipments:edit']">修改</el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['equipments:remove']">删除</el-button>
          </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="equipmentsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="form.equipmentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="序列号" prop="equipmentNo">
          <el-input v-model="form.equipmentNo" placeholder="请输入设备序列号" />
        </el-form-item>
        <el-form-item label="供应商" prop="equipmentSupplier">
          <el-input v-model="form.equipmentSupplier" placeholder="请输入设备供应商" />
        </el-form-item>
        <el-form-item label="所属科室" prop="department">
          <el-input v-model="form.department" placeholder="请输入所属科室" />
        </el-form-item>
        <el-form-item label="所在位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入所在位置" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Equipments">
import { listEquipments, getEquipments, delEquipments, addEquipments, updateEquipments } from "@/api/equipments/equipments";
import {deptTreeSelect} from "@/api/system/user"
const { proxy } = getCurrentInstance();

const equipmentsList = ref([]);
const open = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref([]);

/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response.data;
  });
};

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    equipmentName: undefined,
    equipmentNo: undefined,
    equipmentSupplier: undefined,
    department: undefined,
    location: undefined,
  },
  rules: {
    equipmentId: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    equipmentName: [
      { required: true, message: "设备名称不能为空", trigger: "blur" }
    ],
    equipmentNo: [
      { required: false, message: "设备序列号不能为空", trigger: "blur" }
    ],
    equipmentSupplier: [
      { required: false, message: "设备供应商不能为空", trigger: "blur" }
    ],
    department: [
      { required: false, message: "所属科室不能为空", trigger: "blur" }
    ],
    location: [
      { required: false, message: "所在位置不能为空", trigger: "blur" }
    ],
    remark: [
      { required: false, message: "备注不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备列表 */
function getList() {
  loading.value = true;
  listEquipments(queryParams.value).then(response => {
    equipmentsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    equipmentId: null,
    equipmentName: null,
    equipmentNo: null,
    equipmentSupplier: null,
    department: null,
    location: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("equipmentsRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.equipmentId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加设备";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  loading.value = true
  reset();
  const _equipmentId = row.equipmentId || ids.value
  getEquipments(_equipmentId).then(response => {
    loading.value = false;
    form.value = response.data;
    open.value = true;
    title.value = "修改设备";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["equipmentsRef"].validate(valid => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.equipmentId != null) {
        updateEquipments(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        }).finally(() => {
          buttonLoading.value = false;
        });
      } else {
        addEquipments(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        }).finally(() => {
          buttonLoading.value = false;
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _equipmentIds = row.equipmentId || ids.value;
  proxy.$modal.confirm('是否确认删除设备编号为"' + _equipmentIds + '"的数据项？').then(function() {
    loading.value = true;
    return delEquipments(_equipmentIds);
  }).then(() => {
    loading.value = true;
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  }).finally(() => {
    loading.value = false;
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/equipments/export', {
    ...queryParams.value
  }, `equipments_${new Date().getTime()}.xlsx`)
}
getDeptTree();
getList();
</script>
