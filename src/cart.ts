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

const urunler: Product[] = getSelectedProducts();
const user: User | null = isUserLoggedIn();
console.log(urunler);

const productscontainer: HTMLDivElement | null =
  document.querySelector(".productscontainer");

displayproducts();

const cartagit: HTMLAnchorElement | null = document.querySelector(".cartagit");
const carsayisi: HTMLSpanElement | null = document.querySelector(".carsayisi");

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
function displayproducts(): void {
  productscontainer!.innerHTML = ""; // eski içerikleri sil

  urunler.forEach((product: Product) => {
    console.log(product);
    const gercekproduct: HTMLDivElement = document.createElement("div");
    gercekproduct.classList.add("gercekproductcontianer");

    const cardImg: HTMLImageElement = document.createElement("img");
    cardImg.classList.add("trashimg");
    cardImg.src = `./images/trash.svg`;
    cardImg.alt = product.name;
    gercekproduct.appendChild(cardImg);

    const cardproImg: HTMLImageElement = document.createElement("img");
    cardproImg.classList.add("proimage");
    cardproImg.src = `./images/${product.name}.png`;
    cardproImg.alt = product.name;
    gercekproduct.appendChild(cardproImg);
    if (user) {
      const productinfocontainer: HTMLDivElement =
        document.createElement("div");
      productinfocontainer.classList.add("productinfocontainerwithuser");

      const proname: HTMLSpanElement = document.createElement("span");
      proname.classList.add("proname");
      proname.textContent = product.name;
      productinfocontainer.appendChild(proname);

      const proinfo: HTMLSpanElement = document.createElement("span");
      proinfo.classList.add("proinfo");
      proinfo.textContent = `${product.size}, ${product.additives.join(", ")}`;
      productinfocontainer.appendChild(proinfo);

      gercekproduct.appendChild(productinfocontainer);

      //   const carfiyatlari: HTMLDivElement = document.createElement("div");
      //   carfiyatlari.classList.add("carfiyatlari");

      const totalfiyat: HTMLSpanElement = document.createElement("span");
      totalfiyat.classList.add("eskiurunfiyat");

      totalfiyat.textContent = product.originalPrice;

      const indirimlifiyat: HTMLSpanElement = document.createElement("span");
      indirimlifiyat.classList.add("urunfiyat");

      indirimlifiyat.textContent = product.discountedPrice;
      //carfiyatlari.appendChild(totalfiyat);

      gercekproduct.appendChild(totalfiyat);
      gercekproduct.appendChild(indirimlifiyat);
    } else {
      const productinfocontainer: HTMLDivElement =
        document.createElement("div");
      productinfocontainer.classList.add("productinfocontainer");

      const proname: HTMLSpanElement = document.createElement("span");
      proname.classList.add("proname");
      proname.textContent = product.name;
      productinfocontainer.appendChild(proname);

      const proinfo: HTMLSpanElement = document.createElement("span");
      proinfo.classList.add("proinfo");
      proinfo.textContent = `${product.size}, ${product.additives.join(", ")}`;
      productinfocontainer.appendChild(proinfo);

      gercekproduct.appendChild(productinfocontainer);
      const carfiyatlari: HTMLDivElement = document.createElement("div");
      carfiyatlari.classList.add("carfiyatlari");

      const totalfiyat: HTMLSpanElement = document.createElement("span");
      totalfiyat.classList.add("urunfiyat");

      totalfiyat.textContent = product.originalPrice;
      carfiyatlari.appendChild(totalfiyat);

      gercekproduct.appendChild(carfiyatlari);
    }

    productscontainer?.appendChild(gercekproduct);
  });
  displayresults();
  displaybuttons();
}

