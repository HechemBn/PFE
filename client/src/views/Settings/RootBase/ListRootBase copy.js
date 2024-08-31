import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import SweetAlert from "react-bootstrap-sweetalert";

export const ListRootBase = () => {
  const dispatch = useDispatch();
  const navigate = useHistory();
  const columns = useMemo(
    () => [
      //column definitions...
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',        
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            {/* {console.log(cell.row.index)} */}
            <Button
              onClick={() => {
                navigate.push("/profile");
              }}
              variant="warning"
              size="sm"
              className="text-warning btn-link edit"
            >
              <i className="fa fa-edit" />
            </Button>
           {/*  <Button
              id={"idLigne_" + cell.row.values.id}
              onClick={(e) => {
                confirmMessage(cell.row.values.id,e);
              }}
              variant="danger"
              size="sm"
              className="text-danger btn-link delete"
            >
              <i className="fa fa-trash" id={"idLigne_" + cell.row.values.id}/>
            </Button> */}
          </div>
        ),
      },
      //end
    ],
    [],
  );

  const data = useMemo(
    () => [
      //data definitions...
      {
        firstName: 'Dylan',
        lastName: 'Murray',
        address: '261 Erdman Ford',
        city: 'East Daphne',
        state: 'Kentucky',
      },
      {
        firstName: 'Raquel',
        lastName: 'Kohler',
        address: '769 Dominic Grove',
        city: 'Columbus',
        state: 'Ohio',
      },
      {
        firstName: 'Ervin',
        lastName: 'Reinger',
        address: '566 Brakus Inlet',
        city: 'South Linda',
        state: 'West Virginia',
      },
      {
        firstName: 'Brittany',
        lastName: 'McCullough',
        address: '722 Emie Stream',
        city: 'Lincoln',
        state: 'Nebraska',
      },
      {
        firstName: 'Branson',
        lastName: 'Frami',
        address: '32188 Larkin Turnpike',
        city: 'Charleston',
        state: 'South Carolina',
      },
      //end
    ],
    [],
  );
  {console.log(columns)}
  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableColumnActions={true}
      enableColumnFilters={true}
      enablePagination={true}
      enableSorting={true}
      enableBottomToolbar={true}
      enableTopToolbar={true}
      muiTableBodyRowProps={{ hover: true }}
    /> 
  );
};

export default ListRootBase;