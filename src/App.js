import React,{Component} from 'react';
import {connect} from 'react-redux';
import TaskPage from './components/TaskPage';
import FlashMessage from './components/FlashMessage';
import {createTask,editTask,fetchTasks} from './actions';


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
    this.props.dispatch(fetchTasks());
  }

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
        <TaskPage 
          tasks={this.props.tasks}
          onCreateTask={this.onCreateTask}
          onStatusChange={this.onStatusChange}
          isLoading={this.props.isLoading}
        />
      </div>
      </div>
      
    );
  }
}

function mapStateToProps(state){
  // return {
  //   tasks: state.tasks
  // }
  const {tasks,isLoading,error} = state.tasks;
  return {tasks,isLoading,error};
}

// export default App;
export default connect(mapStateToProps)(App);
