import React from 'react';
import { Button } from "antd";
import PropTypes from "prop-types";

const CustomButton = ({ _key, onClick, children, type, loading, Icon, color, className }) => {
    return <Button
        style={{ color: color }}
        icon={Icon === undefined ? null : <Icon />}
        type={type}
        loading={loading}
        key={_key}
        onClick={onClick}
        className={className}>
        {children}
    </Button>;
};

CustomButton.propTypes = {
    children: PropTypes.any,
    type: PropTypes.string,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    _key: PropTypes.string,
    Icon: PropTypes.any,
    color: PropTypes.string,
    className: PropTypes.string,
}

export default React.memo(CustomButton);
