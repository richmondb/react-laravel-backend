import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


interface props {
    Disabled: boolean,
    ButtonName: string,
    ModalHeading?: string,
    ModalBody?: string
    Onclick: () => void,
}

function ConfirmModal({Disabled, ButtonName, ModalHeading, ModalBody, Onclick}: props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleButtonClick = () => {
        Onclick();
        setShow(false)
    };

    return (<>
        <Button type={"button"} variant="outline-danger" disabled={Disabled} onClick={handleShow}>
            {ButtonName}
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{ModalHeading}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{ModalBody}</Modal.Body>
            <Modal.Footer>
                <Button type={"button"} variant="outline-secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type={"button"} className={'btn-outline-lexorange'} variant={"outline-primary"}
                        onClick={handleButtonClick}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default ConfirmModal;