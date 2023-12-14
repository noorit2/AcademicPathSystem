import {useEffect, useState} from 'react';
import Options from './OptionsC';
import classes from "./ClassroomsTable.module.css"
 
import {
    Table,
    Header,
    HeaderRow,
    HeaderCell,
    Body,
    Row,
    Cell,
  } from '@table-library/react-table-library/table';
  import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { HeaderCellSort, useSort } from '@table-library/react-table-library/sort';
import Modules from '../Modules';
import { get_Sujects,get_modules } from '../../../../store/getandset';
import { auth } from '../../../../store/fire';
import AddClass from './AddClass';
const key = 'Compact Table';
let c=[
    {
        name:"Programming Lab",
        place:"Building 1",
        notes:"",
        id:"01"
    }
    ,
    {
        name:"Networking Lab",
        place:"Building 1",
        notes:"",
        id:"02"
    }
];
const ClassroomsTable = () => {
  const [classroom,setClassRoom]=useState([]);
  const [showAdd,setShowAdd]=useState(false);
  const [classS,setClassS]=useState({});
  const [edit,setEdit]=useState(false);
  const [reload,setReload]=useState(false);
  useEffect(()=>{

    if(!auth.currentUser)
    return;
    const f=async()=>{
    // const data=await get_modules()
    console.log(data);
    setClassRoom(c);
    }
    f();
  },[auth.currentUser,reload])
  
  const data = {
    nodes:classroom
}
const addClassHandler=(edit,classroom={})=>{
if(edit){
    setClassS(classroom);
    setShowAdd(true);
    setEdit(true);
}
else{
    setClassS({});
    setShowAdd(false);
    setEdit(false);
}
}
const sort = useSort(data,{
  onChange: onSortChange,
}, {
  sortFns: {
    NAME: (array) =>
      array.sort((a, b) => a.name.localeCompare(b.name)),
  },});
  const theme = useTheme([getTheme(
   
  ),
  {Table: `
  position:unset;
  `

  },
  {
    HeaderRow: `
    font-size: 16px;
    font-family:GraphikLight;
    background-color: #F5F5F5;
    padding:0;
    
  `,
},
{HeaderCell:
  `
&:nth-of-type(3){
text-align:center;
width:100%;

}
  `
},
{Row: `
font-family:GraphikLight;
`},
{Cell: `
&:nth-of-type(3) p,&:nth-of-type(4) p  {
    background-color: #d2e9fb;
    padding:0.2rem 0.5rem;
    width:fit-content;
    color:var(--styling1);
  }
  &:nth-of-type(3){
    text-align:center;
    display:flex;
    justify-content:center;
    align-items:center;
  }
  
img{
  width:2rem;
  height:2rem;
}
  padding:10px 12px;
`},
]);
function onSortChange(action, state) {
  console.log(action, state);
}
  return (
  <>
 {showAdd && <div className={classes.add}><AddClass classroom={classS} edit={edit} showAdd={setShowAdd} setReload={setReload}/></div>}
 {showAdd && <div className={classes.backDrop} onClick={()=>setShowAdd(false)}/>}
    <div className={classes.container}>
        <div className={classes.table}>
        <h3>View modules</h3>
        <button onClick={()=>setShowAdd(true)}>Add</button>
    <Table data={data} theme={theme} sort={sort}>
      {(tableList) => (
        <>
           <Header>
          <HeaderRow>
            <HeaderCellSort sortKey="NAME">Name</HeaderCellSort>
            <HeaderCell>Place</HeaderCell>
            <HeaderCell>Options</HeaderCell>
          </HeaderRow>
        </Header>

        <Body>
            {classroom.map((classroom) => (
              <Row key={classroom.id} item={classroom}>
                <Cell>
                  {classroom.name}
                </Cell>
                <Cell><p>{classroom.place}</p></Cell>
                <Cell><div className='relative'><Options classroom={classroom} showAdd={addClassHandler}/></div></Cell>
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
    </div>
    </div>
    </>
  );
};
export default ClassroomsTable;