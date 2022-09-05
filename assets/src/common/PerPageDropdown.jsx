import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from 'react-bootstrap';

function PerPageDropdown(props) {
    return (
        <Dropdown onSelect={(limit) => props.onChange(limit)}>
            <Dropdown.Toggle variant="outline-secondary">
                {props.currentLimit} per page
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {
                    props.limits.map((limit) => (
                        <Dropdown.Item eventKey={limit} key={'per-page-limit-' + limit} active={props.currentLimit === limit}>{limit}</Dropdown.Item>
                    ))
                }
            </Dropdown.Menu>
        </Dropdown>
    );
}

PerPageDropdown.propTypes = {
    currentLimit: PropTypes.number,
    limits: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func.isRequired
};

PerPageDropdown.defaultProps = {
    currentLimit: 25,
    limits: [
        25,
        50,
        100,
        250
    ]
};

export default PerPageDropdown;
