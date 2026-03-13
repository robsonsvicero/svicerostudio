import React, { useState } from 'react';

const FAQ = ({ faqs }) => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="max-w-2xl mx-auto">
      {faqs.map((faq, idx) => (
        <div key={idx} className="mb-4 border border-[#E9BF84]/20 rounded-xl bg-white">
          <button
            className="w-full text-left p-4 font-semibold text-[#181818] focus:outline-none flex justify-between items-center"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            {faq.pergunta}
            <span className="ml-2 text-[#E9BF84]">{openIdx === idx ? '-' : '+'}</span>
          </button>
          {openIdx === idx && (
            <div className="p-4 pt-0 text-[#181818] text-base border-t border-[#E9BF84]/10">
              {faq.resposta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
