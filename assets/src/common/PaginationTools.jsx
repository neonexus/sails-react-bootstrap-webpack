import PropTypes from 'prop-types';
import {Col, Row} from 'react-bootstrap';
import PerPageDropdown from './PerPageDropdown';
import PaginationBar from './PaginationBar';

function PaginationTools(props) {
    return (
        <Row>
            <Col className="justify-content-start">
                <PerPageDropdown onChange={(limit) => props.onPerPageChange(limit)} currentLimit={props.currentLimit} limits={props.limits} isDisabled={props.isDisabled} />
            </Col>
            <Col className="justify-content-end d-flex">
                <PaginationBar pages={props.totalPages} onChange={(page) => props.onPageChange(page)} currentPage={props.currentPage} showMax={props.showMaxPages} isDisabled={props.isDisabled} />
            </Col>
        </Row>
    );
}

PaginationTools.propTypes = {
    currentLimit: PropTypes.number,
    currentPage: PropTypes.number,
    limits: PropTypes.arrayOf(PropTypes.number),
    isDisabled: PropTypes.bool.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onPerPageChange: PropTypes.func.isRequired,
    showMaxPages: PropTypes.number,
    totalPages: PropTypes.number.isRequired
};

PaginationTools.defaultProps = {
    currentLimit: 25,
    currentPage: 1,
    limits: [
        25,
        50,
        100,
        250
    ],
    showMaxPages: 7
};

export default PaginationTools;
