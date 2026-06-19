'use client'
import { useCartStore } from '@/store/useCartStore';

export default function CartModal() {
  const { cart, isCartOpen, toggleCart, removeFromCart, addToCart, decreaseQuantity } = useCartStore();

  if (!isCartOpen) return null;

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace(/\D/g, ''));
      return total + (priceNum * item.quantity);
    }, 0);
  };

  const handleWhatsAppCheckout = () => {
    // 👈 ඔයාගේ WhatsApp නම්බර් එක මෙතනට දාන්න (උදා: 94771234567)
    const phoneNumber = "94743853510"; 
    
    // ඔයා ඉල්ලපු හරියටම ෆෝමැට් එක (අමතර මුකුත් නෑ)
    let message = "🛍️ NEW ORDER - SK CREATION 🛍️%0A";
    message += "🛒 ORDER DETAILS:%0A";
    message += "--------------------------------%0A%0A";

    cart.forEach((item) => {
      const priceNum = parseInt(item.price.replace(/\D/g, ''));
      const itemTotal = priceNum * item.quantity;
      const formattedTotal = itemTotal.toLocaleString();

      message += `${item.name}%0A`;
      message += `Code: ${item.item_code}%0A`;
      message += `Qty: ${item.quantity}%0A`;
      message += `Subtotal: Rs. ${formattedTotal}/-%0A`;
    });

    message += "--------------------------------%0A";
    const totalAmount = calculateTotal().toLocaleString();
    message += `💰 TOTAL AMOUNT: Rs. ${totalAmount}/-`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex justify-end">
      <div className="w-full md:w-96 bg-[#1c1c1e] h-full p-6 shadow-2xl flex flex-col relative border-l border-gray-800 animate-slide-in">
        
        <button onClick={toggleCart} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold">
          &times;
        </button>
        
        <h2 className="text-2xl font-black mb-6 text-white tracking-wider">YOUR CART 🛒</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">Cart එක හිස්! බඩු එකතු කරන්න.</p>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.item_code} className="flex gap-4 mb-4 bg-black p-4 rounded-2xl border border-gray-800">
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-white">{item.name}</h4>
                  <p className="text-xs text-gray-400">{item.item_code}</p>
                  <p className="text-green-500 text-sm font-bold mt-1">
                    {item.price}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3 bg-gray-900 w-max rounded-lg p-1 border border-gray-700">
                    <button 
                      onClick={() => decreaseQuantity(item.item_code)}
                      className="w-8 h-8 flex justify-center items-center bg-gray-800 rounded-md text-white font-bold hover:bg-gray-700 hover:text-red-400 transition"
                    >
                      -
                    </button>
                    <span className="text-white font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-8 h-8 flex justify-center items-center bg-gray-800 rounded-md text-white font-bold hover:bg-gray-700 hover:text-green-400 transition"
                    >
                      +
                    </button>
                  </div>

                </div>
                <button 
                  onClick={() => removeFromCart(item.item_code)} 
                  className="text-red-500 text-xs font-bold hover:underline self-start mt-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-6 border-t border-gray-800 pt-6">
            <p className="text-xl font-bold flex justify-between mb-6 text-white">
              Total: <span className="text-green-500">Rs. {calculateTotal().toLocaleString()}/-</span>
            </p>
            
            <button 
              onClick={handleWhatsAppCheckout}
              className="w-full bg-green-600 text-white font-black text-lg py-4 rounded-xl hover:bg-green-700 transition shadow-[0_0_15px_rgba(22,163,74,0.4)]"
            >
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}