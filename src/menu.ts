// interface ProductSize {
//   size: string;
//   addprice: string;
// }

// interface ProductAdditive {
//   name: string;
//   addprice: string;
// }
/*
 {
    "id": 5,
    "name": "Espresso",
    "description": "Classic black coffee",
    "price": "4.50",
    "discountPrice": "4.25",
    "category": "coffee",
    "sizes": {
      "s": {
        "size": "200 ml",
        "price": "4.50"
      },
      "m": {
        "size": "300 ml",
        "price": "5.00",
        "discountPrice": "4.75"
      },
      "l": {
        "size": "400 ml",
        "price": "5.50"
      }
    },
    "additives": [
      {
        "name": "Sugar",
        "price": "0.50"
      },
      {
        "name": "Cinnamon",
        "price": "0.50"
      },
      {
        "name": "Syrup",
        "price": "0.50",
        "discountPrice": "0.45"
      }
    ]
*/
type User = {
  id: number;
  login: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: string;
  createdAt: string; // ISO tarih formatında string
};
const userJSON: string | null = localStorage.getItem("user");
const user: User = JSON.parse(userJSON as string);
const cartagit: HTMLAnchorElement | null = document.querySelector(".cartagit");
const carsayisi: HTMLSpanElement | null = document.querySelector(".carsayisi");

if (user) {
  cartagit?.classList.add("active");
}
console.log("userrrrrrrrrrrrrrrr");
console.log(user);
interface Additives {
  name: string;
  price: string;
  discountPrice?: string;
}

interface SizeOption {
  size: string;
  price: string;
  discountPrice?: string; // Opsiyonel
}

interface Sizes {
  s: SizeOption;
  m: SizeOption;
  l: SizeOption;
  xl: SizeOption;
  xxl: SizeOption;
}

interface ProductDetail {
  additives: Additives[];
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string | null;
  category: string;
  sizes: Sizes;
}

//console.log("selam:" +ProductDetail);
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  discountPrice: string | null;
}
interface ApiResponse {
  data: Product[];
  message: string;
  error: string;
}
interface ProductDetailResponse {
  data: ProductDetail;
  message: string;
  error: string;
}

const productsContainer: HTMLDivElement | null =
  document.querySelector<HTMLDivElement>(".menu-products");
const loadMoreBtn: HTMLElement | null = document.getElementById("reloadbutonu");
let currentCategory: string = "coffee";
let visibleCount: number = 4;
let allProducts: Product[] = [];
console.log(productsContainer);
console.log(loadMoreBtn);
console.log(currentCategory);

