import { React, useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link, Route } from 'react-router-dom';


function App() {
  let [list, setlist] = useState([]);
  let [input, setInput] = useState('');

  return (  
    <div className="App">
      <div className='container'>
    
        <Achive list = {list} setlist = {setlist} setInput = {setInput} input = {input}></Achive>

      </div>
    </div>
  );
}

function Achive(props) {

  useEffect(() => {
    axios.get('http://localhost:8080/list')
    .then((result) => {
      props.setlist([...props.list, ...result.data])
    })
    .catch(() => {
      console.log('list정보 get실패')
    })
  },[])

  const deleteClick = (e) => {
    axios.delete('http://localhost:8080/delete', { data : { id : e.target.id } })
    .then((result) => {
      props.setlist(props.list.filter((data) => { return data._id != e.target.id }));
    }) 
    .catch(() => {
      console.log('delete실패');
    })
  }

  return (
    <div className='purpose'>
      <h1>To Do List</h1>
      <hr/>
      <input type='text' placeholder='오늘의 일정을 작성해 보세요！' onKeyDown={(e) => {
        if(e.key === 'Enter') {
          axios.post('http://localhost:8080/add', { data : {title: e.target.value } })
          .then((result) => {
            console.log('post성공')
          })
          .catch(() => {
            console.log('post실패')
          })
          
          props.setlist([...props.list , { _id : props.list.length + 1, name : e.target.value }])

          e.target.value = ''
        }
      }}></input>

      {
        props.list.map((a, i) => {
          return(
            <div key={i} className = 'todo-list'>
              <span>{ props.list[i].name }</span>
              <button id = {props.list[i]._id} onClick={deleteClick}>완료</button>
            </div>
          )
        })
      }

  </div>
  )
}

export default App;