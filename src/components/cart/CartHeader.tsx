import React from 'react';

export default function CartHeader() {
	return (
		<>
			<div className="grid grid-cols-[0.1fr_1fr] items-center font-medium text-gray-700 bg-white rounded-lg shadow mb-4 p-4">
				<div>
					{/* <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={onSelectAll}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </div> */}
				</div>
				<div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr]">
					<h4>Produtos</h4>
					<h4>Valor unitário</h4>
					<h4>Quantidade</h4>
					<h4>Sub-total</h4>
				</div>
				<div className="block md:hidden">
					<h4>Selecionar todos produtos</h4>
				</div>
			</div>
		</>
	);
}
