import axios from 'axios'
import { Toast } from 'antd-mobile'

// block request
axios.interceptors.request.use(function(config){
	Toast.loading('Loading',0)
	return config
})

// 拦截reponse

axios.interceptors.response.use(function(config){
	Toast.hide()
	return config
})