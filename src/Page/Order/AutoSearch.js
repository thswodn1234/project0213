import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from "react-js-pagination";
import Button from 'react-bootstrap/Button';
import "./Paging.css"
import "./Autosearch.css"
import { Link } from "react-router-dom";
import { getAutoSearch, getSelectList, addBalju, sendBalju } from "../../API/main";

//자동 검색 기능 및 검색결과 출력 화면
const Autosearch = () => {

  const [datas, setDatas] = useState();
  const [data, setData] = useState(null);
  const [list, setList] = useState();
  const [searchList, setSearchList] = useState();
  const [Selected, setSelected] = useState("");
  const [rowdata, setRowdata] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    //자동완성 목록 출력을 위한 row data
    (async () => {
      await getSelectList()
        .then((res) => setDatas(res))
    })();
    //TypeError: (intermediate value)... => 함수와 함수사이에 ';' (세미콜론)이 빠지면 발생하는 에러

    //검색결과 출력을 위한 row data(리드타임 예측 결과 테이블)
    (async () => {
      await getAutoSearch()
        .then((res) => setList(res))
    })();
  }, []);
  // console.log(datas)

  //검색조건 리스트
  const selectList = ["===검색항목선택===", "발주처", "부품대분류", "부품명", "부품번호"];

  // 중복을 제거한 machinery값을 저장하기위한 배열
  let options = [];

  //검색조건(selectList)을 선택하면 발생 이벤트
  const handleSelect = (e) => {
    //선택한 조건 저장
    setSelected(e.target.value);

    //조건 선택하면 자동완성목록 띄우기 위한 데이터 정제(선택된 필드 추출 및 중복제거)
    if (e.target.value === "발주처") {
      setData([...new Set(datas.map((item) => item.baljucheo))]);
    } else if (e.target.value === "부품대분류") {
      setData([...new Set(datas.map((item) => item.machinery))]);
    } else if (e.target.value === "부품명") {
      setData([...new Set(datas.map((item) => item.items))]);
    } else {
      setData([...new Set(datas.map((item) => item.part1))]);
    }
  };

  //검색항목이 변경될때마다 검색창 리셋
  useEffect(()=>{
    setSelectedOption("")
  }, [data])

  //  options라는 배열에 중복제거한 값 저장
  for (let item in data) {
    options.push(data[item]);
  }

  //  options배열을 내림차순 정렬
  options.sort();

  //검색창에 입력값이 변할때 발생하는 이벤트(입력)
  const handleChange = (event) => {
    //현재 검색어를 저장
    setSelectedOption(event.target.value);
  };

  //검색어 입력 후 버튼 클릭할때 이벤트
  const searchData = (event) => {
    event.preventDefault();
    //중복제거 값에서 검색결과만 출력(검색어가 포함된 모든 단어 포함 가능)
    setSearchResults(
      options.filter((option) => option.includes(selectedOption))
    );
  };

  //검색어가 submit 되어 searchResults값이 변경되면 실행
  useEffect(() => {
    //검색결과가 하나로 확정되었을때만 실행하는것으로 변경하였음
    //검색어가 포함된 모든 항목 출력도 가능하다.
    if (searchResults.length === 1) {
      //list = 검색결과 출력을 위한 row data
      //list에서 선택된 검색조건, 검색어와 일치하는 항목을 필터링
      if (Selected === "발주처") { setSearchList(list.filter((item) => item.baljucheo.includes(searchResults))) }
      else if (Selected === "부품대분류") { setSearchList(list.filter((item) => item.machinery.includes(searchResults))) }
      else if (Selected === "부품명") { setSearchList(list.filter((item) => item.items.includes(searchResults))) }
      else { setSearchList(list.filter((item) => item.part1.includes(searchResults))) }
    }

  }, [searchResults])

  //페이징 기능 구현
  const [page, setPage] = useState(1);  //현재 페이지
  const [count, setCount] = useState(0); //아이템 총 개수
  const [postPerPage] = useState(10); //페이지당 보여질 아이템 개수
  const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);  // 현재 페이지의 첫번째 아이템 인덱스
  const [indexOfLastPost, setIndexOfLastPost] = useState(0);  //현재 페이지의 마지막 아이템 인덱스
  const [currentPosts, setCurrentPosts] = useState(0);  // 현재 페이지에서 보여지는 아이템들

  //페이지 구현
  useEffect(() => {
    setCount(searchList?.length);
    setIndexOfLastPost(page * postPerPage);
    setIndexOfFirstPost(indexOfLastPost - postPerPage);
    setCurrentPosts(searchList?.slice(indexOfFirstPost, indexOfLastPost));
  }, [page, indexOfFirstPost, indexOfLastPost, searchList, postPerPage]);

  //페이지 변경 버튼 클릭 시 이벤트
  const handlePageChange = (page) => {
    setPage(page);
  };

  const [checkItems, setCheckItems] = useState([]);
  const [orderData, setOrderData] = useState([]);
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
      rowdata.forEach((el) => idArray.push(el.id));
      setCheckItems(idArray);
    }
    else {
      // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
      setCheckItems([]);
    }
  }

  //체크박스 선택한 행 삭제
  const removeRow = () => {
    setRowdata(rowdata.filter((item) =>
      !checkItems.includes(item.id)
    ))
  }

  //저장 버튼 클릭시 모든 행 db에 저장
  const baljuUp = () => {
    //각 행의 정보를 배열 형태로 저장
    const arr = []
    orderData.map((item) => {
      arr.push(item)
    });
    //저장된 배열을 스프링서버로 전송
    (async () => {
      await sendBalju(arr)
        .then((res) => res)
    })();
  }

  return (
    <>
      <div className="SearchOrder">
        <h3>검색결과</h3>
        <div className="autosearch">
          <select className="orderSelect" onChange={handleSelect}>
            {selectList.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <form onSubmit={searchData}>
            <input
              className="autoinput"
              list="options"
              value={selectedOption}
              onChange={handleChange}
            />
            <datalist id="options">
              {/* options라는 배열의 요소를 option태그 의 value 값에 넣기 */}
              {options.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
            <Button variant="dark" className="autobutt" type="submit">검색</Button>
          </form>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="th2">Machinery</th>
              <th className="th2">청구품목</th>
              <th className="th2">Part.No</th>
              <th className="th2">카테고리</th>
              <th className="th2">발주처</th>
              <th className="th2">리드타임(day)</th>
              {/* <th className="th2">견적화폐</th>
            <th className="th2">견적단가</th> */}
            </tr>
          </thead>
          <tbody className="OrderTable">
            {currentPosts && searchList.length > 0 ? (
              currentPosts.map((item, index) => (
                //검색결과 테이블 클릭한 행의 정보를 저장
                <tr key={index} onClick={() => setRowdata(rowdata => [...rowdata, item])}>
                  <td>{item.machinery}</td>
                  <td>{item.items}</td>
                  <td>{item.part1}</td>
                  <td>{item.key2}</td>
                  <td>{item.baljucheo}</td>
                  <td>{item.leadtime_predicted}</td>
                  {/* <td>{item.gyeonjeokhwapye}</td>
                <td>{item.gyeonjeokdanga}</td> */}
                </tr>
              )))
              : <tr><td>검색결과가 없습니다.</td><td></td><td></td><td></td><td></td><td></td></tr>
            }
          </tbody>
        </Table>
        <Pagination
          activePage={page} // 현재 페이지
          itemsCountPerPage={10} // 한 페이지랑 보여줄 아이템 갯수
          totalItemsCount={count ? count : 0} // 총 아이템 갯수
          pageRangeDisplayed={5} // paginator의 페이지 범위
          prevPageText={"‹"} // "이전"을 나타낼 텍스트
          nextPageText={"›"} // "다음"을 나타낼 텍스트
          onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
        />
        <br />
        <h3>선택 청구품목</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="th3"><input type={'checkbox'} onChange={(e) => handleAllCheck(e.target.checked)}
                checked={checkItems.length === rowdata.length ? true : false}></input></th>
              <th className="th2">Machinery</th>
              <th className="th2">청구품목</th>
              <th className="th2">Part.No</th>
              <th className="th2">카테고리</th>
              <th className="th2">발주처</th>
              <th className="th2">리드타임(day)</th>
              <th className="th2">견적화폐</th>
              <th className="th2">견적단가</th>
              <th className="th4">수량</th>
            </tr>
          </thead>
          <tbody>
            {rowdata.length > 0 ? (
              rowdata?.map((item, index) => (
                //테이블 클릭하여 저장된 정보를 새로운 테이블로 출력(장바구니 같은 개념으로 생각중)
                //클릭하면 테이블에서 삭제
                // <tr key={index} onClick={() => setRowdata(rowdata.filter(ritem => ritem.id !== item.id))}>
                <tr key={index} >
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
                  {/* db에 전송될 배열을 생성 */}
                  <td><input size='1' onChange={(event) => {
                    const orderraw = {
                      "id": item.id,
                      "machinery": item.machinery,
                      "items": item.items,
                      "part1": item.part1,
                      "key2": item.key2,
                      "baljucheo": item.baljucheo,
                      "leadtime_predicted": item.leadtime_predicted,
                      "gyeonjeokhwapye": item.gyeonjeokhwapye,
                      "gyeonjeokdanga": item.gyeonjeokdanga,
                      "baljusuryang": event.target.value,
                      "baljugeumaek": item.gyeonjeokdanga * event.target.value
                    };
                    setOrderData(orderData.filter(ritem => ritem.id !== item.id))
                    setOrderData(orderData => [...orderData, orderraw]);
                  }}></input></td>
                </tr>
              )))
              : <tr><td></td><td>선택한 품목이 없습니다.</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            }
          </tbody>
        </Table>
        {/* 선택되어 따로 생성된 테이블의 정보를 OrderList로 전송(장바구니 목록 결제하는 느낌)
       */}
        {checkItems.length > 0 && <Button variant="dark" className="autobutt2" onClick={removeRow}>선택 삭제</Button>}
        <div className="orderbutt">
          <Link to='/Order'><Button variant="dark" className="autobutt2" onClick={baljuUp}>저장</Button></Link>
        </div>
      </div>
    </>
  );
};

export default Autosearch;

{/* <Link to='/Order' state={orderData}><Button variant="dark" className="autobutt2">발주</Button></Link> */ }
// #state를 사용하면 link를 이용해서도 props를 전송///
//useLocation을 사용해 넘어온 router로 넘어온 props정보를 활용가능
// const location = useLocation();
// const [data, setData] = useState(location.state);