function MenuModal({ menuItems, activeCategory, onClose, onSelectCategory }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 px-4">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-xl shadow-xl overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-bold">Menu Items</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold p-2 rounded hover:bg-red-100 cursor-pointer"
          >
            ✖
          </button>
        </div>
        <ul className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {menuItems?.map((item, index) => (
            <li
              key={index}
              className={`text-lg cursor-pointer p-3 ${
                item === activeCategory
                  ? "bg-orange-400 text-white"
                  : "bg-white text-black"
              } hover:bg-orange-400 hover:text-white rounded-md transition`}
              onClick={() => {
                onSelectCategory(item);
                onClose();
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MenuModal;
