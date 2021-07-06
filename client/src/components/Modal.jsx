import {Modal, Button} from 'react-bootstrap'

function MyVerticallyCenteredModal({children, heading, show, onHide}) {
    return (
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <h2>{heading}</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>إلغاء</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default MyVerticallyCenteredModal