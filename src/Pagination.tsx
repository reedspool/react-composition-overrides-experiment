import { useState } from "react";
import { Anchor, Button } from "./BasicComponents";

interface PaginationProps {
    currentPage: number;
    onPageChange: (page: number) => void;
    total: number;
    Target?: React.FC<React.PropsWithChildren<any>>
    DisabledTarget?: React.FC<React.PropsWithChildren<any>>
}

export type PaginationTargetProps = React.PropsWithChildren<{
    page: number;
    onPageChange: PaginationProps['onPageChange'];
    disabled?: boolean;
}>

export const PaginationButton: React.FC<PaginationTargetProps> =
    ({ page, children, onPageChange, ...rest }) =>
        <Button
            onClick={() => onPageChange(page)} {...rest}>{children}</Button>

export const PaginationAnchor: React.FC<PaginationTargetProps> =
    ({ page, children, onPageChange, ...rest }) =>
        <Anchor onClick={() => onPageChange(page)} {...rest}>{children}</Anchor>

export const Pagination: React.FC<PaginationProps> =
    ({
        currentPage,
        onPageChange,
        total,
        Target = PaginationButton,
    }) => {
        return <nav>
            <ul>
                <li>
                    <Target {...{ onPageChange }} page={1}>
                        first
                    </Target>
                </li>
                <li>
                    <Target {...{ onPageChange }} page={currentPage - 1}>
                        prev
                    </Target>
                </li>
                <li>
                    <Target onPageChange={() => { }} page={currentPage} disabled>
                        {currentPage}
                    </Target>
                </li>
                <li>
                    <Target
                        {...{ onPageChange }}
                        page={currentPage + 1}
                    >
                        next
                    </Target>
                </li>
                <li>
                    <Target
                        {...{ onPageChange }}
                        page={total}
                    >
                        last
                    </Target>
                </li>
            </ul>
        </nav>
    }

interface LocalPaginationProps {
    total: PaginationProps['total'];
    onPageChange: PaginationProps['onPageChange']
    Pagination?: typeof DefaultPagination
}

const DefaultPagination = Pagination;

export const LocalPagination: React.FC<LocalPaginationProps> =
    ({ total, onPageChange, Pagination = DefaultPagination }) => {
        const [currentPage, setCurrentPage] = useState(1);
        const localOnPageChange: typeof onPageChange = (page) => {
            // First, set current page to new page
            setCurrentPage(page);
            // Then call the user's onPageChange
            onPageChange(page);
        }

        return <Pagination
            onPageChange={localOnPageChange}
            {...{ currentPage, total }}
        />
    }
