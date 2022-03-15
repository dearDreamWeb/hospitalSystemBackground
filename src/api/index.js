import request from '../utils/request';

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

