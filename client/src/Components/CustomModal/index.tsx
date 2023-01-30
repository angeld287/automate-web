import React from 'react';
import { Modal } from 'antd';
import IModal from './IModal'

const CustomModal: React.FC<IModal> = ({title, open, setOpen, width, children, footer, style}) => {

  return (
    <>
      <Modal
        centered
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        {...{width, title, footer, open, style}}
      >
        {children}
      </Modal>
    </>
  );
};

export default CustomModal;