import request from '../utils/request';
import axios from 'axios';

export const fetchData = query => {
    return request('./table.json', {
        method: 'get',
        params: query
    });
};

/**
 * 登录
 */
export const adminLogin = (data) => {
    return request('/admin/signIn', {
        method: 'post',
        data
    });
};

// 添加科室
export const section = (data) => {
    return request('/section', {
        method: 'post',
        data
    });
};

// 添加职称
export const addTechnical = (data) => {
    return request('/technical', {
        method: 'post',
        data
    });
};
// 删除职称
export const deleteTechnical = (data) => {
    return request('/technical', {
        method: 'delete',
        data
    });
};

// 修改职称
export const updateTechnical = (data) => {
    return request('/technical', {
        method: 'put',
        data
    });
};

// 查询职称
export const getTechnical = (data) => {
    return request('/technical', {
        method: 'get',
        data
    });
};


/**
 * 获取新闻列表
 */
export const getNews = (data) => {
    return request('/news/query', {
        method: 'post',
        data
    });
};

/**
 * 删除新闻
 */
export const deleteNews = (data) => {
    return request('/news/update', {
        method: 'post',
        data
    });
};

/**
 * 新增新闻
 */
export const addNewsApi = (data) => {
    return request('/news/save', {
        method: 'post',
        data
    });
};

/**
 * 修改新闻
*/
export const updateNews = (data) => {
    return request('/news/update', {
        method: 'post',
        data
    });
};

// 添加科室
export const addSection = (data) => {
    return request('/section', {
        method: 'post',
        data
    });
};
// 删除科室
export const deleteSection = (data) => {
    return request('/section', {
        method: 'delete',
        data
    });
};

// 修改科室
export const updateSection = (data) => {
    return request('/section', {
        method: 'put',
        data
    });
};

// 查询科室
export const getSection = (data) => {
    return request('/section', {
        method: 'get',
        data
    });
};

// 添加门诊
export const addOutpatient = (data) => {
    return request('/outpatient', {
        method: 'post',
        data
    });
};
// 删除门诊
export const deleteOutpatient = (data) => {
    return request('/outpatient', {
        method: 'delete',
        data
    });
};

// 修改门诊
export const updateOutpatient = (data) => {
    return request('/outpatient', {
        method: 'put',
        data
    });
};

// 查询门诊
export const getOutpatient = (data) => {
    return request('/outpatient', {
        method: 'get',
        data
    });
};

// 添加医生
export const addDoctor = (data) => {
    return request('/doctor', {
        method: 'post',
        data
    });
};
// 删除医生
export const deleteDoctor = (data) => {
    return request('/doctor', {
        method: 'delete',
        data
    });
};
// 改变医生状态
export const updateDoctorStatus = (data) => {
    return request('/admin/changeDoctorStatus', {
        method: 'put',
        data
    });
};

// 修改医生
export const updateDoctor = (data) => {
    return request('/doctor', {
        method: 'put',
        data
    });
};

// 查询医生
export const getDoctor = (data) => {
    return request('/doctor', {
        method: 'get',
        data
    });
};

// 添加管理员
export const addAdmin = (data) => {
    return request('/admin', {
        method: 'post',
        data
    });
};
// 删除管理员
export const deleteAdmin = (data) => {
    return request('/admin', {
        method: 'delete',
        data
    });
};

// 修改管理员
export const updateAdmin = (data) => {
    return request('/admin', {
        method: 'put',
        data
    });
};

// 查询管理员
export const getAdmin = (data) => {
    return request('/admin', {
        method: 'get',
        data
    });
};

// 管理员修改自己信息
export const updateAdminSelf = (data) => {
    return request('/admin/updateAdmin', {
        method: 'put',
        data
    });
};

// 预约查询
export const queryReserve = (data) => {
    return request('/reserve/query', {
        method: 'get',
        data
    });
};

// 预约更新
export const updateReserve = (data) => {
    return request('/reserve/update', {
        method: 'post',
        data
    });
};

// 查询用户
export const queryUsers = (data) => {
    return request('/admin/userList', {
        method: 'get',
        data
    });
};

// 修改用户
export const updateUserInfo = (data) => {
    return request('/admin/userInfo', {
        method: 'put',
        data
    });
};

// 获取统计信息
export const getStatisticsInfo = (data) => {
    return request('/common/getStatisticsInfo', {
        method: 'get',
        data
    });
};

// 删除用户
export const deleteUserInfo = (data) => {
    return request('/admin/userInfo', {
        method: 'delete',
        data
    });
};

/**
 * 获取天气信息
 * @returns 
 */
export const queryWeatherInfo = () => {

    return new Promise(async (resolve, reject) => {
        const res = await axios.get('https://restapi.amap.com/v3/ip?key=1170cb4cf4ddb5c7e7a95c2e833383d2');
        if (res.data.status !== '1') {
            reject('获取ip地址失败');
            return;
        }
        axios.get(`https://restapi.amap.com/v3/weather/weatherInfo?key=1170cb4cf4ddb5c7e7a95c2e833383d2&city=${res.data.adcode}`).then((res) => {
            if (res.data.status === '1') {
                resolve(res.data.lives[0])
                return;
            }
            
        })
    })
}

