import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import IModal from './IModal'

const CustomModal: React.FC<IModal> = ({title, open, setOpen, width, children, footer}) => {

  return (
    <>
      <Modal
        centered
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        {...{width, title, footer, open}}
      >
        {children}
      </Modal>
    </>
  );
};

export default CustomModal;