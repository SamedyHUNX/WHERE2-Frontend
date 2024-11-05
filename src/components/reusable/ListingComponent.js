import React, { useState } from "react";
import DeleteConfirmationModal from "./functions/DeleteConfirmationModal";
import ButtonComponent from "./Button";

const ListingComponent = ({
  title,
  data,
  columns,
  totalItems,
  additionalStats,
  actions,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleAction = (action, id) => {
    if (action.requiresConfirmation) {
      setSelectedItemId(id);
      setShowModal(true);
    } else {
      action.onClick(id);
    }
  };

  const handleConfirmAction = () => {
    const confirmAction = actions.find(action => action.requiresConfirmation);
    if (confirmAction) {
      confirmAction.onClick(selectedItemId);
    }
    setShowModal(false);
    setSelectedItemId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItemId(null);
  };

  return (
    <section className="lg:w-full bg-white rounded-lg shadow-lg h-full shadow-lg border-2 border-gray-200 rounded-4xl">
      <div className="flex justify-between items-center py-5 w-[80%] mx-auto">
        <h1 className="text-3xl text-blue-600 font-bold">{title}</h1>
        <div className="flex gap-2 sm:hidden">
          <div className="bg-gray-600 text-white p-4 rounded-lg w-[160px]">
            <p className="text-sm">Total {title}</p>
            <p className="text-4xl font-bold">{totalItems}</p>
          </div>
          {additionalStats &&
            additionalStats.map((stat, index) => (
              <div
                key={index}
                className="bg-blue-600 text-white p-4 rounded-lg w-[160px]"
              >
                <p className="text-sm">{stat.label}</p>
                <p className="text-4xl font-bold">{stat.value}</p>
              </div>
            ))}
        </div>
      </div>
      <table className="w-[90%] mx-auto">
        <thead>
          <tr className="text-center h-full">
            {columns.map((column, index) => (
              <th key={index} className="pb-4">
                {column}
              </th>
            ))}
            <th className="pb-4">Action</th>
          </tr>
        </thead>
        <tbody className="w-full h-full">
          {data.map((item) => (
            <tr key={item.id} className="border-t h-full">
              {columns.map((column, index) => (
                <td
                  key={index}
                  className="py-4 text-center h-full truncate max-w-[150px]"
                >
                  {item[column]}
                </td>
              ))}
              <td className="py-4">
                <div className="flex gap-4 sm:gap-1 justify-center">
                  {actions.map((action, index) => (
                    <ButtonComponent
                      key={index}
                      variant={action.variant}
                      onClick={() => handleAction(action, item.id)}
                    >
                      {action.icon}
                      {action.label}
                    </ButtonComponent>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirmationModal
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        warningMsg={"Are you sure you want to perform this action?"}
        type={"Confirm"}
      />
    </section>
  );
};

export default ListingComponent;