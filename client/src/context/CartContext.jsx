import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CartContext =
  createContext(null);

const STORAGE_KEY =
  "spec360_cart";

function getInitialCart() {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  try {
    const saved =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

const cartReducer = (
  state,
  action
) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const {
        product,
        stock,
      } = action.payload;

      const existing =
        state.find(
          (item) =>
            item._id ===
            product._id
        );

      if (existing) {
        const newQuantity =
          existing.quantity + 1;

        if (
          newQuantity >
          stock
        ) {
          return state;
        }

        return state.map(
          (item) =>
            item._id ===
            product._id
              ? {
                  ...item,
                  quantity:
                    newQuantity,
                  stock,
                }
              : item
        );
      }

      if (stock <= 0) {
        return state;
      }

      return [
        ...state,
        {
          ...product,
          quantity: 1,
          stock,
        },
      ];
    }

    case "REMOVE_FROM_CART":
      return state.filter(
        (item) =>
          item._id !==
          action.payload
      );

    case "UPDATE_QUANTITY": {
      const {
        id,
        quantity,
      } = action.payload;

      const item =
        state.find(
          (entry) =>
            entry._id === id
        );

      if (!item) {
        return state;
      }

      const stock =
        Number(
          item.stock
        );

      const safeStock =
        Number.isFinite(stock)
          ? stock
          : Infinity;

      const requested =
        Number(quantity);

      if (
        !Number.isFinite(
          requested
        )
      ) {
        return state;
      }

      const clamped =
        Math.min(
          Math.max(
            1,
            Math.floor(
              requested
            )
          ),
          safeStock
        );

      return state.map(
        (entry) =>
          entry._id === id
            ? {
                ...entry,
                quantity:
                  clamped,
              }
            : entry
      );
    }

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

export function CartProvider({
  children,
}) {
  const [cart, dispatch] =
    useReducer(
      cartReducer,
      undefined,
      getInitialCart
    );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch {
      // Ignore storage failures.
    }
  }, [cart]);

  const addToCart = (
    product
  ) => {
    if (!product?._id) {
      return;
    }

    const stock =
      Number(
        product.stock
      );

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
        stock:
          Number.isFinite(
            stock
          )
            ? stock
            : Infinity,
      },
    });
  };

  const removeFromCart = (
    id
  ) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: id,
    });
  };

  const updateQuantity = (
    id,
    quantity
  ) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        id,
        quantity,
      },
    });
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART",
    });
  };

  const cartQuantityFor = (
    productId
  ) => {
    const item =
      cart.find(
        (entry) =>
          entry._id ===
          productId
      );

    return item?.quantity ?? 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartQuantityFor,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(
      CartContext
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}