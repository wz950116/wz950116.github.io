/*
 * @Description: 
 * @Author: wangzhen
 * @Date: 2021-10-18 10:18:33
 * @LastEditTime: 2022-02-09 15:58:12
 * @LastEditors: wangzhen
 */
import request from '@/utils/request.js'

export function _printPreview(id) {
  return request({
    url: `/enforce/printing/print/${id}`,
    method: 'get',
    responseType: 'blob',
    timeout: 0
  })
}