"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-t border-gray-200 py-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-medium text-gray-900">
          Detalhe do produto
        </h2>
        <button className="text-gray-500 p-1 bg-green-50 rounded-full">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 text-gray-600">
          <p className="text-sm leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
