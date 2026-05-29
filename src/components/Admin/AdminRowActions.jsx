import React from 'react';
import Button from '../UI/Button';

const AdminRowActions = ({
  onEdit,
  onDelete,
  editLabel = 'Editar',
  deleteLabel = 'Excluir',
  editClassName,
  deleteClassName,
}) => {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Button onClick={onEdit} className={editClassName}>
        {editLabel}
      </Button>
      <Button onClick={onDelete} className={deleteClassName}>
        {deleteLabel}
      </Button>
    </div>
  );
};

export default AdminRowActions;