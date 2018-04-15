import React from "react"
import { Modal, ModalBody } from "../../components/modal/modal"

const RepayLoanModal = ({ handleClose }) => {
  return (
    <Modal show={true} size="md" onModalClosed={handleClose}>
      <ModalBody>
        MODAL BODY
      </ModalBody>
    </Modal>
  )
}

export default RepayLoanModal
