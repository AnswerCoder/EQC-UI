import request from '@/utils/request'

// 查询设备列表
export function listEquipments(query) {
  return request({
    url: '/equipments/list',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getEquipments(equipmentId) {
  return request({
    url: '/equipments/' + equipmentId,
    method: 'get'
  })
}

// 新增设备
export function addEquipments(data) {
  return request({
    url: '/equipments',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateEquipments(data) {
  return request({
    url: '/equipments',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delEquipments(equipmentId) {
  return request({
    url: '/equipments/' + equipmentId,
    method: 'delete'
  })
}
