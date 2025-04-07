import React, { useState } from "react";

import { Delete, Search } from "@bigbinary/neeto-icons";
import { Button, Dropdown, Input } from "@bigbinary/neetoui";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";

const BulkActions = ({ selectedRowKeys, onBulkUpdate, onBulkDelete }) => {
  const hasSelected = selectedRowKeys.length > 0;
  const [searchTerm, setSearchTerm] = useState("");

  const { data: { categories = [] } = {} } = useFetchCategories();

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryChange = categoryId => {
    onBulkUpdate({ assignedCategoryId: categoryId });
  };

  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuButton } = MenuItem;

  return (
    <>
      {hasSelected && (
        <div className="ml-2 space-x-2">
          <Dropdown
            buttonStyle="text"
            closeOnSelect={false}
            label="Change category"
            position="bottom-end"
            strategy="fixed"
          >
            <div className="flex flex-col gap-y-1 p-3">
              <Input
                placeholder="Search category"
                prefix={<Search />}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="max-h-48 overflow-y-auto">
                {filteredCategories.map(category => (
                  <MenuItem key={category.id}>
                    <MenuButton
                      style="link"
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <span className="text-base">{category.name}</span>
                    </MenuButton>
                  </MenuItem>
                ))}
              </div>
            </div>
          </Dropdown>
          <Dropdown
            buttonStyle="text"
            label="Change status"
            position="bottom-end"
            strategy="fixed"
          >
            <Menu>
              <MenuItem>
                <MenuButton
                  className="text-black"
                  style="link"
                  onClick={() => onBulkUpdate({ status: "draft" })}
                >
                  Draft
                </MenuButton>
              </MenuItem>
              <Divider />
              <MenuItem>
                <MenuButton
                  label="Delete"
                  style="link"
                  onClick={() => onBulkUpdate({ status: "published" })}
                >
                  Publish
                </MenuButton>
              </MenuItem>
            </Menu>
          </Dropdown>
          <Button
            icon={Delete}
            label="Delete"
            style="danger"
            onClick={onBulkDelete}
          />
        </div>
      )}
    </>
  );
};

export default BulkActions;
