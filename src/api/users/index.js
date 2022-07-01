import Api from "../index"

export const addUser = async (payload) => {
    return await Api.post(`/User/createUser`, payload)
};

export const checkUser = async (payload) => {
    return await Api.get(`/User/doesUserExist`, { params: payload })
};

export const changeUserPassword = async (payload) => {
    return await Api.post(`/User/changeUserPassword`, payload)
};
