import React, { useEffect, useState } from "react";
import TableCustomers from "../../Pages/Customers/TableCustomers";
import DataListPagination from "./DataListPagination";
import ButtonIconTable from "./ButtonIconTable";

const ListInfo = ({
  data,
  headers,
  keys,
  enableDelete,
  actionDelete,
  enableEdit,
  actionEdit,
  mainKey,
  secondKey,
}) => {
  const onDelete = (element) => {
    if (!secondKey) {
      actionDelete(element[mainKey]);
    } else {
      actionDelete(element[mainKey], element[secondKey]);
    }
  };

  const onEdit = (element) => {
    actionEdit(element);
  };

  return (
    <div className="col table-responsive">
      <table className="table table-hover table-striped mb-0">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={header}>{header}</th>
            ))}
            {(enableEdit || enableDelete) && (
              <th className="text-center">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((line, index) => (
            <tr key={index}>
              {keys.map((key, indexKey) => (
                <td key={`${index}-${key}`}>{line[key]}</td>
              ))}
              {(enableEdit || enableDelete) && (
                <th className="d-flex justify-content-center">
                  {enableEdit && (
                    <ButtonIconTable
                      icon="mdi mdi-pencil"
                      color="warning"
                      onClick={() => onEdit(line)}
                    />
                  )}
                  {enableDelete && (
                    <ButtonIconTable
                      icon="mdi mdi-delete"
                      color="danger"
                      onClick={() => {
                        onDelete(line);
                      }}
                    />
                  )}
                </th>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListInfo;
