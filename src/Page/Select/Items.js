import React from "react";
import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "./SelectMain";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import "./Items.css";
import { getLeadtime, addLog, getSelectList } from "../../API/main";

const Lead = () => {
  const [datas, setdata] = useState();
  const [data1, setdata1] = useState();
  const [data2, setdata2] = useState();
  const [data3, setdata3] = useState();
  const [machinery, setMachinery] = useState();
  const [items, setItems] = useState();
  const [part1, setPart1] = useState();
  const [order, setOrder] = useState();
  const [lead, setLead] = useContext(AppContext);

  useEffect(() => {
    getMachinery();
  }, []);

  useEffect(() => {
    const result = [...new Set(data1)];
    result.sort();
    for (let i = 0; i < result.length; i++) {
      let opt = document.createElement("option");
      opt.value = result[i];
      opt.innerHTML = result[i];
      target.appendChild(opt);
    }
  }, [data1]);

  useEffect(() => {
    const result2 = [...new Set(data2)];
    result2.sort();
    for (let i = 0; i < result2.length; i++) {
      let opt = document.createElement("option");
      opt.value = result2[i];
      opt.innerHTML = result2[i];
      target2.appendChild(opt);
    }
  }, [data2]);

  useEffect(() => {
    const result3 = [...new Set(data3)];
    // result3.sort();
    for (let i = 0; i < result3.length; i++) {
      let opt = document.createElement("option");
      opt.value = result3[i];
      opt.innerHTML = result3[i];
      target3.appendChild(opt);
    }
  }, [data3]);

  const getMachinery = async () => {
    // let url = "http://3.35.179.46:8080/data/selectlist";

    // try {
    //   const resp = await fetch(url);
    //   const data = await resp.json();
    //   setdata(data);
    //   setdata1(data.map((item) => item.machinery));
    // } catch (err) {
    //   console.log(err);
    // }
    (async () => {
      await getSelectList()
        .then((res) => {
          setdata(res);
          setdata1(res.map((item) => item.machinery));
        })
    })();
  };

  //리스트를 select box의 option으로
  let target = document.getElementById("choice");
  let target2 = document.getElementById("choice2");
  let target3 = document.getElementById("choice3");
  //machinary 리스트화

  const changeValue = (e) => {
    e.preventDefault();
    //새로운 machinary가 선택될 때 마다 choice2를 초기화
    target2.length = 0;
    let items = [];
    items.push("===선택===");
    setMachinery(e.target.value);

    datas.map((item) => {
      if (item.machinery === e.target.value) {
        items.push(item.items);
      }
    });
    setdata2(items);
  };

  const changeValue2 = (e) => {
    e.preventDefault();
    //새로운 machinary가 선택될 때 마다 choice2를 초기화
    target3.length = 0;
    setItems(e.target.value);
    let items2 = [];
    items2.push("===선택===");
    datas.map((item) => {
      if (item.machinery === machinery && item.items === e.target.value) {
        items2.push(item.part1);
      }
    });
    setdata3(items2);
  };

  const changeValue3 = (e) => {
    e.preventDefault();
    setPart1(e.target.value);
  };

  const logdata = {
    "machinery": machinery,
    "items": items,
    "part1": part1
  }

  const submitdata = (e) => {
    e.preventDefault();
    (async () => {
      await getLeadtime(machinery, items, part1)
        .then((res) => {
          //axios의 response인 Json에 key, value를 추가하는 법
          res.order_date = order
          setLead(res);
        })
    })();

    //검색한 로그를 db에 입력
    (async () => {
      await addLog(logdata)
        .then((res) => res)
    })();
  };

  const refDateIn = useRef();

  const handleChange = (e) => {
    e.preventDefault();
    // console.log(refDateIn.current.value)
    setOrder(refDateIn.current.value)
    //달력으로 입력받은 날짜값(refDateIn)를 url에 입력될 viewDay로 변경
  }

  //reading 'leadtime_predicted' 에러 발생하는 이유 : 해당 품목을 leadtime_final에서 검색하면 데이터가 없음
  return (
    <>
      <Container>
            {/* <label className="label" for="choice"> Order To </label>
        <input className="input"></input> */}
            <label className="label" for="choice"> MACHINERY </label>
            <select id="choice" onChange={changeValue}>
              <option value={null}>=== 선택 ===</option>
            </select>
            <label className="label" for="choice2"> Description </label>
            <select id="choice2" onChange={changeValue2}>
              <option value={null}>=== 선택 ===</option>
            </select>
            <label className="label" for="choice3"> Part NO </label>
            <select id="choice3" onChange={changeValue3}>
              <option value={null}>=== 선택 ===</option>
            </select>
            <label className="label" for="choice"> Order Date </label>
            <input type='date' className="input" ref={refDateIn} onChange={handleChange} />
            {/* <label className="label" for="choice"> Qty </label>
        <input className="input"></input> */}
        <Button variant="dark" className="butt" onClick={submitdata}>검색</Button>
      </Container>
    </>
  );
};

export default Lead;
