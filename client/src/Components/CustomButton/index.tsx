import { Button } from 'antd';
import React, { FC } from 'react'
import { ICustomButton } from './ICustomButton';

const CustomButton: FC<ICustomButton> = (props) => {
    const { children } = props
    return <Button {...props}>
        {children}
    </Button>
}

export default React.memo(CustomButton)