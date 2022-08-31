import { useState } from "react";
import "./Modal.css";
//code inspired by Ziratsu
const MyModal = (shown: boolean, hideModal: () => void) => {
  if (shown) {
    document.body.classList.add("stop-scrolling");
  } else {
    document.body.classList.remove("stop-scolling");
  }
  return (
    <div className="modal">
      <div onClick={hideModal} className="overlay"></div>
      <div className="modal-content">
        <h2>Hoi</h2>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Reprehenderit iusto aperiam dolorem, inventore cupiditate neque,
          suscipit aliquid labore alias iste mollitia! Quia, consequuntur.
        </p>
        <button className="close-modal" onClick={hideModal}></button>
      </div>
    </div>
  );
};
export default MyModal;
