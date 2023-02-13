import React from 'react';
import { Modal } from 'antd';
import IModal from './IModal'

const CustomModal: React.FC<IModal> = ({title, open, setOpen, width, children, footer, style, onOk, confirmLoading}) => {

  return (
    <>
      <Modal
        centered
        onOk={() => onOk ? onOk() : null}
        onCancel={() => setOpen(false)}
        {...{width, title, footer, open, style, confirmLoading}}
      >
        {children}
      </Modal>
    </>
  );
};

export default CustomModal;