function displayresults(): void {
  let totalPrice: number = 0;
  let dicountedfiyat: number = 0;

  urunler.forEach((urun: Product) => {
    // discountedPrice veya originalPrice olabilir
    const priceStr: string = urun.originalPrice.replace("$", "").trim();
    const price: number = parseFloat(priceStr);
    totalPrice += price;
  });

  urunler.forEach((urun: Product) => {
    // discountedPrice veya originalPrice olabilir
    const priceStr: string = urun.discountedPrice
      ? urun.discountedPrice.replace("$", "").trim()
      : urun.originalPrice.replace("$", "").trim();
    const price: number = parseFloat(priceStr);
    dicountedfiyat += price;
  });
  //   const resultcontainer: HTMLDivElement = document.createElement("div");
  //   resultcontainer.classList.add("resultcontainer");
  const resultcontainer: HTMLDivElement | null =
    document.querySelector(".resultcontainer");
  const totalvefiyat: HTMLDivElement = document.createElement("div");
  totalvefiyat.classList.add("totalvefiyat");

  //   const carcontainer: HTMLDivElement | null =
  //     document.querySelector(".cartcontainer");
  if (user) {
    const totyazi: HTMLSpanElement = document.createElement("span");
    totyazi.classList.add("totyazi");
    totyazi.textContent = "Total:";
    totalvefiyat.appendChild(totyazi);

    const fiyatlardivi: HTMLDivElement = document.createElement("div");
    fiyatlardivi.classList.add("fiyatlardivi");

    const gercekfiyat: HTMLSpanElement = document.createElement("span");
    gercekfiyat.classList.add("eskiurunfiyat");
    gercekfiyat.textContent = `$${totalPrice}`;
    fiyatlardivi.appendChild(gercekfiyat);

    const totfi: HTMLSpanElement = document.createElement("span");
    totfi.classList.add("totfi");
    totfi.textContent = `$${dicountedfiyat}`;
    fiyatlardivi.appendChild(totfi);
    totalvefiyat.appendChild(fiyatlardivi);

    //********* */
    const address: HTMLDivElement = document.createElement("div");
    address.classList.add("address");

    const addressyazi: HTMLSpanElement = document.createElement("span");
    addressyazi.classList.add("addressyazi");
    addressyazi.textContent = "Address:";
    address.appendChild(addressyazi);

    const addressyazibilgi: HTMLSpanElement = document.createElement("span");
    addressyazibilgi.classList.add("totfi");
    addressyazibilgi.textContent = `${user?.city}, ${user?.street}, ${user?.houseNumber}`;
    address.appendChild(addressyazibilgi);
    /****** */

    const paybyconteiner: HTMLDivElement = document.createElement("div");
    paybyconteiner.classList.add("paybyconteiner");

    const paybyyazi: HTMLSpanElement = document.createElement("span");
    paybyyazi.classList.add("paybyyazi");
    paybyyazi.textContent = "Pay by:";
    paybyconteiner.appendChild(paybyyazi);

    const paybykarsi: HTMLSpanElement = document.createElement("span");
    paybykarsi.classList.add("paybykarsi");
    paybykarsi.textContent = `${user?.paymentMethod}`;
    paybyconteiner.appendChild(paybykarsi);

    /***** */

    resultcontainer?.appendChild(totalvefiyat);
    resultcontainer?.appendChild(address);
    resultcontainer?.appendChild(paybyconteiner);
  } else {
    const totyazi: HTMLSpanElement = document.createElement("span");
    totyazi.classList.add("totyazi");
    totyazi.textContent = "Total:";
    totalvefiyat.appendChild(totyazi);

    const totfi: HTMLSpanElement = document.createElement("span");
    totfi.classList.add("totfi");
    totfi.textContent = `$${totalPrice}`;
    totalvefiyat.appendChild(totfi);
    resultcontainer?.appendChild(totalvefiyat);
  }

  //carcontainer?.appendChild(resultcontainer!);
}

function displaybuttons(): void {
  const butonlardivi: HTMLDivElement | null = document.createElement("div");
  const carcontainer: HTMLDivElement | null =
    document.querySelector(".cartcontainer");
  //const butonlar: HTMLDivElement | null = document.querySelector(".butonlar");

  if (user) {
    if (urunler.length > 0) {
      butonlardivi.classList.add("butonlardivi");
      const confirmbuton: HTMLButtonElement = document.createElement("button");
      confirmbuton.classList.add("confirmbutonu");
      confirmbuton.textContent = "confirm";
      butonlardivi?.appendChild(confirmbuton);
      carcontainer?.appendChild(butonlardivi);
    }
  } else {
    butonlardivi.classList.add("butonlarikidivi");

    const signinbutonu: HTMLButtonElement = document.createElement("button");
    signinbutonu.classList.add("signinbutonu");
    signinbutonu.textContent = "signin";
    butonlardivi?.appendChild(signinbutonu);

    const registerbutonu: HTMLButtonElement = document.createElement("button");
    registerbutonu.classList.add("registerbutonu");
    registerbutonu.textContent = "register";
    butonlardivi?.appendChild(registerbutonu);

    carcontainer?.appendChild(butonlardivi);
  }
}