async function loadCategory(category: string): Promise<void> {
  const loader: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".menuloader");

  const errortext: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".hatamesaji");
  loader?.classList.remove("active");
  errortext?.classList.remove("active");
  productsContainer?.classList.remove("active");
  try {
    const res: Response = await fetch(
      "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products"
    );
    if (!res.ok) {
      throw new Error("Sunucu hatası: " + res.status);
    }
    const json: ApiResponse = await res.json(); //     console.log(json);
    const data: Product[] = json.data;
    currentCategory = category;
    allProducts = data.filter((item: Product) => item.category === category);
    visibleCount = window.innerWidth <= 768 ? 4 : allProducts.length;

    renderProducts();
    updateLoadMoreVisibility();
    loader?.classList.add("active");
    productsContainer?.classList.add("active");
  } catch (error) {
    loader?.classList.add("active");
    errortext?.classList.add("active");
    console.log(error);
  }
}
function renderProducts(): void {
  if (!productsContainer) return;
  productsContainer.innerHTML = "";
  const itemsToShow: Product[] = allProducts.slice(0, visibleCount);
  console.log(itemsToShow);

  itemsToShow.forEach((item: Product) => {
    //carcontainer
    const card: HTMLDivElement = document.createElement("div");
    card.classList.add("preview");

    //image

    const cardImg: HTMLImageElement = document.createElement("img");
    cardImg.classList.add("previewimage");
    cardImg.src = `./images/${item.name}.png`;
    cardImg.alt = item.name;
    card.appendChild(cardImg);

    //description
    const description: HTMLDivElement = document.createElement("div");
    description.classList.add("description");
    card.appendChild(description);
    //titletogether
    const titletogether: HTMLDivElement = document.createElement("div");
    titletogether.classList.add("titletogether");
    description.appendChild(titletogether);

    //titletogetherınspanleri
    const bigtitle: HTMLSpanElement = document.createElement("span");
    bigtitle.classList.add("bigtitle");
    bigtitle.textContent = item.name;
    titletogether.appendChild(bigtitle);

    const smalltitle: HTMLSpanElement = document.createElement("span");
    smalltitle.classList.add("smalltitle");
    smalltitle.textContent = item.description;
    titletogether.appendChild(smalltitle);

    //titleprice
    if (user) {
      if (item.discountPrice == null) {
        const titleprice: HTMLSpanElement = document.createElement("span");
        titleprice.classList.add("titleprice");
        titleprice.textContent = `$${item.price}`;
        description.appendChild(titleprice);
      } else {
        console.log("object");
        const priceContainer: HTMLDivElement = document.createElement("div");
        priceContainer.classList.add("pricecontainmenu");

        const discountspanPrice: HTMLSpanElement =
          document.createElement("span");
        discountspanPrice.classList.add("spanprice");
        discountspanPrice.textContent = `$${Number(item.discountPrice).toFixed(
          2
        )}`;
        priceContainer.appendChild(discountspanPrice);

        const spanPrice: HTMLSpanElement = document.createElement("span");
        spanPrice.classList.add("spanpricefirst");
        spanPrice.textContent = `$${Number(item.price).toFixed(2)}`;
        priceContainer.appendChild(spanPrice);

        description.appendChild(priceContainer);
      }
    } else {
      const titleprice: HTMLSpanElement = document.createElement("span");
      titleprice.classList.add("titleprice");
      titleprice.textContent = `$${item.price}`;
      description.appendChild(titleprice);
    }
    card.addEventListener("click", () => openModal(item));
    productsContainer.appendChild(card);
  });
}
function updateLoadMoreVisibility(): void {
  if (!loadMoreBtn) return;
  if (window.innerWidth <= 768 && visibleCount < allProducts.length) {
    loadMoreBtn.style.display = "flex";
  } else {
    loadMoreBtn.style.display = "none";
  }
}

loadMoreBtn?.addEventListener("click", () => {
  visibleCount = allProducts.length;
  renderProducts();
  updateLoadMoreVisibility();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    visibleCount = allProducts.length;
  } else {
    visibleCount = Math.min(visibleCount, 4);
  }

  renderProducts();
  updateLoadMoreVisibility();
});

function changeToActive(category: string): void {
  const categories: string[] = ["coffee", "tea", "dessert"];
  categories.forEach((cat: string) => {
    const cont: HTMLDivElement | null = document.querySelector(
      `.${cat}-container`
    );
    const rnd: HTMLDivElement | null = document.querySelector(`.${cat}-round`);
    const txt: HTMLSpanElement | null = document.querySelector(`.${cat}-text`);

    if (cont) cont.classList.remove("active");
    if (rnd) rnd.classList.remove("active");
    if (txt) txt.classList.remove("active");
  });
  const container: HTMLDivElement | null = document.querySelector(
    `.${category}-container`
  );
  const round: HTMLDivElement | null = document.querySelector(
    `.${category}-round`
  );
  const text: HTMLSpanElement | null = document.querySelector(
    `.${category}-text`
  );
  console.log(category);
  if (container) container.classList.toggle("active");
  console.log(container);

  if (round) round.classList.toggle("active");
  console.log(round);

  if (text) text.classList.toggle("active");
  console.log(text);
}
["coffee", "tea", "dessert"].forEach((category: string) => {
  const container: HTMLDivElement | null = document.querySelector(
    `.${category}-container`
  );
  container?.addEventListener("click", () => {
    loadCategory(category);
    changeToActive(category);
  });
});

loadCategory("coffee");
changeToActive("coffee");

// modala hoşgeldi

const modal: HTMLDivElement | null = document.querySelector(".modal-container");
const modalTitle: HTMLSpanElement | null =
  document.querySelector(".titlelan-name");
