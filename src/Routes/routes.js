import React from "react";
import { Navigate } from "react-router-dom";

// Import Authentication pages
import Login from "../Pages/Authentication/Login";
import ForgetPasswordPage from "../Pages/Authentication/ForgetPassword";
import Logout from "../Pages/Authentication/Logout";
import UserProfile from "../Pages/Authentication/user-profile";
import RecoverPassword from "../Pages/Authentication/RecoverPassword";
import Home from "../Pages/Home";
import Error404 from "../Pages/Utility/Error404Page";
import Customers from "../Pages/Customers/Customers";
import NewCustomer from "../Pages/Customers/NewCustomer";

//import AccountinControl
import AccountsPayable from "../Pages/AccountingControl/AccountsPayable";
import AccountsReceivable from "../Pages/AccountingControl/AccountsReceivable";
import AccountingControl from "../Pages/AccountingControl/AccountingControl";
import EditCustomerContainer from "../Pages/Customers/EditCustomerContainer";
import PurchaseOrders from "../Pages/PurchaseOrders/PurchaseOrders";
import NewPurchaseOrder from "../Pages/PurchaseOrders/NewPurchaseOrder";
import EditPurchaseOrderContainer from "../Pages/PurchaseOrders/EditPurchaseOrderContainer";
import NewAccountsControl from "../Pages/AccountingControl/NewAccountsControl";
import ProductsReception from "../Pages/ProductsReception/ProductsReception";
import EditProductsReceptionContainer from "../Pages/ProductsReception/EditProductsReceptionContainer";
import Stock from "../Pages/Stock/Stock";
import NewProduct from "../Pages/Stock/NewProduct";
import EditProductContainer from "../Pages/Stock/EditProductContainer";
import Suppliers from "../Pages/Suppliers/Suppliers";
import NewSupplier from "../Pages/Suppliers/NewSupplier";
import EditSupplierContainer from "../Pages/Suppliers/EditSupplierContainer";
import NewRole from "../Pages/GeneralSettings/Roles/NewRole";
import EditRoleContainer from "../Pages/GeneralSettings/Roles/EditRoleContainer";
import Warehouses from "../Pages/Warehouses/Warehouses";
import NewWarehouse from "../Pages/Warehouses/NewWarehouse";
import EditWarehouseContainer from "../Pages/Warehouses/EditWarehouseContainer";

import StockMove from "../Pages/StockMove/StockMove";
import NewStockMoveIn from "../Pages/StockMove/NewStockMoveIn";
import NewStockMoveOut from "../Pages/StockMove/NewStockMoveOut";

import EditAccountingControlContainer from "../Pages/AccountingControl/EditAccountingControlContainer";
import Menu from "../Pages/Restaurant/Menu/Menu";
import NewMenu from "../Pages/Restaurant/Menu/NewMenu";
import EditMenuContainer from "../Pages/Restaurant/Menu/EditMenuContainer";
import RestaurantHome from "../Pages/Restaurant/RestaurantHome";
import CleaningJobs from "../Pages/CleaningJobs/CleaningJobs";

import ReceptionHome from "../Pages/Reception/ReceptionHome";
import AvailabilityNewBooking from "../Pages/Reception/Availability/AvailabilityNewBooking"
import NewBooking from "../Pages/Reception/Availability/NewBooking/NewBooking";

import TaxManagement from "../Pages/TaxManagement/TaxManagement";
import NewTaxManagement from "../Pages/TaxManagement/NewTaxManagement";
import EditTaxManagement from "../Pages/TaxManagement/EditTaxManagement";
import NewCleaningJob from "../Pages/CleaningJobs/NewCleaningJob";
import EditCleaningJobContainer from "../Pages/CleaningJobs/EditCleaningJobContainer";

