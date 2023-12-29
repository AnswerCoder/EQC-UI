import request from '@/utils/request'

// 查询设备耗材列表
export function listConsumables(query) {
  return request({
    url: '/system/consumables/list',
    method: 'get',
    params: query
  })
}

// 查询设备耗材详细
export function getConsumables(consumableId) {
  return request({
    url: '/system/consumables/' + consumableId,
    method: 'get'
  })
}

// 新增设备耗材
export function addConsumables(data) {
  return request({
    url: '/system/consumables',
    method: 'post',
    data: data
  })
}

// 修改设备耗材
export function updateConsumables(data) {
  return request({
    url: '/system/consumables',
    method: 'put',
    data: data
  })
}

// 删除设备耗材
export function delConsumables(consumableId) {
  return request({
    url: '/system/consumables/' + consumableId,
    method: 'delete'
  })
}
