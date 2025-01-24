import {useMemo} from 'react';
import Pagination from 'react-bootstrap/Pagination';

function PaginationBar({currentPage, onChange, pages, isDisabled = false, showMax = 5}) {
    if (typeof currentPage !== 'number' || currentPage <= 0) {
        throw new Error('currentPage must be a positive number for PaginationBar.');
    }

    if (!onChange || typeof onChange !== 'function') {
        throw new Error('onChange is a required callback function for PaginationBar.');
    }

    if (typeof pages !== 'number' || pages <= 0) {
        throw new Error('pages must be a positive number for PaginationBar.');
    }

    const handleOnClick = (page) => {
        if (page !== currentPage) {
            onChange(page);
        }
    };

    const generateItems = useMemo(() => {
        const items = [];
        let startAt = currentPage - Math.floor(showMax / 2);
        let last = 1;

        if (startAt < 1) {
            startAt = 1;
        }

        const max = showMax > pages ? pages : showMax;

        for (let x = 0; x < max; ++x) {
            if (startAt + x >= pages) {
                break;
            }

            last = startAt + x;

            items.push(
                <Pagination.Item
                    key={`page-item-${startAt + x}`}
                    active={currentPage === startAt + x}
                    onClick={() => handleOnClick(startAt + x)}
                    disabled={pages === 1 || isDisabled}
                >
                    {startAt + x}
                </Pagination.Item>
            );
        }

        if (startAt > 1) {
            if (startAt === 2) {
                items.unshift(
                    <Pagination.Item key="page-item-1" active={currentPage === 1} onClick={() => handleOnClick(1)} disabled={isDisabled}>1</Pagination.Item>
                );
            } else {
                items.unshift(
                    <Pagination.Ellipsis key="page-item-first-ellipsis" onClick={() => handleOnClick(startAt - 1)} disabled={isDisabled} />
                );
            }
        }

        if (last + 1 < pages) {
            if (last + 2 === pages) {
                items.push(
                    <Pagination.Item key={`page-item-${last + 1}`} active={currentPage === last + 1} onClick={() => handleOnClick(last + 1)} disabled={isDisabled}>
                        {last + 1}
                    </Pagination.Item>
                );
            } else {
                items.push(
                    <Pagination.Ellipsis key="page-item-last-ellipsis" onClick={() => handleOnClick(last + 1)} disabled={isDisabled} />
                );
            }
        }

        if (pages < 1) {
            items.push(
                <Pagination.Item key="page-item-last" disabled>1</Pagination.Item>
            );
        } else {
            items.push(
                <Pagination.Item key="page-item-last" active={currentPage === pages} onClick={() => handleOnClick(pages)} disabled={isDisabled}>
                    {pages}
                </Pagination.Item>
            );
        }

        return items;
    }, [currentPage, isDisabled, pages, showMax]);

    return (
        <Pagination>
            {
                (pages > 6) ? <Pagination.First onClick={() => handleOnClick(1)} disabled={currentPage === 1 || isDisabled} /> : null
            }

            {
                (pages > 4 || pages === 1) ? <Pagination.Prev onClick={() => handleOnClick(currentPage - 1)} disabled={currentPage === 1 || isDisabled} /> : null
            }

            {generateItems}

            {
                (pages > 4 || pages === 1) ? <Pagination.Next onClick={() => handleOnClick(currentPage + 1)} disabled={currentPage === pages || isDisabled} /> : null
            }

            {
                (pages > 6) ? <Pagination.Last onClick={() => handleOnClick(pages)} disabled={currentPage === pages || isDisabled} /> : null
            }
        </Pagination>
    );
}

export default PaginationBar;