const modalDesc: HTMLSpanElement | null =
  document.querySelector(".real-description");
const kucukisim: HTMLSpanElement | null = document.querySelector(".kucukisim");
const ortaisim: HTMLSpanElement | null = document.querySelector(".ortaisim");
const buyukisim: HTMLSpanElement | null = document.querySelector(".buyukisim");

const adkucuk: HTMLSpanElement | null = document.querySelector(".kucuk1-isim");
const adorta: HTMLSpanElement | null = document.querySelector(".orta1-isim");
const adbuyuk: HTMLSpanElement | null = document.querySelector(".buyuk1-isim");

const price: HTMLSpanElement | null = document.querySelector(".price");
const gercekpara: HTMLSpanElement | null =
  document.querySelector(".original-price");

const modalImg: HTMLImageElement | null =
  document.querySelector(".modalinresmi");

let currentItem: ProductDetail | null;
let selectedSize: string = "s";
let selectedAdditives: number[] = [];
//let basePrice: string = "0"; //burada problem var
// console.log(basePrice);
// console.log(selectedSize);
// console.log(selectedAdditives);
const carpi: HTMLDivElement | null =
  document.querySelector<HTMLDivElement>(".modalcarpi");
const modallan: HTMLDivElement | null =
  document.querySelector<HTMLDivElement>(".modal");
async function openModal(item: Product): Promise<void> {
  const yukle: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".modalloader");

  modal?.classList.add("active");

  yukle?.classList.add("active");
  try {
    const res: Response = await fetch(
      `https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${item.id}`
    );
    if (!res.ok) {
      yukle?.classList.remove("active");
      modal?.classList.remove("active");
      console.log("resok da");
      throw new Error("Sunucu hatası: " + res.status);
    }
    const json: ProductDetailResponse = await res.json();
    console.log(json.data); //     console.log(json);
    const data: ProductDetail = json.data;
    currentItem = data;
    yukle?.classList.remove("active");
    carpi?.classList.add("active");
    modallan?.classList.add("active");
    //modal?.classList.add("active");
    document.body.style.overflow = "hidden";
    modalTitle!.textContent = data.name;
    modalDesc!.textContent = data.description;
    modalImg!.src = `./images/${data.name}.png`;

    //sizes
    kucukisim!.textContent = data.sizes.s.size;
    ortaisim!.textContent = data.sizes.m.size;
    buyukisim!.textContent = data.sizes.l.size;

    //addities
    adkucuk!.textContent = data.additives[0].name;
    adorta!.textContent = data.additives[1].name;
    adbuyuk!.textContent = data.additives[2].name;

    //basePrice = data.price;
    selectedSize = "s";
    selectedAdditives = [];

    document
      .querySelectorAll(
        ".kucuk, .kucuk-daire, .kucukisim, .orta, .orta-daire, .ortaisim, .buyuk, .buyuk-daire, .buyukisim, .kucuk1, .orta1, .buyuk1, .kucuk1-daire, .kucuk1-isim, .orta1-daire, .orta1-isim, .buyuk1-daire, .buyuk1-isim"
      )
      .forEach((el: Element) => el.classList.remove("active"));

    // varsayılan boyut aktif
    document.querySelector(".kucuk")?.classList.add("active");
    document.querySelector(".kucuk-daire")?.classList.add("active");
    document.querySelector(".kucukisim")?.classList.add("active");

    calculateTotalPrice(data);

    console.log(data);
  } catch (error) {
    yukle?.classList.remove("active");
    alert("Something went wrong. Please, try again");
    console.log("catch de");

    console.log(error);
  }
}
function closeModal(): void {
  modal?.classList.remove("active");
  carpi?.classList.remove("active");
  modallan?.classList.remove("active");
  document.body.style.overflow = "";

  // Durumları sıfırla
  currentItem = null;
  selectedSize = "s";
  selectedAdditives = [];

  // UI temizliği
  document
    .querySelectorAll(
      ".kucuk, .kucuk-daire, .kucukisim, .orta, .orta-daire, .ortaisim, .buyuk, .buyuk-daire, .buyukisim, .kucuk1, .orta1, .buyuk1, .kucuk1-daire, .kucuk1-isim, .orta1-daire, .orta1-isim, .buyuk1-daire, .buyuk1-isim"
    )
    .forEach((el: Element) => el.classList.remove("active"));

  modalTitle!.textContent = "";
  modalDesc!.textContent = "";
  modalImg!.src = "";
  price!.textContent = "";
}

