import React from "react";

import { Button, Tag, Typography } from "@bigbinary/neetoui";

const Card = ({ quiz }) => (
  <div className="flex flex-col justify-between space-y-5 rounded-lg border border-gray-200 p-6 shadow-sm">
    <div>
      <Typography className="mb-2 text-xl font-bold">{quiz.name}</Typography>
      <Tag className="p-2" label={quiz.category} style="info" />
    </div>
    <div>
      <Typography className="mb-4 text-gray-600">{25} Questions</Typography>
      <Button
        className="w-full justify-center rounded bg-blue-600 py-3 text-center text-white transition-colors hover:bg-blue-700"
        label="Start quiz"
      />
    </div>
  </div>
);

export default Card;
