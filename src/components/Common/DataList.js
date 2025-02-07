import React, { useCallback, useEffect, useState } from 'react'
import TableCustomers from '../../Pages/Customers/TableCustomers';
import TableAccountingControl from '../../Pages/AccountingControl/TableAccountingControl';
import DataListPagination from './DataListPagination';
import TablePurchaseOrder from '../../Pages/PurchaseOrders/TablePurchaseOrder';
import TableProductsReception from '../../Pages/ProductsReception/TableProductsReception';
import TableStock from '../../Pages/Stock/TableStock';
import TableSuppliers from '../../Pages/Suppliers/TableSuppliers';
import TableWarehouses from '../../Pages/Warehouses/TableWarehouses';
import TableWarehouseLines from '../../Pages/Warehouses/TableWarehouseLines';
import TableStockMove from '../../Pages/StockMove/TableStockMove';
import TableMenu from '../../Pages/Restaurant/Menu/TableMenu';
import TableCleaningJobs from '../../Pages/CleaningJobs/TableCleaningJobs';
import TableTaxManagement from '../../Pages/TaxManagement/TableTaxManagement';
import TableUsers from '../../Pages/GeneralSettings/Users/TableUsers';
import TableRoles from '../../Pages/GeneralSettings/Roles/TableRoles';
import TableSupplyType from '../../Pages/GeneralSettings/SupplyType/TableSupplyType';
import TableLocations from '../../Pages/GeneralSettings/Locations/TableLocations';
import TableCleanlinessCheck from '../../Pages/CleanlinessCheck/TableCleanlinessCheck';
import TableInternTransfers from '../../Pages/InternTransfers/TableInternTransfers';
import TableAssets from '../../Pages/Assets/TableAssets';
import TableAssetMove from '../../Pages/AssetsMove/TableAssetMove';
import TableInvoicesIssued from '../../Pages/Invoices/TableInvoicesIssued';
import TableInvoicesParameters from '../../Pages/Invoices/TableInvoicesParameters';
import TableTypeRoom from '../../Pages/GeneralSettings/Hotel/TypeRoom/TableTypeRoom'
import TableAmenities from '../../Pages/GeneralSettings/Hotel/Amenities/TableAmenities'
import TableExtraService from '../../Pages/GeneralSettings/Hotel/ExtraService/TableExtraService'
import TableRooms from '../../Pages/GeneralSettings/Hotel/Rooms/TableRooms';
import TableSeason from '../../Pages/GeneralSettings/Hotel/Season/TableSeason';
import TablePackage from '../../Pages/GeneralSettings/Hotel/AdminPackage/TablePackage';
import TableTours from '../../Pages/GeneralSettings/Hotel/Tours/TableTours';
import TableTypeService from '../../Pages/GeneralSettings/Hotel/TypeService/TableTypeService';
import TableOperativeAreas from '../../Pages/GeneralSettings/Hotel/OperativeAreas/TableOperativeAreas';
import TableNotes from '../../Pages/Reception/Availability/NewBooking/Notes/TableNotes';
import TableTypeRoomSeason from '../../Pages/GeneralSettings/Hotel/Season/TableTypeRoomSeason';
import TableDataTypeRoom from '../../Pages/Reception/Availability/NewBooking/TableDataTypeRoom';
import TableDate from './TableDate';
import TableOrders from '../../Pages/Restaurant/Orders/TableOrders';
import TableFloors from '../../Pages/GeneralSettings/Floors/TableFloors';
import TableTables from '../../Pages/GeneralSettings/Tables/TableTables';
import TableMenuType from '../../Pages/GeneralSettings/MenuType/TableMenuType';
import TableDishType from '../../Pages/GeneralSettings/DishType/TableDishType';
import TablePaymentMethod from '../../Pages/GeneralSettings/PaymentMethod/TablePaymentMethod';
/* import TableListBooking from '../../Pages/Reception/ListBooking/TableListBooking';/*  */

