import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';
export const CALL_API = 'CALL_API';

function makeCall({endpoint,method='GET',body}){
    const url = `${API_BASE_URL}${endpoint}`

    const params = {
        method: method,
        url,
        data: body,
        headers: {
            'Content-Type':'application/json',
        },
    };

    // return axios.get(url).then(res=>res).catch(err=>err)
    return axios(params).then(res=>res).catch(err=>err);
}
const apiMiddleware = store => next => action => {
    const callApi = action[CALL_API];
    if (typeof callApi === 'undefined') {
        return next(action);
    }
    const [requestStartedType,successType,failureType] = callApi.types;
    next({type:requestStartedType});
    // return makeCall(callApi.endpoint).then(
    //     res => next({
    //         type: successType,
    //         payload: res.data,
    //     }),
    //     error => next({
    //         type: failureType,
    //         payload: error.message,
    //     }),
    // );
    makeCall({
        method: callApi.method,
        body: callApi.body,
        endpoint: callApi.endpoint,
    }).then(
        res => next({
            type: successType,
            payload: res.data,
        }),
        err => next({
            type: failureType,
            error:err.message,
        }),
    );
};

export default apiMiddleware;