// function calculateTotalPrice(item: ProductDetail): void {
//   if (user) {
//     let sizeExtra: number;
//     if (item.sizes[selectedSize as keyof Sizes].discountPrice === undefined) {
//       sizeExtra = Number(item.sizes[selectedSize as keyof Sizes].price);
//     } else {
//       sizeExtra = Number(item.sizes[selectedSize as keyof Sizes].discountPrice);
//     }

//     const additivesTotal: number = selectedAdditives.reduce(
//       (sum: number, addIndex: number) => {
//         if (item.additives[addIndex].discountPrice === undefined) {
//           const addPrice: number = Number(item.additives[addIndex].price);
//           return sum + addPrice;
//         } else {
//           const addPrice: number = Number(
//             item.additives[addIndex].discountPrice
//           );
//           return sum + addPrice;
//         }
//       },
//       0
//     );
//     console.log(typeof additivesTotal);

//     const total: number = sizeExtra + additivesTotal;
//     price!.textContent = `$${Number(total).toFixed(2)}`;
//   } else {
//     const sizeExtra: number = Number(
//       item.sizes[selectedSize as keyof Sizes].price
//     );
//     const additivesTotal: number = selectedAdditives.reduce(
//       (sum: number, addIndex: number) => {
//         const addPrice: number = Number(item.additives[addIndex].price);
//         return sum + addPrice;
//       },
//       0
//     );
//     console.log(typeof additivesTotal);

//     const total: number = sizeExtra + additivesTotal;
//     price!.textContent = `$${Number(total).toFixed(2)}`;
//   }
// }

function calculateTotalPrice(item: ProductDetail): void {
  const originalSizePrice: number = Number(
    item.sizes[selectedSize as keyof Sizes].price
  );
  const discountedSizePrice: number =
    user && item.sizes[selectedSize as keyof Sizes].discountPrice
      ? Number(item.sizes[selectedSize as keyof Sizes].discountPrice)
      : originalSizePrice;

  const originalAdditivesTotal: number = selectedAdditives.reduce(
    (sum: number, index: number) => {
      return sum + Number(item.additives[index].price);
    },
    0
  );

  const discountedAdditivesTotal: number = selectedAdditives.reduce(
    (sum: number, index: number) => {
      if (user && item.additives[index].discountPrice) {
        return sum + Number(item.additives[index].discountPrice);
      }
      return sum + Number(item.additives[index].price);
    },
    0
  );

  const originalTotal: number = originalSizePrice + originalAdditivesTotal;
  const discountedTotal: number =
    discountedSizePrice + discountedAdditivesTotal;

  // UI Güncelleme
  // const discountedPriceEl = document.querySelector(".discounted-price");
  // const originalPriceEl = document.querySelector(".original-price");
  //price discount fiyat
  //originalfiya
  if (user) {
    gercekpara?.classList.remove("active");
    price!.textContent = `$${discountedTotal.toFixed(2)}`;
    gercekpara!.textContent = `$${Number(originalTotal).toFixed(2)}`;
    //originalSizePrice!.classList.add("strikethrough"); // CSS’te üstü çizili görünmesi için
  } else {
    price!.textContent = `$${originalTotal.toFixed(2)}`;
    gercekpara?.classList.add("active");
    //originalSizePrice!.classList.remove("strikethrough");
  }
}

document
  .querySelectorAll(".kucuk1, .orta1, .buyuk1")
  .forEach((el: Element, index: number) => {
    el.addEventListener("click", () => {
      if (!modal?.classList.contains("active")) return;

      // Seçimi tersine çevir
      el.classList.toggle("active");
      el.querySelectorAll("div, span").forEach((child: Element) =>
        child.classList.toggle("active")
      );

      // Diziyi güncelle
      if (el.classList.contains("active")) {
        if (!selectedAdditives.includes(index)) {
          selectedAdditives.push(index);
        }
      } else {
        selectedAdditives = selectedAdditives.filter(
          (i: number) => i !== index
        );
      }

      if (currentItem) calculateTotalPrice(currentItem);
    });
  });

