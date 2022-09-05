import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'react-bootstrap/Pagination';

function PaginationBar(props) {
    function handleOnClick(page) {
        if (page !== props.currentPage) {
            props.onChange(page);
        }
    }

    function generateItems() {
        let items = [];
        let startAt = props.currentPage - Math.floor(props.showMax / 2);
        let last = 1;

        if (startAt < 1) {
            startAt = 1;
        }

        const max = props.showMax > props.pages ? props.pages : props.showMax;

        for (let x = 0; x < max; ++x) {
            if (startAt + x >= props.pages) {
                break;
            }

            last = startAt + x;

            items.push(
                <Pagination.Item key={'page-item-' + startAt + x} active={props.currentPage === startAt + x} onClick={() => handleOnClick(startAt + x)} disabled={(props.pages === 1)}>
                    {startAt + x}
                </Pagination.Item>
            );
        }

        if (startAt > 1) {
            if (startAt === 2) {
                items.unshift(
                    <Pagination.Item key="page-item-1" active={props.currentPage === 1} onClick={() => handleOnClick(1)}>1</Pagination.Item>
                );
            } else {
                items.unshift(
                    <Pagination.Ellipsis key="page-item-first-ellipsis" onClick={() => handleOnClick(startAt - 1)} />
                );
            }
        }

        if (last + 1 < props.pages) {
            if (last + 2 === props.pages) {
                items.push(
                    <Pagination.Item key={'page-item-' + last + 1} active={props.currentPage === last + 1} onClick={() => handleOnClick(last + 1)}>{last + 1}</Pagination.Item>
                );
            } else {
                items.push(
                    <Pagination.Ellipsis key="page-item-last-ellipsis" onClick={() => handleOnClick(last + 1)} />
                );
            }
        }

        items.push(
            <Pagination.Item key="page-item-last" active={props.currentPage === props.pages} onClick={() => handleOnClick(props.pages)}>{props.pages}</Pagination.Item>
        );

        return items;
    }

    return (
        <Pagination>
            {
                (props.pages > 6) ? <Pagination.First onClick={() => handleOnClick(1)} disabled={props.currentPage === 1} /> : null
            }

            {
                (props.pages > 4 || props.pages === 1) ? <Pagination.Prev onClick={() => handleOnClick(props.currentPage - 1)} disabled={props.currentPage === 1} /> : null
            }

            {generateItems()}

            {
                (props.pages > 4 || props.pages === 1) ? <Pagination.Next onClick={() => handleOnClick(props.currentPage + 1)} disabled={props.currentPage === props.pages} /> : null
            }

            {
                (props.pages > 6) ? <Pagination.Last onClick={() => handleOnClick(props.pages)} disabled={props.currentPage === props.pages} /> : null
            }
        </Pagination>
    );
}

PaginationBar.propTypes = {
    currentPage: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    pages: PropTypes.number.isRequired,
    showMax: PropTypes.number
};

PaginationBar.defaultProps = {
    showMax: 5 // 5 or 7 work best
};

export default PaginationBar;
