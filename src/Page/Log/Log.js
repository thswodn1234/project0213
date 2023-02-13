import { useEffect, useState } from "react";
import { getLog } from "../../API/main";
import Table from 'react-bootstrap/Table';
import "./Log.css"

function Log() {

  const [log, setLog] = useState([]);

  useEffect(() => {
    (async () => {
      await getLog()
        .then((res) => {
          setLog(res);
        })
    })();

  }, [])

  return (
    <>
    <div className="logtable">
      <h3>리드타임 검색 기록</h3>
      <Table striped bordered hover >
        <thead>
          <tr>
            <th>#</th>
            <th>Machinery</th>
            <th>청구품목</th>
            <th>Part No</th>
            <th>검색일자</th>
          </tr>
        </thead>
        <tbody>
          {log.length > 0 ? (
            log.map((item,index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{item.machinery}</td>
                <td>{item.items}</td>
                <td>{item.part1}</td>
                <td>{item.logdate}</td>
              </tr>
            )))
            :<tr><td>기록이 없습니다.</td></tr>
          }       
        </tbody>
      </Table>
      </div>
    </>
  )
}
export default Log;