import GeneralSettings from "../Pages/GeneralSettings/GeneralSettings";
import Users from "../Pages/GeneralSettings/Users/Users";
import NewUser from "../Pages/GeneralSettings/Users/NewUser";
import EditUser from "../Pages/GeneralSettings/Users/EditUser";
import Roles from "../Pages/GeneralSettings/Roles/Roles";
import SupplyType from "../Pages/GeneralSettings/SupplyType/SupplyType";
import EditSupplyType from "../Pages/GeneralSettings/SupplyType/EditSupplyType";
import Location from "../Pages/GeneralSettings/Locations/Locations";
import EditLocation from "../Pages/GeneralSettings/Locations/EditLocations";
import CleanlinessChecks from "../Pages/CleanlinessCheck/CleanlinessChecks";
import NewCleanlinessCheck from "../Pages/CleanlinessCheck/NewCleanlinessCheck";
import InternTransfers from "../Pages/InternTransfers/InternTransfers";
import EditCleanlinessCheckContainer from "../Pages/CleanlinessCheck/EditCleanlinessCheckContainer";
import NewInternTransfer from "../Pages/InternTransfers/NewInternTransfer";
import EditInternTransferContainer from "../Pages/InternTransfers/EditInternTransferContainer";

import Assets from "../Pages/Assets/Assets";
import NewAsset from "../Pages/Assets/NewAsset";
import EditAsset from "../Pages/Assets/EditAsset";
import AssetsMove from "../Pages/AssetsMove/AssetsMove";
import AssetMove from "../Pages/AssetsMove/AssetMove";
import NewAssetMove from "../Pages/AssetsMove/NewAssetMove";
import NewSupplyType from "../Pages/GeneralSettings/SupplyType/NewSupplyType";
import NewLocation from "../Pages/GeneralSettings/Locations/NewLocation";
import HotelHomeSettings from "../Pages/GeneralSettings/Hotel/HotelHomeSettings";
import Amenities from "../Pages/GeneralSettings/Hotel/Amenities/Amenities";
import NewAmenities from "../Pages/GeneralSettings/Hotel/Amenities/NewAmenities";
import EditAmenities from "../Pages/GeneralSettings/Hotel/Amenities/EditAmenities";
import TypeRoom from "../Pages/GeneralSettings/Hotel/TypeRoom/TypeRoom";
import NewTypeRom from "../Pages/GeneralSettings/Hotel/TypeRoom/NewTypeRoom";
import EditTypeRoom from "../Pages/GeneralSettings/Hotel/TypeRoom/EditTypeRoom";
import ExtraService from "../Pages/GeneralSettings/Hotel/ExtraService/ExtraService";
import NewExtraService from "../Pages/GeneralSettings/Hotel/ExtraService/NewExtraService";
import EditExtraService from "../Pages/GeneralSettings/Hotel/ExtraService/EditExtraService";
import EditRoom from '../Pages/GeneralSettings/Hotel/Rooms/EditRoom'
import Rooms from "../Pages/GeneralSettings/Hotel/Rooms/Roms";
import NewRoom from "../Pages/GeneralSettings/Hotel/Rooms/NewRoom";
import Season from "../Pages/GeneralSettings/Hotel/Season/Season";
import NewSeason from "../Pages/GeneralSettings/Hotel/Season/NewSeason";
import EditSeason from "../Pages/GeneralSettings/Hotel/Season/EditSeason";
import AdminPackages from "../Pages/GeneralSettings/Hotel/AdminPackage/AdminPackage";
import Tour from "../Pages/GeneralSettings/Hotel/Tours/Tours";
import NewTour from "../Pages/GeneralSettings/Hotel/Tours/NewTour";
import EditTour from "../Pages/GeneralSettings/Hotel/Tours/EditTour";
import NewPackage from "../Pages/GeneralSettings/Hotel/AdminPackage/NewPackage";
import EditPackage from "../Pages/GeneralSettings/Hotel/AdminPackage/EditPackage";
import TypeService from "../Pages/GeneralSettings/Hotel/TypeService/TypeService";
import NewTypeService from "../Pages/GeneralSettings/Hotel/TypeService/NewTypeService";
import EditTypeService from "../Pages/GeneralSettings/Hotel/TypeService/EditTypeService";
import OperativeAreas from "../Pages/GeneralSettings/Hotel/OperativeAreas/OperativeAreas";
import NewOperativeAreas from "../Pages/GeneralSettings/Hotel/OperativeAreas/NewOperativeAreas";
import EditOperativeAreas from "../Pages/GeneralSettings/Hotel/OperativeAreas/EditOperativeAreas";
import Booking from "../Pages/Reception/Availability/ViewBooking/View&EditBooking";

