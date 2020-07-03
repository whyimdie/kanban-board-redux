// import axios from 'axios';
import * as api from '../api';
import {CALL_API} from '../middleware/api';

// let _id = 1;
// export function uniqueId() {
//     return _id++;
// };


export const FETCH_TASKS_STARTED = 'FETCH_TASKS_STARTED';
export const FETCH_TASKS_SUCCEEDED = 'FETCH_TASKS_SUCCEEDED';
export const FETCH_TASKS_FAILED = 'FETCH_TASKS_FAILED';

export const CREATE_TASK_STARTED = 'CREATE_TASK_STARTED';
export const CREATE_TASK_SUCCEEDED = 'CREATE_TASK_SUCCEEDED';
export const CREATE_TASK_FAILED = 'CREATE_TASK_FAILED';

export function createTask({title,description,status='Unstarted'}) {
    return {
        [CALL_API]: {
            types: [CREATE_TASK_STARTED,CREATE_TASK_SUCCEEDED,CREATE_TASK_FAILED],
            endpoint:'/tasks',
            method:'POST',
            body:{
                title,
                description,
                status,
            },
        },
    };
};

// export function createTask({title,description,status='Unstarted'}){
//     return dispatch =>{
//         api.createTask({title,description,status}).then(res=>{
//             dispatch(createTaskSucceeded(res.data));
//         })
//     }
// }

// export function createTaskSucceeded(task){
//     return {
//         type: 'CREATE_TASK_SUCCEEDED',
//         payload: {
//             task,
//         },
//         meta: {
//             analytics: {
//                 event: 'create_task',
//                 data: {
//                     id: task.id,
//                 }
//             }
//         }
//     }
// }



export function editTaskSucceeded(task){
    return {
        type: 'EDIT_TASK_SUCCEEDED',
        payload: {
            task,
        },
    }
}


export function editTask(id,params={}){
    
    return (dispatch,getState) =>{
        // console.log(getState().tasks)
        const task = getTaskById(getState().tasks.tasks,id);
        const updatedTask = Object.assign({},task,params);

        api.editTask(id,updatedTask).then(res=>{
            dispatch(editTaskSucceeded(res.data));
        });
    };
}

function getTaskById(tasks, id) {
  return tasks.find(task => task.id === id);
}




export function fetchTasks() {
    return {
        [CALL_API]: {
            types:[FETCH_TASKS_STARTED,FETCH_TASKS_SUCCEEDED,FETCH_TASKS_FAILED],
            endpoint: '/tasks',
        },
    };
}

// export function createTask({title,description}) {
//     return {
//         type:'CREATE_TASK',
//         payload: {
//             id:uniqueId(),
//             title,
//             description,
//             status:'Unstarted',
//         },
//     };
// }

// export function editTask(id,params={}){
//     return {
//         type:'EDIT_TASK',
//         payload: {
//             id,
//             params
//         }
//     };
// }

// export function fetchTasksSucceeded(tasks) {
//     return {
//         type: 'FETCH_TASKS_SUCCEEDED',
//         payload: {
//             tasks
//         }
//     }
// }

// function fetchTasksStarted(){
//     return {
//         type:'FETCH_TASKS_STARTED',
//     };
// }

// function fetchTasksFailed(error){
//     return {
//         type: 'FETCH_TASKS_FAILED',
//         payload: {
//             error,
//         },
//     };
// }


// export function fetchTasks(){
//     return dispatch => {
//         axios.get('http://localhost:3001/tasks').then(res=>{
//             dispatch(fetchTasksSucceeded(res.data));
//         });
//     };
// }

// export function fetchTasks(){
//     return dispatch =>{
//         dispatch(fetchTasksStarted());

//         // api.fetchTasks().then(res=>{
//         //     dispatch(fetchTasksSucceeded(res.data));
//         // });

//         api.fetchTasks().then(res=>{
//             setTimeout(()=>{
//                 dispatch(fetchTasksSucceeded(res.data));
//             },2000);
//             // throw new Error('Oh noes! Unable to fetch tasks!');
//         // });
//         }).catch(err=>{
//             dispatch(fetchTasksFailed(err.message));
//         })
//     };
// }