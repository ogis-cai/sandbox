import React from 'react';
import TreeView from 'react-treeview';
import DraggableList from './DraggableList';
import './uncontrolled.css'

const dataSource = [
  {
    type: 'Employees',
    collapsed: false,
    people: [
      {name: 'Paul Gordon', age: 29, sex: 'male', role: 'coder', collapsed: false},
      {name: 'Sarah Lee', age: 27, sex: 'female', role: 'ocamler', collapsed: false},
    ],
  },
  {
    type: 'CEO',
    collapsed: false,
    people: [
      {name: 'Drew Anderson', age: 39, sex: 'male', role: 'boss', collapsed: false},
    ],
  },
];

class CompanyPeople extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  renderPeople = (node) =>{
    return node.people.map(person => {
      const label2 = <span className="node">{person.name}</span>;
      return (
        <div className="people">
          <TreeView nodeLabel={label2} key={person.name} defaultCollapsed={false}>
            <DraggableList>
              <div>F</div>
              <div>U</div>
              <div>C</div>
              <div>K</div>
            </DraggableList>
          </TreeView>
        </div>
      )
    });
  }

  renderTreeView = () => {
    return dataSource.map((node, i) => {
      const type = node.type;
      const label = <span className="node">{type}</span>;
      return (
        <TreeView key={`${type}|${i}`} nodeLabel={label} defaultCollapsed={false}>
          {this.renderPeople(node)}
        </TreeView>
      );
    });
  }

  render() {
    return (
      <div className="tree-container">
        {this.renderTreeView()}
      </div>
    );
  }
}

export default CompanyPeople;