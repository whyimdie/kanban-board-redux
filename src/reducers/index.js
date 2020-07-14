import {createSelector} from 'reselect';
import { TASK_STATUSES } from '../constants';


// import {uniqueId} from '../actions';

// const mockTasks = [
//     {
//       id: uniqueId(),
//       title: 'Learn Redux',
//       description: 'The store, actions, and reducers, oh my!',
//       status: 'In Progress',
//     },
//     {
//       id: uniqueId(),
//       title: 'Peacce on Earth',
//       description: 'No big deal',
//       status: 'In Progress',
//     },
//     {
//       id: uniqueId(),
//       title: 'Earth',
//       description: 'No big deal',
//       status: 'Completed',
//     },
//   ];

// Remove mockTask from state={tasks:...}
// export default function tasks(state={tasks:[]},action){
//     if (action.type==='CREATE_TASK'){
//         return {tasks: state.tasks.concat(action.payload)};
//     } 
//     if (action.type==='EDIT_TASK'){
//         const {payload} = action;
//         return {
//             tasks: state.tasks.map(task=>{
//                 if (task.id === payload.id) {
//                     return Object.assign({},task,payload.params);
//                 }
//                 return task;
//             })
//         }
//     }
//     if (action.type==='FETCH_TASKS_SUCCEEDED'){
//       return {
//         tasks: action.payload.tasks,
//       };
//     }
    
//     return state;
// }

const initialTasksState = {
  tasks: [],
  isLoading: false,
  error: null,
  searchTerm: ''
}

const initialProjectsState = {
  items: [],
  isLoading: false,
  error: null
};

const initialPageState = {
  currentProjectId: null,
  searchTerm: '',
}

export function page(state=initialPageState,action){
  switch(action.type){
    case 'SET_CURRENT_PROJECT_ID':{
      return {
        ...state,
        currentProjectId: action.payload.id,
      };
    }
    case 'FILTER_TASKS':{
      return {
        ...state,
        searchTerm: action.searchTerm
      };
    }
    default: {
      return state;
    }
  }
}
export function projects(state=initialProjectsState,action){
  switch(action.type){
    case 'FETCH_PROJECTS_STARTED':{
      return {
        ...state,
        isLoading:true,
      };
    }
    case 'FETCH_PROJECTS_SUCCEEDED':{
      return {
        ...state,
        isLoading:false,
        items: action.payload.projects,
      }
    }
    case 'FETCH_PROJECTS_FAILED':{
      return{
        ...state,
        error: action.payload.err
      }
    }
    case 'CREATE_TASK_SUCCEEDED':{
      const {task} = action.payload;
      const projectIndex = state.items.findIndex(
        project=>project.id===task.projectId,
      );
      const project = state.items[projectIndex];
      const nextProject = {
        ...project,
        tasks:project.tasks.concat(task)
      };
      return {
        ...state,
        items:[
          ...state.items.slice(0,projectIndex),
          nextProject,
          ...state.items.slice(projectIndex+1),
        ],
      }
    }
    case 'EDIT_TASK_SUCCEEDED': {
      const {task} = action.payload;
      const projectIndex = state.items.findIndex(
        project => project.id === task.projectId,
      );
      const project = state.items[projectIndex];
      const taskIndex = project.tasks.findIndex(t=>t.id===task.id);
      const nextProject = {
        ...project,
        tasks:[
          ...project.tasks.slice(0,taskIndex),
          task,
          ...project.tasks.slice(taskIndex+1),
        ],
      };
      return {
        ...state,
        items:[
          ...state.items.slice(0,projectIndex),
          nextProject,
          ...state.items.slice(projectIndex+1)
        ],
      };
    }
    default: return state;
  }
}

// Convert the above function into switch condition
export function tasks(state=initialTasksState,action){
  switch (action.type) {
    // case 'CREATE_TASK':{
    //   return {tasks: state.tasks.concat(action.payload)}
    // }
    // case 'EDIT_TASK':{
    //   const {payload} = action;
    //   return {
    //     tasks: state.tasks.map(task=>{
    //       if (task.id === payload.id) {
    //         return Object.assign({},task,payload.params);
    //       }
    //       return task;
    //     }),
    //   };
    // }
    case 'FILTER_TASKS':{
      return{
        ...state,
        searchTerm: action.payload.searchTerm
      }
    }
    case 'FETCH_TASKS_STARTED': {
      return {
        ...state,
        isLoading:true,
      };
    }
    case 'FETCH_TASKS_SUCCEEDED':{
      return {
        ...state,
        isLoading: false,
        tasks: action.payload.tasks
      };
    }
    // case 'CREATE_TASK_SUCCEEDED':{
    //   return {
    //     ...state,
    //     tasks: state.tasks.concat(action.payload.task)
    //   };
    // }
    case 'EDIT_TASK_SUCCEEDED':{
      const {payload} = action;
      const nextTasks = state.tasks.map(task=>{
        if (task.id === payload.task.id){
          return payload.task;
        }
        return task;
      });
      return {
        ...state,
        tasks: nextTasks,
      }
    }
    case 'FETCH_TASKS_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case 'TIMER_INCREMENT': {
      const nextTasks = state.tasks.map(task=>{
        if (task.id === action.payload.taskId) {
          return {...task, timer: task.timer + 1};
        }
        return task;
      });
      return {...state,tasks:nextTasks}
    }
    default: {
      return state;
    }
  }
}

// export function getFilteredTasks(tasks,searchTerm){
//   return tasks.filter(task=>{
//     return task.title.match(new RegExp(searchTerm,'i'));
//   });
// }

// const getTasks = state => state.tasks.tasks;
// const getSearchTerm = state => state.tasks.searchTerm;
const getSearchTerm = state => state.page.tasksSearchTerm;
const getTasksByProjectId = state => {
  if (!state.page.currentProjectId){
    return [];
  }
  const currentProject = state.projects.items.find(
    project => project.id === state.page.currentProjectId,
  );
  return currentProject.tasks
};

export const getFilteredTasks = createSelector(
  // [getTasks,getSearchTerm],
  [getTasksByProjectId,getSearchTerm],
  (tasks,searchTerm) => {
    return tasks.filter(task=> task.title.match(new RegExp(searchTerm,'i')));
  },
);

export const getGroupedAndFilteredTasks = createSelector(
  [getFilteredTasks],
  tasks=>{
    const grouped = {};
    TASK_STATUSES.forEach(status=>{
      grouped[status] = tasks.filter(task=>task.status===status);
    });
    return grouped;
  },
);
