import React,{Component} from 'react';
import {connect} from 'react-redux';
import TaskPage from './components/TaskPage';
import FlashMessage from './components/FlashMessage';
import {createTask,editTask,filterTasks,fetchProjects,setCurrentProjectId} from './actions';

// import {fetchTasks} from './actions';
// import {getFilteredTasks} from './reducers';
import {getGroupedAndFilteredTasks} from './reducers';
import Header from './components/Header';


// import {createStore} from 'redux';
// function counterReducer(state=0,action){
//   if (action.type==='INCREMENT'){
//     return state + 1;
//   }
//   return state;
// }
// const store = createStore(counterReducer);
// console.log(store.getState());

// store.subscribe(()=>{
//   console.log('current state: ',store.getState());
// })
// store.dispatch({type:'INCREMENT'});

class App extends Component {
  // WHen the componentDidMount, fetchs the data from database
  componentDidMount(){
    // this.props.dispatch(fetchTasks());
    this.props.dispatch(fetchProjects());
  }

  onCurrentProjectChange = e => {
    this.props.dispatch(setCurrentProjectId(Number(e.target.value)));
  };

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm));
  };

  onCreateTask = ({title,description})=>{
    this.props.dispatch(createTask({title,description}));
  }
  onStatusChange = (id,status)=>{
    this.props.dispatch(editTask(id,{status}));
  }
  render() {
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error}/>}
        <div className="main-content">
          <Header
            projects={this.props.projects}
            onCurrentProjectChange={this.onCurrentProjectChange}
          />
          <TaskPage 
            tasks={this.props.tasks}
            onCreateTask={this.onCreateTask}
            onSearch={this.onSearch}
            onStatusChange={this.onStatusChange}
            isLoading={this.props.isLoading}
          />
      </div>
      </div>
      
    );
  }
}

// function mapStateToProps(state){
//   // return {
//   //   tasks: state.tasks
//   // }
//   // const {tasks,isLoading,error} = state.tasks;
//   // return {tasks,isLoading,error};

//   // const {isLoading,error,searchTerm} = state.tasks;
//   // const tasks = state.tasks.tasks.filter(task=>{
//   //   return task.title.match(new RegExp(searchTerm,'i'));
//   // });
//   // return {tasks,isLoading,error};

//   // const {tasks, isLoading, error, searchTerm} = state.tasks;
//   // return {tasks:getFilteredTasks(tasks,searchTerm),isLoading,error};

//   const {isLoading, error} = state.tasks;
//   // return {tasks:getFilteredTasks(state),isLoading,error};
//   return {tasks:getGroupedAndFilteredTasks(state),isLoading,error};
// }

function mapStateToProps(state){
  const {isLoading,error,items} = state.projects;
  return {
    tasks: getGroupedAndFilteredTasks(state),
    projects: items,
    isLoading,
    error,
  }
}
// export default App;
export default connect(mapStateToProps)(App);
