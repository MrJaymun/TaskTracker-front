import Api from "../index"

export const addProject = async (payload) => {
    return await Api.post(`/Project/createProject`, payload)
};

export const getProjects = async (payload) => {
    return await Api.get(`/Project/getProjects`, { params: payload })
};

export const watchProject = async (payload) => {
    return await Api.get(`/Project/watchProject`, { params: payload })
};

export const goProject = async (payload) => {
    return await Api.get(`/Project/goToProject`, { params: payload })
};

export const joinProject = async (payload) => {
    return await Api.post(`/Project/joinProject`, payload)
};

export const changeProject = async (payload) => {
    return await Api.post(`/Project/changeProject`, payload)
};

export const removeProject = async (payload) => {
    return await Api.post(`/Project/deleteProject`, payload)
};
