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
  { path: "/asset/movements/:name/:id", component: <AssetMove /> },
  { path: "/asset/newmovement/:type/:id", component: <NewAssetMove /> },

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
  { path: "/editsuppliertype/:id", component: <EditSupplyType /> },
  { path: "/locations", component: <Location /> },
  { path: "/editlocation/:id", component: <EditLocation /> },

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
