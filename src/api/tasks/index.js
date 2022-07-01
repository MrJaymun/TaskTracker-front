import Api from "../index"

export const addTask = async (payload) => {
    return await Api.post(`/Task/createTask`, payload)
};

export const getTaskList = async (payload) => {
    return await Api.get(`/Task/getTasks`, { params: payload })
};

export const getTheTask = async (payload) => {
    return await Api.get(`/Task/getTask`, { params: payload })
};

export const updateTask = async (payload) => {
    return await Api.post(`/Task/updateTask`, payload)
};

export const updateTaskStatus = async (payload) => {
    return await Api.post(`/Task/updateTaskStatus`, payload)
};

export const deleteTask = async (payload) => {
    return await Api.post(`/Task/deleteTask`, payload)
};