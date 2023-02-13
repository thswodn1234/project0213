import "react-calendar/dist/Calendar.css";
import React, { useState, createContext, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import Items from "./Items";
import Visual from "./Visual";
import "./selectMain.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
//데이터를 이동하기 위해 useContext를 사용
export const AppContext = createContext();

function SelectDate() {
  const [lead, setLead] = useState();
  const [startDate, setStartDate] = useState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lead === undefined) {
      setVisible(false);
    } else {
      if (visible === false) {
        setVisible(true);
      } else setVisible(true);
    }
    setStartDate(lead?.[0]["order_date"]);
  }, [lead, visible]);

  // const d1 = [];
  // let a = 100;

  let a = startDate;
  let b = lead?.[0]["leadtime_predicted"];
  let t = b;

  let y = parseInt(t / 365);
  let m = parseInt((t % 365) / 30);
  let d2 = parseInt((t % 365) % 30);

  return (
    <AppContext.Provider value={[lead, setLead]}>
      <Container>
        <h3>리드타임 예측</h3>
        <Row>
          <Col xs={4} className="colLeft">
            <Items />
          </Col>
          <Col className="colRight">
            <Calendar
              value={
                moment(startDate).add(lead?.[0]["leadtime_predicted"], "days")[
                  "_d"
                ]
              }
              locale="en-EN"
              className="calendar"
            />
            <br />
            {visible && (
              <div>
                {lead?.[0]["machinery"]} / {lead?.[0]["items"]} /{" "}
                {lead?.[0]["part1"]}의<br />
                예상 리드타임은 {`${y}year ${m}month ${d2}day`} 입니다.
                <br />
                발주일이 {moment(a).format("YYYY년 MM월 DD일")}이라면{" "}
                {moment(startDate).add(b, "days").format("YYYY년 MM월 DD일")}에
                입고예정입니다.
              </div>
            )}

            <Visual props={lead} />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="top">
              · 리드타임 예측 서비스입니다. <br />
              <br />
              · MACHINERY - 부품 대분류를 선택하십시오.
              <br />
              · Description - 부품을 선택하십시오.
              <br />
              · Part NO - 부품 번호를 선택하십시오.
              <br />
              · Order Date - 주문 예상일자를 입력하십시오.
              <br />
            </div>
            <font color="gray">
              · 검색 버튼을 클릭하시면 해당 품목의 도착예상일자를 조회하실 수
              있습니다.
              <br />· 과거 기록 버튼을 클릭하시면 과거 리드타임 이력을 조회하실
              수 있습니다.
            </font>
          </Col>
        </Row>
      </Container>
    </AppContext.Provider>
  );
}

export default SelectDate;