const DataList = ({ ...props }) => {
    const { data, type, displayLength, onDelete } = props;
    const [page, setPage] = useState(() => {
        const savedPage = localStorage.getItem('active_page_' + type);
        return savedPage && data?.length > displayLength ? parseInt(savedPage, 10) : 1;
    });

    const [datos, setDatos] = useState([]);

    // Memoriza la función getData para que no se redefina en cada renderizado
    const getData = useCallback(() => {
        let array = [];
        const startIndex = (page - 1) * displayLength;
        let size = data.length;

        if (startIndex + displayLength <= data.length) {
            size = startIndex + displayLength;
        }

        for (let i = startIndex; i < size; i++) {
            array.push(data[i]);
        }

        return array;
    }, [data, page, displayLength]);

    useEffect(() => {
        if (data.length < displayLength && page !== 1) {
            setPage(1);
        } else {
            setDatos(getData());
        }
    }, [data, displayLength, page, getData]);

    return (
        <>
            <div className="table-responsive">
                {
                    type === 'customers' &&
                    <TableCustomers {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'suppliers' &&
                    <TableSuppliers {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'purchaseOrders' &&
                    <TablePurchaseOrder {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'accountingControl' &&
                    <TableAccountingControl {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'productsReception' &&
                    <TableProductsReception {...props} data={datos} />
                }
                {
                    type === 'stock' &&
                    <TableStock {...props} data={datos} />
                }
                {
                    type === 'warehouses' &&
                    <TableWarehouses {...props} data={datos} />
                }
                {
                    type === 'warehouseLines' &&
                    <TableWarehouseLines {...props} data={datos} />
                }
                {
                    type === 'stockMove' &&
                    <TableStockMove {...props} data={datos} />
                }
                {
                    type === 'menu' &&
                    <TableMenu {...props} data={datos} />
                }
                {
                    type === 'cleaningJobs' &&
                    <TableCleaningJobs {...props} data={datos} />
                }
                {
                    type === 'taxManagement' &&
                    <TableTaxManagement {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'users' &&
                    <TableUsers {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'roles' &&
                    <TableRoles {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'SupplyType' &&
                    <TableSupplyType {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'locations' &&
                    <TableLocations {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'cleanlinessChecks' &&
                    <TableCleanlinessCheck {...props} data={datos} />
                }
                {
                    type === 'internTransfers' &&
                    <TableInternTransfers {...props} data={datos} />
                }
                {
                    type === 'assets' &&
                    <TableAssets {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'assetMove' &&
                    <TableAssetMove {...props} data={datos} />
                }
                {
                    type === 'typeroom' &&
                    <TableTypeRoom {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'amenities' &&
                    <TableAmenities {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'extraservice' &&
                    <TableExtraService {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'rooms' &&
                    <TableRooms {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'season' &&
                    <TableSeason {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'package' &&
                    <TablePackage {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'tour' &&
                    <TableTours {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'typservice' &&
                    <TableTypeService {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'operativearea' &&
                    <TableOperativeAreas {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'notes' &&
                    <TableNotes {...props} data={datos} />
                }
                {
                    type === 'typeroomseason' &&
                    <TableTypeRoomSeason {...props} data={datos} />
                }
                {
                    type === 'typeroomdata' &&
                    <TableDataTypeRoom data={datos} />
                }
                {
                    type === 'invoicesIssued' &&
                    <TableInvoicesIssued {...props} data={datos} />
                }
                {
                    type === 'invoicesParameters' &&
                    <TableInvoicesParameters {...props} data={datos} />
                }
                {
                    type === 'tableDate' &&
                    <TableDate {...props} data={datos} />
                }
                {
                    type === 'orders' &&
                    <TableOrders {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'floors' &&
                    <TableFloors {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'tables' &&
                    <TableTables {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'menuType' &&
                    <TableMenuType {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'dishType' &&
                    <TableDishType {...props} data={datos} onDelete={onDelete} />
                }
                {
                    type === 'paymentMethod' &&
                    <TablePaymentMethod {...props} data={datos} onDelete={onDelete} />
                }
               {/*  {
                    type === 'listbook' &&
                    <TableListBooking {...props} data={datos} onDelete={onDelete} />
                } */}
            </div>
            {(data.length > displayLength) &&
                <DataListPagination type={type} length={data.length} displayLength={displayLength} activePage={parseInt(page)} setPage={setPage} />
            }
        </>
    )
}

export default DataList