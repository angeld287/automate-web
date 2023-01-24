import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import IModal from './IModal'

const CustomModal: React.FC<IModal> = ({title, open, setOpen, width, children}) => {

  return (
    <>
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        {...{width, title}}
      >
        {children}
      </Modal>
    </>
  );
};

export default CustomModal;