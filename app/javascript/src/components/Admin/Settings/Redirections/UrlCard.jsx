import React, { useState } from "react";

import { stripDomainFromUrl } from "utils/url";

import Show from "./Show";
import UrlForm from "./UrlForm";

const UrlCard = ({ redirectionData }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="mb-4">
      <div className="p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
        {isEditing ? (
          <UrlForm
            id={redirectionData.id}
            mode="edit"
            initialValues={{
              source: stripDomainFromUrl(redirectionData.source),
              destination: stripDomainFromUrl(redirectionData.destination),
            }}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <Show {...redirectionData} onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
};

export default UrlCard;
