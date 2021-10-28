import formatDate from 'date-fns/format'
import { Children, MouseEvent, useEffect, useRef, useState } from 'react'
import { RiCheckFill, RiCloseFill, RiDeleteBinLine, RiEdit2Line, RiMore2Line } from 'react-icons/ri'
import { Button, ButtonProps } from '../form/button'
import { Img, ImgProps } from '../img'
import { NotFound } from '../not-found'
import { Dropdown } from '../popover/dropdown'
import { Spinner } from '../spinner'
import { useDataTable } from './data-table'
import { NumberPipe } from '../../../lib/pipes/number'

interface TableProps extends ReactProps {
    items?: any
}

export function Table({ className = '', style = {}, ...props }: TableProps) {
    const { itemName, items, headers, loadingItems, selection, setSelection } = useDataTable()
    const [tableItems, setTableItems] = useState<any[]>(undefined)

    const columnComponents = Children.map(props.children, (child) =>
        child?.type?.displayName === 'Column' ? { child } : null
    )
    const columns = (columnComponents?.map((col) => col.child.props) || []) as ColumnProps[]
    const children = Children.map(props.children, (child) =>
        !child?.type?.displayName ? { child } : null
    )
    console.log(columns, tableItems)

    useEffect(() => {
        setTableItems(items || props.items)
    }, [items, props.items])

    return (
        <table
            className={`w-full border-l border-r border-collapse ${className}`}
            style={{ ...style }}
        >
            <thead>
                <tr className="uppercase text-sm font-semibold bg-gray-50 text-gray-600 border-b border-t">
                    {columns.map((col, index, arr) => (
                        <th
                            onClick={() => {}}
                            key={index}
                            className={`py-3 ${
                                index == 0
                                    ? 'pl-3 pr-2'
                                    : index == arr.length - 1
                                    ? 'pl-2 pr-3'
                                    : 'px-2'
                            }`}
                        >
                            <div className={`flex items-center justify-center`}>{col.label}</div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="relative">
                {loadingItems && (
                    <>
                        {tableItems?.length ? (
                            <tr>
                                <td className="border-b" colSpan={100}>
                                    <Spinner className="absolute py-0 h-full max-h-44" />
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td className="border-b" colSpan={100}>
                                    <Spinner className="py-20" />
                                </td>
                            </tr>
                        )}
                    </>
                )}
                {tableItems && !tableItems.length && (
                    <tr>
                        <td className="border-b" colSpan={100}>
                            <NotFound className="py-20" text={`Không tìm thấy ${itemName}`} />
                        </td>
                    </tr>
                )}
                {tableItems?.map((item, index) => (
                    <tr
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        key={index}
                        style={{ transitionProperty: 'background-color' }}
                        className={`border-b text-gray-800 duration-75 h-12 ${
                            selection ? 'bg-primary-light' : 'hover:bg-gray-50'
                        } ${
                            loadingItems
                                ? 'opacity-0 border-transparent pointer-events-none'
                                : `${
                                      index == tableItems.length - 1
                                          ? 'border-transparent'
                                          : 'border-gray-200'
                                  }`
                        }`}
                    >
                        {columns.map((col, index, arr) => (
                            <td
                                key={index}
                                className={`${
                                    index == 0
                                        ? 'py-2 pl-3 pr-2'
                                        : index == arr.length - 1
                                        ? 'py-2 pl-2 pr-3'
                                        : 'p-2'
                                } ${
                                    col.center
                                        ? 'text-center'
                                        : col.right
                                        ? 'text-right'
                                        : 'text-left'
                                } ${
                                    col.top
                                        ? 'align-top'
                                        : col.bottom
                                        ? 'align-bottom'
                                        : 'align-middle'
                                } ${col.className || ''}`}
                                style={{ width: col.width ? col.width + 'px' : 'auto' }}
                            >
                                {col.render(item)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

interface ColumnProps extends ReactProps {
    label?: string
    center?: boolean
    right?: boolean
    top?: boolean
    bottom?: boolean
    width?: number
    orderBy?: string
    render?: (item: any, column?: ColumnProps) => React.ReactNode
}
const Column = ({ children }: ColumnProps) => children
Column.displayName = 'Column'
Table.Column = Column

interface CellProps extends ReactProps {
    value: any
}

interface CellTextProps extends CellProps {
    subText?: any
    subTextClassName?: string
    image?: string
    imageClassName?: string
    avatar?: string
    ratio169?: boolean
    percent?: number
    compress?: number
}
const CellText = ({
    value,
    className = '',
    style = {},
    subText = '',
    subTextClassName = 'text-sm',
    image,
    avatar,
    imageClassName = '',
    ratio169,
    percent,
    compress,
}: CellTextProps) => (
    <div className="flex items-center">
        {(image !== undefined || avatar !== undefined) && (
            <Img
                compress={compress || 80}
                className={`w-10 mr-3 ${imageClassName}`}
                imageClassName={`border border-gray-300`}
                src={image || avatar}
                avatar={avatar !== undefined}
                showImageOnClick
                ratio169={ratio169}
                percent={percent}
            />
        )}
        <div className="flex-1">
            <div className={`${className}`} style={{ ...style }}>
                {value}
            </div>
            {subText && <div className={`${subTextClassName}`}>{subText}</div>}
        </div>
    </div>
)
CellText.displayName = 'CellText'
Table.CellText = CellText

interface CellDateProps extends CellProps {
    format?: string
}
const CellDate = ({ value, className = '', style = {}, format = 'dd-MM-yyyy' }: CellDateProps) => (
    <div className={`${className}`} style={{ ...style }}>
        {value ? formatDate(new Date(value), format) : ''}
    </div>
)
CellDate.displayName = 'CellDate'
Table.CellDate = CellDate

interface CellNumberProps extends CellProps {
    currency?: string | boolean
}
const CellNumber = ({ value, className = '', style = {}, currency }: CellNumberProps) => (
    <div className={`${className}`} style={{ ...style }}>
        {NumberPipe(value, currency)}
    </div>
)
CellNumber.displayName = 'CellNumber'
Table.CellNumber = CellNumber

interface CellBooleanProps extends CellProps {
    trueIcon?: JSX.Element
    falseIcon?: JSX.Element
    trueClassName?: string
    falseClassName?: string
}
const CellBoolean = ({
    value,
    className = '',
    style = {},
    trueIcon = <RiCheckFill />,
    trueClassName = 'text-success',
    falseIcon = <RiCloseFill />,
    falseClassName = 'text-gray-700',
}: CellBooleanProps) => (
    <div className={`flex-center ${className}`} style={{ ...style }}>
        <i className={`${value ? trueClassName : falseClassName}`}>
            {value ? trueIcon : falseIcon}
        </i>
    </div>
)
CellBoolean.displayName = 'CellBoolean'
Table.CellBoolean = CellBoolean

interface CellImageProps extends CellProps, ImgProps {
    center?: boolean
    right?: boolean
    compress?: number
}
const CellImage = ({
    value,
    className = '',
    style = {},
    center,
    right,
    compress,
    ...props
}: CellImageProps) => (
    <Img
        compress={compress || 80}
        className={`flex ${center ? 'mx-auto' : right ? 'ml-auto' : 'mr-auto'} ${className}`}
        imageClassName="border border-gray-300"
        style={{ ...style }}
        src={value}
        showImageOnClick
        {...props}
    />
)
CellImage.displayName = 'CellImage'
Table.CellImage = CellImage

interface CellStatusProps extends CellProps {
    options: Option[]
    isLabel?: boolean
}
const CellStatus = ({
    value,
    className = '',
    style = {},
    options,
    isLabel = true,
}: CellStatusProps) => {
    let option = options.find((option) => option.value == value)
    return (
        <span
            className={`${isLabel ? 'status-label' : 'status-text'} ${
                option?.color
                    ? isLabel
                        ? 'bg-' + option.color
                        : 'text-' + option.color
                    : isLabel
                    ? 'bg-gray-400 text-gray-700'
                    : 'text-gray-700'
            } ${className}`}
            style={{
                ...style,
            }}
        >
            {option?.label}
        </span>
    )
}
CellStatus.displayName = 'CellStatus'
Table.CellStatus = CellStatus

interface CellActionProps extends ReactProps {}
const CellAction = ({ className = '', style = {}, children }: CellActionProps) => {
    return (
        <div className={`flex border-group ${className}`} style={{ ...style }}>
            {children}
        </div>
    )
}
CellAction.displayName = 'CellAction'
Table.CellAction = CellAction

interface CellButtonProps extends ButtonProps {
    value: any
    isEditButton?: boolean
    isDeleteButton?: boolean
    refreshAfterTask?: boolean
    moreItems?: ((ButtonProps & { refreshAfterTask?: boolean }) | 'divider')[]
}
const CellButton = ({
    value,
    isEditButton,
    isDeleteButton,
    refreshAfterTask,
    moreItems,
    className = '',
    ...props
}: CellButtonProps) => {
    const { loadAll, onDeleteItem } = useDataTable()
    const ref = useRef()

    let icon = props.icon
    if (!icon) {
        if (isEditButton) {
            icon = <RiEdit2Line />
        } else if (isDeleteButton) {
            icon = <RiDeleteBinLine />
        } else if (moreItems) {
            icon = <RiMore2Line />
        }
    }

    return (
        <>
            <Button
                {...props}
                icon={icon}
                innerRef={props.innerRef || ref}
                hoverDanger={isDeleteButton}
                className={`text-xl px-3 ${className}`}
                onClick={async (e) => {
                    try {
                        if (props.onClick) await props.onClick(e)
                        // if (isEditButton) await onUpdateItem(value)
                        if (isDeleteButton) await onDeleteItem(value)
                        if (refreshAfterTask) await loadAll()
                    } catch (err) {}
                }}
            />
            {moreItems && (
                <Dropdown reference={props.innerRef || ref}>
                    {moreItems.map((item, index) =>
                        item == 'divider' ? (
                            <Dropdown.Divider key={index} />
                        ) : (
                            <Dropdown.Item
                                key={index}
                                {...item}
                                onClick={async (e) => {
                                    try {
                                        if (item.onClick) await item.onClick(e)
                                        if (item.refreshAfterTask) await loadAll()
                                    } catch (err) {}
                                }}
                            />
                        )
                    )}
                </Dropdown>
            )}
        </>
    )
}
CellButton.displayName = 'CellButton'
Table.CellButton = CellButton
