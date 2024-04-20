<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
                </template>
            </TableCustom>

        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData" :changeSelect="changeSelect"/>
        </el-dialog>
        <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
            <TableDetail :data="viewData"></TableDetail>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { User } from '@/types/user';
import { fetchUserData, fetchUserDataRequest, fetchRoleListRequest, fetchBuildingListRequest, fetchRoomListRequest } from '@/api';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = reactive({
    name: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '用户名：', prop: 'name' }
])
const handleSearch = () => {
    changePage(1);
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'name', label: '用户名' },
    { prop: 'phone', label: '手机号' },
    { prop: 'role', label: '角色', formatter: roleFormatter},
    { prop: 'displayRoomInfo', label: '宿舍' },
    { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
})

function roleFormatter (row, column, cellValue, index) {
    // console.log(row)
    return row?.displayName
}

const tableData = ref<User[]>([]);
const getData = async () => {
    // const res = await fetchUserData()
    // tableData.value = res.data.list;
    // page.total = res.data.pageTotal;

    fetchUserDataRequest().then(function (result) { 
        console.log(result);
        // for (let i = 0; i < result.data.userDataList.length; i++) {
        //     result.data.userDataList[i].roleIdSelected = 0
        // }
        tableData.value = result.data.userDataList
        page.total = result.data.userDataList.length
    }).catch((err) => {
        console.log(err)
    })
};
getData();

const changePage = (val: number) => {
    page.index = val;
    getData();
};

var roleList = []
var buildingList = []
var roomList = []
// 新增/编辑弹窗相关
let options = ref<FormOption>({
    labelWidth: '100px',
    span: 12,
    list: [
        { type: 'input', label: '用户名', prop: 'name', required: true },
        { type: 'input', label: '手机号', prop: 'phone', required: true },
        // { type: 'input', label: '密码', prop: 'password', required: true },
        // { type: 'select', label: '权限修改', prop: 'roleIdSelected', opts: roleList, required: true },
        // { type: 'select', label: '分配宿舍', prop: 'buildingIdSelected', opts: buildingList, required: true },
        { type: 'select', label: '分配宿舍', prop: 'roomIdSelected', opts: roomList, required: true },
    ]
})

const getRoleList = async () => {
    const roleResponse = await fetchRoleListRequest()
    console.log(roleResponse)
    for (let i = 0; i < roleResponse.data.roleList.length; i++) {
        roleResponse.data.roleList[i].label = roleResponse.data.roleList[i].displayName;
        roleResponse.data.roleList[i].value = roleResponse.data.roleList[i].id;
    }
    roleList = roleResponse.data.roleList
    options.value.list.push({ type: 'select', label: '权限修改', prop: 'roleIdSelected', opts: roleList, required: true })
    roleList = roleResponse.data.roleList
}

getRoleList()

const getBuildingList = async () => {
    const buildingResponse = await fetchBuildingListRequest()
    console.log(buildingResponse)
    for (let i = 0; i < buildingResponse.data.buildingDataList.length; i++) {
        buildingResponse.data.buildingDataList[i].label = buildingResponse.data.buildingDataList[i].name;
        buildingResponse.data.buildingDataList[i].value = buildingResponse.data.buildingDataList[i].id;
    }
    buildingList = buildingResponse.data.buildingDataList
    options.value.list.push({ type: 'select', label: '修改楼号', prop: 'buildingIdSelected', opts: buildingList, required: true })
    buildingList = buildingResponse.data.buildingDataList
}

getBuildingList()


const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = async (row: User) => {
    console.log(row)
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
};
const updateData = (value) => {
    console.log(value)
    closeDialog();
    getData();
};

const changeSelect = (value, prop) => {
    console.log(prop)
    console.log(value)
}

const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
    row: {},
    list: []
});
const handleView = (row: User) => {
    viewData.value.row = { ...row }
    viewData.value.list = [
        {
            prop: 'id',
            label: '用户ID',
        },
        {
            prop: 'name',
            label: '用户名',
        },
        // {
        //     prop: 'password',
        //     label: '密码',
        // },
        {
            prop: 'displayRoomInfo',
            label: '宿舍',
        },
        {
            prop: 'phone',
            label: '电话',
        },
        {
            prop: 'role',
            label: '角色',
        },
        {
            prop: 'createTime',
            label: '注册日期',
        },
    ]
    visible1.value = true;
};

// 删除相关
const handleDelete = (row: User) => {
    ElMessage.success('删除成功');
}
</script>

<style scoped></style>