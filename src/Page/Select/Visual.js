import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import Barchart from './BarChart';
import Button from 'react-bootstrap/Button';
import './Visual.css'
import { getPastLeadtime } from "../../API/main";

function Visual(props){
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [list, setList] = useState();

  const machinery = props['props']?.[0]['machinery']
  const items = props['props']?.[0]['items']
  const part1 = props['props']?.[0]['part1']

  useEffect(()=>{
    (async () => {
      await getPastLeadtime(machinery, items, part1)
        .then((res)=>{
          //axios의 response인 Json에 key, value를 추가하는 법
          res.predicted_leadtime = props['props']?.[0]['leadtime_predicted']
          setList(res);
        })
    })();
  },[props])

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return(
    <>
      <Button className='butt2' variant="dark" onClick={() => setModalIsOpen(true)}>기록</Button>
	    <Modal isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)} 
        ariaHideApp={false} 
        style={customStyles}>
        <Barchart props={list}/>
      </Modal>
    </>
  )
};
export default Visual;