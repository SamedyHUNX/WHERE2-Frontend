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
    const confirmAction = actions.find((action) => action.requiresConfirmation);
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
    <section className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <h1 className="text-2xl lg:text-3xl text-blue-600 font-bold tracking-tight">
            {title}
          </h1>

          {/* Stats Cards */}
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="bg-gray-700 text-white p-4 rounded-xl shadow-md flex-1 lg:flex-none lg:w-fit">
              <p className="text-sm font-medium text-gray-200">Total {title}</p>
              <p className="text-3xl font-bold mt-1">{totalItems}</p>
            </div>

            {additionalStats?.map((stat, index) => (
              <div
                key={index}
                className="bg-blue-600 text-white p-4 rounded-xl shadow-md flex-1 lg:flex-none lg:w-fit"
              >
                <p className="text-sm font-medium text-blue-100">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider text-center"
                  >
                    {column}
                  </th>
                ))}
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      className="px-6 py-4 text-sm text-gray-600 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
                    >
                      {item[column]}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-center gap-2">
                      {actions.map((action, index) => (
                        <ButtonComponent
                          key={index}
                          variant={action.variant}
                          onClick={() => handleAction(action, item.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm"
                        >
                          {action.icon}
                          <span className="hidden sm:inline">
                            {action.label}
                          </span>
                        </ButtonComponent>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmationModal
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        warningMsg="Are you sure you want to perform this action?"
        type="Confirm"
      />
    </section>
  );
};

export default ListingComponent;
