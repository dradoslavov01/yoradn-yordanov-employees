import './App.css';
import { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';

function App() {
  const [arr, setArr] = useState();
  const [file, setFile] = useState();
  const [dataInfo, setDataInfo] = useState();


  useEffect(() => {
    let filteredArr = [];
    const result = [];
    if (arr !== undefined) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].ProjectID === arr[j].ProjectID) {
            filteredArr.push(arr[i], arr[j]);
            break;
          };
        };
      };
    };
    if (filteredArr.length > 0) {
      let daysWorked = 0;
      for (let i = 0; i < filteredArr.length; i++) {
        const date1 = new Date(filteredArr[i].DateFrom.includes('NULL') ? getCurrentDate() : filteredArr[i].DateFrom);
        const date2 = new Date(filteredArr[i].DateTo.includes('NULL') ? getCurrentDate() : filteredArr[i].DateTo);
        const diffInMs = Math.abs(date2 - date1);
        const diffInDays = (diffInMs / (1000 * 60 * 60 * 24)).toFixed(0);
        daysWorked += Number(diffInDays)
      };
      result.push(filteredArr[0].EmpID, filteredArr[1].EmpID, filteredArr[1].ProjectID, daysWorked);
      setDataInfo(result)
    };

  }, [file, arr]);


  const handleFile = ((e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const textFile = /text.*/;

    if (file.type.match(textFile)) {
      reader.onload = function (event) {
        const data = event.target.result;
        setFile(data);
        const line = data.trim().split('\n');
        let dataArray = [];
        line.forEach(e => {
          const lineSplited = e.split(', ');
          dataArray.push({ 'EmpID': lineSplited[0], 'ProjectID': lineSplited[1], 'DateFrom': lineSplited[2], 'DateTo': lineSplited[3] });
        });
        setArr(dataArray);
      };
    };
    reader.readAsText(file);
  });

  function getCurrentDate() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    return date;
  }

  const columns = [
    { key: 'empId1', name: 'Employee ID #1' },
    { key: 'empId2', name: 'Employee ID #2' },
    { key: 'projectId', name: 'ProjectId' },
    { key: 'daysWorked', name: 'Days worked' }
  ];
  let rows;

  if(dataInfo !== undefined) {
     rows = [
      { empId1: dataInfo[0], empId2: dataInfo[1], projectId: dataInfo[2], daysWorked: dataInfo[3] },
    ];
  } else {
    rows = [
      { empId1: '', empId2: '', projectId: '', daysWorked: '' },
    ];
  }




  return (
    <div className="App">
      <p className="textMsg">Select a file to display data</p>
      <div className="data-grid" style={{ height: '100px', width: '700px' }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
      <form className="form-container">
        <div className="select-file-container">
          <input type="file" name="file" onChange={e => handleFile(e)} />
        </div>
      </form>
    </div>
  );
}

export default App;
