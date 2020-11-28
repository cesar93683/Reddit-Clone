import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface DeleteModalWithButtonProps {
  onDelete: () => void;
  type: string;
}

const DeleteModalWithButton = (props: DeleteModalWithButtonProps) => {
  const { onDelete, type } = props;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  return (
    <>
      <Button variant="danger" onClick={handleShowDeleteModal}>
        Delete
      </Button>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {`Are you sure you want to delete this ${type}?`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteModalWithButton;
