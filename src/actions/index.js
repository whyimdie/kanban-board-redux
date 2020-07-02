// import axios from 'axios';
import * as api from '../api';

let _id = 1;
export function uniqueId() {
    return _id++;
};

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

export function fetchTasksSucceeded(tasks) {
    return {
        type: 'FETCH_TASKS_SUCCEEDED',
        payload: {
            tasks
        }
    }
}

// export function fetchTasks(){
//     return dispatch => {
//         axios.get('http://localhost:3001/tasks').then(res=>{
//             dispatch(fetchTasksSucceeded(res.data));
//         });
//     };
// }

export function fetchTasks(){
    return dispatch =>{
        dispatch(fetchTasksStarted());

        // api.fetchTasks().then(res=>{
        //     dispatch(fetchTasksSucceeded(res.data));
        // });

        api.fetchTasks().then(res=>{
            setTimeout(()=>{
                dispatch(fetchTasksSucceeded(res.data));
            },2000);
            // throw new Error('Oh noes! Unable to fetch tasks!');
        // });
        }).catch(err=>{
            dispatch(fetchTasksFailed(err.message));
        })
    };
}

export function createTaskSucceeded(task){
    return {
        type: 'CREATE_TASK_SUCCEEDED',
        payload: {
            task,
        },
    }
}
export function createTask({title,description,status='Unstarted'}){
    return dispatch =>{
        api.createTask({title,description,status}).then(res=>{
            dispatch(createTaskSucceeded(res.data));
        })
    }
}

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
        }).catch(error=>{
            dispatch(fetchTasksFailed(error.message));
        });
    };
}

function getTaskById(tasks, id) {
  return tasks.find(task => task.id === id);
}

function fetchTasksStarted(){
    return {
        type:'FETCH_TASKS_STARTED',
    };
}

function fetchTasksFailed(error){
    return {
        type: 'FETCH_TASKS_FAILED',
        payload: {
            error,
        },
    };
}