import InvoiceMaintenance from "../Pages/Invoices/Maintenance";
import InvoiceIssued from "../Pages/Invoices/Issued";
import InvoiceParameters from "../Pages/Invoices/Parameters";
import InvoiceCreditNote from "../Pages/Invoices/CreditNote";
import InvoiceCompany from "../Pages/Invoices/Company";

const authProtectedRoutes = [
  { path: "/home", component: <Home /> },
  { path: "/profile", component: <UserProfile /> },

  { path: "/customers", component: <Customers /> },
  { path: "/newcustomer", component: <NewCustomer /> },
  { path: "/editcustomer/:id", component: <EditCustomerContainer /> },

  { path: "/purchaseorders", component: <PurchaseOrders /> },
  { path: "/newpurchaseorder", component: <NewPurchaseOrder /> },
  { path: "/editpurchaseorder/:id", component: <EditPurchaseOrderContainer /> },

  { path: "/productsreception", component: <ProductsReception /> },
  { path: "/productsreception/:id", component: <EditProductsReceptionContainer /> },

  { path: "/assets", component: <Assets /> },
  { path: "/newasset", component: <NewAsset /> },
  { path: "/editasset/:id", component: <EditAsset /> },
  { path: "/assets/movements", component: <AssetsMove /> },
  { path: "/asset/movements/:id", component: <AssetMove /> },
  { path: "/asset/newmovement/:id", component: <NewAssetMove /> },
  { path: "/asset/newmovement", component: <NewAssetMove /> },

  { path: "/accountingcontrol", component: <AccountingControl /> },
  { path: "/accountspayable", component: <AccountsPayable /> },
  { path: "/accountsreceivable", component: <AccountsReceivable /> },
  { path: "/newaccountscontrol/:tipo", component: <NewAccountsControl /> },
  { path: "/editaccountingcontrol/:tipo/:id", component: <EditAccountingControlContainer /> },

  { path: "/stock/:stockType", component: <Stock /> },
  { path: "/newproduct/:stockType", component: <NewProduct /> },
  { path: "/editproduct/:stockType/:id", component: <EditProductContainer /> },

  { path: "/product/movements/:stockType/:productName/:productId", component: <StockMove /> },
  { path: "/product/movements/in/:stockType/:productName/:productId", component: <NewStockMoveIn /> },
  { path: "/product/movements/out/:stockType/:productName/:productId", component: <NewStockMoveOut /> },

  { path: "/suppliers", component: <Suppliers /> },
  { path: "/newsupplier", component: <NewSupplier /> },
  { path: "/editsupplier/:id", component: <EditSupplierContainer /> },

  { path: "/warehouses", component: <Warehouses /> },
  { path: "/newwarehouse", component: <NewWarehouse /> },
  { path: "/editwarehouse/:id", component: <EditWarehouseContainer /> },

  { path: "/restaurant", component: <RestaurantHome /> },
  { path: "/restaurant/menu", component: <Menu /> },
  { path: "/restaurant/newmenu", component: <NewMenu /> },
  { path: "/restaurant/editmenu/:id", component: <EditMenuContainer /> },

  { path: "/reception", component: <ReceptionHome /> },
  { path: "/reception/availability", component: <AvailabilityNewBooking /> },
  { path: "/reception/availability/newbooking", component: <NewBooking /> },
  { path: "/reception/availability/booking", component: <Booking /> },

  { path: "/cleaningjobs", component: <CleaningJobs /> },
  { path: "/editcleaningjob/:id", component: <EditCleaningJobContainer /> },
  { path: "/newcleaningjob", component: <NewCleaningJob /> },

  { path: "/cleaningjobs/checks", component: <CleanlinessChecks /> },
  { path: "/cleaningjobs/newcheck", component: <NewCleanlinessCheck /> },
  { path: "/cleaningjobs/check/:id", component: <EditCleanlinessCheckContainer /> },

  { path: "/cleaningjobs", component: <CleaningJobs /> },
  // { path: "/editcleaningjob/:id", component: <EditCleaningJobContainer /> },
  // { path: "/newcleaningjob", component: <NewCleaningJob /> },

  { path: "/internTransfers", component: <InternTransfers /> },
  { path: "/newinterntransfer", component: <NewInternTransfer /> },
  { path: "/internTransfers/:id", component: <EditInternTransferContainer /> },

  { path: "/taxmanagement", component: <TaxManagement /> },
  { path: "/newtaxmanagement", component: <NewTaxManagement /> },
  { path: "/edittaxmanagement/:id", component: <EditTaxManagement /> },

  { path: "/generalsettings", component: <GeneralSettings /> },
  { path: "/users", component: <Users /> },
  { path: "/newuser", component: <NewUser /> },
  { path: "/edituser/:id", component: <EditUser /> },
  { path: "/roles", component: <Roles /> },
  { path: "/newrole", component: <NewRole /> },
  { path: "/editrole/:id", component: <EditRoleContainer /> },
  { path: "/suppliertype", component: <SupplyType /> },
  { path: "/newsuppliertype", component: <NewSupplyType /> },
  { path: "/editsuppliertype/:id", component: <EditSupplyType /> },
  { path: "/locations", component: <Location /> },
  { path: "/editlocation/:id", component: <EditLocation /> },
  { path: "/newlocation", component: <NewLocation /> },
  { path: "/hotelsettings", component: <HotelHomeSettings /> },
  { path: "/hotelsettings/typeroom", component: <TypeRoom /> },
  { path: "/hotelsettings/newtyperoom", component: <NewTypeRom /> },
  { path: "/hotelsettings/edittyperoom/:id", component: <EditTypeRoom /> },
  { path: "/hotelsettings/amenities", component: <Amenities /> },
  { path: "/hotelsettings/newamenities", component: <NewAmenities /> },
  { path: "/hotelsettings/editamenities/:id", component: <EditAmenities /> },
  { path: "/hotelsettings/extraservices", component: <ExtraService /> },
  { path: "/hotelsettings/newextraservices", component: <NewExtraService /> },
  { path: "/hotelsettings/editextraservice/:id", component: <EditExtraService /> },
  { path: "/hotelsettings/rooms", component: <Rooms /> },
  { path: "/hotelsettings/newroom", component: <NewRoom /> },
  { path: "/hotelsettings/editroom/:id", component: <EditRoom /> },
  { path: "/hotelsettings/season", component: <Season /> },
  { path: "/hotelsettings/newseason", component: <NewSeason /> },
  { path: "/hotelsettings/editseason/:id", component: <EditSeason /> },
  { path: "/hotelsettings/hotelpackages", component: <AdminPackages /> },
  { path: "/hotelsettings/tours", component: <Tour /> },
  { path: "/hotelsettings/newtour", component: <NewTour /> },
  { path: "/hotelsettings/edittour/:id", component: <EditTour /> },
  { path: "/hotelsettings/newpackage", component: <NewPackage /> },
  { path: "/hotelsettings/editpackage/:id", component: <EditPackage /> },
  { path: "/hotelsettings/typeservice", component: <TypeService /> },
  { path: "/hotelsettings/newtypeservice", component: <NewTypeService /> },
  { path: "/hotelsettings/edittypeservice/:id", component: <EditTypeService /> },
  { path: "/hotelsettings/operativeareas", component: <OperativeAreas /> },
  { path: "/hotelsettings/newoperativearea", component: <NewOperativeAreas /> },
  { path: "/hotelsettings/editoperativeareas/:id", component: <EditOperativeAreas /> },


  { path: "/invoice/maintenance", component: <InvoiceMaintenance /> },
  { path: "/invoice/credit/notes", component: <InvoiceCreditNote /> },
  { path: "/invoice/debit/notes", component: <InvoiceMaintenance /> },
  { path: "/invoice/issued", component: <InvoiceIssued /> },
  { path: "/invoice/parameters", component: <InvoiceParameters /> },
  { path: "/invoice/companies", component: <InvoiceCompany /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/home" />,
  },
];

const publicRoutes = [

  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/auth-recoverpw", component: <RecoverPassword /> },

  {
    path: "*",
    component: <Navigate to="/404" />,
  },
  { path: "/404", component: <Error404 /> },
];

export { authProtectedRoutes, publicRoutes };