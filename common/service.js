
const baseUrl="https://2846579.club:8443/hcx/f/api/";
const webUrl="https://2846579.club:8443/hcx/";
const xxlUrl="https://2846579.club:8080/xxl-job-admin/hcx/api/";

// const baseUrl='https://127.0.0.1/hcx/f/api/';
// const webUrl="https://127.0.0.1/hcx/";
// const xxlUrl="https://127.0.0.1:8080/xxl-job-admin/hcx/api/";

// const baseUrl='https://127.0.0.1:8443/hcx/f/api/';
// const webUrl="https://127.0.0.1:8443/hcx/";
// const xxlUrl="https://127.0.0.1:8080/xxl-job-admin/hcx/api/";
//全局引用
import md5 from '@/common/md5.js';
//通用秘钥
const key = '幻彩希';
const encryp = function(data, timestamp) {
	let temp;
	temp = md5(data + timestamp).toLowerCase() + key;
	let sign = md5(temp).toLowerCase();
	// console.log(sign);
	return sign;
}

export default {
	baseUrl,
	webUrl,
	xxlUrl,
	//*************方法************//
	encryp
	
}