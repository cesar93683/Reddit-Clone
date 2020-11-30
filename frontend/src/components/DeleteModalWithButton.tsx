import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface DeleteModalWithButtonProps {
  onDelete: () => void;
  type: string;
}

export default function DeleteModalWithButton(
  props: DeleteModalWithButtonProps
) {
  const { onDelete, type } = props;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onCloseDeleteModal = () => setShowDeleteModal(false);
  const onShowDeleteModal = () => setShowDeleteModal(true);

  const onDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  return (
    <>
      <Button variant="danger" onClick={onShowDeleteModal}>
        Delete
      </Button>
      <Modal show={showDeleteModal} onHide={onCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {`Are you sure you want to delete this ${type}?`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCloseDeleteModal}>
            No
          </Button>
          <Button variant="danger" onClick={onDeleteConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
