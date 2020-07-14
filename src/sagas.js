import {call,put, fork,takeLatest, take} from 'redux-saga/effects';
import {delay} from 'redux-saga/effects';
import {channel} from 'redux-saga';

// import {take,takeEvery} from 'redux-saga/effects';
// import {delay} from 'redux-saga';

// Take lastest cancel old processes when a new one begins
import * as api from './api';

export default function* rootSaga(){
    // yield fork(watchFetchTasks);
    yield takeLatest('FETCH_TASKS_STARTED',fetchTasks);
    yield fork(watchSomethingElse);
    // yield takeEvery('TIMER_STARTED',handleProgressTimer);
    yield takeLastestById(['TIMER_STARTED','TIMER_STOPPED'],handleProgressTimer);
}

function* takeLastestById(actionType,saga){
    const channelsMap = {};
    while (true){
        const action = yield take(actionType);
        const {taskId} = action.payload;
        if (!channelsMap[taskId]){
            channelsMap[taskId] = channel();
            yield takeLatest(channelsMap[taskId],saga);
        }
        yield put(channelsMap[taskId],action);
    }
}

function* handleProgressTimer({payload,type}){
    if (type==='TIMER_STARTED'){
        while(true){
            // yield call(delay,1000);
            yield delay(1000);
            yield put({
                type: 'TIMER_INCREMENT',
                payload: {taskId: payload.taskId},
            })
        }
    }
    
}

function* fetchTasks(){
    try{
        const {data} = yield call(api.fetchTasks);
        yield put({
            type: 'FETCH_TASKS_SUCCEEDED',
            payload: {tasks:data},
        }); 
    } catch(e) {
        yield put({
            type: 'FETCH_TASKS_FAILED',
            payload: {error:e.message},
        });     
    }
}

// function* watchFetchTasks(){
//     // console.log('watching!');
//     while (true){
//         yield take('FETCH_TASKS_STARTED');
//         try {
//             const {data} = yield call(api.fetchTasks);
//             yield put({
//                 type: 'FETCH_TASKS_SUCCEEDED',
//                 payload: {tasks:data}
//             });
//         } catch (e) {
//             yield put ({
//                 type: 'FETCH_TASKS_FAILED',
//                 payload: {error:e.message}
//             });
//         }
//         // console.log('started!');
//     }
// }

function* watchSomethingElse(){
    yield "Nothing";
    console.log('watching something else');
}

// export default function* rootSaga(){
//     console.log('rootSaga reporting for duty!');
// }