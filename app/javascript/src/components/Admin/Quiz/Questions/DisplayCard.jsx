import React from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import { Radio, Dropdown } from "@bigbinary/neetoui";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const QuestionDisplayCard = ({ question, handleDelete, handleClone }) => {
  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuButton } = MenuItem;

  const { slug } = useParams();

  return (
    <div className="relative flex w-full rounded-md border border-gray-100 bg-white p-4 shadow-lg md:w-[600px] lg:w-[800px]">
      <Radio
        stacked
        label={question.body}
        labelProps={{ className: "text-lg mb-3" }}
      >
        {question.options.map(option => (
          <Radio.Item
            disabled
            checked={option.isCorrect}
            key={option.text}
            label={option.text}
            labelProps={{ className: "text-gray-400" }}
            name={`stackedOptions-${question.id}`}
            value={option.text}
          />
        ))}
      </Radio>
      <div className="absolute right-4 top-4">
        <Dropdown
          buttonStyle="text"
          icon={MenuHorizontal}
          position="bottom-end"
        >
          <Menu>
            <MenuItem>
              <MenuButton
                style="link"
                to={`/admin/quizzes/${slug}/questions/${question.id}/edit`}
              >
                Edit
              </MenuButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuButton style="link" onClick={() => handleClone(question.id)}>
                Clone
              </MenuButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuButton
                style="danger"
                type="delete"
                onClick={() => handleDelete(question.id, slug)}
              >
                Delete
              </MenuButton>
            </MenuItem>
          </Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default QuestionDisplayCard;
