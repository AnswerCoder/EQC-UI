<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="设备" prop="equipmentId">
        <el-select v-model="queryParams.equipmentId" @keyup.enter="handleQuery">
          <el-option
            v-for="item in equipmentOptions"
            :key="item.equipmentId"
            :label="item.equipmentName"
            :value="item.equipmentId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="耗材名称" prop="consumableName">
        <el-input
          v-model="queryParams.consumableName"
          placeholder="请输入耗材名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="耗材编号" prop="consumableNo">
        <el-input
          v-model="queryParams.consumableNo"
          placeholder="请输入耗材编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="开始使用时间" prop="activationTime">
        <el-date-picker clearable
          v-model="queryParams.activationTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始使用时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="使用期效" prop="validity">
        <el-input
          v-model="queryParams.validity"
          placeholder="请输入使用期效"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="使用期效单位" prop="validityUint">
        <el-input
          v-model="queryParams.validityUint"
          placeholder="请输入使用期效单位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="负责人" prop="chargeUser">
        <el-select
          v-model="queryParams.chargeUser"
          placeholder="请选择负责人"
          @keyup.enter="handleQuery"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
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
          v-hasPermi="['equipments:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['equipments:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipments:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['equipments:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="consumablesList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" align="center" />
      <!-- <el-table-column
        label="主键"
        align="center"
        prop="consumableId"
        v-if="true"
      /> -->
      <el-table-column label="设备" align="center" prop="equipmentId" width="150">
        <template #default="scope">
          <span>{{equipmentOptions.find(option=>option.equipmentId===scope.row.equipmentId)?.equipmentName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗材名称" align="center" prop="consumableName" width="150"/>
      <el-table-column label="耗材编号" align="center" prop="consumableNo"  width="200"/>
      <el-table-column label="开始使用时间" align="center" prop="activationTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.activationTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用期效" align="center" prop="validity" width="100">
        <template #default="scope">
          <span>{{ scope.row.validity + sys_time_unit.find(item=>item.value===scope.row.validityUint)?.label}}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center" prop="dueTime" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="chargeUser" width="100">
        <template #default="scope">
          <span>{{ userOptions.find(option=>option.userId===scope.row.chargeUser)?.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <dict-tag :options="consumable_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipments:edit']"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipments:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备耗材对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form
        ref="consumablesRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="设备" prop="equipmentId">
          <el-select v-model="form.equipmentId" placeholder="请选择设备" disabled>
            <el-option
              v-for="item in equipmentOptions"
              :key="item.equipmentId"
              :label="item.equipmentName"
              :value="item.equipmentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="耗材名称" prop="consumableName">
          <el-input
            v-model="form.consumableName"
            placeholder="请输入耗材名称"
          />
        </el-form-item>
        <el-form-item label="耗材编号" prop="consumableNo">
          <el-input v-model="form.consumableNo" placeholder="请输入耗材编号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="dict in consumable_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始使用时间" prop="activationTime">
          <el-date-picker
            clearable
            v-model="form.activationTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择开始使用时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用期效" prop="validity">
          <el-col :span="8">
            <el-input
              v-model="form.validity"
              type="number"
              placeholder="请输入使用期效"
            />
          </el-col>
          <el-col :span="4" style="margin-left: 5px">
            <el-select v-model="form.validityUint">
              <el-option
                v-for="dict in sys_time_unit"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="负责人" prop="chargeUser">
          <el-select v-model="form.chargeUser" placeholder="请选择负责人">
            <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm"
            >确 定</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Consumables">
import {
  listConsumables,
  getConsumables,
  delConsumables,
  addConsumables,
  updateConsumables,
} from "@/api/equipments/consumables";
import { optionSelect as getEquipmentOptionSelect } from "@/api/equipments/equipments";
import { userOptionsSelect as getUserOptionSelect } from "@/api/system/user";
import useUserStore from '@/store/modules/user';
import { ref } from "vue";
const { proxy } = getCurrentInstance();

const consumablesList = ref([]);
const open = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const equipmentOptions = ref([]);
const userOptions = ref([]);
const route = useRoute();
const { sys_time_unit, consumable_status } = proxy.useDict(
  "sys_time_unit",
  "consumable_status"
);
const defaultEquipment = ref("");
const defaultValidityUint = ref("M");
const defaultStatus = ref("0");
const defaultChargeUser = useUserStore().id;

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    equipmentId: undefined,
    consumableName: undefined,
    consumableNo: undefined,
    activationTime: undefined,
    validity: undefined,
    validityUint: undefined,
    chargeUser: undefined,
    status: undefined,
  },
  rules: {
    consumableId: [
      { required: true, message: "主键不能为空", trigger: "blur" },
    ],
    equipmentId: [{ required: true, message: "设备不能为空", trigger: "blur" }],
    consumableName: [
      { required: true, message: "耗材名称不能为空", trigger: "blur" },
    ],
    consumableNo: [
      { required: false, message: "耗材编号不能为空", trigger: "blur" },
    ],
    activationTime: [
      { required: false, message: "开始使用时间不能为空", trigger: "blur" },
    ],
    validity: [
      { required: false, message: "使用期效不能为空", trigger: "blur" },
    ],
    validityUint: [
      { required: false, message: "使用期效单位不能为空", trigger: "blur" },
    ],
    chargeUser: [
      { required: false, message: "负责人不能为空", trigger: "blur" },
    ],
    status: [{ required: true, message: "状态不能为空", trigger: "change" }],
    remark: [{ required: false, message: "备注不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

function getEquipment(equipmentId) {
  queryParams.value.equipmentId = equipmentId;
  defaultEquipment.value = equipmentId;
  getList();
}

/** 查询设备列表 */
function getEquipmentList() {
  getEquipmentOptionSelect().then((response) => {
    equipmentOptions.value = response.data;
  });
}

/** 查询用户列表 */
function getUserList() {
  getUserOptionSelect().then((response) => {
    userOptions.value = response.data;
  });
}

/** 查询设备耗材列表 */
function getList() {
  loading.value = true;
  listConsumables(queryParams.value).then((response) => {
    consumablesList.value = response.rows;
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
    consumableId: null,
    equipmentId: null,
    consumableName: null,
    consumableNo: null,
    activationTime: null,
    validity: null,
    validityUint: null,
    chargeUser: null,
    status: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
  };
  proxy.resetForm("consumablesRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.equipmentId = defaultEquipment;
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.consumableId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加设备耗材";
  form.value.equipmentId = queryParams.value.equipmentId;
  form.value.status = defaultStatus;
  form.value.validityUint = defaultValidityUint;
  form.value.chargeUser = defaultChargeUser;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  loading.value = true;
  reset();
  const _consumableId = row.consumableId || ids.value;
  getConsumables(_consumableId).then((response) => {
    loading.value = false;
    form.value = response.data;
    open.value = true;
    title.value = "修改设备耗材";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["consumablesRef"].validate((valid) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.consumableId != null) {
        updateConsumables(form.value)
          .then((response) => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      } else {
        addConsumables(form.value)
          .then((response) => {
            proxy.$modal.msgSuccess("新增成功");
            open.value = false;
            getList();
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _consumableIds = row.consumableId || ids.value;
  proxy.$modal
    .confirm('是否确认删除设备耗材编号为"' + _consumableIds + '"的数据项？')
    .then(function () {
      loading.value = true;
      return delConsumables(_consumableIds);
    })
    .then(() => {
      loading.value = true;
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "equipment/consumables/export",
    {
      ...queryParams.value,
    },
    `consumables_${new Date().getTime()}.xlsx`
  );
}

getEquipment(route.params && route.params.equipmentId);
getEquipmentList();
getUserList();
</script>
