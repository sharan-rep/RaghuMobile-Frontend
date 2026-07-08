import React from 'react';

interface ThermalInvoiceProps {
  data: any;
}

export default function ThermalInvoice({ data }: ThermalInvoiceProps) {
  if (!data) return null;

  const cgst = data.tax / 2;
  const sgst = data.tax / 2;
  const cgstRate = data.gstRate / 2;
  const sgstRate = data.gstRate / 2;

  return (
    <div className="w-[80mm] mx-auto bg-white text-black font-mono text-sm p-4 print:p-0 print:m-0">
      <div className="text-center mb-4 flex flex-col items-center">
        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mb-2 print:border print:border-black print:bg-black print:text-white">
          R
        </div>
        <h2 className="font-bold text-xl mb-1 uppercase tracking-wider">Raghu Mobiles</h2>
        <p className="text-xs">123 Market Street, Erode</p>
        <p className="text-xs">Phone: +91 9876543210</p>
        <p className="text-xs font-bold mt-1">GSTIN: 33AAAAA0000A1Z5</p>
      </div>

      <div className="border-b border-dashed border-black pb-2 mb-2 text-xs">
        <div className="flex justify-between">
          <span>Date: {data.date.split(',')[0]}</span>
          <span>Time: {data.date.split(',')[1]?.trim()}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-bold">Bill No: {data.invoiceNumber}</span>
          <span>Cashier: {data.cashier}</span>
        </div>
      </div>

      <div className="border-b border-dashed border-black pb-2 mb-2 text-xs">
        <p><span className="font-semibold">Customer:</span> {data.customerName}</p>
        {data.customerPhone && data.customerPhone !== 'N/A' && (
          <p><span className="font-semibold">Phone:</span> {data.customerPhone}</p>
        )}
      </div>

      <table className="w-full text-xs mb-2">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left py-1">Item</th>
            <th className="text-center py-1">Qty</th>
            <th className="text-right py-1">Price</th>
            <th className="text-right py-1">Amt</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item: any, index: number) => (
            <React.Fragment key={index}>
              <tr>
                <td className="py-1 pr-1 font-semibold">
                  {item.product.name}
                </td>
                <td className="text-center py-1 align-top">{item.quantity}</td>
                <td className="text-right py-1 align-top">{item.unitPrice.toLocaleString('en-IN')}</td>
                <td className="text-right py-1 align-top">{(item.unitPrice * item.quantity).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
              </tr>
              {item.imei && (
                <tr>
                  <td colSpan={4} className="text-[10px] text-gray-700 pb-1 -mt-1">
                    IMEI/SN: {item.imei}
                  </td>
                </tr>
              )}
              {item.discount > 0 && (
                <tr>
                  <td colSpan={4} className="text-[10px] text-right pb-1 pr-1">
                    Item Discount: -{item.discount.toLocaleString('en-IN')}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed border-black pt-2 text-xs space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{data.subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
        </div>
        {data.discount > 0 && (
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-{data.discount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-700">
          <span>CGST ({cgstRate}%):</span>
          <span>{cgst.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>SGST ({sgstRate}%):</span>
          <span>{sgst.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
        </div>
        
        <div className="flex justify-between font-bold text-sm mt-2 border-t-2 border-black pt-2 pb-1">
          <span>GRAND TOTAL:</span>
          <span>₹ {data.total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
        </div>
      </div>

      <div className="mt-2 border-t border-dashed border-black pt-2 text-xs">
        <div className="font-semibold mb-1">Payment Details:</div>
        
        {data.paymentMethod === 'Split' && data.splitDetails ? (
          <div className="ml-2 space-y-1">
            {data.splitDetails.cash > 0 && (
              <div className="flex justify-between">
                <span>Cash:</span>
                <span>{data.splitDetails.cash.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
            )}
            {data.splitDetails.upi > 0 && (
              <div className="flex justify-between">
                <span>UPI:</span>
                <span>{data.splitDetails.upi.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
            )}
            {data.splitDetails.card > 0 && (
              <div className="flex justify-between">
                <span>Card:</span>
                <span>{data.splitDetails.card.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
            )}
            {data.amountPaid > data.total && (
              <div className="flex justify-between border-t border-gray-300 mt-1 pt-1 font-bold">
                <span>Change Returned:</span>
                <span>{(data.amountPaid - data.total).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="ml-2 space-y-1">
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="font-bold">{data.paymentMethod}</span>
            </div>
            {data.paymentMethod === 'Cash' && data.amountPaid > data.total && (
              <>
                <div className="flex justify-between">
                  <span>Amount Tendered:</span>
                  <span>{data.amountPaid.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Change:</span>
                  <span>{(data.amountPaid - data.total).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="text-center mt-6 text-xs pb-4">
        <p className="font-bold">Thank you for shopping!</p>
        <p>Goods once sold will not be taken back.</p>
        <p className="mt-2 font-bold italic">⚡ Raghu Mobiles</p>
      </div>
    </div>
  );
}
