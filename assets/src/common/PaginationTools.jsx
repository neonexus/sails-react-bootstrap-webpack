import {Col, Row} from 'react-bootstrap';
import PerPageDropdown from './PerPageDropdown';
import PaginationBar from './PaginationBar';

function PaginationTools({
    currentLimit = 25,
    currentPage = 1,
    limits = [
        25,
        50,
        100,
        250
    ],
    isDisabled = false,
    onPageChange = null,
    onPerPageChange = null,
    showMaxPages = 7,
    totalPages = null
}) {
    if (typeof onPageChange !== 'function') {
        console.error('`onPageChange` is a required function for PaginationTools.');

        return 'ERROR!';
    }

    if (typeof onPerPageChange !== 'function') {
        console.error('`onPerPageChange` is a required function for PaginationTools.');

        return 'ERROR!';
    }

    if (!totalPages || isNaN(totalPages)) {
        console.error('`totalPages` is a required number for PaginationTools.');

        return 'ERROR!';
    }

    return (
        <Row>
            <Col className="justify-content-start">
                <PerPageDropdown onChange={(limit) => onPerPageChange(limit)} currentLimit={currentLimit} limits={limits} isDisabled={isDisabled} />
            </Col>
            <Col className="justify-content-end d-flex">
                <PaginationBar pages={totalPages} onChange={(page) => onPageChange(page)} currentPage={currentPage} showMax={showMaxPages} isDisabled={isDisabled} />
            </Col>
        </Row>
    );
}

export default PaginationTools;