document.querySelectorAll(".kucuk, .orta, .buyuk").forEach((el: Element) => {
  el.addEventListener("click", () => {
    if (!modal?.classList.contains("active")) return;

    document
      .querySelectorAll(
        ".kucuk, .kucuk-daire, .kucukisim, .orta, .orta-daire, .ortaisim, .buyuk, .buyuk-daire, .buyukisim"
      )
      .forEach((b: Element) => b.classList.remove("active"));

    el.classList.add("active");
    el.querySelectorAll("div, span").forEach((child: Element) =>
      child.classList.add("active")
    );

    if (el.classList.contains("kucuk")) selectedSize = "s";
    else if (el.classList.contains("orta")) selectedSize = "m";
    else selectedSize = "l";

    if (currentItem) calculateTotalPrice(currentItem);
  });
});

modal?.addEventListener("click", (e: MouseEvent) => {
  const target: HTMLElement = e.target as HTMLElement;

  if (target.classList[0] === "modal-container") {
    closeModal();
  }
});
type SelectedProduct = {
  id: number;
  name: string;
  size: string; //mg olarak var
  additives: string[];
  discountedPrice: string;
  originalPrice: string;
  category: string;
};
function saveSelectedProductToLocalStorage(): void {
  if (!currentItem) return;
  const usersizpara: HTMLSpanElement | null =
    document.querySelector(".titleprice");
  let selectedProduct: SelectedProduct;

  if (user) {
    selectedProduct = {
      id: currentItem.id,
      name: currentItem.name,
      size: currentItem.sizes[selectedSize as keyof Sizes].size,
      additives: selectedAdditives.map(
        (index: number) => currentItem!.additives[index].name
      ),
      discountedPrice: price!.textContent,
      originalPrice: gercekpara!.textContent,
      category: currentItem.category,
    };
  } else {
    selectedProduct = {
      id: currentItem.id,
      name: currentItem.name,
      size: currentItem.sizes[selectedSize as keyof Sizes].size,
      additives: selectedAdditives.map(
        (index: number) => currentItem!.additives[index].name
      ),
      discountedPrice: price!.textContent,
      originalPrice: usersizpara!.textContent,
      category: currentItem.category,
    };
  }

  // LocalStorage'da eski ürünleri al
  const existing: string | null = localStorage.getItem("selectedProducts");
  const selectedProducts: SelectedProduct[] = existing
    ? JSON.parse(existing)
    : [];

  // Yeni ürünü ekle
  selectedProducts.push(selectedProduct);

  // Güncellenmiş listeyi tekrar kaydet
  localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));

  console.log("Ürün LocalStorage'a kaydedildi:", selectedProduct);
  console.log(selectedProducts.length);
  if (user) {
    carsayisi!.textContent = selectedProducts.length.toString();
  } else {
    if (selectedProducts.length > 0) {
      cartagit?.classList.add("active");
      carsayisi!.textContent = selectedProducts.length.toString();
    }
  }
}

const addtocart: HTMLDivElement | null = document.querySelector(".kapatmatusu");
addtocart?.addEventListener("click", () => {
  saveSelectedProductToLocalStorage();
  closeModal();
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

const modalkapat: HTMLImageElement | null =
  document.querySelector(".modalresim");
modalkapat?.addEventListener("click", () => {
  closeModal();
});

/**
 */

function isUserLoggedIn(): User | null {
  const userString: string | null = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;
  return user;
}
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
  size: number;
  discountedPrice: string;
  additives: string[];
  quantity: number;
  // başka alanlar da olabilir
  category: string;
}

const urunler: Product[] = getSelectedProducts();
if (user) {
  cartagit?.classList.add("active");
  if (urunler.length > 0) {
    carsayisi!.textContent = urunler.length.toString();
  }
} else {
  if (urunler.length > 0) {
    cartagit?.classList.add("active");
    carsayisi!.textContent = urunler.length.toString();
  }
}
