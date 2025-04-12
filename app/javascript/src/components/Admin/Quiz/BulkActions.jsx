import React, { useState } from "react";

import { Delete, Search } from "@bigbinary/neeto-icons";
import { Button, Dropdown, Input, Typography } from "@bigbinary/neetoui";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import { useTranslation } from "react-i18next";

const BulkActions = ({ selectedRowKeys, onBulkUpdate, onBulkDelete }) => {
  const hasSelected = selectedRowKeys.length > 0;
  const [searchTerm, setSearchTerm] = useState("");

  const { t } = useTranslation();

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
            label={t("labels.buttons.changeCategory")}
            position="bottom-end"
            strategy="fixed"
          >
            <div className="flex flex-col gap-y-1 p-3">
              <Input
                placeholder={t("inputPlaceholders.categoryInput")}
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
                      <Typography className="text-base">
                        {category.name}
                      </Typography>
                    </MenuButton>
                  </MenuItem>
                ))}
              </div>
            </div>
          </Dropdown>
          <Dropdown
            buttonStyle="text"
            label={t("labels.buttons.changeStatus")}
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
                  {t("labels.buttons.draft")}
                </MenuButton>
              </MenuItem>
              <Divider />
              <MenuItem>
                <MenuButton
                  style="link"
                  onClick={() => onBulkUpdate({ status: "published" })}
                >
                  {t("labels.buttons.publish")}
                </MenuButton>
              </MenuItem>
            </Menu>
          </Dropdown>
          <Button
            icon={Delete}
            label={t("labels.buttons.delete")}
            style="danger"
            onClick={onBulkDelete}
          />
        </div>
      )}
    </>
  );
};

export default BulkActions;
