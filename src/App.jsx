import React from 'react';
import './App.css';
import Summary from './components/Summary';
import EmployeeList from './components/EmployeeList';
import Nav from './components/primitives/Nav';
import Content from './components/primitives/Content';

function App() {
  return (
    <div>
      <Nav title="Esprow Employees Admin" />
      <Summary />
      <Content>
        <EmployeeList />
      </Content>
    </div>
  );
}

export default App;
