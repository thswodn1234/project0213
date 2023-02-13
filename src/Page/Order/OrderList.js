import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import "./OrderList.css"
import { Link } from "react-router-dom";
import { getBalju } from "../../API/main";

//선택된 청구품목 목록을 따로 출력
function OrderList() {

  const [baljuData, setBaljuData] = useState();

  //db에 저장된 검색 데이터를 호출
  useEffect(() => {

    (async () => {
      await getBalju()
        .then((res) => setBaljuData(res))
    })();
  }, [])

  const [checkItems, setCheckItems] = useState([]);

  // 체크박스 단일 선택
  const handleSingleCheck = (checked, id) => {
    if (checked) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems(prev => [...prev, id]);
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(checkItems.filter((el) => el !== id));
    }
  };

  const handleAllCheck = (checked) => {
    if (checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      const idArray = [];
      baljuData.forEach((el) => idArray.push(el.id));
      setCheckItems(idArray);
    }
    else {
      // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
      setCheckItems([]);
    }
  }
  //setRowdata(rowdata.filter(ritem => ritem.id !== item.id))
  const removeRow = () => {
    setBaljuData(baljuData.filter((item) =>
      !checkItems.includes(item.id)
    ))
  }

  return (
    <>
      <div className='orderlist'>
        <h3>OrderList</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th><input type={'checkbox'} onChange={(e) => handleAllCheck(e.target.checked)}
                checked={checkItems.length === baljuData?.length ? true : false}></input></th>
              <th>Machinery</th>
              <th>청구품목</th>
              <th>Part.No</th>
              <th>카테고리</th>
              <th>발주처</th>
              <th>리드타임</th>
              <th>견적화폐</th>
              <th>견적단가</th>
              <th>수량</th>
              <th>발주금액</th>
            </tr>
          </thead>
          <tbody >
            {baljuData?.map((item, index) => (
              <tr key={index}>
                <td><input type={'checkbox'} onChange={(e) => handleSingleCheck(e.target.checked, item.id)}
                  checked={checkItems.includes(item.id) ? true : false}></input></td>
                <td>{item.machinery}</td>
                <td>{item.items}</td>
                <td>{item.part1}</td>
                <td>{item.key2}</td>
                <td>{item.baljucheo}</td>
                <td>{item.leadtime_predicted}</td>
                <td>{item.gyeonjeokhwapye}</td>
                <td>{item.gyeonjeokdanga}</td>
                <td>{item.baljusuryang}</td>
                <td>{item.baljugeumaek}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="backbutt">
          <Link to='/OrderMain'><Button variant="dark" >뒤로가기</Button></Link>
          {/* <Button variant="dark" className="autobutt2" onClick={removeRow}>선택 삭제</Button> */}
        </div>
      </div>
    </>
  );
}
export default OrderList;