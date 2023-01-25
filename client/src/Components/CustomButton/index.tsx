import { Button, ButtonProps } from 'antd';
import React, { FC } from 'react'

const CustomButton: FC<ButtonProps> = (props) => {
    const { children } = props
    return <Button {...props}>
        {children}
    </Button>
}

export default React.memo(CustomButton)