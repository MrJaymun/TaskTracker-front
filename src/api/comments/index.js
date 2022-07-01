import Api from "../index"

export const createComment = async (payload) => {
    return await Api.post(`/Comment/createComment`, payload)
};

export const updateTheComment = async (payload) => {
    return await Api.post(`/Comment/updateComment`, payload)
};

export const deleteTheComment = async (payload) => {
    return await Api.post(`/Comment/deleteComment`, payload)
};