import {Dropdown} from 'react-bootstrap';

function PerPageDropdown({
    currentLimit = 25,
    limits = [
        25,
        50,
        100,
        250
    ],
    isDisabled = false,
    onChange = () => {}
}) {
    return (
        <Dropdown onSelect={(limit) => onChange(limit)}>
            <Dropdown.Toggle variant="outline-secondary" disabled={isDisabled}>
                {currentLimit} per page
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {
                    limits.map((limit) => (
                        <Dropdown.Item eventKey={limit} key={'per-page-limit-' + limit} active={currentLimit === limit}>{limit}</Dropdown.Item>
                    ))
                }
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default PerPageDropdown;
