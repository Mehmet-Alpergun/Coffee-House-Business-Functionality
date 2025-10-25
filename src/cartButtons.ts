const confirmbuton: HTMLButtonElement | null =
  document.querySelector(".confirmbutonu");
const registerbutonu: HTMLButtonElement | null =
  document.querySelector(".registerbutonu");
const signinbutonu: HTMLButtonElement | null =
  document.querySelector(".signinbutonu");

registerbutonu?.addEventListener("click", () => {
  window.location.href = "register.html";
});
signinbutonu?.addEventListener("click", () => {
  window.location.href = "signin.html";
});

interface User {
  id: number;
  login: string;
  paymentMethod: string;
  street: string;
  houseNumber: number;
  city: string;
  createdAt: string;
}
function isUserLoggedIn(): User | null {
  const userString: string | null = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;
  return user;
}
//const user: User | null = isUserLoggedIn();
function getSelectedProducts(): Product[] {
  const user: User | null = isUserLoggedIn();
  console.log(user);
  const data: string | null = localStorage.getItem("selectedProducts");
  if (!data) return [];
  try {
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error("LocalStorage parse hatası:", error);
    return [];
  }
}
interface Product {
  id: number;
  name: string;
  originalPrice: string;
  size: string;
  discountedPrice: string;
  additives: string[];
  // başka alanlar da olabilir
  category: string;
}

const urunler: Product[] = getSelectedProducts();

interface Confirmitem {
  productId: number;
  size: string;
  additives: string[];
  quantity: number;
}
interface Fonkdon {
  items: Confirmitem[];
  totalPrice: number;
}
/** */
const confirmOrderUrl: string =
  "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/orders/confirm";
function createOrderPayload(products: Product[]): Fonkdon {
  console.log(products);
  const items: Confirmitem[] = products.map((p: Product) => ({
    productId: p.id,
    size: p.size,
    additives: p.additives,
    quantity: 1,
  }));

  const totalPrice: number = products
    .map((product: Product) =>
      parseFloat(product.discountedPrice.replace("$", ""))
    )
    .reduce((sum: number, price: number) => sum + price, 0);

  console.log(totalPrice);

  //const totalPrice: number = prices.reduce((sum, price) => sum + price, 0);

  return { items, totalPrice };
}
const ali: Fonkdon = createOrderPayload(urunler);
console.log(ali);
confirmbuton?.addEventListener("click", async () => {
  const loader: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".cartconfirmloader");
  const cartcontainer: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".cartcontainer");
  const hatamesaji: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".notification");
  const success: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".success");
  loader?.classList.add("active");
  cartcontainer?.classList.add("active");

  //const user: User = isUserLoggedIn();
  const urunler: Product[] = getSelectedProducts();

  if (urunler.length === 0) {
    alert("Sepetiniz boş!");
    return;
  }

  const payload: Fonkdon = createOrderPayload(urunler);
  try {
    const response: Response = await fetch(confirmOrderUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: string = await response.json();
    console.log("buraaaaadaaaaaaa");
    console.log(data);

    if (response.ok) {
      loader?.classList.remove("active");

      //alert("Siparişiniz başarıyla onaylandı!");
      localStorage.removeItem("selectedProducts");
      window.location.href = "cart.html";
      success?.classList.add("active");
      setTimeout(() => {
        success?.classList.remove("active");
      }, 4000);
    } else {
      loader?.classList.remove("active");
      cartcontainer?.classList.remove("active");
      hatamesaji?.classList.add("active");
      setTimeout(() => {
        hatamesaji?.classList.remove("active");
      }, 4000);

      //alert("Sipariş başarısız:");
    }
  } catch (error) {
    console.error("İstek hatası:", error);
    hatamesaji?.classList.add("active");
    setTimeout(() => {
      hatamesaji?.classList.remove("active");
    }, 4000);
    alert("Bir hata oluştu. Lütfen tekrar deneyin.");
  }
});
