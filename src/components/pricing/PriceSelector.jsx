import pricesData from "@/data/prices.json";
import { useTranslations } from "@/i18n/utils";
import { useState } from "react";

const PriceSelector = ({ lang }) => {
  const prices = pricesData[lang];
  const grouped = prices.reduce((acc, item) => {
    if (!acc[item.size]) acc[item.size] = [];
    acc[item.size].push(item);
    return acc;
  }, {});

  const sizes = Object.keys(grouped);
  const [selectedSize, setSelectedSize] = useState("1/8");
  const t = useTranslations(lang);
  console.log('Lang en React: ',lang);

  return (
    <div>
      <div className="flex justify-center space-x-4 mb-10 text-[var(--gold)]">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`px-6 py-3 rounded-lg bg-[var(--brown)] hover:bg-[var(--coffee)] ${
              selectedSize === size
                ? "text-[var(--gold)] ring-4 ring-[#FFD39F]"
                : "text-white"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {grouped[selectedSize].map((item, index) => (
          <div
            key={index}
            className="bg-[var(--brown)] rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between h-full"
          >
            <div>
              <h4 className="text-xl font-bold text-[#FFD39F] mb-2">{item.technique}</h4>
              <p className="text-[#E4E0E1] mb-4">{t('pricing_delivered')} {item.deliveryTime}.</p>
              <p className="text-[#E4E0E1] mb-4">
                {t('pricing_materials')} {item.materials.join(" + ")}.
              </p>
            </div>

            <div className="mt-auto pt-4">
              <div className="text-2xl font-semibold text-[#FFE7C2] mb-4">
                ${item.price}
              </div>
              <a
                href="#contact"
                className="inline-block bg-[#AB886D] text-white px-4 py-2 rounded hover:bg-[#8c6b54]"
              >
                {t('pricing_request')}
              </a>
            </div>
          </div>
        ))}
      </div>
      <p class="mb-4 mt-8 font-light text-center text-[var(--brown)] sm:text-xl">
        {t("pricing_dollars")}
      </p>
    </div>
  );
};

export default PriceSelector;