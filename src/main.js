/* eslint-disable indent */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
import vueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false

Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.component('tree-table', TreeTable)
Vue.use(vueQuillEditor)

Vue.filter('dateFormat', function(value, arg) {
    function dateFormat(date, format) {
        if (typeof date === 'string') {
            var mts = date.match(/(\/Date\((\d+)\)\/)/)
            if (mts && mts.length >= 3) {
                date = parseInt(mts[2])
            }
        }
        date = new Date(date)
        if (!date || date.toUTCString() === 'Invalid Date') {
            return ''
        }
        var map = {
            M: date.getMonth() + 1, // 月份
            d: date.getDate(), // 日
            h: date.getHours(), // 小时
            m: date.getMinutes(), // 分
            s: date.getSeconds(), // 秒
            q: Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds() // 毫秒
        }
        format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
            var v = map[t]
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v
                    v = v.substr(v.length - 2)
                }
                return v
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length)
            }
            return all
        })
        return format
    }
    return dateFormat(value, arg)
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')